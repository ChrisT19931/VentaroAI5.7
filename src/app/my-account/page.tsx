'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth, useDebugAuthState, debugAuthStateGlobal } from '@/contexts/SimpleAuthContext';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { checkProductOwnershipWithLogging } from '@/utils/productOwnership';
import { Product, Purchase } from '@/types/product';

export default function MyAccountPage() {
  const { user, signOut, isAuthenticated, isLoading: authLoading, stableAuthState } = useSimpleAuth();
  const router = useRouter();
  const [ownedProducts, setOwnedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const debugAuth = useDebugAuthState();

  // Define callback functions before they are used in useEffect
  const checkAdminStatus = useCallback(async () => {
    console.log('checkAdminStatus called');
    
    try {
      // Only set admin status for chris.t@ventarosales.com
      if (user?.email === 'chris.t@ventarosales.com') {
        console.log('Setting admin status for admin user');
        setIsAdmin(true);
      } else {
        console.log('User is not admin');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  }, [user?.email]);

  const fetchOwnedProducts = useCallback(async (forceRefresh = false) => {
    console.log('fetchOwnedProducts called', { forceRefresh, timestamp: new Date().toISOString() });
    
    try {
      setIsLoading(true);
      console.log('Fetching products for user');
      
      // Define all available products
      const allProducts = [
        {
          id: '1',
          name: 'AI Tools Mastery Guide 2025',
          description: '30-page guide with AI tools and AI prompts to make money online in 2025.',
          image_url: '/images/products/ai-tools-mastery-guide.svg',
          viewUrl: '/downloads/ebook',
          owned: false // Default to not owned
        },
        {
          id: '2', 
          name: 'AI Prompts Arsenal 2025',
          description: '30 professional AI prompts to make money online in 2025.',
          image_url: '/images/products/ai-prompts-arsenal.svg',
          viewUrl: '/downloads/prompts',
          owned: false // Default to not owned
        },
        {
          id: '3',
          name: 'AI Business Strategy Session 2025', 
          description: '60-minute live coaching session to build your online business.',
          image_url: '/images/products/ai-business-strategy-session.svg',
          viewUrl: '/downloads/coaching',
          owned: false // Default to not owned
        }
      ];
      
      // If user is admin (chris.t@ventarosales.com), set all products as owned
      if (isAdmin && user?.email === 'chris.t@ventarosales.com') {
        console.log('Admin user, showing all products as owned');
        setOwnedProducts(allProducts.map(product => ({ ...product, owned: true })));
        return;
      }
      
      // For non-admin users, fetch their purchases to determine which products they own
      if (user?.id || user?.email) {
        try {
          // Build query parameters - include both userId and email for better purchase matching
          const params = new URLSearchParams();
          if (user.id) params.append('userId', user.id);
          if (user.email) params.append('email', user.email);
          
          const response = await fetch(`/api/purchases/confirm?${params.toString()}`);
          
          if (response.ok) {
            const data = await response.json();
            const userPurchases = data.purchases || [];
            
            console.log('User purchases found:', userPurchases);
            
            // Mark products as owned based on user's purchases using the new utility function
            const productsWithOwnership = allProducts.map(product => {
              const isOwned = userPurchases.some((purchase: Purchase) => {
                const owns = checkProductOwnershipWithLogging(purchase, product.id, true);
                return owns;
              });
              
              return { ...product, owned: isOwned };
            });
            
            console.log('Setting products with ownership status', productsWithOwnership);
            setOwnedProducts(productsWithOwnership);
            setLastRefresh(new Date());
          } else {
            console.error('Failed to fetch user purchases');
            setOwnedProducts(allProducts); // Fallback to all products not owned
          }
        } catch (error) {
          console.error('Error fetching user purchases:', error);
          setOwnedProducts(allProducts); // Fallback to all products not owned
        }
      } else {
        setOwnedProducts(allProducts); // Fallback to all products not owned
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setOwnedProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, user?.id, user?.email]);

  useEffect(() => {
    console.log('Auth state changed:', { authLoading, isAuthenticated, user: user?.email, stableAuthState });
    debugAuth(); // Use hook-based debug helper
    debugAuthStateGlobal(); // Use global debug helper
    
    // Only redirect if we're sure the user is not authenticated after loading completes
    if (!authLoading && stableAuthState && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // Only proceed with data fetching if we have a user object and stable auth state
    if (!authLoading && stableAuthState && isAuthenticated && user) {
      console.log('User authenticated:', user?.email);
      checkAdminStatus().then(() => {
        fetchOwnedProducts();
      });
      
      // Set up auto-refresh every 30 seconds to check for new purchases
      const refreshInterval = setInterval(() => {
        console.log('Auto-refreshing product access...');
        fetchOwnedProducts(true);
      }, 30000);
      
      return () => clearInterval(refreshInterval);
    } else if (!authLoading && stableAuthState && isAuthenticated && !user) {
      console.log('User object is null but isAuthenticated is true - possible auth state mismatch');
      // Wait a moment and try again if we have this inconsistent state
      const timer = setTimeout(() => {
        if (isAuthenticated && !user) {
          console.log('Still in inconsistent state, forcing refresh');
          window.location.reload();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, isAuthenticated, authLoading, stableAuthState, router, checkAdminStatus, fetchOwnedProducts]);

  // Functions are now properly defined at the top of the component

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Show loading state while authentication is being determined or while fetching products
  // We need a more stable loading state to prevent flashing
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => {
    // Only set loading to false when we're sure authentication is complete AND products are loaded
    if (!authLoading && stableAuthState && !isLoading) {
      setShowLoading(false);
    }
  }, [authLoading, stableAuthState, isLoading]);
  
  // Always show loading screen until we're 100% sure everything is ready
  if (showLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <Spinner size="lg" color="primary" text="Loading your account..." />
      </div>
    );
  }

  // Only show redirect message if we're sure the user is not authenticated
  if (!authLoading && (!isAuthenticated || !user)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <p className="text-white">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-panel rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
              <p className="text-gray-300">{user?.email || 'No email available'}</p>
              <p className="text-gray-400 text-sm mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
              {isAdmin && (
                <div className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Access
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => fetchOwnedProducts(true)}
                variant="outline" 
                size="md"
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                disabled={isLoading}
              >
                {isLoading ? '🔄' : '🔄'} Refresh
              </Button>
              <Button onClick={handleSignOut} variant="danger" size="md">
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="glass-panel rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">My Products</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <Spinner size="md" color="primary" text="Loading your products..." />
            </div>
          ) : ownedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Products Available</h3>
              <p className="text-gray-400 mb-6">There are no products available at this time.</p>
              <Button href="/products" variant="primary" size="md">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {ownedProducts.map((product) => (
                <div key={product.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:bg-gray-800/70 transition-all">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                      <p className="text-gray-300 mb-4">{product.description}</p>
                      
                      <div className="flex items-center gap-3">
                        {product.owned || isAdmin ? (
                          <>
                            <Button 
                              href={`${product.viewUrl}${isAdmin ? '?admin=true' : ''}`}
                              variant="primary" 
                              size="md"
                              className="w-full"
                            >
                              📖 View Content
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              href={`/products/${product.id}`}
                              variant="primary" 
                              size="md"
                            >
                              🛒 Purchase
                            </Button>
                            
                            <Button 
                              href={`/products/${product.id}`}
                              variant="outline" 
                              size="md"
                            >
                              👁️ View Details
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {isAdmin ? (
                        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Admin
                        </div>
                      ) : product.owned ? (
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Owned
                        </div>
                      ) : (
                        <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Locked
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}