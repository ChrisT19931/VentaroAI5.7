'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import PurchaseForm from '@/components/PurchaseForm';
import { Buffer } from 'buffer';

export default function MyAccountPage() {
  const { user, signOut, isAuthenticated, isLoading: authLoading } = useSimpleAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases'); // Default to purchases tab

  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching orders and products for user:', user.id);
      
      const supabase = createClient();
      
      // Fetch all products first
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (productsError && productsError.code !== 'PGRST116') {
        console.error('Error fetching products:', productsError);
      }
      
      // Set products (with fallback to mock data if needed)
      const products = productsData && productsData.length > 0 ? productsData : [
        {
          id: '1',
          name: 'AI Tools Mastery Guide 2025',
          description: '30-page guide with AI tools and AI prompts to make money online in 2025.',
          price: 25.00,
          image_url: '/images/products/ai-tools-mastery-guide.svg',
          category: 'courses',
          is_active: true,
          featured: true
        },
        {
          id: '2',
          name: 'AI Prompts Arsenal 2025',
          description: '30 professional AI prompts to make money online in 2025.',
          price: 10.00,
          image_url: '/images/products/ai-prompts-arsenal.svg',
          category: 'tools',
          is_active: true,
          featured: false
        },
        {
          id: '3',
          name: 'AI Business Strategy Session 2025',
          description: '60-minute live coaching session to build your online business.',
          price: 500.00,
          image_url: '/images/products/ai-business-strategy-session.svg',
          category: 'services',
          is_active: true,
          featured: false
        }
      ];
      
      setAllProducts(products);
      
      // Fetch orders with their items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total,
          status,
          order_items(id, product_id, quantity, price, download_url, download_count)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        
        // If the orders table doesn't exist, gracefully handle it
        if (ordersError.code === '42P01') {
          console.log('⚠️ Orders table not found, user has no orders yet');
          setOrders([]);
          return;
        }
        
        // For other errors, show a more user-friendly message
        console.log('⚠️ Database connection issue, showing empty orders');
        setOrders([]);
        return;
      }
      
      console.log('Orders data:', ordersData?.length || 0, 'orders found');
      
      // Fetch product details for each order item
      if (ordersData && ordersData.length > 0) {
        console.log('Processing orders with product details');
        const ordersWithProducts = await Promise.all(
          ordersData.map(async (order) => {
            const orderItems = order.order_items;
            
            if (orderItems && orderItems.length > 0) {
              console.log(`Processing ${orderItems.length} items for order ${order.id}`);
              const itemsWithProductDetails = await Promise.all(
                orderItems.map(async (item: any) => {
                  try {
                    const { data: productData, error: productError } = await supabase
                      .from('products')
                      .select('name, image_url, type')
                      .eq('id', item.product_id)
                      .single();
                    
                    if (productError) {
                      console.error(`Error fetching product ${item.product_id}:`, productError);
                      return {
                        ...item,
                        product: { name: 'Product unavailable', image_url: null, type: null }
                      };
                    }
                    
                    return {
                      ...item,
                      product: productData
                    };
                  } catch (err) {
                    console.error(`Error processing item ${item.id}:`, err);
                    return {
                      ...item,
                      product: { name: 'Product unavailable', image_url: null, type: null }
                    };
                  }
                })
              );
              
              return {
                ...order,
                order_items: itemsWithProductDetails
              };
            }
            
            return order;
          })
        );
        
        console.log('Setting orders with product details');
        setOrders(ordersWithProducts);
      } else {
        console.log('No orders found, setting empty array');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Gracefully handle any unexpected errors
      console.log('⚠️ Unexpected error, showing empty orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    console.log('My Account page useEffect - Auth state:', { authLoading, user: user?.id });
    
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    if (user) {
      console.log('User authenticated, fetching orders for:', user.id);
      fetchUserOrders();
    }
  }, [user, isAuthenticated, authLoading, router, fetchUserOrders]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      toast.success('You have been signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to check if user owns a product
  const isProductOwned = (productId: string) => {
    return orders.some(order => 
      order.order_items?.some((item: any) => item.product_id === productId)
    );
  };

  // Get purchase details for a product
  const getPurchaseDetails = (productId: string) => {
    for (const order of orders) {
      const item = order.order_items?.find((item: any) => item.product_id === productId);
      if (item) {
        return {
          orderId: order.id,
          purchaseDate: order.created_at,
          downloadUrl: item.download_url,
          price: item.price
        };
      }
    }
    return null;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Spinner size="lg" color="primary" text="Loading your account information..." />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-white">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <Button
              onClick={handleSignOut}
              variant="danger"
              size="md"
            >
              Sign Out
            </Button>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
            <p className="text-gray-300"><span className="text-gray-400">Email:</span> {user?.email}</p>
            <p className="text-gray-300 mt-2"><span className="text-gray-400">Member since:</span> {user?.created_at ? formatDate(user.created_at) : 'N/A'}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'purchases' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('purchases')}
          >
            My Purchases
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'profile' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Product Library</h2>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => router.push('/purchases')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Order History</h3>
                    <p className="text-blue-100">View detailed purchase history and receipts</p>
                  </div>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/products')}
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-6 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Browse Products</h3>
                    <p className="text-gray-300">Discover new AI-powered digital products</p>
                  </div>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-300 font-semibold">{allProducts.filter(product => isProductOwned(product.id)).length}</p>
                    <p className="text-green-200/80 text-sm">Owned Products</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-orange-300 font-semibold">{allProducts.filter(product => !isProductOwned(product.id)).length}</p>
                    <p className="text-orange-200/80 text-sm">Locked Products</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-300 font-semibold">{allProducts.length}</p>
                    <p className="text-blue-200/80 text-sm">Total Products</p>
                  </div>
                </div>
              </div>
            </div>

            {/* All Products with Lock/Unlock Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">All Products</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Owned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Locked</span>
                  </div>
                </div>
              </div>
              
              {allProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No products available</h3>
                  <p className="text-gray-400 mb-6">Products will appear here once they're added to the store.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {allProducts.map((product) => {
                    const owned = isProductOwned(product.id);
                    const purchaseDetails = getPurchaseDetails(product.id);
                    
                    return (
                      <div key={product.id} className={`relative rounded-lg p-6 border transition-all duration-200 ${
                        owned 
                          ? 'bg-green-900/10 border-green-800/50 hover:bg-green-900/20' 
                          : 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50'
                      }`}>
                        {/* Lock/Unlock Indicator */}
                        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
                          owned ? 'bg-green-600' : 'bg-orange-600'
                        }`}>
                          {owned ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex items-start gap-4 pr-12">
                          {/* Product Image */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className={`w-full h-full object-cover transition-all duration-200 ${
                                  owned ? 'opacity-100' : 'opacity-50 grayscale'
                                }`}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className={`text-lg font-semibold ${
                                owned ? 'text-white' : 'text-gray-300'
                              }`}>
                                {product.name}
                              </h4>
                            </div>
                            
                            <p className={`text-sm mb-3 line-clamp-2 ${
                              owned ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              {product.description}
                            </p>
                            
                            <div className="flex items-center gap-4 mb-4">
                              <span className={`text-lg font-bold ${
                                owned ? 'text-green-400' : 'text-gray-400'
                              }`}>
                                ${product.price?.toFixed(2) || '0.00'}
                              </span>
                              
                              {product.category && (
                                <span className={`text-xs px-2 py-1 rounded-full border ${
                                  owned 
                                    ? 'bg-blue-900/50 text-blue-400 border-blue-800/50' 
                                    : 'bg-gray-700 text-gray-400 border-gray-600'
                                }`}>
                                  {product.category}
                                </span>
                              )}
                              
                              {owned && purchaseDetails && (
                                <span className="text-xs text-green-400">
                                  Purchased {formatDate(purchaseDetails.purchaseDate)}
                                </span>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                              {owned ? (
                                <>
                                  {purchaseDetails?.downloadUrl ? (
                                    <Button 
                                      href={`/downloads/${product.id}?session_id=${purchaseDetails.orderId}&token=${Buffer.from(`${purchaseDetails.orderId}-${purchaseDetails.orderId}-${product.id}`).toString('base64')}`}
                                      variant="success"
                                      size="sm"
                                    >
                                      Download
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      disabled
                                      className="bg-gray-700 text-gray-300"
                                    >
                                      No Download
                                    </Button>
                                  )}
                                  
                                  <Link 
                                    href={`/products/${product.id}`}
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                  >
                                    View Details
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <Button
                                    href={`/products/${product.id}`}
                                    variant="primary"
                                    size="sm"
                                  >
                                    Purchase
                                  </Button>
                                  
                                  <Link 
                                    href={`/products/${product.id}`}
                                    className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                                  >
                                    View Details
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Purchase Form for Testing */}
            <div className="border-t border-gray-700 pt-8 mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Test Purchase Flow</h3>
              <PurchaseForm />
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  <div className="bg-blue-900/30 px-3 py-1 rounded-full border border-blue-800/50">
                    <p className="text-xs text-blue-400 font-medium">Active</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-900/70 rounded-md p-3 border border-gray-700 w-full">
                        <p className="text-white">{user?.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('This feature is coming soon!')}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-900/70 rounded-md p-3 border border-gray-700 w-full">
                        <p className="text-white">••••••••••••</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Password reset feature coming soon!')}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div>
                      <p className="font-medium text-white">Order Updates</p>
                      <p className="text-sm text-gray-400">Receive notifications about your orders</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="order-updates" 
                        className="absolute w-6 h-6 opacity-0 cursor-pointer" 
                        defaultChecked={true}
                        onChange={() => toast.success('Preference saved!')}
                      />
                      <label 
                        htmlFor="order-updates" 
                        className="block h-6 overflow-hidden rounded-full cursor-pointer bg-gray-700"
                      >
                        <span className="block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-blue-500 translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}