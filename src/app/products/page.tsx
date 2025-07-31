import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import BuyNowButton from '@/components/BuyNowButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Business Solutions - From Starter Prompts to Business Coaching',
  description: 'Browse our complete hierarchy of AI business solutions: AI Prompts Starter Pack, AI Business E-Book, and Complete Business Deployment Coaching.',
  keywords: 'AI prompts, AI business, e-book, business coaching, online business, digital products, AI tools',
  openGraph: {
    title: 'AI Business Solutions - From Starter Prompts to Business Coaching',
    description: 'Discover our complete hierarchy of AI business solutions for every stage of your online business journey.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Business Solutions - From Starter to Coaching',
    description: 'Complete hierarchy of AI business solutions for your online success',
  },
};

async function getProducts() {
  // Try to fetch from Supabase first
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.error('Error connecting to Supabase:', e);
  }
  
  // Fallback to mock data if Supabase fetch fails or returns empty
  return [
    {
      id: '2',
      name: 'AI Prompts Starter Pack',
      description: 'Your entry point to AI-powered business success. 30 ready-to-use prompts that jumpstart your online business journey with minimal learning curve and immediate implementation.',
      price: 10.00,
      originalPrice: 20.00,
      image_url: '/images/products/ai-prompts-arsenal.svg',
      category: 'tools',
      is_active: true,
      featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: '1',
      name: 'AI Business E-Book',
      description: 'The essential knowledge resource containing half of what you need to build a successful online business. Comprehensive strategies, frameworks, and implementation guides for the self-starter.',
      price: 25.00,
      originalPrice: 50.00,
      image_url: '/images/products/ai-tools-mastery-guide.svg',
      category: 'courses',
      is_active: true,
      featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Complete Business Deployment Coaching',
      description: 'The ultimate solution for those who want all information required to deploy a custom-built site from start to finish. Own your front-end/back-end and edit everything on the fly with expert guidance.',
      price: 500.00,
      originalPrice: 3000.00,
      image_url: '/images/products/ai-business-strategy-session.svg',
      category: 'services',
      is_active: true,
      featured: false,
      created_at: new Date().toISOString()
    },

  ];
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-black">AI Business Solutions for Every Stage</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          Explore our complete hierarchy of AI business solutions designed for every stage of your online business journey. From entry-level AI Prompts to comprehensive coaching and custom web development services, we have the perfect solution for your needs.
        </p>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <select 
              className="input-field max-w-xs"
              defaultValue="all"
            >
              <option value="all">All Categories</option>
              <option value="tools">AI Tools</option>
              <option value="templates">Templates</option>
              <option value="courses">Courses</option>
            </select>
          </div>
          <div>
            <select 
              className="input-field max-w-xs"
              defaultValue="newest"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <div key={product.id} className="card group hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {product.image_url ? (
                    <Image 
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Product Image
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-1 capitalize">{product.category || 'Uncategorized'}</div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold">A${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">A${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <Link href={`/products/${product.id}`} className="btn-outline text-sm">
                        View Details
                      </Link>
                    </div>
                    <BuyNowButton 
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image_url: product.image_url
                      }} 
                      className="text-sm py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}