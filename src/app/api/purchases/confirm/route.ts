import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { sendOrderConfirmationEmail } from '@/lib/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      email, 
      orderNumber, 
      orderItems, 
      total, 
      paymentIntentId 
    } = await request.json();

    if (!email || !orderNumber || !orderItems || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Create purchase records in database
    const purchasePromises = orderItems.map(async (item: any) => {
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          product_id: item.id,
          product_name: item.name,
          amount: item.price,
          currency: 'USD',
          status: 'completed',
          order_number: orderNumber,
          payment_intent_id: paymentIntentId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating purchase record:', error);
        throw error;
      }

      return data;
    });

    try {
      const purchases = await Promise.all(purchasePromises);
      
      // Generate download links for digital products
      const downloadLinks = orderItems.map((item: any) => ({
        productName: item.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/downloads/${item.slug || item.id}`
      }));

      // Send confirmation email
      try {
        await sendOrderConfirmationEmail({
          email,
          orderNumber,
          orderItems,
          total,
          downloadLinks,
          isGuest: !userId
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the purchase if email fails
      }

      return NextResponse.json({
        message: 'Purchase confirmed successfully',
        purchases,
        downloadLinks
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to record purchase' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Purchase confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user purchases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchases:', error);
      return NextResponse.json(
        { error: 'Failed to fetch purchases' },
        { status: 500 }
      );
    }

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error('Get purchases error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}