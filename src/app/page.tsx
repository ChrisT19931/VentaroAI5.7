'use client';

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Elite Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 text-white overflow-hidden flex items-center">
        {/* Premium Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Elite Geometric Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 border border-white/10 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 border border-white/20 rotate-12 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-gray-400/10 to-transparent rounded-full blur-xl animate-float-delayed"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Elite Brand Header */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-12">
                      <span className="text-3xl font-black text-black">V</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                      VENTARO<span className="text-gray-300 text-2xl">®</span>
                    </h1>
                    <div className="flex items-center space-x-2 mt-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-200 tracking-widest uppercase font-medium">AI DIGITAL STORE</span>
                    </div>
                  </div>
                </div>
                
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-800/50 to-slate-700/50 rounded-full border border-white/10 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium tracking-wide">100% MADE WITH AI</span>
                </div>
              </div>
              
              {/* Elite Main Heading */}
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-black leading-none">
                  About{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 animate-gradient-x">
                    Ventaro AI
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-200">
                    Digital Store
                  </span>
                </h2>
                
                {/* Elite Description */}
                <div className="space-y-4 max-w-2xl">
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                    Your destination for premium AI-powered digital products and innovative design solutions.
                  </p>
                  <div className="p-4 bg-gradient-to-r from-gray-800/30 to-slate-700/30 rounded-lg border border-white/10 backdrop-blur-sm">
                    <p className="text-lg font-medium text-white">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">This entire website was created 100% with AI.</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Elite CTA */}
              <div className="pt-8">
                <Link href="/products" className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black font-bold rounded-xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-white/25 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative z-10 text-lg">Explore All Products</span>
                  <svg className="ml-3 w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Right Column - Elite Visual */}
            <div className="relative lg:block hidden">
              <div className="relative w-full h-96">
                {/* Central Elite Element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/20 flex items-center justify-center animate-spin-slow">
                      <div className="w-60 h-60 bg-gradient-to-br from-gray-800/50 to-slate-700/50 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-40 h-40 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center shadow-2xl">
                          <span className="text-6xl font-black text-black">V</span>
                        </div>
                      </div>
                    </div>
                    {/* Orbiting Elements */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-bounce delay-500"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-bounce delay-1000"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce delay-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Elite Future Vision */}
          <div className="text-center py-20 border-t border-white/10">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                The Future is{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x drop-shadow-lg">
                  AI-Native
                </span>
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed font-light">
                Welcome to 2025 - where every pixel, every line of code, and every design decision is powered by artificial intelligence.{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">This site is living proof - 100% AI-generated.</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Elite Bottom Transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V120L1200,120V0C1000,40 800,80 600,60C400,40 200,20 0,0Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1: E-book */}
            <div className="card group hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="h-48 bg-gray-200 relative overflow-hidden rounded-t-lg">
                <Image 
                  src="/images/products/elite-ai-mastery.svg"
                  alt="Elite AI Mastery Guide"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Featured
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-1 capitalize">Courses</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  Elite AI Mastery Guide
                </h3>
                <p className="text-gray-600 mb-4">
                  30-page guide on how to use AI chatbots (ChatGPT, Claude, Grok, Gemini), agents, and bots with 30 sales lessons.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">$25.00</span>
                    <span className="text-sm text-gray-500 line-through">$50.00</span>
                  </div>
                  <Link href="/products/1" className="btn-outline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product 2: AI Prompts */}
            <div className="card group hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="h-48 bg-gray-200 relative overflow-hidden rounded-t-lg">
                <Image 
                  src="/images/products/elite-prompt-arsenal.svg"
                  alt="Elite Prompt Arsenal"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-1 capitalize">Tools</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  Elite Prompt Arsenal
                </h3>
                <p className="text-gray-600 mb-4">
                  30 simple AI prompts to help you build your online business and make money.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">$10.00</span>
                  <Link href="/products/2" className="btn-outline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product 3: Coaching Call */}
            <div className="card group hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="h-48 bg-gray-200 relative overflow-hidden rounded-t-lg">
                <Image 
                  src="/images/products/elite-strategy-session.svg"
                  alt="Elite AI Strategy Session"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-1 capitalize">Services</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  Elite AI Strategy Session
                </h3>
                <p className="text-gray-600 mb-4">
                  Exclusive 60-minute strategic consultation with comprehensive implementation roadmap.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">$497.00</span>
                  <Link href="/products/3" className="btn-outline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="btn-secondary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">Why Choose Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Instant Access</h3>
              <p className="text-gray-700">
                Get immediate access to your purchased products with our seamless delivery system.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Secure Payments</h3>
              <p className="text-gray-700">
                Your transactions are protected with industry-standard security measures.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">One-Time Payment</h3>
              <p className="text-gray-700">
                No subscriptions or hidden fees. Pay once and own the product forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Enhance Your Workflow?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Browse our collection of premium AI tools and digital products designed to help you work smarter, not harder. <strong className="text-white">Everything here was created with AI.</strong>
          </p>
          <Link href="/products" className="btn-primary text-lg px-8 py-3 inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  )
}