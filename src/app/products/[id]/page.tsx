'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AddToCartButton from '@/components/AddToCartButton';
import BuyNowButton from '@/components/BuyNowButton';

import dynamic from 'next/dynamic';

// Dynamically import the 3D component to avoid SSR issues
const Product3D = dynamic(() => import('@/components/3d/Product3D'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl flex items-center justify-center">
      <div className="text-white text-lg">Loading 3D experience...</div>
    </div>
  )
});

// Define the product type
type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category?: string;
  is_featured?: boolean;
  is_active?: boolean;
  productType: 'digital' | 'physical'; // Required by AddToCartButton
  [key: string]: any;
};
// Fallback products data
const fallbackProducts = {
  '1': {
    id: '1',
    name: 'AI Tools Mastery Guide 2025',
    description: '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
    price: 25.00,
    originalPrice: 50.00,
    image_url: '/images/products/ai-tools-mastery-guide.svg',
    category: 'courses',
    is_active: true,
    featured: true,
    product_type: 'digital',
    created_at: new Date().toISOString(),
    benefits: [
      'Learn ChatGPT, Claude, Grok, and Gemini',
      'Master AI agents and bots',
      '30 practical sales lessons',
      'Simple step-by-step instructions',
      'Ready-to-use techniques',
      'Boost your sales with AI'
    ],
    details: {
      description: 'A practical 30-page guide teaching you how to use popular AI chatbots like ChatGPT, Claude, Grok, and Gemini. Learn to create and use AI agents and bots, plus get 30 powerful sales lessons to grow your business.',
      features: [
        'Complete guide to ChatGPT, Claude, Grok, and Gemini',
        'How to create and use AI agents',
        'Bot creation and management',
        '30 sales lessons for business growth',
        'Practical examples and tutorials'
      ],
      includes: [
        '30-page comprehensive PDF guide',
        'AI chatbot tutorials',
        'Agent and bot creation guides',
        '30 sales lessons',
        'Quick reference sheets'
      ],
      pages: 30,
      format: 'PDF',
      language: 'English',
      level: 'Beginner to Advanced',
      downloadSize: '2.5 MB',
      readingTime: '45 minutes'
    }
  },
  '2': {
    id: '2',
    name: 'AI Prompts Arsenal 2025',
    description: '30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
    price: 10.00,
    image_url: '/images/products/ai-prompts-arsenal.svg',
    category: 'tools',
    is_active: true,
    featured: false,
    product_type: 'digital',
    created_at: new Date().toISOString(),
    benefits: [
      '30 proven prompts for building online business',
      'Copy-paste ready for immediate use',
      'Works with ChatGPT and other AI tools',
      'Organized by business type',
      'Simple instructions included',
      'Start making money today'
    ],
    details: {
      description: 'Get 30 simple AI prompts that help you build your online business and start making money. Each prompt is tested and ready to use - just copy, paste, and start earning.',
      features: [
        '30 business-focused prompts',
        'Simple step-by-step instructions',
        'Perfect for online business building',
        'Money-making strategies included',
        'Works with popular AI tools'
      ],
      includes: [
        'PDF with all 30 prompts',
        'Copy-paste ready format',
        'Business building guide',
        'Quick start instructions'
      ],
      promptCount: 30,
      format: 'PDF',
      language: 'English',
      compatibility: 'ChatGPT and other AI tools',
      downloadSize: '1.2 MB'
    }
  },
  '3': {
    id: '3',
    name: 'AI Business Strategy Session 2025',
    description: '60-minute live coaching session to understand your goals and learn step-by-step how to build, deploy, and launch your own online store/website. Includes complete walkthrough from start to finish with detailed implementation report. 🚀 LAUNCH OFFER: $500 (reduced from $3000) until September 1st, 2025!',
    price: 500.00,
    image_url: '/images/products/ai-business-strategy-session.svg',
    category: 'services',
    is_active: true,
    featured: false,
    product_type: 'digital',
    created_at: new Date().toISOString(),
    benefits: [
      'Live 60-minute video coaching session',
      'Understand your specific business goals',
      'Learn step-by-step online store creation',
      'Complete website deployment walkthrough',
      'Master e-commerce setup and configuration',
      'Comprehensive implementation report included',
      'Start-to-finish guidance with real examples'
    ],
    details: {
      description: 'Join an exclusive 60-minute live video coaching session where you\'ll learn to build and deploy your own online store/website from start to finish. This hands-on session includes goal assessment, step-by-step guidance, and a detailed implementation report.',
      features: [
        'Live video coaching with expert instructor',
        'Goal assessment and business planning',
        'Step-by-step online store creation tutorial',
        'Real-time website building and deployment',
        'E-commerce setup and configuration',
        'Professional development workflow setup'
      ],
      includes: [
        'Full 60-minute live video session',
        'Personal goal assessment and planning',
        'Complete Vercel deployment walkthrough',
        'Hands-on site building experience',
        'Comprehensive implementation report',
        'Session recording for future reference',
        'Email support for follow-up questions'
      ],
      duration: '60 minutes',
      format: 'Live video session (Zoom/Teams)',
      language: 'English',
      deliverables: 'Implementation report + session recording',
      followUp: 'Email support included',
      note: 'Full package options available - email us for custom quotes and comprehensive solutions'
    }
  }
};

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const handleAddToCart = () => {
    if (product) {
      // This will be handled by the AddToCartButton component
      // but we need to provide a callback for the 3D component
      const event = new CustomEvent('addToCart', { detail: product });
      window.dispatchEvent(event);
    }
  };
  
  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;
      
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      
      try {
        // Try to fetch from Supabase first
        const supabase = await createClient();
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();
        
        if (!error && data) {
          // Ensure productType is set (required by AddToCartButton)
          setProduct({
            ...data,
            productType: ((data.product_type as 'digital' | 'physical') || 'digital') as 'digital' | 'physical'
          });
          setLoading(false);
          return;
        }
        
        // Fallback to hardcoded products if not found in database
        if (fallbackProducts[id as keyof typeof fallbackProducts]) {
          const fallbackProduct = fallbackProducts[id as keyof typeof fallbackProducts];
          setProduct({
            ...fallbackProduct,
            description: fallbackProduct.description || '',
            productType: ((fallbackProduct.product_type as 'digital' | 'physical') || 'digital') as 'digital' | 'physical'
          });
        } else {
          // Product not found
          router.push('/not-found');
        }
      } catch (e) {
        console.error('Error fetching product:', e);
        // Try fallback
        if (fallbackProducts[id as keyof typeof fallbackProducts]) {
          const fallbackProduct = fallbackProducts[id as keyof typeof fallbackProducts];
          setProduct({
            ...fallbackProduct,
            description: fallbackProduct.description || '',
            productType: ((fallbackProduct.product_type as 'digital' | 'physical') || 'digital') as 'digital' | 'physical'
          });
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [params.id, router]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }
  
  // Add animation styles
  const animationStyles = `
    @keyframes book-flip {
      0%, 100% { transform: rotateY(0deg) scale(1); }
      25% { transform: rotateY(-15deg) scale(1.05); }
      50% { transform: rotateY(0deg) scale(1.1); }
      75% { transform: rotateY(15deg) scale(1.05); }
    }
    @keyframes page-turn {
      0%, 100% { transform: translateX(-100%) skewX(0deg); opacity: 0; }
      50% { transform: translateX(0%) skewX(-10deg); opacity: 0.3; }
    }
    @keyframes rocket-launch {
      0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
      25% { transform: translateY(-10px) rotate(-5deg) scale(1.05); }
      50% { transform: translateY(-20px) rotate(0deg) scale(1.1); }
      75% { transform: translateY(-10px) rotate(5deg) scale(1.05); }
    }
    @keyframes rocket-trail {
      0%, 100% { height: 20px; opacity: 0.8; }
      50% { height: 40px; opacity: 1; }
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }
    @keyframes target-focus {
      0%, 100% { transform: scale(1) rotateZ(0deg); }
      25% { transform: scale(1.05) rotateZ(-2deg); }
      50% { transform: scale(1.1) rotateZ(0deg); }
      75% { transform: scale(1.05) rotateZ(2deg); }
    }
    @keyframes target-ring-1 {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.2; }
      50% { transform: scale(1.1) rotate(180deg); opacity: 0.4; }
    }
    @keyframes target-ring-2 {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
      50% { transform: scale(1.15) rotate(-180deg); opacity: 0.5; }
    }
    @keyframes target-ring-3 {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
      50% { transform: scale(1.2) rotate(180deg); opacity: 0.6; }
    }
    @keyframes coaching-arrow {
      0%, 100% { transform: translateX(-50%) translateY(-50%) rotate(0deg) scale(1); opacity: 0.8; }
      25% { transform: translateX(-50%) translateY(-50%) rotate(15deg) scale(1.1); opacity: 1; }
      50% { transform: translateX(-50%) translateY(-50%) rotate(0deg) scale(1.2); opacity: 1; }
      75% { transform: translateX(-50%) translateY(-50%) rotate(-15deg) scale(1.1); opacity: 1; }
    }
    .animate-book-flip {
      animation: book-flip 4s ease-in-out infinite;
      transform-style: preserve-3d;
    }
    .animate-page-turn {
      animation: page-turn 6s ease-in-out infinite;
    }
    .animate-rocket-launch {
      animation: rocket-launch 4s ease-in-out infinite;
    }
    .animate-rocket-trail {
      animation: rocket-trail 2s ease-in-out infinite;
    }
    .animate-twinkle {
      animation: twinkle 3s ease-in-out infinite;
    }
    .animate-target-focus {
      animation: target-focus 4s ease-in-out infinite;
      transform-style: preserve-3d;
    }
    .animate-target-ring-1 {
      animation: target-ring-1 6s linear infinite;
    }
    .animate-target-ring-2 {
      animation: target-ring-2 8s linear infinite;
    }
    .animate-target-ring-3 {
      animation: target-ring-3 10s linear infinite;
    }
    .animate-coaching-arrow {
      animation: coaching-arrow 3s ease-in-out infinite;
    }
  `;
  
  return (
    <div className="bg-black min-h-screen py-12">
      <style jsx>{animationStyles}</style>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3D Product Showcase */}
          <div className="relative">
            <Product3D 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url || '/placeholder-product.jpg',
                description: product.description || 'No description available'
              }} 
              onAddToCart={handleAddToCart} 
            />
            
            {/* Product Specs */}
            {(product.details?.pages || product.details?.duration || product.details?.promptCount) && (
              <div className="mt-6 glass-panel rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 glow-text">Specifications</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.details.pages && (
                    <div>
                      <span className="text-gray-300">Pages:</span>
                      <span className="ml-2 font-medium text-white">{product.details.pages}</span>
                    </div>
                  )}
                  {product.details.format && (
                    <div>
                      <span className="text-gray-300">Format:</span>
                      <span className="ml-2 font-medium text-white">{product.details.format}</span>
                    </div>
                  )}
                  {product.details.readingTime && (
                    <div>
                      <span className="text-gray-300">Reading Time:</span>
                      <span className="ml-2 font-medium text-white">{product.details.readingTime}</span>
                    </div>
                  )}
                  {product.details.downloadSize && (
                    <div>
                      <span className="text-gray-300">File Size:</span>
                      <span className="ml-2 font-medium text-white">{product.details.downloadSize}</span>
                    </div>
                  )}
                  {product.details.promptCount && (
                    <div>
                      <span className="text-gray-300">Prompts:</span>
                      <span className="ml-2 font-medium text-white">{product.details.promptCount}</span>
                    </div>
                  )}
                  {product.details.duration && (
                    <div>
                      <span className="text-gray-300">Duration:</span>
                      <span className="ml-2 font-medium text-white">{product.details.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 glow-text">{product.name}</h1>
              <p className="text-xl text-gray-300 mb-6">{product.description}</p>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-white glow-text">A${product.price.toFixed(2)} AUD</span>
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-sm font-medium shadow-lg">
                  {product.category === 'services' ? 'Consultation' : 'Digital Download'}
                </span>
              </div>
            </div>

            {/* Complete Ebook Content */}
            {product.id === '1' && (
              <div className="space-y-8">
                {/* Table of Contents */}
                <div className="glass-panel rounded-lg p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2 glow-text">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    📚 AI Tools Mastery Guide 2025 - Complete Content
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Part I: Foundation</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">1.</span>
                          <span>Introduction to AI Sales Revolution</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">2.</span>
                          <span>Understanding AI Tools Landscape</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">3.</span>
                          <span>Setting Up Your AI Toolkit</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Part II: Core AI Platforms</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">4.</span>
                          <span>ChatGPT Mastery for Sales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">5.</span>
                          <span>Claude: Advanced Reasoning</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">6.</span>
                          <span>Grok: Real-time Intelligence</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">7.</span>
                          <span>Gemini: Multimodal Power</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Part III: Advanced Strategies</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">8.</span>
                          <span>AI Agents & Automation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">9.</span>
                          <span>Custom Bot Development</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">10.</span>
                          <span>Integration Workflows</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Part IV: Revenue Generation</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">11.</span>
                          <span>30 Proven Sales Strategies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">12.</span>
                          <span>Revenue Optimization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">13.</span>
                          <span>Scaling Your AI Business</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Chapter 1 Preview */}
                <div className="glass-panel rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 glow-text">Chapter 1: Introduction to AI Sales Revolution</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-4">
                      The landscape of sales and business development has undergone a seismic shift with the advent of artificial intelligence. What once required teams of researchers, writers, and analysts can now be accomplished by a single individual armed with the right AI tools and knowledge.
                    </p>
                    <p className="text-gray-300 mb-4">
                      This guide represents the culmination of extensive research and real-world application of AI tools in sales environments. You'll discover how to leverage ChatGPT, Claude, Grok, and Gemini to create compelling sales materials, automate customer interactions, and generate revenue streams that were previously impossible for individual entrepreneurs.
                    </p>
                    <h4 className="text-lg font-semibold text-white mb-3">What You'll Learn:</h4>
                    <ul className="space-y-2 text-gray-300 mb-4">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>How to identify the right AI tool for each sales task</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Prompt engineering techniques that deliver consistent results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Building automated sales funnels with AI assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>Creating personalized customer experiences at scale</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Chapter 4 Preview - ChatGPT Mastery */}
                <div className="glass-panel rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 glow-text">Chapter 4: ChatGPT Mastery for Sales</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-4">
                      ChatGPT has become the cornerstone of AI-powered sales operations. This chapter provides you with battle-tested prompts and strategies that have generated millions in revenue for businesses worldwide.
                    </p>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">Essential ChatGPT Sales Prompts:</h4>
                    
                    <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 mb-4">
                      <h5 className="text-white font-semibold mb-2">1. Cold Email Generator</h5>
                      <div className="bg-black/50 rounded p-3 text-sm text-gray-300 font-mono">
                        "Write a compelling cold email for [PROSPECT NAME] at [COMPANY]. Their pain point is [SPECIFIC CHALLENGE]. Our solution offers [KEY BENEFIT]. Include: attention-grabbing subject line, personalized opening, value proposition, social proof, and clear CTA. Tone: professional yet conversational. Length: 150-200 words."
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 mb-4">
                      <h5 className="text-white font-semibold mb-2">2. Sales Page Creator</h5>
                      <div className="bg-black/50 rounded p-3 text-sm text-gray-300 font-mono">
                        "Create a high-converting sales page for [PRODUCT/SERVICE]. Target audience: [CUSTOMER PROFILE]. Include: compelling headline, problem identification, solution presentation, benefits vs features, social proof, objection handling, urgency elements, and strong CTA. Structure with psychological triggers and persuasive copywriting techniques."
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 mb-4">
                      <h5 className="text-white font-semibold mb-2">3. Follow-up Sequence</h5>
                      <div className="bg-black/50 rounded p-3 text-sm text-gray-300 font-mono">
                        "Design a 7-email follow-up sequence for prospects who didn't respond to initial outreach. Each email should: provide unique value, address different objections, include social proof, maintain relationship focus, and have clear next steps. Vary tone from helpful to urgent while staying professional."
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">
                      <strong>Pro Tip:</strong> Always customize these prompts with specific details about your industry, target audience, and unique value proposition. The more context you provide, the better ChatGPT's output will be.
                    </p>
                  </div>
                </div>

                {/* Chapter 11 Preview - 30 Sales Strategies */}
                <div className="glass-panel rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 glow-text">Chapter 11: 30 Proven Sales Strategies</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-4">
                      This chapter contains the most valuable collection of AI-powered sales strategies, each tested and proven to generate results. Here are the first 10 strategies:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">1. AI-Powered Prospect Research</h5>
                        <p className="text-gray-300 text-sm">Use AI to analyze prospect's digital footprint, recent company news, and pain points before outreach.</p>
                      </div>
                      
                      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">2. Dynamic Pricing Optimization</h5>
                        <p className="text-gray-300 text-sm">Leverage AI to adjust pricing based on market conditions, competitor analysis, and customer behavior.</p>
                      </div>
                      
                      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">3. Automated Objection Handling</h5>
                        <p className="text-gray-300 text-sm">Create AI responses for common objections that feel personal and address specific concerns.</p>
                      </div>
                      
                      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">4. Predictive Lead Scoring</h5>
                        <p className="text-gray-300 text-sm">Use AI to score leads based on behavior patterns and likelihood to convert.</p>
                      </div>
                      
                      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">5. Content Personalization Engine</h5>
                        <p className="text-gray-300 text-sm">Generate personalized content for each prospect based on their industry and role.</p>
                      </div>
                      
                      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                        <h5 className="text-white font-semibold mb-2">6. Social Media Sales Automation</h5>
                        <p className="text-gray-300 text-sm">Automate social selling activities while maintaining authentic engagement.</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mt-4">
                      <em>And 24 more strategies covering advanced automation, revenue optimization, customer retention, and scaling techniques...</em>
                    </p>
                  </div>
                </div>

                {/* Bonus Materials */}
                <div className="glass-panel rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 glow-text">🎁 Bonus Materials Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Templates & Scripts</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>50+ Ready-to-use AI prompts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Email templates for every scenario</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Sales page frameworks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Objection handling scripts</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Tools & Resources</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>AI tool comparison matrix</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>ROI calculation worksheets</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Implementation checklists</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Case study examples</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* CTA Button */}
            <div className="glass-panel rounded-lg p-6 text-center">
              <BuyNowButton product={product} />
              <p className="text-gray-300 text-sm mt-4">Secure checkout • Instant download</p>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <AddToCartButton product={product} />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-700">
              <div className="flex items-center gap-2 text-gray-300">
                <svg className="h-5 w-5 text-green-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <svg className="h-5 w-5 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{product.category === 'services' ? 'Quick Booking' : 'Instant Download'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <svg className="h-5 w-5 text-purple-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Quality Products</span>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    </div>
  );
}