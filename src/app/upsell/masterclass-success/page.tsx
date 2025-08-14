'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import UnifiedCheckoutButton from '@/components/UnifiedCheckoutButton';
import { CheckCircle, Clock, Star, Zap, Gift } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export default function MasterclassSuccessUpsell() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [showUpsell, setShowUpsell] = useState(true);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowUpsell(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Track upsell page view and redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated') {
      // Track upsell view
      analytics.trackUpsellView(['2', '1'], 25);
      analytics.setUserId(session?.user?.id || '');
    }
  }, [status, router, session]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your exclusive offers...</p>
        </div>
      </div>
    );
  }

  if (!showUpsell || timeLeft <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Masterclass!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your exclusive offers have expired, but you can still access your masterclass content anytime.
          </p>
          <button
            onClick={() => router.push('/my-account')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg"
          >
            Go to My Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🎉 Congratulations! Your Masterclass is Ready!
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              You now have lifetime access to the AI Web Creation Masterclass. But wait...
            </p>
          </div>

          {/* Urgent Timer */}
          <div className="bg-red-600/20 border-2 border-red-500 rounded-2xl p-6 mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-red-400 mr-3" />
              <span className="text-2xl font-bold text-white">LIMITED TIME OFFER</span>
            </div>
            <div className="text-4xl font-black text-red-400 mb-2">
              {formatTime(timeLeft)}
            </div>
            <p className="text-red-300">This exclusive bundle pricing expires soon!</p>
          </div>

          {/* Main Upsell Offer */}
          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 rounded-3xl p-8 mb-8 border-2 border-purple-500/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold">
              🔥 EXCLUSIVE BUNDLE
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Complete Your AI Business Arsenal
              </h2>
              <p className="text-xl text-gray-200 text-center mb-8">
                Since you just invested in learning how to build, why not get the tools to <strong>fill it with profitable content?</strong>
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                
                {/* AI Prompts Arsenal */}
                <div className="bg-gray-800/40 rounded-2xl p-6 border border-green-500/30">
                  <div className="flex items-center mb-4">
                    <Zap className="w-8 h-8 text-green-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">30x AI Prompts Arsenal</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    The exact prompts I use to generate profitable content, marketing copy, and business strategies.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-green-300">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Content generation prompts</span>
                    </div>
                    <div className="flex items-center text-green-300">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Marketing copy templates</span>
                    </div>
                    <div className="flex items-center text-green-300">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Business strategy prompts</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 line-through text-lg">Regular: A$10</div>
                    <div className="text-green-400 text-2xl font-bold">Bundle: A$7</div>
                  </div>
                </div>

                {/* AI Tools Mastery Guide */}
                <div className="bg-gray-800/40 rounded-2xl p-6 border border-blue-500/30">
                  <div className="flex items-center mb-4">
                    <Star className="w-8 h-8 text-blue-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">AI Tools Mastery Guide</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Master 30 essential AI tools to automate and scale your new website business.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-blue-300">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">30 detailed tool tutorials</span>
                    </div>
                    <div className="flex items-center text-blue-300">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Implementation strategies</span>
                    </div>
                    <div className="flex items-center text-blue-300">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Business automation workflows</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 line-through text-lg">Regular: A$25</div>
                    <div className="text-blue-400 text-2xl font-bold">Bundle: A$18</div>
                  </div>
                </div>
              </div>

              {/* Bundle Pricing */}
              <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-2xl p-8 text-center border-2 border-yellow-500/50">
                <div className="flex items-center justify-center mb-4">
                  <Gift className="w-8 h-8 text-yellow-400 mr-3" />
                  <span className="text-2xl font-bold text-white">EXCLUSIVE BUNDLE DEAL</span>
                </div>
                
                <div className="mb-6">
                  <div className="text-gray-400 text-lg mb-2">If purchased separately: <span className="line-through">A$35</span></div>
                  <div className="text-5xl font-black text-green-400 mb-2">A$25</div>
                  <div className="text-yellow-300 font-bold">Save A$10 + Get Instant Access</div>
                </div>

                <div className="space-y-4">
                  <UnifiedCheckoutButton
                    product={{
                      id: 'complete-ai-bundle',
                      name: 'Complete AI Business Bundle',
                      price: 25,
                      productType: 'digital'
                    }}
                    buttonText="🚀 Yes! Add Both Products for A$25"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg"
                    variant="direct"
                  />
                  
                  <div className="text-sm text-gray-400">
                    ⚡ Instant access • 30-day money-back guarantee
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="ml-4 text-gray-300">Join 247+ successful AI entrepreneurs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/40 rounded-xl p-6 text-center border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Just the Prompts</h4>
              <UnifiedCheckoutButton
                product={{
                  id: '2',
                  name: 'AI Prompts Arsenal',
                  price: 10,
                  productType: 'digital'
                }}
                buttonText="Get Prompts - A$10"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                variant="direct"
              />
            </div>
            
            <div className="bg-gray-800/40 rounded-xl p-6 text-center border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Just the Guide</h4>
              <UnifiedCheckoutButton
                product={{
                  id: '1',
                  name: 'AI Tools Mastery Guide',
                  price: 25,
                  productType: 'digital'
                }}
                buttonText="Get Guide - A$25"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                variant="direct"
              />
            </div>
            
            <div className="bg-gray-800/40 rounded-xl p-6 text-center border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">No Thanks</h4>
              <button
                onClick={() => router.push('/my-account')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue to Account
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Instant Access
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                30-Day Guarantee
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 