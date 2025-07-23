import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase';
import { sendEmail, sendOrderConfirmationEmail } from '@/lib/sendgrid';
import { validateStripeEnvironment } from '@/lib/env-validation';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Validate Stripe environment variables
    const envValidation = validateStripeEnvironment();
    if (!envValidation.isValid) {
      console.error('Stripe environment validation failed:', envValidation.errors);
      return NextResponse.json(
        { error: 'Payment system configuration error' },
        { status: 500 }
      );
    }

    const { cartItems, guestEmail } = await request.json();

    if (!cartItems || !cartItems.length) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!guestEmail) {
      return NextResponse.json(
        { error: 'Email is required for checkout' },
        { status: 400 }
      );
    }

    // Initialize variables for user data
    const userEmail = guestEmail;
    let orderId: string;
    const supabase = await createClient();

    // Fetch product details from database to ensure price integrity
    const productIds = cartItems.map((item: any) => item.id);
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image_url')
      .in('id', productIds);

    if (productsError || !productsData) {
      return NextResponse.json(
        { error: 'Failed to fetch product details' },
        { status: 500 }
      );
    }

    // Create product metadata and line items for Stripe checkout
    const productMetadata = cartItems.map((item: any) => {
      const product = productsData.find((p: any) => p.id === item.id);
      
      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }
      
      // Determine download URL based on product type
      let download_url = null;
      if (product.name.includes('E-book')) {
        download_url = '/downloads/ebook';
      } else if (product.name.includes('AI Prompts')) {
        download_url = '/downloads/prompts';
      }
      // Coaching calls don't have download URLs
      
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        download_url
      };
    });
    
    // Create line items for Stripe checkout
    const lineItems = productMetadata.map((product: any) => {
      // Find the original product data to get the image_url
      const originalProduct = productsData.find((p: any) => p.id === product.id);
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: originalProduct?.image_url ? [originalProduct.image_url] : [],
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: product.quantity,
      };
    });

    // Calculate order total
    const orderTotal = cartItems.reduce((total: number, item: any) => {
      const product = productsData.find((p: any) => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);

    // Create a new order in the database
    const supabaseAdmin = await createClient();
    
    // Create a guest ID for the order
    const guestId = `guest_${uuidv4()}`;
    
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: guestId,
          status: 'pending',
          total: orderTotal,
          guest_email: userEmail,
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Insert order items
    const orderItems = cartItems.map((item: any) => {
      const product = productsData.find((p: any) => p.id === item.id);
      return {
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: product ? product.price : 0,
      };
    });

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderData.id}&guest=true`,
      cancel_url: `${request.headers.get('origin')}/cart?canceled=true`,
      metadata: {
        order_id: orderData.id,
        user_id: guestId,
        is_guest: 'true',
        guest_email: userEmail,
      },
    });

    // Send confirmation email with download links
    const downloadLinks = productMetadata
      .filter((product: any) => product.download_url)
      .map((product: any) => ({
        productName: product.name,
        url: `${request.headers.get('origin')}${product.download_url}`
      }));
    
    // Send email asynchronously (don't await to avoid delaying response)
    sendOrderConfirmationEmail({
      email: userEmail,
      orderNumber: orderData.id.slice(0, 8),
      orderItems: productMetadata,
      total: orderTotal,
      downloadLinks,
      isGuest: true
    }).catch(error => {
      console.error('Failed to send confirmation email:', error);
    });
    
    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}