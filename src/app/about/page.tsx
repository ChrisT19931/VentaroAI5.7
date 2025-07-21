import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
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
              100% <span className="text-gradient">AI-Designed</span> Digital Products
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Crafted with ChatGPT, Cursor, and cutting-edge AI tools. We teach you the exact methods behind our $50K-quality designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary btn-lg">
                Explore AI Products
              </Link>
              <Link href="/contact" className="btn-outline btn-lg">
                Learn Our Methods
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Our Story Section */}
      <div className="section-padding bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              The Future is <span className="text-gradient-accent">AI-Native</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Welcome to 2025 - where every pixel, every line of code, and every design decision is powered by artificial intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Our AI-First Approach</h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Every product in our store is 100% designed using AI tools like <span className="text-white font-semibold">ChatGPT</span>, <span className="text-white font-semibold">Cursor</span>, and advanced AI design systems. We don't just use AI as a helper - it's our primary creative force.
                </p>
                <p className="text-gray-300">
                  Founded in 2025, Ventaro AI represents the new generation of digital product creation where human creativity meets artificial intelligence to produce results that would traditionally cost $50,000+ to develop.
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
                    <div className="text-3xl font-bold text-gradient mb-2">$50K</div>
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
      <div className="section-padding bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              We Teach You <span className="text-gradient">How</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our focus isn't just selling products - it's teaching you the exact AI methods, prompts, and workflows we use to create $50K-quality designs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-premium group">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Design Ebooks</h3>
              <p className="text-gray-300 mb-6">
                Comprehensive guides revealing our exact ChatGPT prompts, Cursor workflows, and AI design methodologies that create premium results.
              </p>
              <div className="text-gradient font-semibold">Learn the Secrets →</div>
            </div>
            
            <div className="card-premium group">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Premium Prompts</h3>
              <p className="text-gray-300 mb-6">
                Battle-tested prompt libraries for ChatGPT, Claude, and other AI tools that consistently produce professional-grade outputs.
              </p>
              <div className="text-gradient font-semibold">Get the Prompts →</div>
            </div>
            
            <div className="card-premium group">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1-on-1 Coaching</h3>
              <p className="text-gray-300 mb-6">
                Personal coaching calls where we walk you through our entire AI design process, from concept to $50K-quality execution.
              </p>
              <div className="text-gradient font-semibold">Book a Call →</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="section-padding bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient-accent">AI Arsenal</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The cutting-edge tools and platforms we use to create every product in our store.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-bold text-white mb-2">ChatGPT</h3>
              <p className="text-gray-400 text-sm">AI Conversations</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Cursor</h3>
              <p className="text-gray-400 text-sm">AI Code Editor</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-bold text-white mb-2">Midjourney</h3>
              <p className="text-gray-400 text-sm">AI Design</p>
            </div>
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-lg font-bold text-white mb-2">Claude</h3>
              <p className="text-gray-400 text-sm">AI Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Master <span className="text-gradient">AI Design</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the AI revolution. Learn the exact methods we use to create $50K-quality digital products with artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products" className="btn-primary btn-lg">
                Start Learning Now
              </Link>
              <Link href="/contact" className="btn-outline btn-lg">
                Book a Coaching Call
              </Link>
            </div>
            <div className="mt-8 text-gray-400 text-sm">
              🚀 100% AI-Designed • 💎 Premium Quality • 🎯 Teaching Focused
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}