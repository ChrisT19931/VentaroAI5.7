import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BuyNowButton from '@/components/BuyNowButton';
import StarBackground from '@/components/3d/StarBackground';
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
    <div className="relative min-h-screen py-12 overflow-hidden">
      {/* Star Background */}
      {/* Choose your preferred background: */}
      {/* Option 1: No background (clean black) */}
      <StarBackground enabled={false} />
      
      {/* Option 2: Simple CSS stars */}
      {/* <StarBackground simple={true} /> */}
      
      {/* Option 3: 3D stars (original) */}
      {/* <StarBackground /> */}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-white">AI Business Solutions for Every Stage</h1>
        <p className="text-lg text-gray-200 mb-8 max-w-3xl">
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
            {products.map((product: any, index: number) => {
              const cardColors = [
                { bg: 'from-slate-900/90 to-gray-900/90', accent: 'emerald', shadow: 'emerald-500/10' },
                { bg: 'from-slate-900/90 to-gray-900/90', accent: 'blue', shadow: 'blue-500/10' },
                { bg: 'from-slate-900/80 to-gray-900/80', accent: 'purple', shadow: 'purple-500/10' }
              ];
              const colors = cardColors[index % 3];
              
              return (
                <div key={product.id} className={`group relative bg-gradient-to-br ${colors.bg} backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-${colors.shadow} transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 overflow-hidden border-2 border-slate-600/40`}>
                  {product.featured && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className={`bg-gradient-to-r from-${colors.accent}-500 to-${colors.accent}-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse`} style={{animationDuration: '2s'}}>
                        FEATURED
                      </div>
                    </div>
                  )}
                  <div className="h-48 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center">
                    <div className="relative">
                      <svg className={`w-20 h-20 text-${colors.accent}-400 opacity-60`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      <div className={`absolute inset-0 bg-${colors.accent}-400/20 rounded-full blur-xl`}></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-3xl font-black mb-3 text-white drop-shadow-lg">
                      {product.name}
                    </h3>
                    <p className="text-gray-200 mb-6 leading-relaxed text-base font-medium">
                      {product.description}
                    </p>
                    <div className="text-center mb-6">
                      {product.originalPrice ? (
                        <div>
                          <div className="flex items-center justify-center space-x-3 mb-2">
                            <span className="text-3xl font-black text-white drop-shadow-lg">A${product.price.toFixed(2)}</span>
                            <span className="text-xl text-gray-400 line-through font-bold">A${product.originalPrice.toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-green-300 font-bold animate-pulse bg-green-500/20 px-3 py-1 rounded-full" style={{animationDuration: '2s'}}>50% OFF Launch Price</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl font-black text-white drop-shadow-lg mb-2">A${product.price.toFixed(2)}</div>
                          <div className="text-sm text-gray-300 font-medium">One-time payment</div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <a 
                        href={`/products/${product.id}`}
                        className={`w-full block text-center py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600/30 hover:shadow-gray-500/20`}
                      >
                        View Details
                      </a>
                      <BuyNowButton 
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image_url: product.image_url
                        }} 
                        className={`w-full block text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-${colors.accent}-600 to-${colors.accent}-700 hover:from-${colors.accent}-500 hover:to-${colors.accent}-600 text-white border border-${colors.accent}-500/30 hover:shadow-${colors.accent}-500/20`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-white">No products found</h3>
            <p className="text-gray-200 mt-2">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}