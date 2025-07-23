import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Verify token for guest users
const verifyToken = (token: string, guestEmail: string, productType: string): boolean => {
  try {
    // Decode the token
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    
    // Token format: orderId-productId-email
    const [orderId, productId, tokenEmail] = decodedToken.split('-');
    
    // Verify the email matches
    if (tokenEmail !== guestEmail) {
      return false;
    }
    
    // In a production environment, you would want to verify the orderId and productId
    // by querying the database to ensure they match
    
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
      const { productId, productType, guestEmail, orderToken } = await request.json();

      if (!guestEmail || !orderToken || !productType) {
        return NextResponse.json(
          { error: 'Missing required parameters' },
          { status: 400 }
        );
      }
      
      // Verify the token for guest access
      const isValidToken = verifyToken(orderToken, guestEmail, productType);
      
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

    // Check if user has any completed orders containing the specified product type
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
      .eq('guest_email', guestEmail);
    
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