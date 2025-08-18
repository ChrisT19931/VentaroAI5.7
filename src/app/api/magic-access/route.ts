import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { verifyMagicToken } from '@/lib/magic-link';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const payload = verifyMagicToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const stripe = await getStripeInstance();
    const session = await stripe.checkout.sessions.retrieve(payload.sessionId, { expand: ['line_items.data.price'] });
    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not verified' }, { status: 400 });
    }

    const customerEmail = session.customer_details?.email?.toLowerCase();
    const userId = session.client_reference_id || '';
    if (!customerEmail) {
      return NextResponse.json({ error: 'Missing customer email' }, { status: 400 });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(payload.sessionId);

    for (const item of lineItems.data || []) {
      const priceId = typeof item.price === 'string' ? item.price : item.price?.id;
      if (!priceId) continue;
      const price = await stripe.prices.retrieve(priceId);
      const productId = price.product as string;
      const product = await stripe.products.retrieve(productId);

      await supabase
        .from('purchases')
        .upsert({
          user_id: userId,
          customer_email: customerEmail,
          product_id: productId,
          product_name: product.name,
          price: item.amount_total ? item.amount_total / 100 : 0,
          session_id: payload.sessionId,
          download_url: `/downloads/${productId}`,
          status: 'completed'
        }, { onConflict: 'user_id,product_id', ignoreDuplicates: true });
    }

    // Redirect to account after unlocking
    const redirectUrl = `${request.nextUrl.origin}/my-account`;
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
} 