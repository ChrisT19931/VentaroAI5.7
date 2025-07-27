'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function MyAccountPage() {
  const { user, signOut, isAuthenticated, isLoading: authLoading } = useSimpleAuth();
  const router = useRouter();
  const [ownedProducts, setOwnedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      checkAdminStatus();
      fetchOwnedProducts();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const checkAdminStatus = () => {
    const isAdminUser = user?.email === 'chris.t@ventarosales.com';
    setIsAdmin(isAdminUser);
  };

  const fetchOwnedProducts = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createClient();
      
      // Get all products
      const allProducts = [
        {
          id: '1',
          name: 'AI Tools Mastery Guide 2025',
          description: '30-page guide with AI tools and AI prompts to make money online in 2025.',
          image_url: '/images/products/ai-tools-mastery-guide.svg',
          viewUrl: '/downloads/ebook'
        },
        {
          id: '2', 
          name: 'AI Prompts Arsenal 2025',
          description: '30 professional AI prompts to make money online in 2025.',
          image_url: '/images/products/ai-prompts-arsenal.svg',
          viewUrl: '/downloads/prompts'
        },
        {
          id: '3',
          name: 'AI Business Strategy Session 2025', 
          description: '60-minute live coaching session to build your online business.',
          image_url: '/images/products/ai-business-strategy-session.svg',
          viewUrl: '/downloads/coaching'
        }
      ];

      if (isAdmin) {
        // Admin sees all products
        setOwnedProducts(allProducts);
      } else {
        // Check which products user owns
        const { data: orders } = await supabase
          .from('orders')
          .select(`
            order_items(product_id)
          `)
          .eq('user_id', user.id);

        const ownedProductIds = new Set();
        orders?.forEach(order => {
          order.order_items?.forEach((item: any) => {
            ownedProductIds.add(item.product_id);
          });
        });

        const owned = allProducts.filter(product => ownedProductIds.has(product.id));
        setOwnedProducts(owned);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setOwnedProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <Spinner size="lg" color="primary" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
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
              <p className="text-gray-300">{user.email}</p>
              {isAdmin && (
                <div className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Access
                </div>
              )}
            </div>
            <Button onClick={handleSignOut} variant="danger" size="md">
              Sign Out
            </Button>
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
              <h3 className="text-xl font-semibold text-white mb-2">No Products Yet</h3>
              <p className="text-gray-400 mb-6">You haven't purchased any products yet.</p>
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
                        <Button 
                          href={`${product.viewUrl}${isAdmin ? '?admin=true' : ''}`}
                          variant="primary" 
                          size="md"
                        >
                          📖 View Content
                        </Button>
                        
                        <Button 
                          href={`/downloads?product=${product.id}${isAdmin ? '&admin=true' : ''}`}
                          variant="outline" 
                          size="md"
                        >
                          📥 Download
                        </Button>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isAdmin ? 'Admin' : 'Owned'}
                      </div>
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