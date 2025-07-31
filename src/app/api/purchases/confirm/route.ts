import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
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


    // Create purchase records in database
    const purchasePromises = orderItems.map(async (item: any) => {
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          product_id: item.id,
          product_name: item.name,
          price: item.price, // Using 'price' to match database schema
          customer_email: email, // Add customer_email to match the query in GET endpoint
          session_id: orderNumber, // Use orderNumber as session_id
          download_url: '/my-account' // Set default download URL
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
    const email = searchParams.get('email');

    console.log('GET /api/purchases/confirm - Parameters:', { userId, email });

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    const adminClient = getSupabaseAdmin();
    let query = adminClient
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    // Query by user_id if available, otherwise by email
    if (userId) {
      console.log('Querying by user_id:', userId);
      query = query.eq('user_id', userId);
    } else if (email) {
      console.log('Querying by customer_email:', email);
      query = query.eq('customer_email', email);
    }

    const { data: purchases, error } = await query;

    console.log('Query result:', { purchases, error, count: purchases?.length });

    if (error) {
      console.error('Error fetching purchases:', error);
      return NextResponse.json(
        { error: 'Failed to fetch purchases' },
        { status: 500 }
      );
    }

    // Add cache-busting headers to ensure immediate access
    const response = NextResponse.json({ purchases });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Get purchases error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}