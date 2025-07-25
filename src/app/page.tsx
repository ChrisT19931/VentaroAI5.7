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
      <section className="py-24 bg-black relative overflow-hidden z-10">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500/30 rotate-45 animate-pulse" style={{animationDuration: '2s'}}></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-purple-500/30 rotate-12 animate-pulse delay-500" style={{animationDuration: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-500/10 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 glow-text">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">AI Success Plan</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Start your AI journey with our carefully crafted tiers. From beginner-friendly tools to advanced business strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* LITE Plan */}
            <div className="group relative glass-panel rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 overflow-hidden border border-white/20">
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
                  30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for business growth.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">30 proven prompts for business</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Copy-paste ready for immediate use</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Works with ChatGPT and other AI tools</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-white glow-text mb-2">A$10</div>
                  <div className="text-sm text-gray-400">One-time payment</div>
                </div>
                <Link href="/products/2" className="neon-button w-full block text-center py-4 rounded-xl font-bold transition-transform duration-200 hover:scale-105 shadow-lg hover:shadow-green-500/30">
                  Get Started
                </Link>
              </div>
            </div>
            
            {/* ADVANCE Plan */}
            <div className="group relative glass-panel rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 overflow-hidden border-2 border-blue-500/30">
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
                  30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Learn ChatGPT, Claude, Grok, and Gemini</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Master AI agents and bots</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">30 practical sales lessons</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Simple step-by-step instructions</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-4xl font-black text-white glow-text">A$25</span>
                <span className="text-xl text-gray-500 line-through">A$50</span>
                  </div>
                  <div className="text-sm text-green-400 font-semibold animate-pulse" style={{animationDuration: '2s'}}>50% OFF Launch Price</div>
                </div>
                <Link href="/products/1" className="neon-button w-full block text-center py-4 rounded-xl font-bold transition-transform duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/30">
                  Get Advanced
                </Link>
              </div>
            </div>
            
            {/* PRO Plan */}
            <div className="group relative glass-panel rounded-3xl shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 overflow-hidden border border-purple-500/30">
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
                <Link href="/products/3" className="neon-button w-full block text-center py-4 rounded-xl font-bold transition-transform duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/30">
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

      {/* Custom Website Creation Section */}
      <section className="py-24 bg-gradient-to-br from-black via-blue-950/20 to-purple-950/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 border border-blue-500/30 rotate-12 animate-pulse" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-purple-500/30 rotate-45 animate-pulse delay-700" style={{animationDuration: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 glow-text">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Custom Website Creation</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Need a fully custom website solution? Our expert team creates professional, high-converting websites tailored to your specific business needs.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="glass-panel rounded-3xl shadow-2xl border border-blue-500/30 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-4xl font-black text-white mb-4 glow-text">Full Custom Site Creation</h3>
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-white mb-2">Starting from $1,000+</div>
                  <div className="text-sm text-blue-400 font-medium">Professional Custom Development - Quote Based</div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-4 glow-text">What's Included:</h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Custom design & development</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Responsive mobile optimization</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">SEO-friendly architecture</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Content management system</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Payment processing integration</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Social media integration</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Analytics & tracking setup</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">SSL certificate & security</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Email marketing integration</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Live chat & support tools</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Performance optimization</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Launch support & training</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-8 rounded-2xl border border-blue-500/30">
                    <h4 className="text-2xl font-bold text-white mb-6 glow-text flex items-center">
                      <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Quick Inquiry Form
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-semibold mb-2 flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          Project Type *
                        </label>
                        <select className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-400/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 backdrop-blur-sm">
                          <option value="">Select project type</option>
                          <option value="business-website">Business Website</option>
                          <option value="e-commerce">E-commerce Store</option>
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
                          Budget Range *
                        </label>
                        <select className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-400/30 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 hover:border-purple-300 backdrop-blur-sm">
                          <option value="">Select budget range</option>
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
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          Timeline *
                        </label>
                        <select className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-green-400/30 rounded-xl text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 hover:border-green-300 backdrop-blur-sm">
                          <option value="">Select timeline</option>
                          <option value="rush">Rush (1-3 days)</option>
                          <option value="standard">Standard (1-2 weeks)</option>
                          <option value="extended">Extended (2-4 weeks)</option>
                          <option value="flexible">Flexible timeline</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white font-semibold mb-2 flex items-center">
                          <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                          Contact Email *
                        </label>
                        <input 
                          type="email"
                          placeholder="your@email.com"
                          className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-pink-400/30 rounded-xl text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 focus:outline-none transition-all duration-300 hover:border-pink-300 placeholder-gray-400 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-white font-semibold mb-2 flex items-center">
                          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                          Phone (Optional)
                        </label>
                        <input 
                          type="tel"
                          placeholder="Your phone number"
                          className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-cyan-400/30 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 hover:border-cyan-300 placeholder-gray-400 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-white font-semibold mb-2 flex items-center">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                          Special Requirements
                        </label>
                        <textarea 
                          rows={4}
                          placeholder="Tell us about specific features, integrations, or requirements for your project..."
                          className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-yellow-400/30 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300 hover:border-yellow-300 placeholder-gray-400 backdrop-blur-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 mb-8 glass-panel">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center glow-text">
                    <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Next Steps
                  </h4>
                  <p className="text-gray-300 mb-4">
                    After submitting your inquiry, our expert team will:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1">Quick Review</h5>
                        <p className="text-gray-300 text-sm">Review your requirements within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1">Detailed Proposal</h5>
                        <p className="text-gray-300 text-sm">Send comprehensive proposal and timeline</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1">Consultation Call</h5>
                        <p className="text-gray-300 text-sm">Schedule a call to discuss your vision</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1">Custom Quote</h5>
                        <p className="text-gray-300 text-sm">Receive tailored pricing for your project</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
                    <p className="text-blue-400 font-semibold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Direct Contact: <strong>chris.t@ventarosales.com</strong>
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <button className="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg px-16 py-5 rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/30 border border-blue-400/30 hover:border-blue-300 focus:ring-4 focus:ring-blue-400/20 focus:outline-none transform hover:-translate-y-1 overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center justify-center">
                      <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Inquiry
                      <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                  <p className="text-gray-400 text-sm mt-4">
                    Or contact us directly at <span className="text-blue-400 font-semibold hover:text-blue-300 transition-colors cursor-pointer">chris.t@ventarosales.com</span>
                  </p>
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