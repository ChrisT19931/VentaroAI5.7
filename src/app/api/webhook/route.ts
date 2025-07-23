import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { sendOrderConfirmationEmail } from '@/lib/sendgrid';

// Get Stripe webhook secret from environment
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Check if webhook secret is missing or is a placeholder
    if (!webhookSecret || 
        webhookSecret === 'whsec_placeholder' || 
        webhookSecret.includes('placeholder')) {
      console.warn('STRIPE_WEBHOOK_SECRET not configured or is a placeholder - webhook processing will not work');
      // Return a 200 response during build/deployment to prevent errors
      // In production with real webhook secret, this code won't execute
      return NextResponse.json({ received: true, mode: 'build' });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature') as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred processing the webhook' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    const { order_id, user_id } = session.metadata;

    if (!order_id || !user_id) {
      throw new Error('Missing order_id or user_id in session metadata');
    }

    // Update order status to completed
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', order_id);

    if (updateError) throw updateError;

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError) throw orderError;

    // Fetch order items with product details
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        quantity,
        price,
        products (id, name, file_url)
      `)
      .eq('order_id', order_id);

    if (itemsError) throw itemsError;

    // Generate download URLs for digital products
    await Promise.all(
      (orderItems || []).map(async (item: any) => {
        if (item.products?.file_url) {
          // Update the order item with the download URL
          const { error: updateItemError } = await supabase
            .from('order_items')
            .update({ 
              download_url: item.products.file_url 
            })
            .eq('id', item.id);

          if (updateItemError) {
            console.error('Error updating download URL:', updateItemError);
          }
        }
      })
    );

    // Get user email for sending confirmation
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', user_id)
      .single();

    if (userError) throw userError;

    // Fetch updated order items with download URLs
    const { data: updatedItems, error: updatedItemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        quantity,
        price,
        download_url,
        products (id, name)
      `)
      .eq('order_id', order_id);

    if (updatedItemsError) throw updatedItemsError;

    // Send order confirmation email
    if (userData?.email) {
      const downloadLinks = (updatedItems || [])
        .filter((item: any) => item.download_url)
        .map((item: any) => ({
          productName: item.products?.name || 'Product',
          url: `${process.env.NEXT_PUBLIC_SITE_URL}${item.download_url}`
        }));

      await sendOrderConfirmationEmail({
        email: userData.email,
        orderNumber: order_id,
        orderItems: (updatedItems || []).map((item: any) => ({
          name: item.products?.name || 'Product',
          quantity: item.quantity,
          price: item.price
        })),
        total: order.total,
        downloadLinks
      });
    }

    console.log(`Order ${order_id} processed successfully`);
  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}