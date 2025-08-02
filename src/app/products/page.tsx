import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import BuyNowButton from '../../components/BuyNowButton';
import StarBackground from '../../components/3d/StarBackground';
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
      description: 'The essential knowledge resource containing 90% of what you need to build a successful online business. Comprehensive strategies, frameworks, and implementation guides for the self-starter.',
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
    <div className="relative min-h-screen py-16 overflow-hidden bg-gradient-to-br from-slate-950 via-gray-950 to-black">
      {/* Subtle background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 drop-shadow-2xl">
            AI Business Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light max-w-4xl mx-auto leading-relaxed">
            Choose your path to AI-powered business success
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        {/* Professional Three-Tier Layout */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {products.map((product: any, index: number) => {
              const cardConfigs = [
                {
                  bg: 'from-slate-900/90 via-emerald-900/30 to-gray-900/90',
                  accent: 'emerald',
                  accentHex: '#10b981',
                  shadow: 'emerald-500/25',
                  border: 'emerald-500/30',
                  glow: 'emerald-400/15',
                  icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                  tier: 'STARTER',
                  tierColor: 'from-emerald-500 to-emerald-600',
                  scale: 'hover:scale-105',
                  popular: false
                },
                {
                  bg: 'from-slate-900/95 via-blue-900/40 to-gray-900/95',
                  accent: 'blue',
                  accentHex: '#3b82f6',
                  shadow: 'blue-500/30',
                  border: 'blue-500/40',
                  glow: 'blue-400/20',
                  icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
                  tier: 'PROFESSIONAL',
                  tierColor: 'from-blue-500 to-blue-600',
                  scale: 'hover:scale-110',
                  popular: true
                },
                {
                  bg: 'from-slate-900/95 via-purple-900/40 to-gray-900/95',
                  accent: 'purple',
                  accentHex: '#8b5cf6',
                  shadow: 'purple-500/30',
                  border: 'purple-500/40',
                  glow: 'purple-400/20',
                  icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
                  tier: 'PREMIUM',
                  tierColor: 'from-purple-500 to-purple-600',
                  scale: 'hover:scale-105',
                  popular: false
                }
              ];
              const config = cardConfigs[index % 3];
              const isPopular = config.popular;
              
              return (
                <div key={product.id} className={`group relative bg-gradient-to-br ${config.bg} backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-${config.shadow} transition-all duration-700 transform hover:-translate-y-6 ${config.scale} overflow-hidden border-2 ${isPopular ? `border-${config.accent}-400/60` : `border-${config.border}`} ${isPopular ? 'ring-2 ring-blue-400/20' : ''}`}>
                  {/* Professional glow effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-${config.accent}-500/10 via-transparent to-${config.accent}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  
                  {/* Subtle floating elements */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className={`absolute top-6 right-6 w-2 h-2 bg-${config.accent}-400/40 rounded-full animate-pulse`} style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
                    <div className={`absolute bottom-8 left-8 w-1.5 h-1.5 bg-${config.accent}-300/30 rounded-full animate-pulse`} style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
                  </div>
                  
                  {/* Tier Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className={`bg-gradient-to-r ${config.tierColor} text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all duration-500 group-hover:scale-110`}>
                      {config.tier}
                    </div>
                  </div>
                  
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute top-6 right-6 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-pulse" style={{animationDuration: '2s'}}>
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  {/* Hero Section */}
                  <div className={`h-48 bg-gradient-to-br from-slate-900/50 to-gray-900/50 relative overflow-hidden flex items-center justify-center transition-all duration-700`}>
                    <div className="relative transform group-hover:scale-110 transition-all duration-700">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.tierColor} flex items-center justify-center shadow-2xl group-hover:shadow-${config.accent}-500/50 transition-all duration-700`}>
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d={config.icon}/>
                        </svg>
                      </div>
                      <div className={`absolute inset-0 bg-${config.glow} rounded-2xl blur-xl group-hover:bg-${config.accent}-400/30 transition-all duration-700`}></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4 text-white leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                      {product.description}
                    </p>
                    
                    {/* Pricing Section */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center space-x-2 mb-2">
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
                          A${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            A${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">One-time investment</div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <a 
                        href={`/products/${product.id}`}
                        className={`w-full block text-center py-4 rounded-xl font-semibold transition-all duration-500 hover:scale-105 shadow-lg bg-gradient-to-r ${config.tierColor} text-white hover:shadow-${config.accent}-500/30 hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group/btn`}
                      >
                        <span className="relative z-10">View Details</span>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      </a>
                      
                      <BuyNowButton 
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image_url: product.image_url
                        }} 
                        className="w-full py-4 rounded-xl font-semibold transition-all duration-500 hover:scale-105 shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white hover:shadow-gray-500/20 hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group/buy"
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