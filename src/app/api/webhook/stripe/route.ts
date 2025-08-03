import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { getStripeInstance } from '@/lib/stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// In-memory cache for processed webhook events (in production, use Redis or database)
const processedEvents = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const sig = headersList.get('stripe-signature');

    if (!sig || !endpointSecret) {
      console.error('Missing stripe signature or webhook secret');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const stripe = await getStripeInstance();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received Stripe webhook event:', event.type);

    // IDEMPOTENCY: Check if we've already processed this event
    if (processedEvents.has(event.id)) {
      console.log(`⚠️ Event ${event.id} already processed, returning success to prevent retries`);
      return NextResponse.json({ received: true, status: 'already_processed' });
    }

    // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Mark event as processed after successful handling
      processedEvents.add(event.id);
      
      // Clean up old events (keep only last 1000 to prevent memory leaks)
      if (processedEvents.size > 1000) {
        const eventsArray = Array.from(processedEvents);
        processedEvents.clear();
        eventsArray.slice(-500).forEach(id => processedEvents.add(id));
      }

      return NextResponse.json({ received: true, event_id: event.id });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  console.log('Processing checkout session completed:', session.id);

  try {
    // DUPLICATE PREVENTION: Check if this session has already been processed
    const { data: existingPurchases } = await supabase
      .from('purchases')
      .select('id')
      .eq('session_id', session.id)
      .limit(1);
    
    if (existingPurchases && existingPurchases.length > 0) {
      console.log(`⚠️ Session ${session.id} already processed, skipping to prevent duplicates`);
      return;
    }

    // Get line items to see what was purchased
    const stripe = await getStripeInstance();
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    });

    const customerEmail = session.customer_details?.email;
    if (!customerEmail) {
      console.error('No customer email found in session');
      return;
    }

    console.log(`Creating purchase records for ${customerEmail}`);

    // Enhanced user linking: prioritize registered users over payment email
    let userId = session.metadata?.user_id;
    let linkedUserEmail = customerEmail; // Default to payment email
    
    if (!userId) {
      // Step 1: Try to find existing user by payment email
      const { data: users } = await supabase.auth.admin.listUsers();
      let existingUser = users?.users?.find(user => user.email === customerEmail);
      
      if (existingUser) {
        userId = existingUser.id;
        linkedUserEmail = existingUser.email;
        console.log(`✅ Found registered user by payment email: ${userId} (${linkedUserEmail})`);
      } else {
        // Step 2: Check if there are any existing purchases with this payment email
        // that might be linked to a different registered user
        const { data: existingPurchases } = await supabase
          .from('purchases')
          .select('user_id, customer_email')
          .eq('customer_email', customerEmail)
          .not('user_id', 'is', null)
          .limit(1);
        
        if (existingPurchases && existingPurchases.length > 0) {
          // Found existing purchase with this email linked to a user
          const linkedUserId = existingPurchases[0].user_id;
          const { data: linkedUserData } = await supabase.auth.admin.getUserById(linkedUserId);
          
          if (linkedUserData.user) {
            userId = linkedUserId;
            linkedUserEmail = linkedUserData.user.email || customerEmail;
            console.log(`✅ Found existing user link via previous purchase: ${userId} (${linkedUserEmail})`);
          }
        } else {
          console.log(`ℹ️  No registered user found for payment email: ${customerEmail}`);
          console.log('   Purchase will be created with payment email only');
          console.log('   User can claim this purchase by registering with this email');
        }
      }
    } else {
      // User ID provided in metadata, get their registered email
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      if (userData.user) {
        linkedUserEmail = userData.user.email || customerEmail;
        console.log(`✅ Using registered user from metadata: ${userId} (${linkedUserEmail})`);
      }
    }

    // Create purchase records for each item
    const purchasePromises = lineItems.data.map(async (item: any) => {
      const product = item.price.product;
      if (!product) return;

      // Map Stripe product to our internal product IDs
      let internalProductId = product.id;
      const productName = product.name.toLowerCase();
      
      if (productName.includes('ebook') || productName.includes('e-book') || productName.includes('mastery guide')) {
        internalProductId = 'ebook';
      } else if (productName.includes('prompt') || productName.includes('ai prompt')) {
        internalProductId = 'prompts';
      } else if (productName.includes('coaching') || productName.includes('strategy session')) {
        internalProductId = 'coaching';
      }

      const purchaseData = {
        user_id: userId,
        product_id: internalProductId,
        product_name: product.name,
        price: (item.amount_total || 0) / 100, // Convert from cents - using 'price' to match schema
        customer_email: customerEmail, // Always use payment email for consistency
        session_id: session.id, // Changed from stripe_session_id to match database schema
        download_url: '/my-account' // Set default download URL
      };
      
      // Log the linking decision for debugging
      if (userId) {
        console.log(`🔗 Linking purchase to registered user: ${userId}`);
        console.log(`   Registered email: ${linkedUserEmail}`);
        console.log(`   Payment email: ${customerEmail}`);
      } else {
        console.log(`📧 Creating unlinked purchase for email: ${customerEmail}`);
        console.log('   This purchase can be claimed when user registers with this email');
      }

      console.log('Creating purchase record:', purchaseData);

      // ENHANCED DUPLICATE PREVENTION: Use insert with conflict handling
      const { data: insertResult, error: purchaseError } = await supabase
        .from('purchases')
        .insert(purchaseData)
        .select('id');

      if (purchaseError) {
        // Check if it's a duplicate key violation (PGRST09 or 23505)
        if (purchaseError.code === 'PGRST09' || purchaseError.code === '23505' || 
            purchaseError.message?.includes('duplicate') || 
            purchaseError.message?.includes('unique constraint')) {
          console.log(`ℹ️ Purchase already exists for ${product.name}, skipping duplicate`);
          return; // Skip this duplicate, don't throw error
        }
        console.error('Error creating purchase record:', purchaseError);
        throw purchaseError;
      }

      console.log(`✅ Purchase record created for ${product.name}`);
    });

    await Promise.all(purchasePromises);
    console.log('✅ All purchase records created successfully');
    
    // Auto-link any existing unlinked purchases if user was found
    if (userId && linkedUserEmail !== customerEmail) {
      await linkExistingPurchasesToUser(userId, linkedUserEmail, customerEmail);
    }

    // Send confirmation email with download links
    await sendPurchaseConfirmationEmail(customerEmail, lineItems.data, session);

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Processing payment intent succeeded:', paymentIntent.id);
  
  // Additional logic for payment intent if needed
  // This is mainly for backup/verification purposes
}

// Helper function to link existing unlinked purchases to a registered user
async function linkExistingPurchasesToUser(userId: string, registeredEmail: string, paymentEmail: string) {
  try {
    console.log(`🔄 Checking for existing unlinked purchases to link to user ${userId}...`);
    
    // Find unlinked purchases with either the registered email or payment email
    const { data: unlinkPurchases, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .is('user_id', null)
      .or(`customer_email.eq.${registeredEmail},customer_email.eq.${paymentEmail}`);
    
    if (fetchError) {
      console.error('Error fetching unlinked purchases:', fetchError);
      return;
    }
    
    if (unlinkPurchases && unlinkPurchases.length > 0) {
      console.log(`📦 Found ${unlinkPurchases.length} unlinked purchase(s) to link`);
      
      // Update all unlinked purchases to link them to the user
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ 
          user_id: userId
          // Keep customer_email as is for consistency
        })
        .is('user_id', null)
        .or(`customer_email.eq.${registeredEmail},customer_email.eq.${paymentEmail}`);
      
      if (updateError) {
        console.error('Error linking existing purchases:', updateError);
      } else {
        console.log(`✅ Successfully linked ${unlinkPurchases.length} existing purchase(s) to user ${userId}`);
        unlinkPurchases.forEach(purchase => {
          console.log(`   - ${purchase.product_name} (${purchase.customer_email})`);
        });
      }
    } else {
      console.log('ℹ️  No existing unlinked purchases found to link');
    }
  } catch (error) {
    console.error('Error in linkExistingPurchasesToUser:', error);
  }
}

// Helper function to send confirmation email
async function sendPurchaseConfirmationEmail(email: string, items: any[], session: any) {
  try {
    // Import the sendOrderConfirmationEmail function
    const { sendOrderConfirmationEmail } = await import('@/lib/sendgrid');
    
    // Format order items for the email
    const orderItems = items.map(item => ({
      name: item.price.product.name,
      price: (item.amount_total || 0) / 100,
      id: item.price.product.id
    }));
    
    // Generate download links for digital products
    const downloadLinks = orderItems.map(item => {
      let slug = '';
      const productName = item.name.toLowerCase();
      
      if (productName.includes('ebook') || productName.includes('e-book') || productName.includes('mastery guide')) {
        slug = 'ebook';
      } else if (productName.includes('prompt') || productName.includes('ai prompt')) {
        slug = 'prompts';
      } else if (productName.includes('coaching') || productName.includes('strategy session')) {
        slug = 'coaching';
      }
      
      return {
        productName: item.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/my-account`
      };
    });
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.amount_total || 0) / 100, 0);
    
    // Send the confirmation email
    await sendOrderConfirmationEmail({
      email,
      orderNumber: session.id,
      orderItems,
      total,
      downloadLinks,
      isGuest: !session.metadata?.user_id
    });
    
    console.log(`✅ Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw the error to prevent webhook failure
  }
}