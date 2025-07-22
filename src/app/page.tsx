'use client';

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Elite Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 text-white overflow-hidden">
        {/* Premium Background Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Elite Geometric Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 border border-white/5 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 border border-white/10 rotate-12 animate-pulse"></div>
          <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-white/3 to-transparent rounded-full blur-xl animate-float"></div>
          <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-gradient-to-br from-gray-400/5 to-transparent rounded-full blur-xl animate-float-delayed"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10 flex items-center min-h-screen">
          <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-12">
              {/* Elite Brand Header */}
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-700 hover:rotate-6">
                      <span className="text-4xl font-black text-black">V</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                      VENTARO<span className="text-gray-300 text-3xl">®</span>
                    </h1>
                    <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-200 tracking-widest uppercase font-semibold">AI DIGITAL STORE</span>
                    </div>
                  </div>
                </div>
                
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800/60 to-slate-700/60 rounded-full border border-white/20 backdrop-blur-md">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-4 animate-pulse"></div>
                  <span className="text-sm font-semibold tracking-wide text-white">100% MADE WITH AI</span>
                </div>
              </div>
              
              {/* Elite Main Heading */}
              <div className="space-y-8">
                <h2 className="text-6xl md:text-7xl font-black leading-tight">
                  <span className="block text-white drop-shadow-xl">Make Money Online</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x drop-shadow-xl">
                    With AI in 2025
                  </span>
                </h2>
                
                {/* Elite Description */}
                <div className="space-y-6 max-w-2xl">
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                    Master premium AI tools and AI prompts to build profitable online businesses in 2025. Learn proven strategies to make money with AI using ChatGPT, Claude, and cutting-edge technologies.
                  </p>
                  <div className="p-6 bg-gradient-to-r from-gray-800/40 to-slate-700/40 rounded-2xl border border-white/20 backdrop-blur-md">
                    <p className="text-lg font-semibold text-white">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">100% AI-created products that generate real income online.</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Elite CTA */}
              <div className="pt-4">
                <Link href="/products" className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-white to-gray-100 text-black font-bold text-lg rounded-2xl transition-all duration-700 transform hover:scale-105 shadow-2xl hover:shadow-white/30 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                  <span className="relative z-10">Explore All Products</span>
                  <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-3 transition-transform duration-700 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Right Column - Elite Visual */}
            <div className="relative lg:block hidden">
              <div className="relative w-full h-[500px] flex items-center justify-center">
                {/* Central Elite Element */}
                <div className="relative">
                  <div className="w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full border border-white/10 flex items-center justify-center animate-spin-slow">
                    <div className="w-72 h-72 bg-gradient-to-br from-gray-800/30 to-slate-700/30 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                      <div className="w-48 h-48 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-7xl font-black text-black">V</span>
                      </div>
                    </div>
                  </div>
                  {/* Orbiting Elements */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce shadow-lg"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-bounce delay-500 shadow-lg"></div>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-bounce delay-1000 shadow-lg"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce delay-700 shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elite Bottom Transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V120L1200,120V0C1000,50 800,100 600,80C400,60 200,30 0,0Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-gray-300 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-gray-400 rotate-12 animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">AI Success Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start your AI journey with our carefully crafted tiers. From beginner-friendly tools to advanced business strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* LITE Plan */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 overflow-hidden border border-gray-200">
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  LITE
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden flex items-center justify-center">
                <div className="text-6xl font-black text-green-600 opacity-20">L</div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-2 text-gray-900">
                  AI Starter Pack
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Perfect for beginners. Essential AI prompts and basic tools to start your AI journey.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">20+ Basic AI Prompts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Getting Started Guide</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Email Support</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-gray-900 mb-2">$10</div>
                  <div className="text-sm text-gray-500">One-time payment</div>
                </div>
                <Link href="/products/2" className="w-full block text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started
                </Link>
              </div>
            </div>
            
            {/* ADVANCE Plan */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 overflow-hidden border-2 border-blue-200">
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ADVANCE
                </div>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  POPULAR
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden flex items-center justify-center">
                <div className="text-6xl font-black text-blue-600 opacity-20">A</div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-2 text-gray-900">
                  AI Mastery Guide
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Complete toolkit for serious AI entrepreneurs. Everything you need to build profitable AI businesses.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">50+ Premium AI Prompts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">30-Page Mastery Guide</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Video Tutorials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Priority Support</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-4xl font-black text-gray-900">$25</span>
                    <span className="text-xl text-gray-500 line-through">$50</span>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">50% OFF Launch Price</div>
                </div>
                <Link href="/products/1" className="w-full block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Advanced
                </Link>
              </div>
            </div>
            
            {/* PRO Plan */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 overflow-hidden border border-gray-200">
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  PRO
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden flex items-center justify-center">
                <div className="text-6xl font-black text-purple-600 opacity-20">P</div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-2 text-gray-900">
                  AI Business Coaching
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Elite 1-on-1 coaching for serious entrepreneurs ready to scale their AI business.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">60-Min Strategy Session</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Custom AI Business Plan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">All Previous Content</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Direct Access to Expert</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-gray-900 mb-2">$497</div>
                  <div className="text-sm text-gray-500">One-time investment</div>
                </div>
                <Link href="/products/3" className="w-full block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Go Pro
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-8">
              Not sure which plan is right for you? <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-semibold underline">Get in touch</Link> and we'll help you choose.
            </p>
            <Link href="/products" className="group relative inline-flex items-center px-12 py-5 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-lg rounded-2xl transition-all duration-700 transform hover:scale-105 shadow-2xl hover:shadow-black/30 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
              <span className="relative z-10">View All Products</span>
              <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-3 transition-transform duration-700 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Elite Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Elite</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the pinnacle of digital excellence with our premium AI-powered solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Get immediate access to your purchased products with our seamless, lightning-fast delivery system.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Bank-Level Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Your transactions are protected with military-grade encryption and industry-leading security protocols.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Lifetime Ownership</h3>
              <p className="text-gray-600 leading-relaxed">
                No subscriptions, no recurring fees. Pay once and own your digital products forever with unlimited access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Call to Action */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/30 rotate-12 animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">Ready to Transform Your Future?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
              Join thousands of forward-thinking professionals who have already embraced the AI revolution. 
              <span className="font-bold text-white">Everything here was created with AI - and so can your success.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/products" className="group relative inline-flex items-center px-12 py-5 bg-gradient-to-r from-white to-gray-100 text-black font-bold text-lg rounded-2xl transition-all duration-700 transform hover:scale-105 shadow-2xl hover:shadow-white/30 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                <span className="relative z-10">Start Your Journey</span>
                <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-3 transition-transform duration-700 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">100% AI-Generated Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}