'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UnifiedCheckoutButton from '@/components/UnifiedCheckoutButton';

export default function AIWebCreationMasterclassPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAccess = async () => {
      console.log('🔐 AI Web Creation: Checking access...');
      
      if (status === 'loading') {
        console.log('⏳ AI Web Creation: Session loading...');
        return;
      }

      if (status === 'unauthenticated') {
        console.log('❌ AI Web Creation: User not authenticated, redirecting to signin');
        router.push('/signin?callbackUrl=/products/ai-web-creation-masterclass');
        return;
      }

      if (!session?.user) {
        console.log('❌ AI Web Creation: No user session found');
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        if (session.user.roles?.includes('admin')) {
          console.log('✅ AI Web Creation: Admin access granted');
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has purchased the product
        const userProducts = session.user.entitlements || [];
        console.log('🔍 AI Web Creation: User entitlements:', userProducts);
        
        // Check for various product IDs that might unlock this content
        const hasProduct = userProducts.includes('4') || 
                          userProducts.includes('ai-business-video-guide-2025') || 
                          userProducts.includes('ai-web-creation-masterclass') ||
                          userProducts.includes('video') ||
                          userProducts.includes('masterclass');

        console.log('🔐 AI Web Creation: Has product access:', hasProduct);
        setHasAccess(hasProduct);
        
      } catch (error) {
        console.error('❌ AI Web Creation: Error checking access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [session, status, router]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-300 mb-6">
            Please sign in to access the AI Web Creation Masterclass.
          </p>
          <button
            onClick={() => router.push('/signin?callbackUrl=/products/ai-web-creation-masterclass')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">📅 Coming Soon - Pre-Order Now!</h1>
          <p className="text-gray-300 mb-6">
            The AI Web Creation Masterclass is coming soon! Pre-order now to secure your spot and get instant access when it's released.
          </p>
          <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 mb-6">
            <p className="text-orange-200 text-sm">
              🎯 Pre-order benefits: Early access, bonus materials, and priority support!
            </p>
          </div>
          <div className="space-y-4">
            <UnifiedCheckoutButton
              product={{
                id: 'ai-business-video-guide-2025',
                name: 'AI Web Creation Masterclass',
                price: 50,
                productType: 'digital',
                isPreOrder: true
              }}
              className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white text-base"
              variant="direct"
            >
              📅 Pre-Order Now – A$50
            </UnifiedCheckoutButton>
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🎯 AI Web Creation Masterclass
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complete step-by-step video guide to creating AI-powered websites from scratch. 
              Build a fully operational online business in 2 hours with no experience required!
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">What You'll Learn:</h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    Complete website creation process from start to finish
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    AI tools and prompts for unlimited customization
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    Full control of backend and frontend code
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    Deploy your website and start making money
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    No experience required - complete beginner friendly
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Watch?</h3>
                  <p className="text-white/90 mb-6">
                    Access your exclusive masterclass content now!
                  </p>
                  <button
                    onClick={() => router.push('/products/ai-web-creation-masterclass/video')}
                    className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    🎥 Watch Masterclass
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">📚 Your Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎥</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Video Masterclass</h3>
                <p className="text-gray-300 text-sm">Complete 2-hour step-by-step guide</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📁</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Source Files</h3>
                <p className="text-gray-300 text-sm">All templates and code examples</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Prompts</h3>
                <p className="text-gray-300 text-sm">Ready-to-use prompts for customization</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/my-account')}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors mr-4"
            >
              ← Back to My Account
            </button>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View More Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}