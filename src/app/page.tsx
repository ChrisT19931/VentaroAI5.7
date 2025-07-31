'use client';

import Link from 'next/link'
import Image from 'next/image'
import CinematicHero from '../components/3d/CinematicHero'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <CinematicHero />
      </div>

      {/* Pricing Tiers Section */}
      <section className="py-24 bg-gradient-to-br from-gray-950 via-black to-gray-950 relative overflow-hidden z-10">
        {/* Professional Dark Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-black to-gray-950/90"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-slate-700/20 to-slate-900/20 rounded-2xl rotate-12 animate-pulse" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-slate-600/20 to-slate-800/20 rounded-xl rotate-45 animate-pulse delay-1000" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-slate-500/10 to-slate-700/10 rounded-full animate-pulse delay-500" style={{animationDuration: '4s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">AI Success Plan</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Start your AI journey with our carefully crafted tiers. From beginner-friendly tools to advanced business strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* LITE Plan */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 overflow-hidden border border-slate-700/30">
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse" style={{animationDuration: '2s'}}>
                  LITE
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center">
                <div className="relative">
                  <svg className="w-20 h-20 text-emerald-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-3 text-white drop-shadow-lg">
                  AI Prompts Arsenal 2025
                </h3>
                <p className="text-gray-200 mb-6 leading-relaxed text-base font-medium">
                  30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for business growth.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">30 proven prompts for immediate business implementation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Content creation prompts for blogs, social media, and marketing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Business planning and strategy prompts</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-black text-white drop-shadow-lg mb-2">A$10</div>
                  <div className="text-sm text-gray-300 font-medium">One-time payment</div>
                </div>
                <Link href="/products/2" className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-500/30 hover:shadow-emerald-500/20">
                  Get Started
                </Link>
              </div>
            </div>
            
            {/* ADVANCE Plan */}
            <div className="group relative bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 overflow-hidden border-2 border-slate-600/40">
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse" style={{animationDuration: '2s'}}>
                  ADVANCE
                </div>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce" style={{animationDuration: '1s'}}>
                  POPULAR
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center">
                <div className="relative">
                  <svg className="w-20 h-20 text-blue-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                  </svg>
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-3 text-white drop-shadow-lg">
                  AI Tools Mastery Guide 2025
                </h3>
                <p className="text-gray-200 mb-6 leading-relaxed text-base font-medium">
                  30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Comprehensive business-building knowledge foundation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Detailed AI implementation strategies for online success</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Proven business models and revenue generation tactics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Step-by-step implementation guides with real examples</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <span className="text-5xl font-black text-white drop-shadow-lg">A$25</span>
                    <span className="text-2xl text-gray-400 line-through font-bold">A$50</span>
                  </div>
                  <div className="text-sm text-green-300 font-bold animate-pulse bg-green-500/20 px-3 py-1 rounded-full" style={{animationDuration: '2s'}}>50% OFF Launch Price</div>
                </div>
                <Link href="/products/1" className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-500/30 hover:shadow-blue-500/20">
                  Get Advanced
                </Link>
              </div>
            </div>
            
            {/* PRO Plan */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 overflow-hidden border border-slate-700/30">
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse" style={{animationDuration: '2s'}}>
                  PRO
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center">
                <div className="relative">
                  <svg className="w-20 h-20 text-purple-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-3 text-white drop-shadow-lg">
                  AI Business Strategy Session 2025
                </h3>
                <p className="text-gray-200 mb-6 leading-relaxed text-base font-medium">
                  60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Complete knowledge transfer for full business ownership</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Custom website/business deployment from start to finish</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Front-end and back-end mastery for total control</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-100 font-medium">Edit and customize your site on the fly without dependencies</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-black text-white drop-shadow-lg mb-2">A$500</div>
                  <div className="text-sm text-gray-300 font-medium">One-time investment</div>
                </div>
                <Link href="/products/3" className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border border-purple-500/30 hover:shadow-purple-500/20">
                  Go Pro
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-lg text-gray-200 mb-8 font-medium">
              Not sure which plan is right for you? <Link href="/contact" className="text-blue-400 hover:text-blue-300 font-semibold underline glow-text">Get in touch</Link> and we'll help you choose.
            </p>
            <Link href="/products" className="group relative inline-flex items-center px-12 py-5 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border border-slate-600/40 hover:shadow-slate-500/20">
              <span className="relative z-10">View All Products</span>
              <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-3 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Elite Benefits Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 glow-text">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ventaro</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the pinnacle of digital with our high-quality AI-powered solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-blue-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Instant Digital Delivery</h3>
              <p className="text-gray-300 leading-relaxed">
                Get immediate access to your purchased products with our seamless, lightning-fast delivery system.
              </p>
            </div>
            
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-green-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Professional-Grade Content</h3>
              <p className="text-gray-300 leading-relaxed">
                All our products feature high-quality, professional content created with the latest AI technologies.
              </p>
            </div>
            
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-purple-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Lifetime Access</h3>
              <p className="text-gray-300 leading-relaxed">
                No subscriptions, no recurring fees. Pay once and own your digital products forever with unlimited access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Custom Website Creation */}
      <section id="elite-custom-website-creation" className="py-24 bg-black relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 right-20 w-32 h-32 border border-purple-500/20 rotate-45 animate-pulse" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-blue-500/20 rotate-12 animate-pulse" style={{animationDuration: '4s'}}></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Elite Header Section */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full text-xs font-semibold text-purple-300 mb-4 border border-purple-500/30 shadow-lg shadow-purple-500/10">
              FLAGSHIP PREMIUM SERVICE
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 glow-text">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Elite Custom Website Creation</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your vision into a high-converting digital masterpiece.
            </p>
          </div>
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-6 glow-text">Ready to Dominate Your Market?</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Get a FREE QUOTE and discover how we can transform your business with a high-converting custom website that drives real results.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">FREE Strategy Session</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">Custom Quote in 24hrs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-300">No Obligation</span>
                </div>
              </div>
              
              <div className="glass-panel rounded-3xl p-6 border border-blue-500/30 mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Full Custom Site Creation</h4>
                    <p className="text-gray-400"></p>
                  </div>
                </div>
                <h5 className="text-lg font-semibold text-white mb-3">What's Included:</h5>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom design tailored to your brand</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Responsive for all devices</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>SEO optimization</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Content creation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div className="glass-panel rounded-3xl p-8 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <form className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name"
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-400/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Email *
                  </label>
                  <input 
                    type="email" 
                    placeholder="your.business@email.com"
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-400/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-400/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Company/Organization
                  </label>
                  <input 
                    type="text" 
                    placeholder="Your company name"
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-400/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Project Type *
                  </label>
                  <select className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-400/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 backdrop-blur-sm">
                    <option value="">Select your project type</option>
                    <option value="business-website">Professional Business Website</option>
                    <option value="e-commerce">E-commerce Platform</option>
                    <option value="portfolio">Portfolio/Personal</option>
                    <option value="blog">Blog/Content Site</option>
                    <option value="web-app">Web Application</option>
                    <option value="saas">SaaS Platform</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Investment Budget *
                  </label>
                  <select className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-400/30 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 hover:border-purple-300 backdrop-blur-sm">
                    <option value="">Select your investment range</option>
                    <option value="1k-3k">$1,000 - $3,000</option>
                    <option value="3k-5k">$3,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-20k">$10,000 - $20,000</option>
                    <option value="20k-plus">$20,000+</option>
                    <option value="discuss">Let's discuss</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Project Timeline *
                  </label>
                  <select className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-400/30 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 hover:border-purple-300 backdrop-blur-sm">
                    <option value="">When do you need this completed?</option>
                    <option value="asap">ASAP (1-2 weeks)</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="flexible">Flexible timeline</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                    Describe Your Vision *
                  </label>
                  <textarea 
                    rows={5} 
                    placeholder="Tell us about your project goals, target audience, key features you need, and what success looks like for your business. The more details you provide, the better we can tailor our proposal to exceed your expectations."
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-pink-400/30 rounded-xl text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 focus:outline-none transition-all duration-300 hover:border-pink-300 backdrop-blur-sm"
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-300 mb-6">
                    <span className="text-blue-400">🎯</span> Ready to transform your business? We are standing by to create your digital masterpiece.
                  </p>
                  <button type="submit" className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
                    🔥 GET MY FREE QUOTE
                  </button>
                  <p className="text-xs text-gray-400 mt-4">
                    We respect your privacy and will never share your information.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Call to Action */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rotate-45 animate-pulse" style={{animationDuration: '2s'}}></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/30 rotate-12 animate-pulse delay-500" style={{animationDuration: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x" style={{animationDuration: '3s'}}>Ready to Transform Your Future?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
              Join thousands of forward-thinking professionals who have already embraced the AI revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
  <Link href="/products" className="group relative inline-flex items-center px-12 py-5 bg-gradient-to-r from-white to-gray-100 text-black font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/30 overflow-hidden">
    <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    <span className="relative z-10">Start Your Journey</span>
    <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-3 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </Link>
</div>
          </div>
        </div>
      </section>
    </main>
  )
}