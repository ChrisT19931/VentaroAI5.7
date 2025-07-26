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
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userPurchases, setUserPurchases] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  const sessionId = searchParams.get('session_id');
  const orderToken = searchParams.get('token');
  const orderId = searchParams.get('order_id');
  const guestEmail = searchParams.get('email');

  useEffect(() => {
    const verifyVIPAccess = async () => {
      // If no user and no guest credentials, redirect to login
      if (!user && (!guestEmail || !orderToken)) {
        router.push('/login?redirect=/vip-portal');
        return;
      }

      try {
        // Verify user has made at least one purchase
        const response = await fetch('/api/verify-vip-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            guestEmail: guestEmail,
            orderToken: orderToken,
            sessionId: sessionId,
            orderId: orderId
          })
        });

        const data = await response.json();
        setHasAccess(data.hasAccess);
        setUserPurchases(data.purchases || []);
      } catch (error) {
        console.error('Error verifying VIP access:', error);
        toast.error('Error verifying access. Please try again.');
        setHasAccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyVIPAccess();
  }, [user, router, guestEmail, orderToken, sessionId, orderId]);

  const handleDownload = (fileName: string, displayName: string) => {
    const link = document.createElement('a');
    link.href = `/downloads/${fileName}`;
    link.download = displayName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`📥 ${displayName} download started!`);
  };

  const copyAffiliateLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('🔗 Affiliate link copied to clipboard!');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white glow-text">Verifying VIP access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="glass-card p-8">
            <div className="text-6xl mb-6 animate-pulse">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4 glow-text">VIP Access Required</h1>
            <p className="text-gray-300 mb-6">
              Welcome to the Ventaro Nation VIP Portal! This exclusive area is reserved for our valued customers.
            </p>
            <div className="space-y-4">
              <Link href="/" className="neon-button inline-block">
                Browse Products
              </Link>
              <br />
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                Already a customer? Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 border-b border-purple-500/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl animate-bounce">🎉</div>
                <div>
                  <h2 className="text-2xl font-bold text-white glow-text">Welcome to Ventaro Nation!</h2>
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
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">Ventaro Nation VIP Portal</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Exclusive content, bonuses, and opportunities reserved for our valued community members
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Your Downloads */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📚</span>
                Your Digital Library
              </h2>
              <div className="space-y-4">
                {userPurchases.map((purchase, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{purchase.name}</h3>
                        <p className="text-gray-300 text-sm">Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDownload(purchase.fileName, purchase.name)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        📥 Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusive Bonuses */}
            <div className="glass-card p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🎁</span>
                Exclusive VIP Bonuses
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI Business Accelerator Checklist</h3>
                  <p className="text-gray-300 text-sm mb-4">30-point checklist to launch your AI business in 30 days</p>
                  <button
                    onClick={() => handleDownload('ai-business-accelerator-checklist.pdf', 'AI Business Accelerator Checklist')}
                    className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                  >
                    📥 Download Bonus
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-6">
                  <div className="text-3xl mb-3">💰</div>
                  <h3 className="text-lg font-semibold text-white mb-2">100 High-Converting AI Prompts</h3>
                  <p className="text-gray-300 text-sm mb-4">Bonus collection of proven money-making prompts</p>
                  <button
                    onClick={() => handleDownload('bonus-ai-prompts-collection.pdf', '100 High-Converting AI Prompts')}
                    className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                  >
                    📥 Download Bonus
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI Niche Finder Worksheet</h3>
                  <p className="text-gray-300 text-sm mb-4">Find your profitable AI niche in 7 simple steps</p>
                  <button
                    onClick={() => handleDownload('ai-niche-finder-worksheet.pdf', 'AI Niche Finder Worksheet')}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    📥 Download Bonus
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI Revenue Tracker Template</h3>
                  <p className="text-gray-300 text-sm mb-4">Track and optimize your AI income streams</p>
                  <button
                    onClick={() => handleDownload('ai-revenue-tracker-template.xlsx', 'AI Revenue Tracker Template')}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    📥 Download Bonus
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Affiliate Program */}
            <div className="glass-card p-6">
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
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🌟</span>
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
                    <span className="text-2xl">🎮</span>
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
            <div className="glass-card p-6">
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