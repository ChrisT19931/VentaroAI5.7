import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
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
      const productId = price.product as string;
      const product = await stripe.products.retrieve(productId);
      
      // Create purchase record
      const { data: purchase, error } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          customer_email: customerEmail,
          product_id: productId,
          price_id: priceId,
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          currency: price.currency,
          status: 'active',
          stripe_session_id: session.id,
          stripe_customer_id: customerId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating purchase record:', error);
        continue;
      }
      
      console.log(`Created purchase record for ${customerEmail}, product ${productId}`);
      
      // Send confirmation email
      await sendOrderConfirmationEmail({
        email: customerEmail,
        orderDetails: {
          productName: product.name,
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          orderId: purchase.id,
        },
      });
      
      // Send access granted email
      await sendAccessGrantedEmail({
        email: customerEmail,
        productName: product.name,
        accessLink: `${process.env.NEXT_PUBLIC_SITE_URL}/my-account`,
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
    const productId = metadata.productId;
    const customerEmail = paymentIntent.receipt_email || metadata.customerEmail;
    
    if (!userId || !productId || !customerEmail) {
      console.log('Missing required metadata in payment intent, skipping');
      return;
    }
    
    // Create purchase record
    const { data: purchase, error } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        customer_email: customerEmail,
        product_id: productId,
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
    
    console.log(`Created purchase record for ${customerEmail}, product ${productId} from payment intent`);
    
    // Get product details from Stripe
    const stripe = await getStripeInstance();
    const product = await stripe.products.retrieve(productId);
    
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