import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AddToCartButton from '@/components/AddToCartButton';

async function getProduct(id: string) {
  // Try to fetch from Supabase first
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error('Error connecting to Supabase:', e);
  }
  
  // Fallback to mock data if Supabase fetch fails
  const mockProducts = [
    {
      id: '1',
      name: 'Premium AI E-book',
      description: 'Comprehensive guide to leveraging AI for your business and personal productivity.',
      price: 50.00,
      image_url: '/images/products/product-1.jpg',
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
    {
      id: '2',
      name: '30 Premium AI Prompts',
      description: 'Collection of 30 expertly crafted prompts to maximize your AI tool results.',
      price: 10.00,
      image_url: '/images/products/product-2.jpg',
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
    {
      id: '3',
      name: '1-on-1 Coaching Call',
      description: 'Personal 60-minute coaching session to optimize your AI workflow.',
      price: 300.00,
      image_url: '/images/products/product-3.jpg',
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
          '60-minute video call',
          'Screen sharing and demonstrations',
          'Recording of the session',
          'Custom action plan',
          'Two weeks of email support'
        ]
      }
    },

  ];
  
  const product = mockProducts.find(p => p.id === id);
  return product || null;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 relative">
              {product.image_url ? (
                <Image 
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Product Image
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
            <nav className="-mb-px flex space-x-8">
              <button className="border-primary-500 text-primary-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Description
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                FAQ
              </button>
            </nav>
          </div>
          
          <div className="py-8 prose prose-lg max-w-none">
            <h2>Product Description</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
}