import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BuyNowButton from '@/components/BuyNowButton';
import StarBackground from '@/components/3d/StarBackground';



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
      name: '30x AI Prompts Arsenal 2025',
      description: 'Build your online business from scratch with 30 proven AI prompts. Simply copy/paste into ChatGPT and get step-by-step plans for every aspect of your business - from setup to scaling.',
      price: 10.00,
      image_url: '/images/products/ai-prompts-arsenal.svg',
      category: 'tools',
      is_active: true,
      featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: '1',
      name: 'AI Tools Mastery Guide 2025',
      description: 'Complete step-by-step guide to master 30 essential AI tools for building profitable online businesses from scratch. Everything you need to leverage AI for maximum business success.',
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
      name: 'AI Business Strategy Session 2025',
      description: 'Get personalized 1-on-1 expert guidance to build and deploy your complete online business. Learn everything you need for full technical independence and long-term success.',
      price: 500.00,
      originalPrice: 3000.00,
      image_url: '/images/products/ai-business-strategy-session.svg',
      category: 'services',
      is_active: true,
      featured: false,
      created_at: new Date().toISOString()
    }
  ];
}



export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div className="relative min-h-screen py-16 overflow-hidden bg-gradient-to-br from-slate-950 via-gray-950 to-black">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <StarBackground />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-full text-xs font-semibold text-purple-300 mb-4 border border-purple-500/30 shadow-lg shadow-purple-500/10 animate-pulse">
            🔥 LIMITED TIME: 83% OFF LAUNCH PRICING
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-purple-500 drop-shadow-2xl">
            AI Business Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light max-w-4xl mx-auto leading-relaxed">
            Choose your path to AI-powered business success
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full animate-pulse"></div>

        </div>
        
        {/* Enhanced Three-Tier Layout with Advanced Effects */}
        <style jsx>{`
          @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
            50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.3); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes premium-glow {
            0%, 100% { 
              box-shadow: 0 0 30px rgba(147, 51, 234, 0.3), 0 0 60px rgba(147, 51, 234, 0.1);
            }
            50% { 
              box-shadow: 0 0 50px rgba(147, 51, 234, 0.5), 0 0 100px rgba(147, 51, 234, 0.2);
            }
          }
          @keyframes premium-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            25% { transform: translateY(-10px) scale(1.02); }
            50% { transform: translateY(-5px) scale(1.01); }
            75% { transform: translateY(-15px) scale(1.03); }
          }
          .card-glow { animation: glow-pulse 3s ease-in-out infinite; }
          .premium-glow { animation: premium-glow 3s ease-in-out infinite; }
          .premium-float { animation: premium-float 4s ease-in-out infinite; }
          .shimmer-effect {
            position: relative;
            overflow: hidden;
          }
          .shimmer-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shimmer 2s infinite;
            z-index: 1;
          }
        `}</style>
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
                <div key={product.id} className={`group relative bg-gradient-to-br ${config.bg} backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-${config.shadow} transition-all duration-700 transform hover:-translate-y-6 ${config.scale} overflow-hidden border-2 ${isPopular ? `border-${config.accent}-400/60 premium-glow premium-float` : `border-${config.border} card-glow`} ${isPopular ? 'ring-2 ring-blue-400/20' : ''} shimmer-effect hover:border-${config.accent}-500/40 hover:bg-gradient-to-br hover:from-slate-800/95 hover:to-gray-800/95`}>
                  {/* Enhanced glow effects */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-${config.accent}-500/20 via-transparent to-${config.accent}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse`}></div>
                  <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-${config.accent}-600/30 to-purple-600/30 opacity-0 group-hover:opacity-50 blur-xl transition-all duration-700`}></div>
                  
                  {/* Floating Particles Effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{animationDelay: '0s'}}></div>
                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{animationDelay: '2s'}}></div>
                  </div>
                  
                  {/* Enhanced floating elements */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className={`absolute top-4 right-4 w-3 h-3 bg-${config.accent}-400/60 rounded-full animate-ping`} style={{animationDelay: '0.5s'}}></div>
                    <div className={`absolute bottom-6 left-6 w-2 h-2 bg-${config.accent}-300/40 rounded-full animate-pulse`} style={{animationDelay: '1s'}}></div>
                    <div className={`absolute top-1/2 right-8 w-1 h-1 bg-${config.accent}-200/60 rounded-full animate-ping`} style={{animationDelay: '1.5s'}}></div>
                    <div className={`absolute bottom-1/3 left-4 w-1.5 h-1.5 bg-${config.accent}-400/30 rounded-full animate-pulse`} style={{animationDelay: '2s'}}></div>
                  </div>
                  
                  {/* Enhanced Tier Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className={`bg-gradient-to-r ${config.tierColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse group-hover:animate-bounce transition-all duration-300 group-hover:scale-110`} style={{animationDuration: '2s'}}>
                      {config.tier}
                      <div className={`absolute inset-0 bg-gradient-to-r ${config.tierColor.replace('to-', 'to-').replace('from-', 'from-').replace('-500', '-400').replace('-600', '-500')} rounded-full opacity-0 group-hover:opacity-50 animate-ping`}></div>
                    </div>
                  </div>
                  
                  {/* Enhanced Popular Badge */}
                  {isPopular && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce" style={{animationDuration: '1s'}}>
                        POPULAR
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Hero Section */}
                  <div className={`h-48 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500`}>
                    <div className="relative transform group-hover:scale-110 transition-all duration-500">
                      <svg className={`w-20 h-20 text-${config.accent}-400 opacity-60 group-hover:opacity-100 group-hover:text-${config.accent}-300 transition-all duration-500 group-hover:drop-shadow-lg`} fill="currentColor" viewBox="0 0 24 24">
                        <path d={config.icon}/>
                      </svg>
                      <div className={`absolute inset-0 bg-${config.accent}-400/20 rounded-full blur-xl group-hover:bg-${config.accent}-400/40 group-hover:animate-pulse transition-all duration-500`}></div>
                      {/* Orbiting particles */}
                      <div className={`absolute -top-2 -right-2 w-1 h-1 bg-${config.accent}-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300`} style={{animationDelay: '0.2s'}}></div>
                      <div className={`absolute -bottom-2 -left-2 w-1 h-1 bg-${config.accent}-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300`} style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8">
                    <h3 className="text-3xl font-black mb-3 text-white drop-shadow-lg">
                      {product.name}
                    </h3>
                    <p className="text-gray-100 mb-8 leading-relaxed text-base font-medium group-hover:text-white transition-colors duration-500">
                      <span className={`text-${config.accent}-400 font-bold`}>📚</span> {product.description}
                    </p>
                    
                    {/* Enhanced Value Propositions */}
                    <div className="space-y-4 mb-8">
                      {product.id === '1' && (
                        <>
                          <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                            <div className={`w-3 h-3 bg-${config.accent}-400 rounded-full shadow-lg group-hover:shadow-${config.accent}-400/50 group-hover:animate-pulse transition-all duration-300`}></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300"><span className={`text-${config.accent}-400 font-bold`}>📖 30 Lessons:</span> Complete AI tools mastery course</span>
                          </div>
                          <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                            <div className={`w-3 h-3 bg-${config.accent}-400 rounded-full animate-pulse shadow-lg group-hover:shadow-${config.accent}-400/50 transition-all duration-300`}></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">ChatGPT, Claude, Replit, Cursor & Trae AI included</span>
                          </div>
                          <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                            <div className={`w-3 h-3 bg-${config.accent}-400 rounded-full animate-pulse shadow-lg group-hover:shadow-${config.accent}-400/50 transition-all duration-300`}></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300"><span className="text-yellow-400 font-bold">💰 Value:</span> Everything needed for online business success</span>
                          </div>
                          <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.4s'}}>
                            <div className={`w-3 h-3 bg-${config.accent}-400 rounded-full shadow-lg group-hover:shadow-${config.accent}-400/50 transition-all duration-300`}></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Step-by-step implementation guides</span>
                          </div>
                        </>
                      )}
                      {product.id === '2' && (
                        <>
                          <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                            <div className={`w-3 h-3 bg-${config.accent}-400 rounded-full shadow-lg group-hover:shadow-${config.accent}-400/50 group-hover:animate-pulse transition-all duration-300`}></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300"><span className={`text-${config.accent}-400 font-bold`}>🎯 30 Prompts:</span> Ready-to-use AI business prompts</span>
                          </div>
                          <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                            <div className={`w-3 h-3 bg-${config.accent}-400 rounded-full animate-pulse shadow-lg group-hover:shadow-${config.accent}-400/50 transition-all duration-300`}></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Copy-paste templates for instant results</span>
                          </div>
                          <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                            <div className={`w-3 h-3 bg-${config.accent}-400 rounded-full animate-pulse shadow-lg group-hover:shadow-${config.accent}-400/50 transition-all duration-300`}></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300"><span className="text-yellow-400 font-bold">⚡ Speed:</span> 10x faster content creation</span>
                          </div>
                          <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.4s'}}>
                            <div className={`w-3 h-3 bg-${config.accent}-400 rounded-full shadow-lg group-hover:shadow-${config.accent}-400/50 transition-all duration-300`}></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Proven prompts used by successful entrepreneurs</span>
                          </div>
                        </>
                      )}
                      {product.id === '3' && (
                        <>
                          <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">📹 60-minute Google Meet session with screen sharing</span>
                          </div>
                          <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full shadow-lg group-hover:shadow-green-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">🚀 Full start-to-finish custom AI site deployment</span>
                          </div>
                          <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                            <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">📋 Complete implementation report + all steps</span>
                          </div>
                          <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.4s'}}>
                            <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg group-hover:shadow-orange-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">🤝 Ongoing support as you build your first business</span>
                          </div>
                          <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.5s'}}>
                            <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg group-hover:shadow-yellow-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                            <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">💎 83% OFF - A$3,000 value for only A$500</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Enhanced Pricing Section */}
                    <div className="text-center mb-8">
                      <div className="relative">
                        {/* Pricing Background Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-${config.accent}-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100`}></div>
                        
                        <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 group-hover:border-gray-600/50 transition-all duration-500">
                          <div className="flex items-center justify-center space-x-4 mb-4">
                            <div className="text-center">
                              <div className="flex items-baseline justify-center space-x-2">
                                <span className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-white transition-all duration-500">
                                  A${product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-500 line-through font-medium">
                                    A${product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {product.originalPrice && (
                                <div className="mt-3">
                                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-full backdrop-blur-sm group-hover:from-red-500/30 group-hover:to-pink-500/30 group-hover:border-red-400/50 transition-all duration-300">
                                    <span className="text-red-300 text-sm font-bold group-hover:text-red-200 transition-colors duration-300">
                                      💥 Save A${(product.originalPrice - product.price).toFixed(2)} (83% OFF)
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Limited Time Offer */}
                          {product.id === '3' && (
                            <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/20 rounded-xl">
                              <div className="flex items-center justify-center space-x-2">
                                <span className="text-orange-300 text-xs font-bold animate-pulse">🔥 LIMITED TIME</span>
                                <span className="text-gray-300 text-xs">- Only 5 spots available this month</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-gray-300 font-medium mt-3">One-time payment</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Action Buttons */
                    <div className="space-y-4">
                      <div className="relative group/button">
                        {/* Button Glow Effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r from-${config.accent}-500 to-purple-500 rounded-xl blur opacity-0 group-hover/button:opacity-75 transition-all duration-500`}></div>
                        
                        <Link href={`/products/${product.id}`} className={`relative w-full block text-center py-4 px-6 bg-gradient-to-r ${config.tierColor} hover:from-${config.accent}-400 hover:to-${config.accent}-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-${config.accent}-500/40 group-hover:shadow-xl group-hover:shadow-${config.accent}-500/30 border border-${config.accent}-400/20 hover:border-${config.accent}-300/40 overflow-hidden`}>
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            <span>🚀 Start Learning Now - A${product.price.toFixed(2)}</span>
                          </span>
                          <div className={`absolute inset-0 bg-gradient-to-r from-${config.accent}-400 to-${config.accent}-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </Link>
                      </div>
                      
                      {/* Trust Indicators */}
                      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span className="text-green-400">🔒</span>
                          <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span className="text-blue-400">⚡</span>
                          <span>Instant Access</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span className="text-purple-400">💎</span>
                          <span>Premium Quality</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
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