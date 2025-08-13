'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, Download, Play, BookOpen, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  highlights: { text: string; color: string }[];
  type: 'ebook' | 'prompts' | 'video' | 'support';
  downloadUrl?: string;
  videoUrl?: string;
  productPageUrl: string;
}

const products: Product[] = [
  {
    id: 'ai-tools-mastery-guide-2025',
    title: '30x AI Ebook Lessons',
    description: 'Master AI tools and techniques with our comprehensive guide covering ChatGPT, Claude, Grok, and Gemini.',
    bullets: [
      'Complete AI tools mastery guide',
      'Learn ChatGPT, Claude, Grok, and Gemini',
      'Master AI agents and automation',
      'Professional AI prompt techniques',
      '30 comprehensive lessons'
    ],
    highlights: [
      { text: 'Value', color: 'text-yellow-400' },
      { text: 'Comprehensive', color: 'text-purple-400' }
    ],
    type: 'ebook',
    downloadUrl: '/downloads/ai-tools-mastery-guide-2025.txt',
    productPageUrl: '/products/ai-tools-mastery-guide-2025'
  },
  {
    id: 'ai-prompts-arsenal-2025',
    title: '30x AI Prompts',
    description: 'Professional AI prompts for making money online with proven ChatGPT and Claude prompts ready to copy-paste.',
    bullets: [
      '30 professional money-making prompts',
      'Proven ChatGPT and Claude prompts',
      'Copy-paste ready for immediate use',
      'Business automation prompts',
      'Content creation templates'
    ],
    highlights: [
      { text: 'Speed', color: 'text-orange-400' },
      { text: 'Ready-to-Use', color: 'text-green-400' }
    ],
    type: 'prompts',
    downloadUrl: '/downloads/ai-prompts-arsenal-2025.json',
    productPageUrl: '/products/ai-prompts-arsenal-2025'
  },
  {
    id: 'ai-business-video-guide-2025',
    title: 'AI Web Creation Masterclass',
    description: 'Complete video masterclass on building AI-powered websites and applications from scratch.',
    bullets: [
      '60-minute comprehensive video course',
      'Build AI websites from scratch',
      'Learn modern development techniques',
      'Deploy to production platforms',
      'Monetization strategies included'
    ],
    highlights: [
      { text: 'No Experience Required', color: 'text-yellow-400' },
      { text: 'Complete Course', color: 'text-purple-400' }
    ],
    type: 'video',
    videoUrl: '', // Will be populated from Supabase Storage later
    productPageUrl: '/products/ai-web-creation-masterclass'
  },
  {
    id: 'weekly-support-contract-2025',
    title: 'Support Package',
    description: 'Premium support and resources for your AI journey.',
    bullets: [
      'Weekly support sessions',
      'Priority email support',
      'Exclusive resources access',
      'Custom AI solutions',
      'Business strategy consultation'
    ],
    highlights: [
      { text: 'Premium', color: 'text-blue-400' },
      { text: 'Exclusive', color: 'text-purple-400' }
    ],
    type: 'support',
    productPageUrl: '/products/support-package'
  }
];

export default function ContentAccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProducts, setUserProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/signin?callbackUrl=/account/content');
      return;
    }

    // Fetch user's owned products
    fetchUserProducts();
  }, [session, status, router]);

  const fetchUserProducts = async () => {
    try {
      const response = await fetch('/api/user/products');
      if (response.ok) {
        const data = await response.json();
        setUserProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching user products:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = session?.user?.roles?.includes('admin');
  const hasAccess = (productId: string) => isAdmin || userProducts.includes(productId);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading your content...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const renderProductCard = (product: Product) => {
    const hasProductAccess = hasAccess(product.id);
    
    return (
      <div
        key={product.id}
        className={`bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border transition-all duration-300 ${
          hasProductAccess 
            ? 'border-green-500/30 hover:border-green-400/50' 
            : 'border-gray-600/30 hover:border-gray-500/50'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">{product.title}</h3>
            {hasProductAccess ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <Lock className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <p className="text-gray-300 text-lg leading-relaxed">
            {product.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mt-4">
            {product.highlights.map((highlight, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${highlight.color} bg-gray-700/50`}
              >
                {highlight.text}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${!hasProductAccess ? 'filter blur-sm' : ''}`}>
          <ul className="space-y-3 mb-6">
            {product.bullets.map((bullet, index) => (
              <li key={index} className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 flex-shrink-0"></div>
                {bullet}
              </li>
            ))}
          </ul>

          {/* Content Type Specific Sections */}
          {hasProductAccess ? (
            <div className="space-y-4">
              {product.type === 'ebook' && (
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <BookOpen className="w-6 h-6 text-purple-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">E-book Access</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Download your comprehensive AI tools mastery guide with 30 detailed lessons.
                  </p>
                  <a
                    href={product.downloadUrl}
                    download
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download E-book PDF
                  </a>
                </div>
              )}

              {product.type === 'prompts' && (
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <AlertCircle className="w-6 h-6 text-orange-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">AI Prompts Collection</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Access your collection of 30 professional AI prompts for making money online.
                  </p>
                  
                  {/* Sample prompts preview */}
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                    <h5 className="text-white font-medium mb-2">Sample Prompts:</h5>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="p-2 bg-gray-700/50 rounded">
                        <strong className="text-orange-400">Business Idea Generator:</strong> "Generate 5 unique business ideas for [industry] that can be started with less than $1000..."
                      </div>
                      <div className="p-2 bg-gray-700/50 rounded">
                        <strong className="text-orange-400">Content Creator:</strong> "Create a 7-day social media content calendar for [business type] focusing on engagement..."
                      </div>
                      <div className="p-2 bg-gray-700/50 rounded">
                        <strong className="text-orange-400">Sales Copy Writer:</strong> "Write compelling sales copy for [product] that addresses pain points and drives conversions..."
                      </div>
                    </div>
                  </div>

                  <a
                    href={product.downloadUrl}
                    download
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download All 30 Prompts
                  </a>
                </div>
              )}

              {product.type === 'video' && (
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Play className="w-6 h-6 text-red-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">Video Masterclass</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Watch the complete 60-minute masterclass on building AI-powered websites.
                  </p>
                  
                  {/* Video player placeholder */}
                  <div className="bg-black rounded-lg aspect-video mb-4 flex items-center justify-center border border-gray-600">
                    {product.videoUrl ? (
                      <video
                        controls
                        className="w-full h-full rounded-lg"
                        poster="/images/video-thumbnail.jpg"
                      >
                        <source src={product.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="text-center text-gray-400">
                        <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                        <p>Video will be available soon</p>
                        <p className="text-sm">We're preparing your exclusive content</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <p>Duration: 60 minutes</p>
                    <p>Format: HD Video with downloadable resources</p>
                  </div>
                </div>
              )}

              {product.type === 'support' && (
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Users className="w-6 h-6 text-blue-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">Support Resources</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Support resources coming soon. You'll have access to premium support and consultation services.
                  </p>
                  
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <h5 className="text-blue-300 font-medium mb-2">What's Included:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Weekly 1-on-1 support sessions</li>
                      <li>• Priority email support (24-hour response)</li>
                      <li>• Exclusive resources and templates</li>
                      <li>• Custom AI solution development</li>
                      <li>• Business strategy consultation</li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-blue-300 font-medium">Support portal launching soon!</p>
                    <p className="text-sm text-gray-400">You'll be notified when resources are available</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Locked Content */
            <div className="text-center py-8">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Content Locked</h4>
              <p className="text-gray-400 mb-6">
                Purchase this product to unlock exclusive content and resources.
              </p>
              <Link
                href={product.productPageUrl}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Purchase to Unlock
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
            Content Access Portal
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access your purchased content and explore premium AI resources
          </p>
          
          {isAdmin && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-full shadow-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              Admin Access - All Content Unlocked
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {products.map(renderProductCard)}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-700/50">
          <p className="text-gray-400">
            Need help accessing your content? <Link href="/contact" className="text-purple-400 hover:text-purple-300">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 