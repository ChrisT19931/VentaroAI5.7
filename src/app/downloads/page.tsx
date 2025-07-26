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
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set());
  const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        if (!user) {
          router.push('/login?redirect=/downloads');
          return;
        }

        // Check for URL parameters
        const productParam = searchParams.get('product');
        const adminParam = searchParams.get('admin');
        
        if (productParam) {
          setHighlightedProduct(productParam);
        }

        const response = await fetch('/api/verify-vip-access', {
          credentials: 'include'
        });
        const data = await response.json();
        
        setHasAccess(data.hasAccess || data.isAdmin || adminParam === 'true');
        setIsAdmin(data.isAdmin || adminParam === 'true');
        setPurchases(data.purchases || []);
        
        if (!data.hasAccess && !data.isAdmin && adminParam !== 'true') {
          toast.error('You need to purchase products to access downloads.');
        }
      } catch (error) {
        console.error('Error verifying access:', error);
        toast.error('Error verifying access. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [user, router, searchParams]);

  // Scroll to highlighted product
  useEffect(() => {
    if (highlightedProduct && !isLoading) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`product-${highlightedProduct}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Flash effect
          element.style.transform = 'scale(1.02)';
          setTimeout(() => {
            element.style.transform = 'scale(1)';
          }, 300);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [highlightedProduct, isLoading]);

  const handleDownload = async (fileName: string, displayName: string, productId: string) => {
    if (!hasAccess && !isAdmin) {
      toast.error('You need to purchase this product first!');
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
      
      toast.success(`🎉 ${displayName} download started!`);
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
      description: '30 professional AI prompts to make money online in 2025.',
      fileName: 'ai-prompts-collection.pdf',
      icon: '🚀',
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
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your downloads...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const hasProduct = (productId: string) => {
    return isAdmin || purchases.some(p => p.id === productId || p.id === parseInt(productId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
              const owned = hasProduct(product.id);
              const isDownloading = downloadingItems.has(product.id);
              
              return (
                <div 
                  key={product.id} 
                  id={`product-${product.id}`}
                  className={`glass-card p-6 border-2 transition-all duration-300 ${
                    highlightedProduct === product.id 
                      ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20' 
                      : owned 
                        ? 'border-green-500/50 bg-green-900/10' 
                        : 'border-gray-700 bg-gray-900/20'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${product.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                    {product.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 text-center">{product.name}</h3>
                  <p className="text-gray-300 text-sm mb-4 text-center">{product.description}</p>
                  
                  {owned ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Owned
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          href={product.viewUrl + (isAdmin ? '?admin=true' : '')}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          📖 View Content
                        </Button>
                        
                        {product.fileName && (
                          <button
                            onClick={() => handleDownload(product.fileName!, product.name, product.id)}
                            disabled={isDownloading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                  ) : (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Not Purchased
                      </div>
                      <Button
                        href={`/products/${product.id}`}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Purchase Now
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bonus Materials */}
        {(hasAccess || isAdmin) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">🎁 Bonus Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bonusProducts.map((product) => {
                const isDownloading = downloadingItems.has(product.id);
                
                return (
                  <div key={product.id} className="glass-card p-6 border-2 border-yellow-500/50 bg-yellow-900/10">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${product.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                      {product.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 text-center">{product.name}</h3>
                    <p className="text-gray-300 text-sm mb-4 text-center">{product.description}</p>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 0v1.5M9 21h6" />
                        </svg>
                        Bonus Content
                      </div>
                      
                      <button
                        onClick={() => handleDownload(product.fileName, product.name, product.id)}
                        disabled={isDownloading}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isDownloading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            📥 Download {product.fileName.endsWith('.xlsx') ? 'Excel' : 'PDF'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Button
              href="/my-account"
              variant="outline"
              size="lg"
              className="w-full"
            >
              ← Back to My Account
            </Button>
            
            <Button
              href="/products"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Browse More Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}