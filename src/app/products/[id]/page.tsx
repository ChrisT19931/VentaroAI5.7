'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AddToCartButton from '@/components/AddToCartButton';
import BuyNowButton from '@/components/BuyNowButton';
import ProtectedDownload from '@/components/ProtectedDownload';
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
    description: '60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies to build profitable AI-powered businesses in 2025.',
    price: 497.00,
    image_url: '/images/products/ai-business-strategy-session.svg',
    category: 'services',
    is_active: true,
    featured: false,
    product_type: 'digital',
    created_at: new Date().toISOString(),
    benefits: [
      'Live 60-minute video coaching session',
      'Master ChatGPT for business applications',
      'Learn Vercel deployment from scratch',
      'Complete site deployment walkthrough',
      'Comprehensive implementation report included',
      'Hands-on learning with real examples',
      'Full package options available - email for custom quotes'
    ],
    details: {
      description: 'Join an exclusive 60-minute live video coaching session where you\'ll master ChatGPT usage and learn to deploy professional sites using Vercel. This hands-on session includes real-time guidance and a detailed implementation report.',
      features: [
        'Live video coaching with expert instructor',
        'Complete ChatGPT mastery training',
        'Step-by-step Vercel deployment tutorial',
        'Real-time site building and deployment',
        'Advanced AI integration techniques',
        'Professional development workflow setup'
      ],
      includes: [
        'Full 60-minute live video session',
        'ChatGPT usage and optimization training',
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
                ...product,
                image_url: product.image_url || '/placeholder-product.jpg',
                description: product.description || 'No description available'
              }} 
              onAddToCart={handleAddToCart} 
            />
            
            {/* Product Specs */}
            {(product.details?.pages || product.details?.duration || product.details?.promptCount) && (
              <div className="mt-6 glass-panel rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 glow-text">Product Details</h4>
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

            {/* Key Benefits */}
            {product.benefits && (
              <div className="glass-panel rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 glow-text">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                   {product.benefits.map((benefit: string, index: number) => (
                     <li key={index} className="flex items-start gap-3">
                       <svg className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       <span className="text-gray-300 font-medium">{benefit}</span>
                     </li>
                   ))}
                 </ul>
              </div>
            )}

            {/* Features */}
            {product.details?.features && (
              <div className="glass-panel rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 glow-text">What You'll Get:</h3>
                <ul className="space-y-3">
                   {product.details.features.map((feature: string, index: number) => (
                     <li key={index} className="flex items-start gap-3">
                       <svg className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       <span className="text-gray-300">{feature}</span>
                     </li>
                   ))}
                 </ul>
              </div>
            )}

            {/* Includes */}
            {product.details?.includes && (
              <div className="glass-panel rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 glow-text">Package Includes:</h3>
                <ul className="space-y-3">
                   {product.details.includes.map((item: string, index: number) => (
                     <li key={index} className="flex items-start gap-3">
                       <svg className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                       </svg>
                       <span className="text-gray-300">{item}</span>
                     </li>
                   ))}
                 </ul>
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
        
        {/* Protected Download Section */}
        <div className="mt-16">
          <ProtectedDownload 
            productId={product.id}
            productName={product.name}
            fileName={getProductFileName(product.id)}
            fileSize={getProductFileSize(product.id)}
            isPurchased={false} // In real app, this would check user's purchase status
          />
        </div>
        
        {/* Additional Product Information */}
        <div className="mt-16">
          <div className="border-b border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white glow-text">Product Details</h2>
          </div>
          
          <div className="py-8 prose prose-lg max-w-none">
            <p className="text-gray-300">
              {product.description}
            </p>
            <h3 className="text-white glow-text">Purchase Information</h3>
            <p className="text-gray-300">
              All digital products are delivered immediately after successful payment. You'll receive download links via email and can access your purchases anytime through your account dashboard.
            </p>
            
            <div className="glass-panel border border-blue-500/30 rounded-md p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-400 glow-text">Access After Purchase</h3>
                  <div className="mt-2 text-sm text-gray-300">
                    <p>
                      Your digital products (E-book and AI Prompts) will be available for immediate download after purchase. For coaching calls, you'll receive an email with scheduling instructions within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions to get product file information
function getProductFileName(productId: string): string {
  const fileMap: Record<string, string> = {
    '1': 'ai-tools-mastery-guide-2025.pdf',
    '2': 'ai-prompts-arsenal-2025.pdf',
    '3': 'ai-business-strategy-session-2025.pdf'
  }
  return fileMap[productId] || 'product-download.pdf'
}

function getProductFileSize(productId: string): string {
  const sizeMap: Record<string, string> = {
    '1': '2.5 MB',
    '2': '1.2 MB', 
    '3': 'Booking Confirmation'
  }
  return sizeMap[productId] || '1.0 MB'
}