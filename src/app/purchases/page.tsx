'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/ui/Spinner';

interface Purchase {
  id: string;
  product_name: string;
  price: number; // Changed from 'amount' to match database schema
  currency: string;
  status: string;
  created_at: string;
  download_url?: string;
}

export default function PurchasesPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthenticated = status === 'authenticated';
  const authLoading = status === 'loading';
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Purchases page useEffect - Auth state:', { authLoading, user: user?.id });
    
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // Fetch purchases if authenticated
    if (isAuthenticated && user) {
      fetchUserPurchases();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const fetchUserPurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user?.id) {
        setError('User not found');
        return;
      }

      // Fetch purchases from API
      const response = await fetch(`/api/purchases/confirm?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch purchases');
      }

      const data = await response.json();
      
      // Transform the data to match our interface
      const transformedPurchases: Purchase[] = data.purchases?.map((purchase: any) => ({
        id: purchase.id,
        product_name: purchase.product_name,
        price: purchase.price, // Updated to match schema
        currency: purchase.currency || 'USD',
        status: 'completed', // Hardcoded since we don't want to reference purchase.status
        created_at: purchase.created_at,
        download_url: `/downloads/${purchase.product_id || purchase.id}`
      })) || [];
      
      setPurchases(transformedPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setError('Failed to load purchases. Please try again.');
      
      // Fallback to mock data for development
      const mockPurchases: Purchase[] = [
        {
          id: '1',
          product_name: 'AI Tools Mastery Guide 2025',
          price: 97, // Updated to match schema
          currency: 'USD',
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          download_url: '/downloads/ai-tools-mastery-guide-2025.pdf'
        },
        {
          id: '2',
          product_name: 'AI Prompts Arsenal 2025',
          price: 47, // Updated to match schema
          currency: 'USD',
          status: 'completed',
          created_at: '2024-01-10T14:20:00Z',
          download_url: '/downloads/ai-prompts-arsenal-2025.pdf'
        }
      ];
      setPurchases(mockPurchases);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            My Purchases
          </h1>
          <p className="text-xl text-gray-300">
            Access your digital products and downloads
          </p>
        </div>

        {/* Back to Account Button */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/my-account')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Account
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-300">Loading your purchases...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300">{error}</p>
            </div>
            <button
              onClick={fetchUserPurchases}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Purchases List */}
        {!isLoading && !error && (
          <div className="space-y-6">
            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No purchases yet</h3>
                <p className="text-gray-400 mb-6">Start exploring our AI-powered digital products</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {purchase.product_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <span>Purchased on {formatDate(purchase.created_at)}</span>
                          <span className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-green-400"></span>
                            Completed
                          </span>
                          <span className="font-semibold text-white">
                            {formatPrice(purchase.price, purchase.currency)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 sm:ml-6">
                        {purchase.download_url ? (
                          <button
                            onClick={() => {
                              // In a real implementation, this would handle secure downloads
                              console.log('Downloading:', purchase.download_url);
                              alert('Download functionality will be implemented with secure file serving.');
                            }}
                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">Processing...</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}