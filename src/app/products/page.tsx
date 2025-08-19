'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';
import UnifiedCheckoutButton from '@/components/UnifiedCheckoutButton';

import dynamic from 'next/dynamic';

// Performance optimization: Use React.memo for components that don't need frequent re-renders
const MemoizedUnifiedCheckoutButton = React.memo(UnifiedCheckoutButton);

function getProducts() {
  // Fallback to mock data - Updated business model
  return [
    {
      id: 'ai-business-video-guide-2025',
      name: '🎯 AI Web Creation Masterclass',
      description: '2 Hours from Zero to Live • Watch me create a complete platform from scratch, in real time. No Experience Needed • You just follow along. Keep Your Code Forever • Build it yourself, own it completely, change anything you want. No SaaS Lock-In • Unlike Shopify or Wix, you build and own your platform. AI-Powered Changes • Tell AI agents what to modify and watch your platform transform instantly.',
      price: 50.00,
      image_url: '/images/products/ai-business-video-guide.svg',
      category: 'video',
      is_active: true,
      featured: true,
      productType: 'digital',
      created_at: new Date().toISOString(),
      highlight: true,
      badge: 'PRE-ORDER',
      isPreOrder: true,
      comingSoon: true
    },
    {
      id: 'weekly-support-contract-2025',
      name: 'Support Package',
      description: '60-minute Google Meet/phone call consultation + unlimited email support for 1 month.',
       price: 300.00,
       recurring: false,
      image_url: '/images/products/weekly-support.svg',
      category: 'support',
      is_active: true,
      featured: false,
      productType: 'digital',
      created_at: new Date().toISOString()
    },
    {
      id: 'ai-prompts-arsenal-2025',
      name: '30x AI Prompts Arsenal',
      description: '30 proven AI prompts for building online businesses.',
      price: 10.00,
      image_url: '/images/products/ai-prompts.svg',
      category: 'prompts',
      is_active: true,
      featured: false,
      productType: 'digital',
      created_at: new Date().toISOString()
    },
    {
      id: 'ai-tools-mastery-guide-2025',
      name: 'AI Tools Mastery Guide',
      description: '30 detailed lessons on ChatGPT, Claude, Cursor, and more AI tools for business building.',
      price: 25.00,
      image_url: '/images/products/ai-tools-guide.svg',
      category: 'ebook',
      is_active: true,
      featured: false,

      productType: 'digital',
      created_at: new Date().toISOString()
    }
  ];
}

// Performance optimization: Memoize the ProductsPage component
const ProductsPage = React.memo(function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  
  // Performance optimization: Use useCallback for the fetch function
  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        setProducts(data);
      } else {
        // Performance optimization: Use memoized mock products
        setProducts(getProducts());
      }
    } catch (e) {
      console.error('Error connecting to Supabase:', e);
      setProducts(getProducts());
    }
  }, []);
  
  useEffect(() => {
    fetchProducts();
    
    // Performance optimization: Add cleanup function
    return () => {
      // Cleanup any potential memory leaks
      setProducts([]);
    };
  }, [fetchProducts]);
  
  // Performance optimization: Minimal background effects
  const BackgroundEffects = useMemo(() => (
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-xl opacity-30"></div>
    </div>
  ), []);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {BackgroundEffects}
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Products</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional AI tools and resources to build your online business empire.
          </p>
        </div>

        {/* Products Grid - Same Style as Homepage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <style jsx>{`
            .glass-panel {
              background: rgba(15, 23, 42, 0.6);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            }
            
            .premium-button-glow {
              position: relative;
            }
            
            .premium-button-glow:hover {
              box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
            }
          `}</style>

          {/* AI Web Creation Masterclass - Featured */}
          {products.filter(p => p.id === 'ai-business-video-guide-2025').map((product) => (
            <div key={product.id} className="md:col-span-2 lg:col-span-4">
              <div className="group relative bg-gradient-to-br from-slate-900/95 via-blue-900/40 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-blue-500/40 hover:border-blue-500/60">
                {/* Enhanced glow effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                    PRE-ORDER
                  </div>
                </div>
                
                <div className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl md:text-4xl font-black mb-4 text-white drop-shadow-lg">{product.name}</h3>
                    <p className="text-gray-200 mb-6 text-lg leading-relaxed group-hover:text-white transition-colors duration-500">{product.description}</p>
                    
                    {/* What You Get Section */}
                    <div className="bg-gray-800/40 rounded-2xl p-8 mb-8 border border-purple-500/30">
                      <h4 className="text-2xl font-bold text-white mb-6 text-center">What You Get for $50</h4>
                      <div className="grid md:grid-cols-2 gap-6 text-left">
                        <ul className="space-y-4 text-gray-300">
                          <li className="flex items-start">
                            <svg className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <strong className="text-green-400">Step-by-Step Video Walkthrough</strong><br/>
                              <span className="text-sm">Watch the entire build process</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <strong className="text-blue-400">Complete Tool List</strong><br/>
                              <span className="text-sm">Everything you need, all AI-powered</span>
                            </div>
                          </li>
                        </ul>
                        <ul className="space-y-4 text-gray-300">
                          <li className="flex items-start">
                            <svg className="w-6 h-6 text-yellow-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <strong className="text-yellow-400">Implementation Blueprint</strong><br/>
                              <span className="text-sm">The exact prompts, workflow, and structure I use</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-6 h-6 text-purple-400 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <strong className="text-purple-400">Screen Recording</strong><br/>
                              <span className="text-sm">So you can replicate it whenever you want</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* The $50 vs $5K Gap */}
                    <div className="bg-gradient-to-r from-red-900/30 to-green-900/30 rounded-2xl p-6 mb-10 border border-green-500/30">
                      <h4 className="text-xl font-bold text-white mb-4 text-center">The $50 vs $5K Gap</h4>
                      <div className="space-y-2 text-center">
                        <div className="text-red-300">Hire a dev team? <span className="font-bold text-red-400">$5K–$50K</span></div>
                        <div className="text-green-300">Learn my method? <span className="font-bold text-green-400">$50 once</span> • own the skills + product for life</div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-5xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">A${product.price}</div>
                      <div className="text-sm text-gray-300">one-time payment</div>
                    </div>
                    
                    {product.isPreOrder ? (
                      <UnifiedCheckoutButton 
                        product={product}
                        buttonText="📅 Pre-Order Now • Coming Soon for $50"
                        className="premium-button-glow w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-black py-6 px-12 rounded-2xl hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block text-center text-lg"
                        variant="direct"
                      />
                    ) : (
                      <UnifiedCheckoutButton 
                        product={product}
                        buttonText="🚀 Start Building Now • Get Instant Access for $50"
                        className="premium-button-glow w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black py-6 px-12 rounded-2xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block text-center text-lg"
                        variant="direct"
                      />
                    )}
                    
                    <p className="text-sm text-gray-400 mt-4">{product.isPreOrder ? '📅 Pre-order now • Video available soon' : '⚡ Secure checkout • Premium support'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Support Package */}
          {products.filter(p => p.id === 'weekly-support-contract-2025').map((product) => (
            <div key={product.id} className="group relative bg-gradient-to-br from-slate-900/95 via-orange-900/40 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-orange-500/40 hover:border-orange-500/60">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  PROFESSIONAL
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-orange-400 opacity-60 group-hover:opacity-100 group-hover:text-orange-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-xl group-hover:bg-orange-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">{product.name}</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">{product.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full shadow-lg group-hover:shadow-orange-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors duration-300">60-minute consultation call</span>
                  </div>
                  <div className="flex items-center space-x-2 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full shadow-lg group-hover:shadow-orange-400/50 transition-all duration-300"></div>
                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors duration-300">Unlimited email support (1 month)</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 transition-all duration-500">A${product.price}</div>
                  <div className="text-xs text-gray-300">one-time payment</div>
                </div>
                <UnifiedCheckoutButton 
                  product={product}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-orange-500/30"
                  variant="direct"
                >
                  Get Support
                </UnifiedCheckoutButton>
              </div>
            </div>
          ))}

          {/* 30x AI Prompts Arsenal */}
          {products.filter(p => p.id === 'ai-prompts-arsenal-2025').map((product) => (
            <div key={product.id} className="group relative bg-gradient-to-br from-slate-900/95 via-emerald-900/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-emerald-500/40 hover:border-emerald-500/60">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  STARTER
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:text-emerald-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl group-hover:bg-emerald-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">{product.name}</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">{product.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Revenue-generating prompts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Business-focused only</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-green-400 transition-all duration-500">A${product.price}</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={product}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/30"
                  variant="direct"
                >
                  Get Prompts
                </UnifiedCheckoutButton>
              </div>
            </div>
          ))}

          {/* AI Tools Mastery Guide */}
          {products.filter(p => p.id === 'ai-tools-mastery-guide-2025').map((product) => (
            <div key={product.id} className="group relative bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-blue-500/40 hover:border-blue-500/60">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  EDUCATION
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-blue-400 opacity-60 group-hover:opacity-100 group-hover:text-blue-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">{product.name}</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">{product.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">30 detailed lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Business applications</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">A${product.price}</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={product}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30"
                  variant="direct"
                >
                  Get Ebook
                </UnifiedCheckoutButton>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors text-lg">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ProductsPage;