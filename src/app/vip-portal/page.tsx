'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'react-hot-toast';

export default function VIPPortal() {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/vip-portal');
      return;
    }

    // Simple access check - admin or authenticated user
    const adminParam = searchParams?.get('admin');
    if (adminParam === 'true' && user?.email === 'chris.t@ventarosales.com') {
      setIsAdmin(true);
      setHasAccess(true);
    } else if (user) {
      setHasAccess(true); // Simplified - assume access if logged in
    }
    
    setIsLoading(false);
  }, [user, router, searchParams]);

  const handleDownload = (fileName: string, displayName: string) => {
    if (!hasAccess) {
      toast.error('Please log in to download this product.');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = `/downloads/${fileName}`;
      link.download = displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`📥 ${displayName} download started!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again.');
    }
  };

  const copyAffiliateLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('🔗 Affiliate link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading VIP portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4">VIP Access Required</h1>
            <p className="text-gray-300 mb-8">
              Welcome to the Ventaro Nation VIP Portal! This exclusive area is reserved for our valued customers.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/products" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse Products
              </Link>
              <Link 
                href="/login" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const products = [
    {
      id: '1',
      name: 'AI Tools Mastery Guide 2025',
      description: '30-page comprehensive guide with AI tools and prompts to make money online in 2025.',
      fileName: 'ai-tools-mastery-guide-2025.pdf',
      purchaseDate: '2024-01-15',
      viewUrl: '/downloads/ebook'
    },
    {
      id: '2',
      name: 'AI Prompts Arsenal 2025',
      description: '30 professional AI prompts to build an online business with AI.',
      fileName: 'ai-prompts-collection.pdf',
      purchaseDate: '2024-01-15',
      viewUrl: '/downloads/prompts'
    },
    {
      id: '3',
      name: 'AI Business Strategy Session',
      description: '60-minute live coaching session to build your online business.',
      fileName: null,
      purchaseDate: '2024-01-15',
      viewUrl: '/downloads/coaching'
    }
  ];

  const bonusProducts = [
    {
      name: 'AI Business Accelerator Checklist',
      description: '30-point checklist to launch your AI business in 30 days',
      fileName: 'ai-business-accelerator-checklist.pdf',
      icon: '🔥',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: '100 High-Converting AI Prompts',
      description: 'Bonus collection of proven money-making prompts',
      fileName: 'bonus-ai-prompts-collection.pdf',
      icon: '💰',
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'AI Niche Finder Worksheet',
      description: 'Find your profitable AI niche in 7 simple steps',
      fileName: 'ai-niche-finder-worksheet.pdf',
      icon: '🎯',
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'AI Revenue Tracker Template',
      description: 'Track and optimize your AI income streams',
      fileName: 'ai-revenue-tracker-template.xlsx',
      icon: '📊',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 border-b border-purple-500/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl animate-bounce">🔥</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome to Ventaro Nation!</h2>
                  <p className="text-purple-200">You're now part of an exclusive community of AI entrepreneurs</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="text-purple-200 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">👑</div>
          <h1 className="text-4xl font-bold text-white mb-4">Ventaro Nation VIP Portal</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Exclusive content, bonuses, and opportunities reserved for our valued community members
          </p>
          {isAdmin && (
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Access - All Content Available
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Your Downloads */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📚</span>
                Your Digital Library
              </h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        <p className="text-gray-300 text-sm mb-2">{product.description}</p>
                        <p className="text-gray-400 text-xs">Purchased: {new Date(product.purchaseDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={product.viewUrl}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          📖 View
                        </Link>
                        {product.fileName && (
                          <button
                            onClick={() => handleDownload(product.fileName!, product.name)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            📥 Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusive Bonuses */}
            <div className="bg-gray-900 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">💎</span>
                Exclusive VIP Bonuses
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {bonusProducts.map((product, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
                    <div className="text-3xl mb-3">{product.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                    <button
                      onClick={() => handleDownload(product.fileName, product.name)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full"
                    >
                      📥 Download Bonus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Affiliate Program */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💸</span>
                Earn with Ventaro
              </h3>
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-green-400">50% Commission</div>
                  <p className="text-green-200 text-sm">on every sale you refer</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Share Ventaro products and earn 50% commission on every sale. Perfect for your audience!
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-white text-sm font-semibold block mb-1">Your Affiliate Link:</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value="https://ventaro.ai/ref/your-code" 
                      readOnly 
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                    <button
                      onClick={() => copyAffiliateLink('https://ventaro.ai/ref/your-code')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <Link 
                  href="/affiliate-dashboard" 
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-center py-2 rounded font-semibold transition-all duration-300"
                >
                  View Earnings Dashboard
                </Link>
              </div>
            </div>

            {/* Community Access */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💎</span>
                Join the Community
              </h3>
              <div className="space-y-4">
                <a 
                  href="https://t.me/ventaronation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <div className="font-semibold">Telegram VIP Group</div>
                      <div className="text-sm opacity-90">Daily tips & exclusive updates</div>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://discord.gg/ventaronation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <div className="font-semibold">Discord Community</div>
                      <div className="text-sm opacity-90">Live discussions & support</div>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://forum.ventaro.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <div className="font-semibold">Private Forum</div>
                      <div className="text-sm opacity-90">In-depth strategies & case studies</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/products" 
                  className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center py-2 rounded transition-colors"
                >
                  🛍️ Browse More Products
                </Link>
                <Link 
                  href="/my-account" 
                  className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center py-2 rounded transition-colors"
                >
                  👤 My Account
                </Link>
                <Link 
                  href="/downloads" 
                  className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center py-2 rounded transition-colors"
                >
                  📥 All Downloads
                </Link>
                <a 
                  href="mailto:chris.t@ventarosales.com" 
                  className="block w-full bg-gray-800 hover:bg-gray-700 text-white text-center py-2 rounded transition-colors"
                >
                  📧 Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}