'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Play, Download, BookOpen, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AIWebCreationMasterclassContent() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/signin?callbackUrl=/content/ai-web-creation-masterclass');
        return;
      }

      if (!session?.user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        if (session.user.roles?.includes('admin')) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has purchased the product
        const userProducts = session.user.entitlements || [];
        const hasProduct = userProducts.includes('4') || 
                          userProducts.includes('ai-business-video-guide-2025') || 
                          userProducts.includes('ai-web-creation-masterclass') ||
                          userProducts.includes('video') ||
                          userProducts.includes('masterclass');

        setHasAccess(hasProduct);
        
      } catch (error) {
        console.error('Error checking access:', error);
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
          <p className="text-white text-lg">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto text-center">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">🔒 Access Restricted</h1>
          <p className="text-gray-300 mb-6">
            You need to purchase the AI Web Creation Masterclass to access this content.
          </p>
          <div className="space-y-4">
            <Link
              href="/products"
              className="w-full block text-center py-3 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-base"
            >
              Purchase Access - A$50
            </Link>
            <Link
              href="/my-account"
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full block text-center"
            >
              Back to My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🎯 AI Web Creation Masterclass
            </h1>
            <p className="text-xl text-gray-300">
              Complete step-by-step guide to building AI-powered websites
            </p>
          </div>

          {/* Main Video Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Play className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">Masterclass Video</h3>
                <p className="text-gray-400 mb-4">
                  2+ hours of comprehensive AI web development training
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  ▶️ Start Watching
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📚 Course Modules</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    Module 1: AI Tools Setup & Configuration
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    Module 2: Frontend Development with AI
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    Module 3: Backend Integration & APIs
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    Module 4: Database Setup & Management
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    Module 5: Deployment & Going Live
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    Module 6: Monetization Strategies
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">⚡ Key Features</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3">•</span>
                    No coding experience required
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3">•</span>
                    Build a complete website in 2 hours
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3">•</span>
                    Full source code included
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3">•</span>
                    AI prompts for customization
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3">•</span>
                    Lifetime access to updates
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3">•</span>
                    Community support access
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <Download className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Source Code</h3>
              <p className="text-gray-300 mb-4">Complete project files and templates</p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Download Files
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">AI Prompts</h3>
              <p className="text-gray-300 mb-4">Ready-to-use prompts for customization</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                View Prompts
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <Play className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Bonus Content</h3>
              <p className="text-gray-300 mb-4">Extra tutorials and case studies</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Watch Bonus
              </button>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">📊 Your Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Course Completion</span>
                <span className="text-green-400 font-semibold">0% Complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-sm text-gray-400">
                Start watching to track your progress automatically
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <Link
              href="/my-account"
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors mr-4"
            >
              ← Back to My Account
            </Link>
            <Link
              href="/content"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View All Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 