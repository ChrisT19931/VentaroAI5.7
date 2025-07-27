'use client';

import Link from 'next/link'
import Image from 'next/image'
import CinematicHero from '../components/3d/CinematicHero'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        <CinematicHero />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fadeInUp leading-tight">
              Digital Store
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 animate-fadeInUp leading-relaxed" style={{animationDelay: '0.2s'}}>
              Premium digital products for modern entrepreneurs
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <Link href="#products" className="neon-button px-10 py-5 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/40 text-lg">
                Explore Products
              </Link>
              <Link href="/about" className="glass-panel px-10 py-5 rounded-xl font-bold transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/40 text-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers Section */}
      <section className="py-24 bg-black relative overflow-hidden z-10">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500/30 rotate-45 animate-pulse" style={{animationDuration: '2s'}}></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-purple-500/30 rotate-12 animate-pulse delay-500" style={{animationDuration: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-500/10 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-24" id="products">
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 glow-text leading-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">AI Success Plan</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Start your AI journey with our carefully crafted tiers. From beginner-friendly tools to advanced business strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* LITE Plan */}
            <div className="group relative glass-panel rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden border border-white/20">
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse" style={{animationDuration: '2s'}}>
                  LITE
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-green-900/30 to-emerald-900/30 relative overflow-hidden flex items-center justify-center">
                <div className="text-6xl font-black text-green-400 opacity-40 glow-text">L</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-2 text-white glow-text">
                  AI Prompts Arsenal 2025
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  30 professional AI prompts across multiple business categories. Expertly crafted for content creation, marketing, SEO, business automation, e-commerce, and personal branding.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Business, marketing & SEO prompts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Creative & e-commerce templates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Personal branding & networking tools</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-white glow-text mb-2">A$10</div>
                  <div className="text-sm text-gray-400">One-time payment</div>
                </div>
                <Link href="/products/2" className="neon-button w-full block text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/40">
                  Get Started
                </Link>
              </div>
            </div>
            
            {/* ADVANCE Plan */}
            <div className="group relative glass-panel rounded-3xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden border-2 border-blue-500/40">
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
              <div className="h-48 bg-gradient-to-br from-blue-900/30 to-purple-900/30 relative overflow-hidden flex items-center justify-center">
                <div className="text-6xl font-black text-blue-400 opacity-40 glow-text">A</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-2 text-white glow-text">
                  AI Tools Mastery Guide 2025
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Complete 30-lesson guide to making money with AI in 2025. Each lesson focuses on a specific AI tool or business strategy with clear action steps and practical implementation examples.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Master advanced AI platform techniques</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Build profitable AI-powered businesses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Step-by-step implementation guides</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Complete 30/90/365-day roadmap</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-4xl font-black text-white glow-text">A$25</span>
                <span className="text-xl text-gray-500 line-through">A$50</span>
                  </div>
                  <div className="text-sm text-green-400 font-semibold animate-pulse" style={{animationDuration: '2s'}}>50% OFF Launch Price</div>
                </div>
                <Link href="/products/1" className="neon-button w-full block text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/40">
                  Get Advanced
                </Link>
              </div>
            </div>
            
            {/* PRO Plan */}
            <div className="group relative glass-panel rounded-3xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden border border-purple-500/40">
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse" style={{animationDuration: '2s'}}>
                  PRO
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-purple-900/30 to-pink-900/30 relative overflow-hidden flex items-center justify-center">
                <div className="text-6xl font-black text-purple-400 opacity-40 glow-text">P</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-2 text-white glow-text">
                  AI Business Strategy Session 2025
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Live 60-minute video coaching session</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Master ChatGPT for business applications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Learn Vercel deployment from scratch</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Comprehensive implementation report</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-4xl font-black text-white glow-text">A$500</span>
                    <span className="text-xl text-gray-500 line-through">A$3000</span>
                  </div>
                  <div className="text-sm text-green-400 font-semibold animate-pulse" style={{animationDuration: '2s'}}>🚀 LAUNCH OFFER - 83% OFF</div>
                </div>
                <Link href="/products/3" className="neon-button w-full block text-center py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/40">
                  Go Pro
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-lg text-gray-300 mb-8">
              Not sure which plan is right for you? <Link href="/contact" className="text-blue-400 hover:text-blue-300 font-semibold underline glow-text">Get in touch</Link> and we'll help you choose.
            </p>
            <Link href="/products" className="neon-button group relative inline-flex items-center px-12 py-5 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden">
              <span className="relative z-10">View All Products</span>
              <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-3 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Elite Custom Website Creation Section - FLAGSHIP OFFERING */}
      <section className="py-32 bg-gradient-to-br from-black via-purple-950/30 to-blue-950/30 relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 via-blue-500/10 to-pink-500/5"></div>
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-purple-500/20 rotate-12 animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-blue-500/20 rotate-45 animate-pulse delay-1000" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-xl animate-floatDelayed"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Elite Header Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center px-6 py-3 mb-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
              <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="text-purple-300 font-bold text-sm tracking-wider uppercase">FLAGSHIP PREMIUM SERVICE</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 glow-text leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">Elite Custom</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Website Creation</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-8">
              Transform your vision into a <span className="text-purple-400 font-bold">high-converting digital masterpiece</span>. Our elite development team crafts bespoke websites that don't just look stunning—they <span className="text-blue-400 font-bold">drive results and maximize ROI</span>.
            </p>

          </div>
          


          {/* Elite Inquiry Form Section */}
          <div className="max-w-6xl mx-auto">
            <div className="glass-panel rounded-3xl shadow-2xl border-2 border-purple-500/40 overflow-hidden backdrop-blur-xl">
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/40">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-5xl font-black text-white mb-6 glow-text">Ready to Dominate Your Market?</h3>
                  <p className="text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-8">
                    Get a <span className="text-purple-400 font-bold">FREE consultation</span> and discover how we can transform your business with a <span className="text-blue-400 font-bold">high-converting custom website</span> that drives real results.
                  </p>
                  <div className="flex justify-center items-center space-x-12 text-sm text-gray-400 mb-8">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="font-semibold">No Obligation</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Elite Inquiry Form */}
              <div className="p-12">
                <div className="max-w-5xl mx-auto">
                  <form className="space-y-8">
                    {/* Personal Information Section */}
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-white font-bold mb-3 flex items-center text-lg">
                            <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3 animate-pulse"></span>
                            Full Name *
                          </label>
                          <input 
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-purple-500/30 rounded-2xl text-white text-lg focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 hover:border-purple-300 placeholder-gray-400 backdrop-blur-sm shadow-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-bold mb-3 flex items-center text-lg">
                            <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-3 animate-pulse"></span>
                            Business Email *
                          </label>
                          <input 
                            type="email"
                            placeholder="your.business@email.com"
                            className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-blue-500/30 rounded-2xl text-white text-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 placeholder-gray-400 backdrop-blur-sm shadow-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-bold mb-3 flex items-center text-lg">
                            <span className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3 animate-pulse"></span>
                            Phone Number *
                          </label>
                          <input 
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-green-500/30 rounded-2xl text-white text-lg focus:border-green-400 focus:ring-4 focus:ring-green-400/20 focus:outline-none transition-all duration-300 hover:border-green-300 placeholder-gray-400 backdrop-blur-sm shadow-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-bold mb-3 flex items-center text-lg">
                            <span className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mr-3 animate-pulse"></span>
                            Company/Organization
                          </label>
                          <input 
                            type="text"
                            placeholder="Your company name"
                            className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-pink-500/30 rounded-2xl text-white text-lg focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 focus:outline-none transition-all duration-300 hover:border-pink-300 placeholder-gray-400 backdrop-blur-sm shadow-lg"
                          />
                        </div>
                      </div>
                      
                      {/* Project Details Section */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-white font-bold mb-3 flex items-center text-lg">
                            <span className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mr-3 animate-pulse"></span>
                            Project Type *
                          </label>
                          <select className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-cyan-500/30 rounded-2xl text-white text-lg focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 hover:border-cyan-300 backdrop-blur-sm shadow-lg">
                            <option value="">Select your project type</option>
                            <option value="business-website">🏢 Professional Business Website ($1,500+)</option>
                            <option value="e-commerce">🛒 E-commerce Platform ($3,500+)</option>
                            <option value="web-app">⚡ Custom Web Application ($7,500+)</option>
                            <option value="saas">🚀 SaaS Platform ($15,000+)</option>
                            <option value="enterprise">🏆 Enterprise Solution ($25,000+)</option>
                            <option value="other">💡 Custom Solution (Let's Discuss)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-bold mb-3 flex items-center text-lg">
                            <span className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-3 animate-pulse"></span>
                            Investment Budget *
                          </label>
                          <select className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-yellow-500/30 rounded-2xl text-white text-lg focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300 hover:border-yellow-300 backdrop-blur-sm shadow-lg">
                            <option value="">Select your investment range</option>
                            <option value="1k-3k">💰 $1,500 - $3,000 (Professional)</option>
                            <option value="3k-7k">💎 $3,000 - $7,500 (Enterprise)</option>
                            <option value="7k-15k">🏆 $7,500 - $15,000 (Elite)</option>
                            <option value="15k-30k">🚀 $15,000 - $30,000 (Premium)</option>
                            <option value="30k-plus">👑 $30,000+ (Luxury)</option>
                            <option value="discuss">🤝 Let's Discuss My Vision</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-bold mb-3 flex items-center text-lg">
                            <span className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-3 animate-pulse"></span>
                            Project Timeline *
                          </label>
                          <select className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-red-500/30 rounded-2xl text-white text-lg focus:border-red-400 focus:ring-4 focus:ring-red-400/20 focus:outline-none transition-all duration-300 hover:border-red-300 backdrop-blur-sm shadow-lg">
                            <option value="">When do you need this completed?</option>
                            <option value="rush">⚡ Rush Delivery (1-2 weeks) +50% fee</option>
                            <option value="standard">🎯 Standard Timeline (2-4 weeks)</option>
                            <option value="extended">📅 Extended Timeline (1-2 months)</option>
                            <option value="flexible">🤝 Flexible (Quality over speed)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-bold mb-3 flex items-center text-lg">
                            <span className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3 animate-pulse"></span>
                            Current Website
                          </label>
                          <input 
                            type="url"
                            placeholder="https://your-current-website.com (if any)"
                            className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-indigo-500/30 rounded-2xl text-white text-lg focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 focus:outline-none transition-all duration-300 hover:border-indigo-300 placeholder-gray-400 backdrop-blur-sm shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Vision Section */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white font-bold mb-3 flex items-center text-lg">
                          <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 animate-pulse"></span>
                          Describe Your Vision *
                        </label>
                        <textarea 
                          rows={6}
                          placeholder="Tell us about your project goals, target audience, key features you need, and what success looks like for your business. The more details you provide, the better we can tailor our proposal to exceed your expectations."
                          className="w-full p-5 bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-2 border-purple-500/30 rounded-2xl text-white text-lg focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 hover:border-purple-300 placeholder-gray-400 backdrop-blur-sm shadow-lg resize-none"
                        ></textarea>
                      </div>
                      
                      {/* Premium CTA Section */}
                      <div className="text-center pt-8">
                        <div className="mb-8">
                          <p className="text-xl text-gray-300 mb-4">
                            🎯 <span className="text-purple-400 font-bold">Ready to transform your business?</span> We are standing by to create your digital masterpiece.
                          </p>
                        </div>
                        
                        <button 
                          type="submit"
                          className="group relative inline-flex items-center px-16 py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white text-xl font-black rounded-2xl shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden border-2 border-purple-400/30"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <span className="relative z-10 mr-4">🚀 GET MY FREE CONSULTATION</span>
                          <svg className="relative z-10 w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                        
                        <p className="text-sm text-gray-500 mt-6 max-w-2xl mx-auto">
                          We respect your privacy and will never share your information.
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
              <span className="font-bold text-white">Everything here was created with AI - and so can your success.</span>
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