'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import CinematicHero from '../components/3d/CinematicHero'
import TypewriterText from '../components/TypewriterText'
import UnifiedCheckoutButton from '../components/UnifiedCheckoutButton'
import { ExitIntentPopup, SocialProof, ScarcityIndicator, TestimonialCarousel } from '../components/ConversionOptimizations'
import { analytics } from '../lib/analytics'

export default function Home() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);

  // Track page load
  useEffect(() => {
    analytics.track('homepage_loaded');
  }, []);

  const masterclassProduct = {
    id: 'ai-business-video-guide-2025',
    name: 'AI Web Creation Masterclass',
    price: 50,
    productType: 'digital' as const,
    isPreOrder: true,
    comingSoon: true
  };



  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          subject: `New Project Inquiry - ${contactForm.projectType}`,
          message: `Phone: ${contactForm.phone}\nCompany: ${contactForm.company}\nProject Type: ${contactForm.projectType}\nBudget: ${contactForm.budget}\nTimeline: ${contactForm.timeline}\n\nMessage: ${contactForm.message}`,
          recipient: 'chris.t@ventarosales.com'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Email sent! We\'ll get back to you soon.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <main className="min-h-screen">
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
      {/* Hero Section */}
      <div className="relative">
        <CinematicHero />
      </div>

      {/* Pricing Tiers Section */}
      <section className="py-24 relative overflow-hidden z-10">
        {/* Professional Dark Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-slate-700/10 to-slate-900/10 rounded-2xl rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-slate-600/10 to-slate-800/10 rounded-xl rotate-45"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-slate-500/5 to-slate-700/5 rounded-full"></div>
        </div>
        
        {/* Video Offer Section - Primary Offer */}
        <section id="video-offer" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-orange-600/80 to-yellow-600/80 rounded-full text-sm font-bold text-white mb-6 border border-orange-500/50 shadow-lg shadow-orange-500/20">
                📅 PRE-ORDER NOW - ONLY $50 - COMING SOON!
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl">
                Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Entire Platforms</span> Not Just Websites With AI
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Get the complete step-by-step video guide + detailed report showing how to create a fully operational online business from code within a few hours.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="glass-panel p-10 rounded-3xl border-2 border-purple-500/30 shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10 rounded-3xl"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-8 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-black text-white mb-6">🎯 AI Website Creation Masterclass</h3>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                    <strong className="text-white">2 Hours from Zero to Live</strong> • Watch me create a complete platform from scratch, in real time.<br/>
                <strong className="text-white">No Experience Needed</strong> • You just follow along.<br/>
                <strong className="text-white">Keep Your Code Forever</strong> • Build it yourself, own it completely, change anything you want.<br/>
                <strong className="text-white">No SaaS Lock-In</strong> • Unlike Shopify or Wix, you build and own your platform.<br/>
                <strong className="text-white">AI-Powered Changes</strong> • Tell AI agents what to modify and watch your platform transform instantly.
                  </p>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-6xl font-black text-white">A$50</span>
                  </div>
                  <div className="mb-8">
                    <span className="inline-block px-6 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full text-sm font-bold text-white border border-orange-500/50 shadow-lg shadow-orange-500/20">
                      PRE-ORDER BENEFITS
                    </span>
                  </div>
                  
                  {/* Pre-Order Benefits */}
                  <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-2xl p-6 mb-8 border border-orange-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 text-center">🎯 Pre-Order Benefits</h4>
                    <div className="space-y-2 text-center text-orange-200">
                      <div>✅ <strong>Early Access</strong> - Get the video as soon as it's ready</div>
                      <div>✅ <strong>Bonus Materials</strong> - Extra prompts and templates</div>
                      <div>✅ <strong>Priority Support</strong> - First in line for help</div>
                      <div>✅ <strong>Lock in $50 Price</strong> - Price increases after launch</div>
                    </div>
                  </div>
                  {/* What You Get for $50 */}
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
                  <UnifiedCheckoutButton 
                    product={masterclassProduct}
                    buttonText="📅 Pre-Order Now • Coming Soon for A$50"
                    className="premium-button-glow w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-black py-6 px-12 rounded-2xl hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block text-center text-lg"
                    variant="direct"
                  />
                  
                  {/* Social Proof */}
                  <div className="mt-8">
                    <SocialProof />
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-4">⚡ Secure checkout • Premium support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            {/* Additional Services Header */}
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl">
                Additional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Services & Resources</span>
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Professional support and premium resources to accelerate your success.
              </p>
            </div>
          </div>
          
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
            
            {/* #2 Weekly Support Contract */}
            <div className="group relative bg-gradient-to-br from-slate-900/95 via-orange-900/40 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-orange-500/40 hover:border-orange-500/60">
              {/* Enhanced glow effects */}
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
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">Support Package</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">60-minute Google Meet/phone call consultation + unlimited email support for 1 month.</p>
                
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
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 transition-all duration-500">A$300</div>
                  <div className="text-xs text-gray-300">one-time payment</div>
                </div>
                <UnifiedCheckoutButton 
                  product={{
                    id: 'weekly-support-contract-2025',
                    name: 'Support Package',
                    price: 300,
                    productType: 'digital'
                  }}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-orange-500/30"
                  variant="direct"
                >
                  Get Support
                </UnifiedCheckoutButton>
              </div>
            </div>

            {/* $10 Prompts - Credibility Offer */}
            <div className="group relative bg-gradient-to-br from-slate-900/95 via-emerald-900/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-emerald-500/40 hover:border-emerald-500/60">
              {/* Enhanced glow effects */}
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
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">Full Access To Prompts</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">30 proven AI prompts for building online businesses.</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">DIY website building</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Learn to build yourself</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-green-400 transition-all duration-500">A$10</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={{
                    id: 'ai-prompts-arsenal-2025',
                    name: 'Full Access To Prompts',
                    price: 10,
                    productType: 'digital'
                  }}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/30"
                  variant="direct"
                >
                  Get Prompts
                </UnifiedCheckoutButton>
              </div>
            </div>

            {/* $25 Ebook - Credibility Offer */}
            <div className="group relative bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-blue-500/40 hover:border-blue-500/60">
              {/* Enhanced glow effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  STARTER
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-blue-400 opacity-60 group-hover:opacity-100 group-hover:text-blue-300 transition-all duration-500 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                  </svg>
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">Full Access To Ebook</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">Complete AI tools mastery guide for online business.</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">DIY business building</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Learn AI tools yourself</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">A$25</div>
                  <div className="text-xs text-gray-300">one-time</div>
                </div>
                <UnifiedCheckoutButton 
                  product={{
                    id: 'ai-tools-mastery-guide-2025',
                    name: 'Full Access To Ebook',
                    price: 25,
                    productType: 'digital'
                  }}
                  className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30"
                  variant="direct"
                >
                  Get Ebook
                </UnifiedCheckoutButton>
              </div>
            </div>


            {/* Custom Websites - Premium Offer */}
            <div className="group relative bg-gradient-to-br from-slate-900/95 via-purple-900/40 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-purple-500/40 hover:border-purple-500/60">
              {/* Enhanced glow effects */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300">
                  PREMIUM
                </div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-gray-800 transition-all duration-500">
                <div className="relative transform group-hover:scale-110 transition-all duration-500">
                  <svg className="w-16 h-16 text-purple-400 opacity-60 group-hover:opacity-100 group-hover:text-purple-300 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl group-hover:bg-purple-400/40 transition-all duration-300"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-all duration-500"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black mb-3 text-white drop-shadow-lg">Custom Websites</h3>
                <p className="text-gray-200 mb-4 text-sm leading-relaxed group-hover:text-white transition-colors duration-500">We build professional custom websites and online platforms for you. Higher pricing reflects our time, expertise, and effort.</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Professional development</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">We build it for you</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">A$1,000</div>
                  <div className="text-xs text-gray-300">to A$10,000 based on complexity</div>
                </div>
                <a href="#elite-custom-website-creation" className="premium-button-glow w-full block text-center py-3 rounded-xl font-bold transition-all duration-500 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/30">
                  Learn More
                </a>
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



      {/* Elite Custom Website Creation */}
      <section id="elite-custom-website-creation" className="py-24 bg-black relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 right-20 w-32 h-32 border border-purple-500/20 rotate-45 opacity-50"></div>
              <div className="absolute bottom-20 left-20 w-24 h-24 border border-blue-500/20 rotate-12 opacity-50"></div>
        
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
          
          {/* Unified Centered Box */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-panel rounded-3xl p-8 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              {/* Header Content */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4 glow-text">We Build Your Custom Website</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Get a FREE QUOTE for our professional website development service. We build it for you, saving you time and ensuring professional quality. Pricing reflects our expertise and effort invested in your project.
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">FREE Strategy Session</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">Custom Quote in 24hrs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-300">No Obligation</span>
                  </div>
                </div>
              </div>
              
              {/* What's Included Section */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/30 mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-white">Full Custom Site Creation</h4>
                  </div>
                </div>
                <h5 className="text-lg font-semibold text-white mb-4 text-center">What's Included:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Custom design tailored to your brand</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Responsive for all devices</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">SEO optimization</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Content creation</span>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="Enter your full name"
                    required
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
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="your.business@email.com"
                    required
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
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    placeholder="04XX XXX XXX"
                    required
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
                    name="company"
                    value={contactForm.company}
                    onChange={handleContactChange}
                    placeholder="Your company name"
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-400/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Project Type *
                  </label>
                  <select 
                    name="projectType"
                    value={contactForm.projectType}
                    onChange={handleContactChange}
                    required
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-400/30 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 hover:border-blue-300 backdrop-blur-sm">
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
                  <select 
                    name="budget"
                    value={contactForm.budget}
                    onChange={handleContactChange}
                    required
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-400/30 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 hover:border-purple-300 backdrop-blur-sm">
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
                  <select 
                    name="timeline"
                    value={contactForm.timeline}
                    onChange={handleContactChange}
                    required
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-400/30 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 hover:border-purple-300 backdrop-blur-sm">
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
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Tell us about your project goals, target audience, key features you need, and what success looks like for your business. The more details you provide, the better we can tailor our proposal to exceed your expectations."
                    required
                    className="w-full p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-pink-400/30 rounded-xl text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 focus:outline-none transition-all duration-300 hover:border-pink-300 backdrop-blur-sm"
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-300 mb-6">
                    <span className="text-blue-400">🎯</span> Ready to transform your business? We are standing by to create your digital masterpiece.
                  </p>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {isSubmitting ? '⏳ Sending...' : '🔥 GET MY FREE QUOTE'}
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
              Experience the pinnacle of digital with our high-quality AI-powered tools and strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Row 1 - DIY and Custom Solutions First */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-blue-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">DIY Business Building</h3>
              <p className="text-gray-300 leading-relaxed">
                Our affordable $50 resources give you everything you need to build your own AI-powered business from scratch.
              </p>
            </div>
            
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-purple-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Custom Website Creation</h3>
              <p className="text-gray-300 leading-relaxed">
                Let us build your professional custom website with our expert team, from simple landing pages to complex e-commerce solutions.
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

            {/* Row 2 - Digital Delivery Benefits */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-orange-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Instant Digital Delivery</h3>
              <p className="text-gray-300 leading-relaxed">
                Get immediate access to your purchased products with our seamless, lightning-fast delivery system.
              </p>
            </div>

            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-cyan-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Lifetime Access</h3>
              <p className="text-gray-300 leading-relaxed">
                No subscriptions, no recurring fees. Pay once and own your digital products forever with unlimited access.
              </p>
            </div>



            {/* Row 3 - Strategic Advantages */}
            <div className="group text-center p-8 glass-panel rounded-3xl shadow-2xl hover:shadow-rose-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-102 border border-rose-500/30">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white glow-text">Early Adopter Distribution Advantage</h3>
              <p className="text-gray-300 leading-relaxed">
                The businesses capturing audiences + data now will dominate later. Starting later means you're buying attention instead of owning it.
              </p>
            </div>

            {/* Beat Content Saturation section removed */}

            {/* Brand Over Tech Advantage section removed */}

            {/* Row 4 - Intentionally left empty */}


            {/* Row 5 */}
            {/* Rare Value Proposition section removed */}

            {/* Row 6 - Intentionally left empty */}

          </div>
        </div>
      </section>

      {/* Elite Call to Action */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rotate-45 opacity-50"></div>
              <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/30 rotate-12 opacity-50"></div>
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
    
    {/* Exit Intent Popup */}
    <ExitIntentPopup 
      product={masterclassProduct}
      onClose={() => setShowExitIntent(false)}
    />
    
    <Toaster position="top-right" />
    </>
  )
}