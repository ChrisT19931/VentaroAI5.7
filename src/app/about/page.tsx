'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Image 
                src="/images/ventaro-logo.svg" 
                alt="Ventaro AI" 
                width={300} 
                height={80} 
                className="mx-auto mb-6"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              About <span className="text-gradient">Ventaro AI Digital Store</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Your destination for premium AI-powered digital products and innovative design solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary btn-lg">
                Explore AI Products
              </Link>
              <Link href="/products/ebook" className="btn-outline btn-lg">
                Learn Our Methods
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Our Story Section */}
      <div className="py-12 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              The Future is <span className="text-gradient-accent">AI-Native</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Welcome to 2025 - where every pixel, every line of code, and every design decision is powered by artificial intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-black mb-6">Our AI-First Approach</h3>
              <div className="space-y-4">
                <p className="text-black">
                  Every product in our store is 100% designed using AI tools like <span className="text-black font-semibold">ChatGPT</span>, <span className="text-black font-semibold">Cursor</span>, and advanced AI design systems. We don't just use AI as a helper - it's our primary creative force.
                </p>
                <p className="text-black">
                  Founded in 2025, Ventaro AI represents the new generation of digital product creation where human creativity meets artificial intelligence to produce premium results.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="glass-effect rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-2">100%</div>
                    <div className="text-gray-400">AI Designed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-2">Premium</div>
                    <div className="text-gray-400">Quality Standard</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-2">2025</div>
                    <div className="text-gray-400">Future Design</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-2">AI</div>
                    <div className="text-gray-400">Teaching Focus</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="py-12 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              We Teach You <span className="text-gradient">How</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our focus isn't just selling products - it's teaching you the exact AI methods, prompts, and workflows we use to create premium-quality designs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-premium group">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <Image 
                    src="/images/ebook-cover.jpg" 
                    alt="AI Design Ebooks" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="relative z-10 text-4xl">📚</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Design Ebooks</h3>
              <p className="text-black mb-6">
                Comprehensive guides revealing our exact ChatGPT prompts, Cursor workflows, and AI design methodologies that create premium results.
              </p>
              <Link href="/products/ebook" className="btn-primary text-sm inline-block">
                Learn the Secrets →
              </Link>
            </div>
            
            <div className="card-premium group">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <Image 
                    src="/images/prompts-collection.jpg" 
                    alt="Premium Prompts" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="relative z-10 text-4xl">🚀</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Premium Prompts</h3>
              <p className="text-black mb-6">
                Battle-tested prompt libraries for ChatGPT, Claude, and other AI tools that consistently produce professional-grade outputs.
              </p>
              <Link href="/products/prompts" className="btn-primary text-sm inline-block">
                Get the Prompts →
              </Link>
            </div>
            
            <div className="card-premium group">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <Image 
                    src="/images/coaching-session.jpg" 
                    alt="1-on-1 Coaching" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="relative z-10 text-4xl">🎯</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1-on-1 Coaching</h3>
              <p className="text-black mb-6">
                Personal coaching calls where we walk you through our entire AI design process, from concept to premium-quality execution.
              </p>
              <Link href="/products/coaching" className="btn-primary text-sm inline-block">
                Book a Call →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="py-12 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient-accent">AI Tools</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The cutting-edge tools and platforms we use to create every product in our store.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="mb-4"><svg className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
              <h3 className="text-lg font-bold text-white mb-2">ChatGPT</h3>
              <p className="text-gray-400 text-sm">AI Conversations</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="mb-4"><svg className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>
              <h3 className="text-lg font-bold text-white mb-2">Cursor</h3>
              <p className="text-gray-400 text-sm">AI Code Editor</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="mb-4"><svg className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg></div>
              <h3 className="text-lg font-bold text-white mb-2">Claude</h3>
              <p className="text-gray-400 text-sm">AI Assistant</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="mb-4"><svg className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>
              <h3 className="text-lg font-bold text-white mb-2">Manus</h3>
              <p className="text-gray-400 text-sm">AI Tool</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass-card p-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Master <span className="text-gradient">AI Design</span>?
            </h2>
            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
              Join the AI revolution. Learn the exact methods we use to create premium-quality digital products with artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products" className="btn-primary btn-lg">
                Browse All Products
              </Link>
              <Link href="/products/coaching" className="btn-outline btn-lg">
                Book a Coaching Call
              </Link>
            </div>
            <div className="mt-8 text-gray-400 text-sm">
              100% AI-Designed • Premium Quality • Teaching Focused
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}