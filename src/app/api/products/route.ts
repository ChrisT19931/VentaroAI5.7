import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock data for when database is not set up
const mockProducts = [
  {
    id: '2',
    name: 'AI Prompts Starter Pack',
    description: 'Your entry point to AI-powered business success. 30 ready-to-use prompts that jumpstart your online business journey with minimal learning curve and immediate implementation.',
    price: 10.00,
    image_url: '/images/products/ai-prompts-arsenal.svg',
    category: 'AI Prompts',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '1',
    name: 'AI Business E-Book',
    description: 'The essential knowledge resource containing half of what you need to build a successful online business. Comprehensive strategies, frameworks, and implementation guides for the self-starter.',
    price: 25.00,
    image_url: '/images/products/ai-tools-mastery-guide.svg',
    category: 'E-book',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Complete Business Deployment Coaching',
    description: 'The ultimate solution for those who want all information required to deploy a custom-built site from start to finish. Own your front-end/back-end and edit everything on the fly with expert guidance.',
    price: 497.00,
    image_url: '/images/products/ai-business-strategy-session.svg',
    category: 'Coaching',
    featured: true,
    is_active: true,
    created_at: new Date().toISOString()
  },

];

export async function GET() {
  try {
  
    
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