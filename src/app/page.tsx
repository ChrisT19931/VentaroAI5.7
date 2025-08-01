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
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-emerald-400/30 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}></div>
          <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '2.5s'}}></div>
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
            <style jsx>{`
              @keyframes glow-pulse {
                0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
                50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.3); }
              }
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .card-glow { animation: glow-pulse 3s ease-in-out infinite; }
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
              
              .premium-glow {
                animation: premium-glow 3s ease-in-out infinite;
              }
              
              @keyframes premium-glow {
                0%, 100% { 
                  box-shadow: 0 0 30px rgba(147, 51, 234, 0.3), 0 0 60px rgba(147, 51, 234, 0.1);
                }
                50% { 
                  box-shadow: 0 0 50px rgba(147, 51, 234, 0.5), 0 0 100px rgba(147, 51, 234, 0.2);
                }
              }
              
              .premium-float {
                animation: premium-float 4s ease-in-out infinite;
              }
              
              @keyframes premium-float {
                0%, 100% { transform: translateY(0px) scale(1); }
                25% { transform: translateY(-10px) scale(1.1); }
                50% { transform: translateY(-5px) scale(1.05); }
                75% { transform: translateY(-15px) scale(1.15); }
              }
              
              .premium-border-glow {
                animation: premium-border-glow 2s ease-in-out infinite;
              }
              
              @keyframes premium-border-glow {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
              }
              
              .premium-icon-glow {
                filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.5));
              }
              
              .premium-button-glow {
                position: relative;
              }
              
              .premium-button-glow::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: inherit;
                background: linear-gradient(45deg, #8b5cf6, #ec4899, #6366f1);
                opacity: 0;
                transition: opacity 0.3s;
                z-index: -1;
                filter: blur(10px);
              }
              
              .premium-button-glow:hover::before {
                opacity: 0.7;
                animation: premium-button-pulse 1s ease-in-out infinite;
              }
              
              @keyframes premium-button-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
            `}</style>
            {/* LITE Plan */}
            <div className="group relative bg-gradient-to-br from-slate-900/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 overflow-hidden border border-slate-700/30 shimmer-effect">
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              {/* Floating orbs */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400/60 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-emerald-300/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse group-hover:animate-bounce transition-all duration-300 group-hover:scale-110" style={{animationDuration: '2s'}}>
                  LITE
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-50 animate-ping"></div>
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-20 h-20 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:text-emerald-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl group-hover:bg-emerald-400/40 group-hover:animate-pulse transition-all duration-500"></div>
                  {/* Orbiting particles */}
                  <div className="absolute -top-2 -right-2 w-1 h-1 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-3 text-white drop-shadow-lg">
                  AI Prompts Arsenal 2025
                </h3>
                <p className="text-gray-200 mb-6 leading-relaxed text-base font-medium">
                  30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for business growth.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg group-hover:shadow-emerald-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">30 proven prompts for immediate business implementation</span>
                  </div>
                  <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg group-hover:shadow-emerald-400/50 group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Content creation prompts for blogs, social media, and marketing</span>
                  </div>
                  <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg group-hover:shadow-emerald-400/50 group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Business planning and strategy prompts</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-black text-white drop-shadow-lg mb-2">A$10</div>
                  <div className="text-sm text-gray-300 font-medium">One-time payment</div>
                </div>
                <Link href="/products/2" className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-500 hover:scale-110 shadow-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-500/30 hover:shadow-emerald-500/40 hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group/btn">
                  <span className="relative z-10 group-hover/btn:animate-pulse">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>
            </div>
            
            {/* ADVANCE Plan */}
            <div className="group relative bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 overflow-hidden border-2 border-slate-600/40 shimmer-effect">
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              {/* Floating orbs */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400/60 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse group-hover:animate-bounce transition-all duration-300 group-hover:scale-110" style={{animationDuration: '2s'}}>
                  ADVANCE
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 animate-ping"></div>
                </div>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce" style={{animationDuration: '1s'}}>
                  POPULAR
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-20 h-20 text-blue-400 opacity-60 group-hover:opacity-100 group-hover:text-blue-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                  </svg>
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-400/40 group-hover:animate-pulse transition-all duration-500"></div>
                  {/* Orbiting particles */}
                  <div className="absolute -top-2 -right-2 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-3 text-white drop-shadow-lg">
                  AI Tools Mastery Guide 2025
                </h3>
                <p className="text-gray-200 mb-6 leading-relaxed text-base font-medium">
                  30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                    <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg group-hover:shadow-blue-400/50 group-hover:animate-pulse transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Comprehensive business-building knowledge foundation</span>
                  </div>
                  <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Detailed AI implementation strategies for online success</span>
                  </div>
                  <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Proven business models and revenue generation tactics</span>
                  </div>
                  <div className="flex items-center space-x-3 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.4s'}}>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">Step-by-step implementation guides with real examples</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <span className="text-5xl font-black text-white drop-shadow-lg">A$25</span>
                    <span className="text-2xl text-gray-400 line-through font-bold">A$50</span>
                  </div>
                  <div className="text-sm text-green-300 font-bold animate-pulse bg-green-500/20 px-3 py-1 rounded-full" style={{animationDuration: '2s'}}>50% OFF Launch Price</div>
                </div>
                <Link href="/products/1" className="w-full block text-center py-4 rounded-xl font-bold transition-all duration-500 hover:scale-110 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-500/30 hover:shadow-blue-500/40 hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group/btn">
                  <span className="relative z-10 group-hover/btn:animate-pulse">Get Advanced</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>
            </div>
            
            {/* PRO Plan - Premium AI Business Strategy Session */}
            <div className="relative group bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-3xl shadow-2xl border border-purple-400/40 backdrop-blur-sm overflow-hidden transform transition-all duration-700 hover:shadow-purple-400/40 hover:shadow-2xl hover:-translate-y-4 hover:scale-105 shimmer-effect">
              {/* Premium floating particles */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full blur-sm animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-8 left-8 w-8 h-8 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-sm animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute top-1/3 left-1/5 w-6 h-6 bg-gradient-to-r from-pink-400/25 to-purple-400/25 rounded-full blur-sm animate-pulse" style={{animationDelay: '3s'}}></div>
              <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-gradient-to-r from-purple-300/20 to-indigo-300/20 rounded-full blur-sm animate-pulse" style={{animationDelay: '4.5s'}}></div>
              
              {/* Premium animated border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/30 via-pink-400/20 to-indigo-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Premium badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg animate-pulse group-hover:animate-bounce transition-all duration-300 group-hover:scale-110" style={{animationDuration: '2s'}}>
                  ⭐ PREMIUM
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-0 group-hover:opacity-50 animate-ping"></div>
                </div>
              </div>
              
              <div className="relative h-52 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center overflow-hidden group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:via-indigo-500 group-hover:to-purple-700 transition-all duration-500">
                <div className="relative z-10 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-700">
                  <svg className="w-24 h-24 text-white drop-shadow-2xl group-hover:text-purple-100 transition-all duration-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-2xl animate-pulse group-hover:bg-gradient-to-r group-hover:from-purple-300/40 group-hover:to-pink-300/40 transition-all duration-500"></div>
                  {/* Orbiting particles */}
                  <div className="absolute -top-2 -right-2 w-1 h-1 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all duration-500"></div>
                
                {/* Premium background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 drop-shadow-lg group-hover:scale-105 transition-transform duration-500">
                  AI Business Strategy Session 2025
                </h3>
                <p className="text-gray-100 mb-8 leading-relaxed text-base font-medium group-hover:text-white transition-colors duration-500">
                  🚀 Premium 60-minute Google Meet live presentation with shared screen overview, detailed step-by-step report, and ongoing support packages available. Learn how to make money online with AI tools and AI prompts from industry experts.
                </p>
                
                <div className="space-y-5 mb-8">
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">📹 60-minute Google Meet live presentation with shared screen</span>
                  </div>
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full shadow-lg group-hover:shadow-indigo-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">📋 Detailed step-by-step report with complete overview</span>
                  </div>
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg group-hover:shadow-pink-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">🔄 Ongoing support: $100/week priority email support or $300/hour screenshare live support</span>
                  </div>
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.4s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full shadow-lg group-hover:shadow-purple-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">💼 Complete knowledge transfer for full business ownership</span>
                  </div>
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.5s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg group-hover:shadow-yellow-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">🌐 Custom website/business deployment from start to finish</span>
                  </div>
                </div>
                
                <div className="text-center mb-8 group-hover:scale-105 transition-transform duration-500">
                  <div className="text-lg text-gray-400 line-through mb-1">Was A$3,000</div>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 drop-shadow-2xl mb-2 animate-pulse">A$500</div>
                  <div className="text-sm text-gray-300 font-medium">💎 Premium Investment - Limited Time</div>
                  <div className="text-sm text-green-400 font-bold animate-pulse">🔥 83% OFF - Limited Time Offer!</div>
                </div>
                
                <Link href="/products/3" className="w-full block text-center py-5 rounded-2xl font-black text-lg transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 shadow-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white border-2 border-purple-400/50 hover:border-purple-300/70 hover:shadow-purple-400/30 relative overflow-hidden group/btn">
                  <span className="relative z-10 group-hover/btn:animate-pulse">🚀 Go Premium</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>
            </div>
            
            {/* LIVE SUPPORT Plan - Promotional Contract */}
            <div className="relative group bg-gradient-to-br from-red-900/95 to-orange-900/95 rounded-3xl shadow-2xl border border-red-400/40 backdrop-blur-sm overflow-hidden transform transition-all duration-700 hover:shadow-red-400/40 hover:shadow-2xl hover:-translate-y-4 hover:scale-105 shimmer-effect">
              {/* Urgent floating particles */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-red-400/40 to-orange-400/40 rounded-full blur-sm animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute bottom-8 left-8 w-8 h-8 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-full blur-sm animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/3 left-1/5 w-6 h-6 bg-gradient-to-r from-yellow-400/25 to-red-400/25 rounded-full blur-sm animate-pulse" style={{animationDelay: '2s'}}></div>
              
              {/* Urgent animated border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-400/30 via-orange-400/20 to-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Urgent badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg animate-bounce group-hover:animate-pulse transition-all duration-300 group-hover:scale-110" style={{animationDuration: '1s'}}>
                  🔥 LIVE SUPPORT
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-50 animate-ping"></div>
                </div>
              </div>
              
              {/* Deadline badge */}
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg animate-pulse" style={{animationDuration: '0.8s'}}>
                  ⏰ ENDS SEPT 1st
                </div>
              </div>
              
              <div className="relative h-52 bg-gradient-to-br from-red-600 via-orange-600 to-red-800 flex items-center justify-center overflow-hidden group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:via-orange-500 group-hover:to-red-700 transition-all duration-500">
                <div className="relative z-10 transform group-hover:scale-125 group-hover:rotate-3 transition-all duration-700">
                  <svg className="w-24 h-24 text-white drop-shadow-2xl group-hover:text-red-100 transition-all duration-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9C16.3,14.9 16.2,14.9 16.1,14.9C15.8,14.9 15.6,15 15.4,15.2L13.2,17.4C10.4,15.9 8,13.6 6.6,10.8L8.8,8.6C9.1,8.3 9.2,7.9 9,7.6C8.7,6.5 8.5,5.2 8.5,4C8.5,3.5 8,3 7.5,3H4C3.5,3 3,3.5 3,4C3,13.4 10.6,21 20,21C20.5,21 21,20.5 21,20V16.5C21,16 20.5,15.5 20,15.5M5,5H6.5C6.6,5.9 6.8,6.8 7,7.6L5.8,8.8C5.4,7.6 5.1,6.3 5,5M19,19C17.7,18.9 16.4,18.6 15.2,18.2L16.4,17C17.2,17.2 18.1,17.4 19,17.4V19Z"/>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full blur-2xl animate-pulse group-hover:bg-gradient-to-r group-hover:from-red-300/40 group-hover:to-orange-300/40 transition-all duration-500"></div>
                  {/* Orbiting particles */}
                  <div className="absolute -top-2 -right-2 w-1 h-1 bg-red-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all duration-500"></div>
              </div>
              
              <div className="p-8">
                <h3 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-orange-200 drop-shadow-lg group-hover:scale-105 transition-transform duration-500">
                  Live Support Contract 2025
                </h3>
                <p className="text-gray-100 mb-8 leading-relaxed text-base font-medium group-hover:text-white transition-colors duration-500">
                  🔥 Premium screenshare live support contract at promotional rates. Get direct access to expert guidance with real-time problem solving and implementation support.
                </p>
                
                <div className="space-y-5 mb-8">
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.1s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-orange-400 rounded-full shadow-lg group-hover:shadow-red-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">🖥️ Live screenshare support sessions with expert guidance</span>
                  </div>
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.2s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg group-hover:shadow-orange-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">⚡ Real-time problem solving and implementation support</span>
                  </div>
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.3s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full shadow-lg group-hover:shadow-yellow-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">📋 Flexible hourly contract with no long-term commitment</span>
                  </div>
                  <div className="flex items-center space-x-4 transform group-hover:translate-x-2 transition-all duration-300" style={{transitionDelay: '0.4s'}}>
                    <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full shadow-lg group-hover:shadow-red-400/50 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300"></div>
                    <span className="text-sm text-gray-100 font-medium group-hover:text-white transition-colors duration-300">⏰ Limited time promotional pricing - ends September 1st</span>
                  </div>
                </div>
                
                <div className="text-center mb-8 group-hover:scale-105 transition-transform duration-500">
                  <div className="text-lg text-gray-400 line-through mb-1">Usually A$300/hour</div>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 drop-shadow-2xl mb-2 animate-pulse">A$190</div>
                  <div className="text-sm text-gray-300 font-medium">🔥 Per Hour Contract Rate</div>
                  <div className="text-sm text-red-400 font-bold animate-pulse">⚡ 37% OFF - Contract Ends Sept 1st!</div>
                </div>
                
                <Link href="/products/4" className="w-full block text-center py-5 rounded-2xl font-black text-lg transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 shadow-2xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:via-orange-500 hover:to-red-500 text-white border-2 border-red-400/50 hover:border-red-300/70 hover:shadow-red-400/30 relative overflow-hidden group/btn">
                  <span className="relative z-10 group-hover/btn:animate-pulse">🔥 Get Live Support</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Row 1 */}
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

            {/* Row 2 */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-orange-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">AI Arbitrage Peak Window</h3>
              <p className="text-gray-300 leading-relaxed">
                Right now, AI gives unfair advantages in lead gen, content, marketing, and automation. By 2026, everyone will be using the same tools and margins shrink.
              </p>
            </div>

            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-cyan-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Early Adopter Distribution Advantage</h3>
              <p className="text-gray-300 leading-relaxed">
                The businesses capturing audiences + data now will dominate later. Starting later means you're buying attention instead of owning it.
              </p>
            </div>

            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-emerald-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Lower Costs Now</h3>
              <p className="text-gray-300 leading-relaxed">
                As demand for AI tools grows, pricing for APIs, ad platforms, and AI infrastructure will rise. Getting in now means cheaper growth.
              </p>
            </div>

            {/* Row 3 */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-rose-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-rose-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Beat Content Saturation</h3>
              <p className="text-gray-300 leading-relaxed">
                AI-generated content is flooding the web. By 2026, standing out will be 10x harder than it is now. This is the last easy window.
              </p>
            </div>

            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-indigo-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Brand Over Tech Advantage</h3>
              <p className="text-gray-300 leading-relaxed">
                Right now, results still impress. By 2026, everyone will have similar AI tools and only brands with early traction will matter.
              </p>
            </div>

            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-amber-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Novelty Window Closing</h3>
              <p className="text-gray-300 leading-relaxed">
                Audiences are still wowed by AI-powered sites. In a few years, it'll be the norm. The novelty window is closing fast.
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
                
                <div>
                  <label className="block text-white font-semibold mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    🔄 Ongoing Support
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-green-400/30 rounded text-green-500 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300"
                      />
                      <div className="flex-1">
                        <span className="text-white group-hover:text-green-300 transition-colors duration-300">$100/week priority email support</span>
                        <p className="text-sm text-gray-400 mt-1">Get priority email responses within 24 hours for ongoing questions and minor updates</p>
                      </div>
                    </label>
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-green-400/30 rounded text-green-500 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300"
                      />
                      <div className="flex-1">
                        <span className="text-white group-hover:text-green-300 transition-colors duration-300">$300/hour screenshare live support</span>
                        <p className="text-sm text-gray-400 mt-1">Real-time screenshare sessions for complex issues, training, or feature additions</p>
                      </div>
                    </label>
                  </div>
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