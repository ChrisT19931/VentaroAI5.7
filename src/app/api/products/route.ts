import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Mock data for when database is not set up
const mockProducts = [
  {
    id: '1',
    name: 'AI Tools Mastery Guide 2025',
    description: '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
    price: 25.00,
    image_url: '/images/products/ai-tools-mastery-guide.svg',
    category: 'E-book',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'AI Prompts Arsenal 2025',
    description: '30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
    price: 10.00,
    image_url: '/images/products/ai-prompts-arsenal.svg',
    category: 'AI Prompts',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'AI Business Strategy Session 2025',
    description: '60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies to build profitable AI-powered businesses in 2025.',
    price: 497.00,
    image_url: '/images/products/ai-business-strategy-session.svg',
    category: 'Coaching',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      
      // If the table doesn't exist, return mock data
      if (error.code === '42P01') {
        console.log('⚠️ Database table not found, using mock data');
        return NextResponse.json(mockProducts);
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }
    
    // If no products found in database, return mock data
    if (!data || data.length === 0) {
      console.log('⚠️ No products in database, using mock data');
      return NextResponse.json(mockProducts);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Products API error:', error);
    // Fallback to mock data on any error
    console.log('⚠️ API error, using mock data');
    return NextResponse.json(mockProducts);
  }
}