import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, productType } = await request.json();

    if (!userId || !productType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const supabase = createClient(request);

    // Define product name patterns to match against
    const productPatterns = {
      ebook: ['E-book', 'ebook', 'Premium AI E-book'],
      prompts: ['AI Prompts', 'prompts', 'Prompts Collection'],
      coaching: ['Coaching', 'coaching', 'AI Mastery Coaching']
    };

    const patterns = productPatterns[productType as keyof typeof productPatterns];
    
    if (!patterns) {
      return NextResponse.json(
        { error: 'Invalid product type' },
        { status: 400 }
      );
    }

    // Check if user has any completed orders containing the specified product type
    const { data: orders, error: ordersError } = await supabase
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
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to verify access' },
        { status: 500 }
      );
    }

    // Check if any order contains a product matching the requested type
    const hasAccess = orders?.some(order => 
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