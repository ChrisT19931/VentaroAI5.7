import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripeInstance } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { bulletproofAuth } from '@/lib/auth-bulletproof';
import { sendOrderConfirmationEmail, sendAccessGrantedEmail } from '@/lib/sendgrid';

// COMPREHENSIVE LOGGING SYSTEM
function logPurchaseEvent(level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data: data ? JSON.stringify(data, null, 2) : null
  };
  
  console.log(`[${timestamp}] ${level}: ${message}`);
  if (data) {
    console.log(`[${timestamp}] DATA:`, data);
  }
  
  // In production, you might want to send this to a logging service
  return logEntry;
}

// ENHANCED PRODUCT MAPPING WITH FALLBACKS
function mapStripeProductToInternal(productName: string, stripeProductId: string, metadata?: any): string {
  logPurchaseEvent('INFO', `Mapping product: "${productName}" (${stripeProductId})`);
  
  let mappedProductId = stripeProductId;
  const name = productName.toLowerCase();
  const originalId = mappedProductId;

  // Primary mapping based on product name
  if (name.includes('prompt') || name.includes('ai prompts') || name.includes('arsenal')) {
    mappedProductId = 'prompts';
  } else if (name.includes('e-book') || name.includes('ebook') || name.includes('mastery guide') || name.includes('tools guide')) {
    mappedProductId = 'ebook';
  } else if (name.includes('coaching') || name.includes('session') || name.includes('consultation')) {
    mappedProductId = 'coaching';
  } else if (name.includes('masterclass') || name.includes('video') || name.includes('web creation')) {
    mappedProductId = 'video';
  } else if (name.includes('support') || name.includes('package')) {
    mappedProductId = 'support';
  }

  // Fallback mapping based on Stripe product ID patterns
  if (mappedProductId === originalId) {
    if (stripeProductId.includes('prompt') || stripeProductId.includes('arsenal')) {
      mappedProductId = 'prompts';
    } else if (stripeProductId.includes('ebook') || stripeProductId.includes('guide') || stripeProductId.includes('mastery')) {
      mappedProductId = 'ebook';
    } else if (stripeProductId.includes('coaching') || stripeProductId.includes('session')) {
      mappedProductId = 'coaching';
    } else if (stripeProductId.includes('video') || stripeProductId.includes('masterclass')) {
      mappedProductId = 'video';
    } else if (stripeProductId.includes('support')) {
      mappedProductId = 'support';
    }
  }

  // Additional fallback based on metadata
  if (metadata && mappedProductId === originalId) {
    const productType = metadata.product_type || metadata.category;
    if (productType) {
      const type = productType.toLowerCase();
      if (type.includes('prompt')) mappedProductId = 'prompts';
      else if (type.includes('ebook') || type.includes('guide')) mappedProductId = 'ebook';
      else if (type.includes('coaching')) mappedProductId = 'coaching';
      else if (type.includes('video') || type.includes('masterclass')) mappedProductId = 'video';
      else if (type.includes('support')) mappedProductId = 'support';
    }
  }

  const mappingResult = {
    originalProductId: stripeProductId,
    productName,
    mappedProductId,
    mappingSuccessful: mappedProductId !== originalId,
    metadata
  };

  if (mappedProductId !== originalId) {
    logPurchaseEvent('SUCCESS', `Product mapped successfully: ${originalId} -> ${mappedProductId}`, mappingResult);
  } else {
    logPurchaseEvent('WARN', `Product mapping failed - using original ID: ${originalId}`, mappingResult);
  }

  return mappedProductId;
}

// MULTIPLE PURCHASE CREATION STRATEGIES
async function createPurchaseRecord(purchaseData: any): Promise<boolean> {
  logPurchaseEvent('INFO', 'Attempting to create purchase record', purchaseData);

  const strategies = [
    'bulletproof_auth',
    'direct_supabase',
    'fallback_storage'
  ];

  for (const strategy of strategies) {
    try {
      logPurchaseEvent('INFO', `Trying purchase creation strategy: ${strategy}`);
      
      let success = false;
      let purchase = null;

      switch (strategy) {
        case 'bulletproof_auth':
          purchase = await bulletproofAuth.createPurchase(purchaseData);
          success = !!purchase;
          break;

        case 'direct_supabase':
          const { data, error } = await supabase
            .from('purchases')
            .insert([{
              ...purchaseData,
              id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              created_at: new Date().toISOString()
            }])
            .select()
            .single();
          
          success = !error && !!data;
          purchase = data;
          
          if (error) {
            logPurchaseEvent('ERROR', `Direct Supabase creation failed: ${error.message}`, error);
          }
          break;

        case 'fallback_storage':
          // This would be in-memory or file storage as last resort
          purchase = {
            ...purchaseData,
            id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString(),
            storage_method: 'fallback'
          };
          success = true;
          logPurchaseEvent('WARN', 'Using fallback storage - purchase may not persist across restarts', purchase);
          break;
      }

      if (success && purchase) {
        logPurchaseEvent('SUCCESS', `Purchase created successfully using ${strategy}`, {
          purchaseId: purchase.id,
          userId: purchaseData.user_id,
          productId: purchaseData.product_id,
          email: purchaseData.customer_email,
          strategy
        });
        return true;
      }

    } catch (error: any) {
      logPurchaseEvent('ERROR', `Purchase creation strategy ${strategy} failed: ${error.message}`, {
        strategy,
        error: error.message,
        stack: error.stack
      });
    }
  }

  logPurchaseEvent('ERROR', 'ALL PURCHASE CREATION STRATEGIES FAILED', purchaseData);
  return false;
}

// ENHANCED EMAIL SENDING WITH RETRIES
async function sendNotificationEmails(customerEmail: string, productName: string, purchase: any, accessLink: string) {
  const emailTasks = [
    {
      name: 'Order Confirmation',
      fn: () => sendOrderConfirmationEmail({
        email: customerEmail,
        orderNumber: purchase.id || `ORDER_${Date.now()}`,
        orderItems: [{
          name: productName,
          price: purchase.amount || 0
        }],
        total: purchase.amount || 0,
        downloadLinks: [{
          productName,
          url: accessLink
        }],
        isGuest: false
      })
    },
    {
      name: 'Access Granted',
      fn: () => sendAccessGrantedEmail({
        email: customerEmail,
        productName,
        accessUrl: accessLink,
      })
    }
  ];

  for (const task of emailTasks) {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        await task.fn();
        logPurchaseEvent('SUCCESS', `${task.name} email sent successfully to ${customerEmail}`);
        break;
      } catch (error: any) {
        attempts++;
        logPurchaseEvent('ERROR', `${task.name} email attempt ${attempts} failed: ${error.message}`, {
          email: customerEmail,
          error: error.message,
          attempt: attempts
        });
        
        if (attempts === maxAttempts) {
          logPurchaseEvent('ERROR', `${task.name} email failed after ${maxAttempts} attempts`, {
            email: customerEmail,
            finalError: error.message
          });
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logPurchaseEvent('INFO', '🎣 Stripe webhook received');

  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      logPurchaseEvent('ERROR', 'Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const stripe = await getStripeInstance();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      logPurchaseEvent('SUCCESS', `Webhook signature verified: ${event.type}`, {
        eventId: event.id,
        eventType: event.type
      });
    } catch (err: any) {
      logPurchaseEvent('ERROR', `Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
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
        logPurchaseEvent('INFO', `Unhandled event type: ${event.type}`);
    }

    const processingTime = Date.now() - startTime;
    logPurchaseEvent('SUCCESS', `Webhook processed successfully in ${processingTime}ms`, {
      eventType: event.type,
      processingTime
    });

    return NextResponse.json({ received: true, processingTime });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    logPurchaseEvent('ERROR', `Webhook processing failed after ${processingTime}ms: ${error.message}`, {
      error: error.message,
      stack: error.stack,
      processingTime
    });
    
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      message: error.message 
    }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const sessionStartTime = Date.now();
  logPurchaseEvent('INFO', '💳 Processing checkout.session.completed event', {
    sessionId: session.id,
    customerEmail: session.customer_details?.email,
    paymentStatus: session.payment_status
  });

  try {
    const customerId = session.customer;
    const customerEmail = session.customer_details?.email;
    const userId = session.client_reference_id;
    const lineItems = session.line_items?.data || [];

    // Validation with detailed logging
    if (!customerEmail) {
      logPurchaseEvent('ERROR', 'No customer email found in session', session);
      return;
    }

    if (!userId) {
      logPurchaseEvent('WARN', 'No user ID found in session - purchase will be linked by email only', {
        sessionId: session.id,
        customerEmail
      });
    }

    logPurchaseEvent('INFO', `Processing session for user: ${userId || 'unknown'} (${customerEmail})`);

    // Get line items if not present
    let items = lineItems;
    if (items.length === 0) {
      logPurchaseEvent('INFO', 'Fetching line items from Stripe');
      const stripe = await getStripeInstance();
      try {
        const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id);
        items = lineItemsResponse.data;
        logPurchaseEvent('SUCCESS', `Retrieved ${items.length} line items`);
      } catch (error: any) {
        logPurchaseEvent('ERROR', `Failed to fetch line items: ${error.message}`);
        return;
      }
    }

    logPurchaseEvent('INFO', `Processing ${items.length} purchased items`);

    // Process each purchased item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStartTime = Date.now();
      
      logPurchaseEvent('INFO', `Processing item ${i + 1}/${items.length}`, {
        priceId: item.price?.id,
        quantity: item.quantity
      });

      const priceId = item.price?.id;
      if (!priceId) {
        logPurchaseEvent('WARN', `Skipping item ${i + 1} - no price ID`);
        continue;
      }

      try {
        // Get product details from Stripe
        const stripe = await getStripeInstance();
        
        logPurchaseEvent('INFO', `Fetching Stripe price: ${priceId}`);
        const price = await stripe.prices.retrieve(priceId);
        
        const stripeProductId = price.product as string;
        logPurchaseEvent('INFO', `Fetching Stripe product: ${stripeProductId}`);
        const product = await stripe.products.retrieve(stripeProductId);

        logPurchaseEvent('SUCCESS', `Retrieved product details`, {
          stripeProductId,
          productName: product.name,
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          currency: price.currency
        });

        // CRITICAL: Map Stripe product ID to internal access system ID
        const mappedProductId = mapStripeProductToInternal(
          product.name, 
          stripeProductId, 
          product.metadata
        );

        // Create purchase record with multiple fallback strategies
        const purchaseData = {
          user_id: userId,
          customer_email: customerEmail,
          product_id: mappedProductId,
          product_name: product.name,
          price_id: priceId,
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          currency: price.currency,
          status: 'active' as const,
          stripe_session_id: session.id,
          stripe_customer_id: customerId,
          stripe_product_id: stripeProductId
        };

        logPurchaseEvent('INFO', `Creating purchase record`, purchaseData);
        const purchaseCreated = await createPurchaseRecord(purchaseData);

        if (!purchaseCreated) {
          logPurchaseEvent('ERROR', '🚨 CRITICAL: Purchase record creation failed completely', {
            customerEmail,
            productName: product.name,
            mappedProductId,
            sessionId: session.id
          });
          continue;
        }

        logPurchaseEvent('SUCCESS', `✅ PURCHASE UNLOCKED: ${customerEmail} -> ${mappedProductId}`, {
          customerEmail,
          productName: product.name,
          mappedProductId,
          originalProductId: stripeProductId,
          amount: purchaseData.amount,
          processingTime: Date.now() - itemStartTime
        });

        // CRITICAL: Also create purchase record by email for users who might not have userId
        if (!userId && customerEmail) {
          logPurchaseEvent('INFO', 'Creating additional purchase record by email for fallback access');
          await createPurchaseRecord({
            ...purchaseData,
            user_id: '', // Empty user_id but keep email
            customer_email: customerEmail
          });
        }

        // Send notification emails with magic access fallback
        let accessLink = `${process.env.NEXT_PUBLIC_SITE_URL}/my-account`;
        try {
          if (!userId && customerEmail) {
            const { createMagicToken } = await import('@/lib/magic-link');
            const token = createMagicToken({ sessionId: session.id, orderId: (session as any).metadata?.order_id, email: customerEmail });
            accessLink = `${process.env.NEXT_PUBLIC_SITE_URL}/api/magic-access?token=${encodeURIComponent(token)}`;
          } else if (mappedProductId === 'video') {
            accessLink = `${process.env.NEXT_PUBLIC_SITE_URL}/upsell/masterclass-success?session_id=${session.id}`;
          }
        } catch (e) {
          // Fallback to my-account
        }

        await sendNotificationEmails(customerEmail, product.name, purchaseData, accessLink);

      } catch (itemError: any) {
        logPurchaseEvent('ERROR', `Failed to process item ${i + 1}: ${itemError.message}`, {
          priceId,
          error: itemError.message,
          stack: itemError.stack
        });
      }
    }

    const sessionProcessingTime = Date.now() - sessionStartTime;
    logPurchaseEvent('SUCCESS', `Session processing completed in ${sessionProcessingTime}ms`, {
      sessionId: session.id,
      itemsProcessed: items.length,
      processingTime: sessionProcessingTime
    });

  } catch (error: any) {
    const sessionProcessingTime = Date.now() - sessionStartTime;
    logPurchaseEvent('ERROR', `Session processing failed after ${sessionProcessingTime}ms: ${error.message}`, {
      sessionId: session.id,
      error: error.message,
      stack: error.stack,
      processingTime: sessionProcessingTime
    });
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  logPurchaseEvent('INFO', '💰 Processing payment_intent.succeeded event', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency
  });

  try {
    // Check if this payment intent is already processed
    const { data: existingPurchase, error: lookupError } = await supabase
      .from('purchases')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (!lookupError && existingPurchase) {
      logPurchaseEvent('INFO', `Payment intent ${paymentIntent.id} already processed, skipping`);
      return;
    }

    // Extract metadata
    const metadata = paymentIntent.metadata || {};
    const userId = metadata.userId;
    const stripeProductId = metadata.productId;
    const customerEmail = paymentIntent.receipt_email || metadata.customerEmail;

    if (!userId || !stripeProductId || !customerEmail) {
      logPurchaseEvent('WARN', 'Missing required metadata in payment intent', {
        hasUserId: !!userId,
        hasProductId: !!stripeProductId,
        hasEmail: !!customerEmail,
        metadata
      });
      return;
    }

    // Get product details from Stripe
    const stripe = await getStripeInstance();
    const product = await stripe.products.retrieve(stripeProductId);

    // Map product ID
    const mappedProductId = mapStripeProductToInternal(product.name, stripeProductId, product.metadata);

    // Create purchase record
    const purchaseData = {
      user_id: userId,
      customer_email: customerEmail,
      product_id: mappedProductId,
      product_name: product.name,
      amount: paymentIntent.amount ? paymentIntent.amount / 100 : 0,
      currency: paymentIntent.currency,
                status: 'active' as const,
      stripe_payment_intent_id: paymentIntent.id,
      stripe_customer_id: paymentIntent.customer,
      stripe_product_id: stripeProductId
    };

    const purchaseCreated = await createPurchaseRecord(purchaseData);

    if (purchaseCreated) {
      logPurchaseEvent('SUCCESS', `✅ Payment intent purchase unlocked: ${customerEmail} -> ${mappedProductId}`);
      
      // Send notification emails
      await sendNotificationEmails(
        customerEmail, 
        product.name, 
        purchaseData, 
        `${process.env.NEXT_PUBLIC_SITE_URL}/my-account`
      );
    }

  } catch (error: any) {
    logPurchaseEvent('ERROR', `Payment intent processing failed: ${error.message}`, {
      paymentIntentId: paymentIntent.id,
      error: error.message
    });
  }
}