'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AddToCartButton from '@/components/AddToCartButton';

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
  [key: string]: any;
};
// Fallback products data
const fallbackProducts = {
  '1': {
    id: '1',
    name: 'Premium AI E-book',
    description: 'Comprehensive guide to leveraging AI for your business and personal productivity.',
    price: 50.00,
    image_url: '/images/products/product-1.svg',
    category: 'courses',
    is_active: true,
    featured: true,
    created_at: new Date().toISOString(),
    details: {
      description: 'The Premium AI E-book is a comprehensive guide that teaches you how to leverage AI tools to enhance your business and personal productivity. From basic concepts to advanced techniques, this e-book covers everything you need to know to become proficient in using AI tools effectively.',
      features: [
        'Learn the fundamentals of AI-assisted workflows',
        'Master prompt engineering for various tasks',
        'Create stunning content with minimal effort',
        'Optimize your productivity with AI tools',
        'Access to exclusive strategies and techniques'
      ],
      includes: [
        '200+ pages of actionable content',
        'Downloadable PDF format',
        'Practical examples',
        'Regular updates',
        'Bonus resources'
      ]
    }
  },
  '2': {
    id: '2',
    name: '30 Premium AI Prompts',
    description: 'Collection of 30 expertly crafted prompts to maximize your AI tool results.',
    price: 10.00,
    image_url: '/images/products/product-2.svg',
    category: 'tools',
    is_active: true,
    featured: false,
    created_at: new Date().toISOString(),
    details: {
      description: 'The 30 Premium AI Prompts is a carefully curated set of prompts designed to help you generate high-quality content using AI tools like ChatGPT, Claude, and more. Each prompt has been tested and refined to ensure optimal results.',
      features: [
        '30 expertly crafted prompts',
        'Categorized by use case and platform',
        'Detailed instructions for each prompt',
        'Proven to generate high-quality outputs',
        'Optimized for various AI tools'
      ],
      includes: [
        'Downloadable PDF format',
        'Editable text file for easy copying',
        'Usage guidelines and best practices',
        'Examples of expected outputs',
        'Tips for customization'
      ]
    }
  },
  '3': {
    id: '3',
    name: '1-on-1 Coaching Call',
    description: 'Personal 30-minute coaching session with full report to optimize your AI workflow.',
    price: 500.00,
    image_url: '/images/products/product-3.svg',
    category: 'services',
    is_active: true,
    featured: true,
    created_at: new Date().toISOString(),
    details: {
      description: 'The 1-on-1 Coaching Call is a personalized session where we walk you through our entire AI design process, from concept to premium-quality execution. Get direct guidance tailored to your specific needs and projects.',
      features: [
        'Personalized guidance from AI experts',
        'Custom workflow optimization',
        'Specific prompt engineering for your needs',
        'Troubleshooting your current AI processes',
        'Follow-up resources and recommendations'
      ],
      includes: [
        '30-minute video call',
        'Comprehensive written report',
        'Screen sharing and demonstrations',
        'Recording of the session',
        'Custom action plan',
        'Two weeks of email support'
      ]
    }
  }
};

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
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
          setProduct(data);
          setLoading(false);
          return;
        }
        
        // Fallback to hardcoded products if not found in database
        if (fallbackProducts[id as keyof typeof fallbackProducts]) {
          setProduct(fallbackProducts[id as keyof typeof fallbackProducts]);
        } else {
          // Product not found
          router.push('/not-found');
        }
      } catch (e) {
        console.error('Error fetching product:', e);
        // Try fallback
        if (fallbackProducts[id as keyof typeof fallbackProducts]) {
          setProduct(fallbackProducts[id as keyof typeof fallbackProducts]);
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
    <div className="bg-white min-h-screen py-12">
      <style jsx>{animationStyles}</style>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-gradient-accent rounded-lg overflow-hidden h-96 relative">
              {product.image_url ? (
                <Image 
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain opacity-70"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Product Image
                </div>
              )}
              
              {/* Product-specific animations */}
              {product.id === '1' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white relative z-10">
                    <div className="text-6xl mb-4 animate-book-flip">📚</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-page-turn"></div>
                </div>
              )}
              
              {product.id === '2' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white relative z-10">
                    <div className="text-6xl mb-4 animate-rocket-launch">🚀</div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-20 bg-gradient-to-t from-orange-500 to-transparent animate-rocket-trail"></div>
                  <div className="absolute inset-0 animate-stars">
                    <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
                    <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-20 left-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
                    <div className="absolute bottom-10 right-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
                  </div>
                </div>
              )}
              
              {product.id === '3' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white relative z-10">
                    <div className="text-6xl mb-4 animate-target-focus">🎯</div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-white/20 rounded-full animate-target-ring-1"></div>
                    <div className="absolute w-24 h-24 border-2 border-white/30 rounded-full animate-target-ring-2"></div>
                    <div className="absolute w-16 h-16 border-2 border-white/40 rounded-full animate-target-ring-3"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 animate-coaching-arrow" style={{transformOrigin: 'bottom center'}}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2">
            <div className="text-sm text-gray-500 mb-2 capitalize">{product.category || 'Uncategorized'}</div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="text-2xl font-bold text-primary-600 mb-6">${product.price.toFixed(2)}</div>
            
            <div className="prose prose-lg mb-8">
              <p>{product.description}</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What You'll Get:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant digital download after purchase
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full access to the product files
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    One-time payment, no subscription
                  </li>
                </ul>
              </div>
              
              <AddToCartButton product={product} />
              
              <div className="text-sm text-gray-500">
                Secure payment processing by Stripe
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Product Information */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          </div>
          
          <div className="py-8 prose prose-lg max-w-none">
            <p>
              {product.description}
            </p>
            <h3>Key Benefits</h3>
            <ul>
              <li>Instant digital delivery after purchase</li>
              <li>Professional-grade content and materials</li>
              <li>Lifetime access to your purchased products</li>
              <li>Compatible with all devices and platforms</li>
            </ul>
            <h3>Purchase Information</h3>
            <p>
              All digital products are delivered immediately after successful payment. You'll receive download links via email and can access your purchases anytime through your account dashboard.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Access After Purchase</h3>
                  <div className="mt-2 text-sm text-blue-700">
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