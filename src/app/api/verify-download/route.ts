import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase';
import { getSignedUrl, fileExists } from '@/utils/storage';

// Verify token for guest users using session and order data
const verifyToken = (token: string, sessionId: string, orderId: string, productId: string): boolean => {
  try {
    // Decode the token
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    
    // Token format: sessionId-orderId-productId
    const [tokenSessionId, tokenOrderId, tokenProductId] = decodedToken.split('-');
    
    // Verify all components match
    if (tokenSessionId !== sessionId || tokenOrderId !== orderId || tokenProductId !== productId) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');
    
    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }
    
    // Determine which bucket to use based on path
    const bucket = 'product-files';
    
    // If token is provided, verify it
    if (token) {
      try {
        // Decode the token
        const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
        
        // Token format can vary based on where it was generated
        // It could be: sessionId-orderId-productId or orderId-productId-email
        const tokenParts = decodedToken.split('-');
        
        // Verify the token has the expected format
        if (tokenParts.length < 2) {
          return NextResponse.json(
            { error: 'Invalid token format' },
            { status: 403 }
          );
        }
        
        // Extract token components
        const tokenOrderId = tokenParts[0];
        
        // If orderId is provided in the URL, verify it matches the token
        if (orderId && tokenOrderId !== orderId) {
          return NextResponse.json(
            { error: 'Invalid token for this order' },
            { status: 403 }
          );
        }
        
        // Verify the order exists and is completed
        const supabase = await createClient();
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('id, status')
          .eq('id', tokenOrderId)
          .eq('status', 'completed')
          .single();
        
        if (orderError || !order) {
          console.error('Error verifying order:', orderError);
          return NextResponse.json(
            { error: 'Invalid or expired download link' },
            { status: 403 }
          );
        }
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
        return NextResponse.json(
          { error: 'Invalid download token' },
          { status: 403 }
        );
      }
    }
    
    // Check if the file exists in the public directory first
     const publicFilePath = `${process.cwd()}/public/downloads/${path}`;
     const fs = require('fs');
     
     if (fs.existsSync(publicFilePath)) {
       // For files in the public directory, redirect to the public URL
       const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
       // Remove trailing slash from site URL if it exists
       const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
       return NextResponse.redirect(`${baseUrl}/downloads/${path}`);
     }
    
    // If not in public directory, try to get from Supabase Storage
    try {
      // Check if file exists in Supabase Storage
      const exists = await fileExists(path, bucket);
      
      if (!exists) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      
      // Generate a signed URL with a short expiration time (24 hours)
      const signedUrl = await getSignedUrl(path, bucket, 86400); // 24 hours
      
      // Redirect to the signed URL
      return NextResponse.redirect(signedUrl);
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return NextResponse.json(
        { error: 'File not found or access denied' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
      const { productId, productType, sessionId, orderToken, orderId } = await request.json();

      if (!sessionId || !orderToken || !productType || !orderId || !productId) {
        return NextResponse.json(
          { error: 'Missing required parameters' },
          { status: 400 }
        );
      }
      
      // Verify the token for guest access
      const isValidToken = verifyToken(orderToken, sessionId, orderId, productId);
      
      if (!isValidToken) {
        return NextResponse.json({ hasAccess: false });
      }

    const supabase = await createClient();

    // Define product name patterns to match against
    const productPatterns = {
      ebook: ['E-book', 'ebook', 'AI Tools Mastery Guide 2025'],
      prompts: ['AI Prompts', 'prompts', 'AI Prompts Arsenal 2025'],
      coaching: ['Coaching', 'coaching', 'AI Business Strategy Session 2025'],
      any: ['E-book', 'ebook', 'AI Tools Mastery Guide 2025', 'AI Prompts', 'prompts', 'AI Prompts Arsenal 2025', 'Coaching', 'coaching', 'AI Business Strategy Session 2025']
    };

    const patterns = productPatterns[productType as keyof typeof productPatterns];
    
    if (!patterns) {
      return NextResponse.json(
        { error: 'Invalid product type' },
        { status: 400 }
      );
    }

    // Check if the specific order exists and is completed
    let query = supabase
      .from('orders')
      .select(`
        id,
        status,
        order_items!inner (
          id,
          products!inner (
            id,
            name
          )
        )
      `)
      .eq('status', 'completed')
      .eq('id', orderId);
    
    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to verify access' },
        { status: 500 }
      );
    }

    // Check if any order contains a product matching the requested type
    const hasAccess = orders?.some((order: any) => 
      order.order_items?.some((item: any) => 
        patterns.some(pattern => 
          item.products?.name?.includes(pattern)
        )
      )
    ) || false;

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Verify download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}