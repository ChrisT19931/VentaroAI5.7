import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getStripeInstance } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the Stripe session
    const stripe = await getStripeInstance();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Extract customer information from the session
    const customerId = session.customer;
    const customerEmail = session.customer_details?.email;
    const userId = session.client_reference_id;
    const metadata = session.metadata || {};

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'No customer email found in session' },
        { status: 400 }
      );
    }

    // Get line items from the session
    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(sessionId);
    const items = lineItemsResponse.data || [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'No items found in session' },
        { status: 400 }
      );
    }

    // Process each purchased item
    const purchasePromises = items.map(async (item) => {
      const priceId = item.price?.id;
      if (!priceId) return null;

      // Get product details from Stripe
      const price = await stripe.prices.retrieve(priceId);
      const productId = price.product as string;
      const product = await stripe.products.retrieve(productId);

      // Create or update purchase record (upsert)
      const { data: purchase, error } = await supabase
        .from('purchases')
        .upsert({
          user_id: userId,
          customer_email: customerEmail,
          product_id: productId,
          product_name: product.name,
          price: item.amount_total ? item.amount_total / 100 : 0, // Convert from cents
          session_id: sessionId,
          download_url: `/downloads/${productId}`
        }, {
          onConflict: 'user_id,product_id',
          ignoreDuplicates: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating/updating purchase record:', error);
        return null;
      }

      return purchase;
    });

    const purchases = (await Promise.all(purchasePromises)).filter(Boolean);

    // Add cache-busting headers to ensure immediate access
    const response = NextResponse.json({
      success: true,
      message: 'Purchases synced successfully',
      purchases
    });
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Purchase sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}