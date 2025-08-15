import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { bulletproofAuth } from '@/lib/auth-bulletproof';
import { getStripeInstance } from '@/lib/stripe';
import { env } from '@/lib/env';
import { sendOrderConfirmationEmail, sendAccessGrantedEmail } from '@/lib/email';
import fs from 'fs';
import path from 'path';

// Get webhook secret from environment variables
const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

// Function to log webhook events during development
function logWebhookEvent(event: any) {
  if (process.env.NODE_ENV === 'development') {
    try {
      const logDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const logFile = path.join(logDir, 'stripe-webhook.log');
      const logData = `${new Date().toISOString()} - ${event.type} - ${event.id}\n${JSON.stringify(event.data.object, null, 2)}\n\n`;
      
      fs.appendFileSync(logFile, logData);
    } catch (error) {
      console.error('Error logging webhook event:', error);
    }
  }
}

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

    console.log('Received Stripe webhook event:', event.type, event.id);
    logWebhookEvent(event);

    // Check if we've already processed this event
    const { data: existingEvent, error: lookupError } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('event_id', event.id)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking for existing event:', lookupError);
    }

    if (existingEvent) {
      console.log(`Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true, status: 'already_processed' });
    }

    // Record this event to prevent duplicate processing
    const { error: insertError } = await supabase
      .from('webhook_events')
      .insert({
        event_id: event.id,
        event_type: event.type,
        processed_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error recording webhook event:', insertError);
      // Continue processing anyway, worst case we might process twice
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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log('Processing checkout.session.completed event');
    
    const customerId = session.customer;
    const customerEmail = session.customer_details?.email;
    const userId = session.client_reference_id;
    const lineItems = session.line_items?.data || [];
    
    if (!customerEmail) {
      console.error('No customer email found in session');
      return;
    }
    
    // If no line items in the session, fetch them from Stripe
    let items = lineItems;
    if (items.length === 0) {
      const stripe = await getStripeInstance();
      const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id);
      items = lineItemsResponse.data;
    }
    
    // Process each purchased item
    for (const item of items) {
      const priceId = item.price?.id;
      if (!priceId) continue;
      
      // Get product details from Stripe
      const stripe = await getStripeInstance();
      const price = await stripe.prices.retrieve(priceId);
      const stripeProductId = price.product as string;
      const product = await stripe.products.retrieve(stripeProductId);
      
      // CRITICAL: Map Stripe product ID to internal access system ID
      let mappedProductId = stripeProductId;
      
      // Map based on product name/metadata to our internal access system
      const productName = product.name.toLowerCase();
      if (productName.includes('prompt') || productName.includes('ai prompts')) {
        mappedProductId = 'prompts'; // This matches what the prompts page checks for
      } else if (productName.includes('e-book') || productName.includes('ebook') || productName.includes('mastery guide')) {
        mappedProductId = 'ebook'; // This matches what the ebook page checks for  
      } else if (productName.includes('coaching') || productName.includes('session')) {
        mappedProductId = 'coaching'; // This matches what the coaching page checks for
      } else if (productName.includes('masterclass') || productName.includes('video')) {
        mappedProductId = 'video'; // This matches what the video page checks for
      } else if (productName.includes('support')) {
        mappedProductId = 'support'; // This matches what the support page checks for
      }
      
      console.log(`Mapping Stripe product ${stripeProductId} (${product.name}) to internal ID: ${mappedProductId}`);
      
      // Create purchase record using bulletproof auth system with mapped product ID
      const purchase = await bulletproofAuth.createPurchase({
        user_id: userId,
        customer_email: customerEmail,
        product_id: mappedProductId, // Use mapped ID for access control
        price_id: priceId,
        amount: price.unit_amount ? price.unit_amount / 100 : 0,
        currency: price.currency,
        status: 'active',
        stripe_session_id: session.id,
        stripe_customer_id: customerId,
      });
      
      if (!purchase) {
        console.error('Error creating purchase record via bulletproof auth');
        continue;
      }
      
      console.log(`✅ CRITICAL: Purchase unlocked for ${customerEmail}, product ${mappedProductId} (was ${stripeProductId})`);
      
      // Send confirmation email
      await sendOrderConfirmationEmail({
        email: customerEmail,
        orderDetails: {
          productName: product.name,
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          orderId: purchase.id,
        },
      });
      
      // Send access granted email with upsell link for masterclass
      const accessLink = mappedProductId === 'video' 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/upsell/masterclass-success?session_id=${session.id}`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/my-account`;
        
      await sendAccessGrantedEmail({
        email: customerEmail,
        productName: product.name,
        accessLink,
      });
    }
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('Processing payment_intent.succeeded event');
    
    // Check if this payment intent is already associated with a purchase
    const { data: existingPurchase, error: lookupError } = await supabase
      .from('purchases')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();
    
    if (!lookupError && existingPurchase) {
      console.log(`Payment intent ${paymentIntent.id} already processed, skipping`);
      return;
    }
    
    // If the payment intent has metadata with user and product info, create a purchase
    const metadata = paymentIntent.metadata || {};
    const userId = metadata.userId;
    const stripeProductId = metadata.productId;
    const customerEmail = paymentIntent.receipt_email || metadata.customerEmail;
    
    if (!userId || !stripeProductId || !customerEmail) {
      console.log('Missing required metadata in payment intent, skipping');
      return;
    }
    
    // Get product details from Stripe for mapping
    const stripe = await getStripeInstance();
    const product = await stripe.products.retrieve(stripeProductId);
    
    // CRITICAL: Map Stripe product ID to internal access system ID
    let mappedProductId = stripeProductId;
    
    // Map based on product name/metadata to our internal access system
    const productName = product.name.toLowerCase();
    if (productName.includes('prompt') || productName.includes('ai prompts')) {
      mappedProductId = 'prompts'; // This matches what the prompts page checks for
    } else if (productName.includes('e-book') || productName.includes('ebook') || productName.includes('mastery guide')) {
      mappedProductId = 'ebook'; // This matches what the ebook page checks for  
    } else if (productName.includes('coaching') || productName.includes('session')) {
      mappedProductId = 'coaching'; // This matches what the coaching page checks for
    } else if (productName.includes('masterclass') || productName.includes('video')) {
      mappedProductId = 'video'; // This matches what the video page checks for
    } else if (productName.includes('support')) {
      mappedProductId = 'support'; // This matches what the support page checks for
    }
    
    console.log(`Mapping Stripe product ${stripeProductId} (${product.name}) to internal ID: ${mappedProductId}`);
    
    // Create purchase record with mapped product ID
    const { data: purchase, error } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        customer_email: customerEmail,
        product_id: mappedProductId, // Use mapped ID for access control
        amount: paymentIntent.amount ? paymentIntent.amount / 100 : 0,
        currency: paymentIntent.currency,
        status: 'active',
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: paymentIntent.customer,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating purchase record from payment intent:', error);
      return;
    }
    
    console.log(`✅ CRITICAL: Purchase unlocked for ${customerEmail}, product ${mappedProductId} (was ${stripeProductId}) from payment intent`);
    
    // Send confirmation email
    await sendOrderConfirmationEmail({
      email: customerEmail,
      orderDetails: {
        productName: product.name,
        price: paymentIntent.amount ? paymentIntent.amount / 100 : 0,
        orderId: purchase.id,
      },
    });
    
    // Send access granted email
    await sendAccessGrantedEmail({
      email: customerEmail,
      productName: product.name,
      accessLink: `${process.env.NEXT_PUBLIC_SITE_URL}/my-account`,
    });
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
  }
}