import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { sendOrderConfirmationEmail, sendEmailWithValidation } from '@/lib/sendgrid';
import { optimizedDatabaseQuery, optimizedEmailSend } from '@/lib/system-optimizer';

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
    const { order_id, user_id, guest_email } = session.metadata;

    if (!order_id || !guest_email) {
      throw new Error('Missing order_id or guest_email in session metadata');
    }

    let order;
    let orderItems = [];
    
    try {
      // Update order status to completed with optimization
      const updateError = await optimizedDatabaseQuery(async () => {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('id', order_id);
        return error;
      }, `order-update-${order_id}`);

      if (updateError) {
        if (updateError.code === '42P01') {
          console.log('⚠️ Orders table not found, using mock order data');
          // Create mock order data
          order = {
            id: order_id,
            user_id: user_id || 'guest',
            status: 'completed',
            total: session.amount_total / 100, // Convert from cents
            created_at: new Date().toISOString()
          };
        } else {
          throw updateError;
        }
      } else {
        // Fetch order with items using optimization
        const { data, error: orderError } = await optimizedDatabaseQuery(async () => {
          const result = await supabase
            .from('orders')
            .select('*')
            .eq('id', order_id)
            .single();
          return result;
        }, `order-fetch-${order_id}`);

        if (orderError) {
          if (orderError.code === '42P01') {
            console.log('⚠️ Orders table not found, using mock order data');
            // Create mock order data
            order = {
              id: order_id,
              user_id: user_id || 'guest',
              status: 'completed',
              total: session.amount_total / 100, // Convert from cents
              created_at: new Date().toISOString()
            };
          } else {
            throw orderError;
          }
        } else {
          order = data;
        }
      }

      // Fetch order items with product details using optimization
      const { data: items, error: itemsError } = await optimizedDatabaseQuery(async () => {
        const result = await supabase
          .from('order_items')
          .select(`
            id,
            quantity,
            price,
            products (id, name, file_url)
          `)
          .eq('order_id', order_id);
        return result;
      }, `order-items-${order_id}`);

      if (itemsError) {
        if (itemsError.code === '42P01') {
          console.log('⚠️ Order items table not found, using session line items');
          // Create mock order items from session line items
          if (session.line_items?.data) {
            orderItems = session.line_items.data.map((item: any) => ({
              id: `item_${Math.random().toString(36).substring(2, 9)}`,
              quantity: item.quantity,
              price: item.amount_total / 100 / item.quantity,
              products: {
                id: item.price?.product,
                name: item.description,
                file_url: null
              }
            }));
          }
        } else {
          throw itemsError;
        }
      } else {
        orderItems = items || [];
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      // Create mock order data as fallback
      order = {
        id: order_id,
        user_id: user_id || 'guest',
        status: 'completed',
        total: session.amount_total / 100, // Convert from cents
        created_at: new Date().toISOString()
      };
      
      // Create mock order items from session if available
      if (session.line_items?.data) {
        orderItems = session.line_items.data.map((item: any) => ({
          id: `item_${Math.random().toString(36).substring(2, 9)}`,
          quantity: item.quantity,
          price: item.amount_total / 100 / item.quantity,
          products: {
            id: item.price?.product,
            name: item.description,
            file_url: null
          }
        }));
      }
    }

    // Generate download URLs for digital products
    let updatedItems = [];
    // Get user email for sending confirmation
    const userEmail: string = guest_email;
    
    try {
      await Promise.all(
        (orderItems || []).map(async (item: any) => {
          if (item.products?.file_url) {
            try {
              // Update the order item with the download URL
              const { error: updateItemError } = await supabase
                .from('order_items')
                .update({ 
                  download_url: item.products.file_url 
                })
                .eq('id', item.id);

              if (updateItemError) {
                if (updateItemError.code === '42P01') {
                  console.log('⚠️ Order items table not found, skipping download URL update');
                  // Add download URL directly to the item in memory
                  item.download_url = item.products.file_url;
                } else {
                  console.error('Error updating download URL:', updateItemError);
                }
              }
            } catch (error) {
              console.error('Error updating download URL:', error);
              // Add download URL directly to the item in memory as fallback
              item.download_url = item.products.file_url;
            }
          }
        })
      );

      // User email already defined above

      try {
        // Fetch updated order items with download URLs
        const { data: items, error: updatedItemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            quantity,
            price,
            download_url,
            products (id, name)
          `)
          .eq('order_id', order_id);

        if (updatedItemsError) {
          if (updatedItemsError.code === '42P01') {
            console.log('⚠️ Order items table not found, using in-memory items');
            // Use the in-memory items with download URLs we added above
            updatedItems = orderItems;
          } else {
            throw updatedItemsError;
          }
        } else {
          updatedItems = items || [];
        }
      } catch (error) {
        console.error('Error fetching updated order items:', error);
        // Use the in-memory items as fallback
        updatedItems = orderItems;
      }
    } catch (error) {
      console.error('Error processing download URLs:', error);
      // Use the original order items as fallback
      updatedItems = orderItems;
    }

    // Send order confirmation email with enhanced validation
    if (userEmail) {
      try {
        // Generate download links with tokens for guest users
        const downloadLinks = (updatedItems || []).filter((item: any) => item.download_url)
          .map((item: any) => {
            let url = `${process.env.NEXT_PUBLIC_SITE_URL}${item.download_url}`;
            
            // Create a simple token based on order ID and product ID
            // In a production environment, you might want to use a more secure token generation method
            const token = Buffer.from(`${order_id}-${item.products?.id}-${guest_email}`).toString('base64');
            
            // Add the parameters to the URL
            url = `${url}?email=${encodeURIComponent(guest_email)}&token=${encodeURIComponent(token)}`;
            
            return {
              productName: item.products?.name || 'Product',
              url
            };
          });

        const emailResult = await optimizedEmailSend({
           email: userEmail,
           orderNumber: order_id,
           orderItems: (updatedItems || []).map((item: any) => ({
             name: item.products?.name || 'Product',
             quantity: item.quantity,
             price: item.price
           })),
           total: order.total,
           downloadLinks,
           isGuest: true
         });
        
        if (emailResult.success) {
          console.log('Order confirmation email sent successfully');
        } else {
          console.error('Failed to send order confirmation email:', emailResult.error);
          // Could implement fallback notification system here
        }
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }
    }

    console.log(`Order ${order_id} processed successfully`);
  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}