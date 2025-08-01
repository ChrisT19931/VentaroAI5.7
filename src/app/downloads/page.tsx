'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function DownloadsPage() {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/downloads');
      return;
    }

    // Check if user is admin
    const adminParam = searchParams?.get('admin');
    if (adminParam === 'true' && user?.email === 'chris.t@ventarosales.com') {
      setIsAdmin(true);
      setHasAccess(true);
      setIsLoading(false);
      return;
    }
    
    // For non-admin users, verify purchases
    const fetchUserPurchases = async () => {
      try {
        const response = await fetch(`/api/purchases/confirm?userId=${user.id}`);
        
        if (response.ok) {
          const data = await response.json();
          const userPurchases = data.purchases || [];
          
          // Check if user has any purchases (not checking status since the purchases table doesn't have a status field)
          const hasCompletedPurchase = userPurchases.length > 0;
          
          setHasAccess(hasCompletedPurchase);
        } else {
          console.error('Failed to fetch user purchases');
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error fetching user purchases:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPurchases();
  }, [user, router, searchParams]);

  const handleDownload = async (fileName: string, displayName: string, productId: string) => {
    if (!hasAccess) {
      toast.error('Please log in to download this product.');
      return;
    }

    setDownloadingItems(prev => new Set(prev).add(productId));
    
    try {
      // Create a download link for the PDF
      const link = document.createElement('a');
      link.href = `/downloads/${fileName}`;
      link.download = `${displayName}-Ventaro.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`🔥 ${displayName} download started!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again.');
    } finally {
      setTimeout(() => {
        setDownloadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }, 2000);
    }
  };

  const products = [
    {
      id: '1',
      name: 'AI Tools Mastery Guide 2025',
      description: '30-page comprehensive guide with AI tools and prompts to make money online in 2025.',
      fileName: 'ai-tools-mastery-guide-2025.pdf',
      icon: '📚',
      color: 'from-blue-500 to-purple-600',
      viewUrl: '/downloads/ebook'
    },
    {
      id: '2', 
      name: 'AI Prompts Arsenal 2025',
      description: '30 professional AI prompts to build an online business with AI.',
      fileName: 'ai-prompts-collection.pdf',
      icon: '🔥',
      color: 'from-green-500 to-blue-500',
      viewUrl: '/downloads/prompts'
    },
    {
      id: '3',
      name: 'AI Business Strategy Session',
      description: '60-minute live coaching session to build your online business.',
      fileName: null, // Coaching doesn't have a direct download
      icon: '🎯',
      color: 'from-orange-500 to-red-500',
      viewUrl: '/downloads/coaching'
    }
  ];

  const bonusProducts = [
    {
      id: 'bonus-1',
      name: 'AI Business Accelerator Checklist',
      description: 'Step-by-step checklist to accelerate your AI business growth.',
      fileName: 'ai-business-accelerator-checklist.pdf',
      icon: '✅',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'bonus-2',
      name: 'AI Niche Finder Worksheet',
      description: 'Find your profitable AI niche with this comprehensive worksheet.',
      fileName: 'ai-niche-finder-worksheet.pdf',
      icon: '🎯',
      color: 'from-teal-500 to-green-500'
    },
    {
      id: 'bonus-3',
      name: 'AI Revenue Tracker Template',
      description: 'Track and optimize your AI business revenue with this Excel template.',
      fileName: 'ai-revenue-tracker-template.xlsx',
      icon: '📊',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your downloads...</p>
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
            <h1 className="text-3xl font-bold text-white mb-4">Access Required</h1>
            <p className="text-gray-300 mb-8">
              Please log in or purchase products to access downloads.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/products" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">📥 Your Digital Downloads</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access all your purchased digital products and bonus materials in one place.
          </p>
          {isAdmin && (
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Access - All Products Available
            </div>
          )}
        </div>

        {/* Main Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Main Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const isDownloading = downloadingItems.has(product.id);
              
              return (
                <div
                  key={product.id}
                  id={`product-${product.id}`}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{product.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      href={product.viewUrl}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors block text-center"
                    >
                      📖 View Content
                    </Link>
                    
                    {product.fileName && (
                      <button
                        onClick={() => handleDownload(product.fileName!, product.name, product.id)}
                        disabled={isDownloading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {isDownloading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            📥 Download PDF
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bonus Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">💎 Bonus Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bonusProducts.map((product) => {
              const isDownloading = downloadingItems.has(product.id);
              
              return (
                <div
                  key={product.id}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{product.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(product.fileName, product.name, product.id)}
                    disabled={isDownloading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        📥 Download
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/my-account"
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← Back to Account
            </Link>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Browse More Products
            </Link>
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@ventaroai.com" className="text-blue-400 hover:text-blue-300">
              support@ventaroai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}