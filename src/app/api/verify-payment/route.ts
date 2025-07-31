import { NextRequest, NextResponse } from 'next/server';
// Import Stripe type only, not the actual module
import type { Stripe } from 'stripe';
import { supabase } from '@/lib/supabase';
import { getStripeInstance } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { session_id, order_id } = await request.json();

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Verify the Stripe session
    const stripe = await getStripeInstance();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get order details from session metadata or database
    let orderDetails: any = null;
    let downloadLinks: any[] = [];



    try {
      // Try to get order from database first
      if (order_id) {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .eq('id', order_id)
          .single();

        if (!orderError && order) {
          orderDetails = order;
          
          // Generate secure download links for each item
          downloadLinks = order.order_items.map((item: any) => {
            const product = item.products;
            let downloadUrl = null;

            // Generate secure download URL based on product type
            if (product) {
              const token = Buffer.from(`${session_id}-${order_id}-${product.id}-${Date.now()}`).toString('base64');
              
              if (product.name.toLowerCase().includes('e-book') || product.name.toLowerCase().includes('ebook')) {
                downloadUrl = `/downloads/1?session_id=${encodeURIComponent(session_id)}&token=${encodeURIComponent(token)}&order_id=${encodeURIComponent(order_id)}`;
              } else if (product.name.toLowerCase().includes('prompt') || product.name.toLowerCase().includes('ai')) {
                downloadUrl = `/downloads/2?session_id=${encodeURIComponent(session_id)}&token=${encodeURIComponent(token)}&order_id=${encodeURIComponent(order_id)}`;
              } else if (product.name.toLowerCase().includes('coaching')) {
                downloadUrl = `/downloads/3?session_id=${encodeURIComponent(session_id)}&token=${encodeURIComponent(token)}&order_id=${encodeURIComponent(order_id)}`;
              }
            }

            return {
              id: item.id,
              name: product?.name || 'Digital Product',
              price: item.price,
              quantity: item.quantity,
              image_url: product?.image_url,
              download_url: downloadUrl
            };
          });

          // Update order status to completed
          await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', order_id);

          // Create purchase records for each item to unlock products in user account
          const purchasePromises = order.order_items.map(async (item: any) => {
            const product = item.products;
            if (product) {
              const { error: purchaseError } = await supabase
                .from('purchases')
                .upsert({
                  user_id: order.user_id,
                  product_id: product.id,
                  product_name: product.name,
                  amount: item.price,
                  currency: 'USD',
                  status: 'completed',
                  order_number: order.order_number || order.id,
                  payment_intent_id: session.payment_intent,
                  created_at: new Date().toISOString()
                }, {
                  onConflict: 'user_id,product_id,order_number'
                });

              if (purchaseError) {
                console.error('Error creating purchase record:', purchaseError);
              }
            }
          });

          try {
            await Promise.all(purchasePromises);
            console.log('Purchase records created successfully');
          } catch (purchaseError) {
            console.error('Failed to create some purchase records:', purchaseError);
          }
        }
      }
    } catch (dbError) {
      console.warn('Database operation failed, using session metadata:', dbError);
    }

    // Fallback to session metadata if database is not available
    if (!orderDetails) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session_id, {
        expand: ['data.price.product']
      });

      orderDetails = {
        id: session.metadata?.order_id || session_id,
        total: (session.amount_total || 0) / 100,
        status: 'completed',
        created_at: new Date().toISOString()
      };

      // Generate download links from line items
      downloadLinks = lineItems.data.map((item: any, index: number) => {
        const product = item.price.product;
        const token = Buffer.from(`${session_id}-${orderDetails.id}-${product.id}-${Date.now()}`).toString('base64');
        
        let downloadUrl = null;
        if (product.name.toLowerCase().includes('e-book') || product.name.toLowerCase().includes('ebook')) {
          downloadUrl = `/downloads/1?session_id=${encodeURIComponent(session_id)}&token=${encodeURIComponent(token)}`;
        } else if (product.name.toLowerCase().includes('prompt') || product.name.toLowerCase().includes('ai')) {
          downloadUrl = `/downloads/2?session_id=${encodeURIComponent(session_id)}&token=${encodeURIComponent(token)}`;
        } else if (product.name.toLowerCase().includes('coaching')) {
          downloadUrl = `/downloads/3?session_id=${encodeURIComponent(session_id)}&token=${encodeURIComponent(token)}`;
        }

        return {
          id: product.id,
          name: product.name,
          price: (item.amount_total || 0) / 100,
          quantity: item.quantity,
          image_url: product.images?.[0] || null,
          download_url: downloadUrl
        };
      });

      // Create purchase records for fallback scenario (when using session metadata)
      if (session.customer_details?.email) {
        const purchasePromises = lineItems.data.map(async (item: any) => {
          const product = item.price.product;
          if (product) {
            try {
              const { error: purchaseError } = await supabase
                .from('purchases')
                .upsert({
                  user_id: session.metadata?.user_id || null,
                  product_id: product.id,
                  product_name: product.name,
                  amount: (item.amount_total || 0) / 100,
                  currency: 'USD',
                  status: 'completed',
                  order_number: orderDetails.id,
                  payment_intent_id: session.payment_intent,
                  customer_email: session.customer_details.email,
                  created_at: new Date().toISOString()
                }, {
                  onConflict: 'product_id,order_number,customer_email'
                });

              if (purchaseError) {
                console.error('Error creating fallback purchase record:', purchaseError);
              }
            } catch (error) {
              console.error('Failed to create fallback purchase record:', error);
            }
          }
        });

        try {
          await Promise.all(purchasePromises);
          console.log('Fallback purchase records created successfully');
        } catch (purchaseError) {
          console.error('Failed to create some fallback purchase records:', purchaseError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: orderDetails,
      downloadLinks,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email
      }
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}