'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UnifiedCheckoutButton } from '@/components/UnifiedCheckoutButton';

export default function AIWebCreationMasterclassPage() {
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/signin');
          return;
        }

        setUser(user);

        // Check if user has purchased this product
        const { data: purchases, error } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', 'ai-web-creation-masterclass')
          .eq('status', 'completed');

        if (error) {
          console.error('Error checking purchases:', error);
          setHasAccess(false);
        } else {
          setHasAccess(purchases && purchases.length > 0);
        }
      } catch (error) {
        console.error('Error:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">
            You need to purchase the AI Web Creation Masterclass to access this content.
          </p>
          <div className="space-y-4">
            <div>
              {/* Direct checkout for AI Web Creation Masterclass */}
              {/* Using product id that maps to video (4) via LEGACY_PRODUCT_MAPPINGS */}
              <UnifiedCheckoutButton
                product={{
                  id: 'ai-web-creation-masterclass',
                  name: 'AI Web Creation Masterclass',
                  price: 50,
                  productType: 'digital'
                }}
                className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-base"
                variant="direct"
              >
                Buy Now – A$50
              </UnifiedCheckoutButton>
            </div>
            <button
              onClick={() => router.push('/products')}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
            >
              View All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Web Creation Masterclass
          </h1>
          <p className="text-xl text-gray-300">
            Master the art of AI-powered web development
          </p>
        </div>

        {/* Video Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Course Video</h2>
            
            {/* Video Placeholder */}
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Video Coming Soon</h3>
                <p className="text-gray-400">
                  The masterclass video will be available here shortly.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                Duration: Approximately 2 hours of comprehensive training
              </p>
              <div className="inline-flex items-center bg-green-600/20 text-green-400 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Access Granted
              </div>
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Tools Integration</h3>
                    <p className="text-gray-300">Learn to integrate powerful AI tools into your web development workflow.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Automated Code Generation</h3>
                    <p className="text-gray-300">Master AI-powered code generation techniques and best practices.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Design Optimization</h3>
                    <p className="text-gray-300">Use AI to optimize user experience and design decisions.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Deployment Strategies</h3>
                    <p className="text-gray-300">Learn AI-assisted deployment and maintenance strategies.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/my-account')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to My Account
          </button>
        </div>
      </div>
    </div>
  );
}