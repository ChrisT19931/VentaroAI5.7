import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Ventaro AI Digital Store 2025 - Learn How to Make Money Online with AI Tools & AI Prompts',
  description: 'Discover how to make money online with AI tools and AI prompts in 2025. Learn our proven strategies to make money with AI through premium digital products, coaching, and AI business solutions.',
  keywords: 'about AI tools, AI prompts 2025, make money online with AI, AI business strategies, make money with AI, AI coaching, digital products, artificial intelligence business',
  openGraph: {
    title: 'About Ventaro AI Digital Store 2025 - AI Tools & Prompts for Online Income',
    description: 'Learn how to make money online with AI tools and AI prompts. Discover our proven 2025 strategies for AI-powered business success.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Ventaro AI Digital Store 2025',
    description: 'Learn to make money online with AI tools and AI prompts in 2025',
  },
};

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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight glow-text">
              About <span className="text-gradient">Ventaro AI Digital Store 2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Your destination for AI Tools Mastery Guide 2025, AI Prompts Arsenal 2025, and AI Business Strategy Sessions to build an online business from scratch with artificial intelligence in 2025.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="neon-button btn-lg">
                Explore AI Products
              </Link>
              <Link href="/products/1" className="neon-button btn-lg">
                Learn Our Methods
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 glow-text">
              Our <span className="text-gradient-accent">AI-First Approach</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Founded in 2025, we represent the new generation of digital product creation where human creativity meets artificial intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="glass-panel p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center mr-4 animate-pulse">
                  <Image 
                    src="/images/ai-brain-icon.svg" 
                    alt="AI Brain" 
                    width={24} 
                    height={24} 
                    className="object-contain" 
                  />
                </div>
                <h3 className="text-2xl font-bold text-white glow-text">100% AI-Designed Products</h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Every product in our store is designed using cutting-edge AI tools like <span className="font-semibold text-blue-400">ChatGPT</span>, <span className="font-semibold text-blue-400">Cursor</span>, and advanced AI design systems.
                </p>
                <p className="text-gray-300">
                  We don&apos;t just use AI as a helper - it&apos;s our primary creative force, enabling us to produce professional results at scale.
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
                    <div className="text-3xl font-bold text-gradient mb-2">Quality</div>
                    <div className="text-gray-400"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-2">2025</div>
                    <div className="text-gray-400">Future Ready</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-2">Expert</div>
                    <div className="text-gray-400">Teaching</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 glow-text">
              Our <span className="text-gradient">Digital Products</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover our collection of AI Tools Mastery Guide 2025, AI Prompts Arsenal 2025, and AI Business Strategy Sessions designed to help you master artificial intelligence and build profitable online businesses.
              </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 animate-pulse">
                <Image 
                  src="/images/ebook-icon.svg" 
                  alt="AI Tools Mastery Guide" 
                  width={32} 
                  height={32} 
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 glow-text">AI Tools Mastery Guide 2025</h3>
              <p className="text-gray-300 mb-6">
                Comprehensive 30-page guide covering the latest AI tools, proven workflows, and step-by-step strategies for building successful AI-powered businesses.
              </p>
              <Link href="/products/1" className="neon-button text-sm inline-block">
                Explore Guide →
              </Link>
            </div>
            
            <div className="glass-panel group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 animate-pulse">
                <Image 
                  src="/images/prompts-icon.svg" 
                  alt="AI Prompts Arsenal" 
                  width={32} 
                  height={32} 
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 glow-text">AI Prompts Arsenal 2025</h3>
              <p className="text-gray-300 mb-6">
                Battle-tested prompt collections for content creation, marketing automation, and AI-powered business growth. Professional-grade prompts that deliver results.
              </p>
              <Link href="/products/2" className="neon-button text-sm inline-block">
                Get Prompts →
              </Link>
            </div>
            
            <div className="glass-panel group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 animate-pulse">
                <Image 
                  src="/images/coaching-icon.svg" 
                  alt="AI Business Strategy Session" 
                  width={32} 
                  height={32} 
                  className="object-contain" 
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 glow-text">AI Business Strategy Session 2025</h3>
              <p className="text-gray-300 mb-6">
                Personalized 60-minute strategy sessions to accelerate your AI business journey. Get expert guidance and an implementation report tailored to your specific goals and challenges.
              </p>
              <Link href="/products/3" className="neon-button text-sm inline-block">
                Book Strategy Session →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 glow-text">
              Our <span className="text-gradient-accent">AI Toolkit</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The cutting-edge AI platforms and tools we use to create every product in our digital store.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="mb-4">
                <svg className="h-10 w-10 mx-auto text-gradient-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ChatGPT</h3>
              <p className="text-gray-400 text-sm">AI Conversations</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="mb-4">
                <svg className="h-10 w-10 mx-auto text-gradient-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cursor</h3>
              <p className="text-gray-400 text-sm">AI Code Editor</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="mb-4">
                <svg className="h-10 w-10 mx-auto text-gradient-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                  <path d="M2 2l7.586 7.586"/>
                  <circle cx="11" cy="11" r="2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Claude</h3>
              <p className="text-gray-400 text-sm">AI Assistant</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="mb-4">
                <svg className="h-10 w-10 mx-auto text-gradient-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Design</h3>
              <p className="text-gray-400 text-sm">Creative Tools</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-500 mb-6">
              Ready to Start Your <span className="text-gray-500">AI Journey</span>?
            </h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Join the AI revolution and learn the exact methods we use to create high-quality digital products with artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products" className="btn-primary btn-lg">
                Explore Products
              </Link>
              <Link href="/products/3" className="btn-outline btn-lg">
                Get Coaching
              </Link>
            </div>
            <div className="mt-8 text-gray-500 text-sm">
              100% AI-Designed • Professional Quality • Expert Teaching
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}