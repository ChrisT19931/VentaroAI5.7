'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ProtectedDownload from '@/components/ProtectedDownload';

export default function AccountPage() {
  const { user, isLoading: loading, signOut, isAuthenticated } = useSimpleAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases'); // Default to purchases tab
  const [isAdmin, setIsAdmin] = useState(false);



  const fetchUserOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const supabase = await createClient();
      
      console.log('Fetching orders for user:', user?.id);
      
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

  const checkAdminStatus = async () => {
    try {
      const supabase = await createClient();
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }
      
      setIsAdmin(profile?.user_role === 'admin');
      console.log('Admin status:', profile?.user_role);
      
      // If user is admin, add admin tab
      if (profile?.user_role === 'admin') {
        console.log('User is admin, showing admin tab');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  useEffect(() => {
    console.log('Account page useEffect - Auth state:', { loading, user: user?.id });
    
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    if (user) {
      console.log('User authenticated, fetching orders for:', user.id);
      fetchUserOrders();
      checkAdminStatus();
    }
  }, [user, loading, isAuthenticated, router, fetchUserOrders]);

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

  if (loading || isLoading) {
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
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'downloads' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('downloads')}
          >
            Downloads
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'settings' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          {isAdmin && (
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === 'admin' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Tools
            </button>
          )}
        </div>

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Purchases</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-white mb-2">No purchases yet</h3>
                <p className="text-gray-400 mb-6">You haven't made any purchases yet.</p>
                <Button
                  href="/products"
                  variant="primary"
                  size="lg"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div>
                <div className="bg-blue-900/30 rounded-lg p-4 mb-6 border border-blue-800/50">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-400 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-blue-300 font-medium">Purchase History</h4>
                      <p className="text-blue-200/80 text-sm mt-1">Your purchase history is displayed below. Click on any product to view details.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Order #{order.id.substring(0, 8)}</h3>
                          <p className="text-xs text-gray-400">Purchased on {formatDate(order.created_at)}</p>
                        </div>
                        <div className="bg-green-900/30 px-3 py-1 rounded-full border border-green-800/50">
                          <p className="text-xs text-green-400 font-medium">{order.status}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {order.order_items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors">
                            <div className="flex items-center space-x-4">
                              {item.product?.image_url && (
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                                  <img 
                                    src={item.product.image_url} 
                                    alt={item.product?.name || 'Product'} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-white text-lg">{item.product?.name || 'Product'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded-full border border-blue-800/50">
                                    {item.product?.type || 'Digital'}
                                  </span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-sm text-gray-300 font-medium">${(item.price / 100).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              {item.download_url ? (
                                <Button 
                                  href={`/downloads/${item.product_id}?session_id=${order.id}&token=${Buffer.from(`${order.id}-${order.id}-${item.product_id}`).toString('base64')}`}
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
                                href={`/products/${item.product_id}`}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                View Product
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                        <p className="text-gray-400">Total</p>
                        <p className="font-semibold text-white">${(order.total / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Downloads</h2>
            
            {orders.length === 0 || !orders.some(order => order.order_items.some((item: any) => item.download_url)) ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-white mb-2">No downloads available</h3>
                <p className="text-gray-400 mb-6">You don't have any downloadable products yet.</p>
                <Button
                  href="/products"
                  variant="success"
                  size="lg"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div>
                <div className="bg-blue-900/30 rounded-lg p-4 mb-6 border border-blue-800/50">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-400 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-blue-300 font-medium">Download Information</h4>
                      <p className="text-blue-200/80 text-sm mt-1">Your purchased downloads are available here. You can download them anytime from your account.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {orders
                    .filter(order => order.order_items.some((item: any) => item.download_url))
                    .map((order) => (
                      <div key={order.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Order #{order.id.substring(0, 8)}</h3>
                            <p className="text-xs text-gray-400">Purchased on {formatDate(order.created_at)}</p>
                          </div>
                          <div className="bg-green-900/30 px-3 py-1 rounded-full border border-green-800/50">
                            <p className="text-xs text-green-400 font-medium">{order.status}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {order.order_items
                            .filter((item: any) => item.download_url)
                            .map((item: any) => (
                              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors">
                                <div className="flex items-center space-x-4">
                                  {item.product?.image_url && (
                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                                      <img 
                                        src={item.product.image_url} 
                                        alt={item.product?.name || 'Product'} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-white text-lg">{item.product?.name || 'Product'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded-full border border-blue-800/50">
                                        {item.product?.type || 'Digital'}
                                      </span>
                                      <span className="text-xs text-gray-400">•</span>
                                      <span className="text-xs text-gray-400">Downloads: {item.download_count || 0}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                  <Button 
                                    href={`/downloads/${item.product_id}?session_id=${order.id}&token=${Buffer.from(`${order.id}-${order.id}-${item.product_id}`).toString('base64')}`}
                                    variant="success"
                                    size="sm"
                                  >
                                    Download
                                  </Button>
                                  
                                  <Link 
                                    href={`/products/${item.product_id}`}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                  >
                                    View Product
                                  </Link>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Profile Information</h3>
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
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div>
                      <p className="font-medium text-white">Product Updates</p>
                      <p className="text-sm text-gray-400">Receive notifications about product updates</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="product-updates" 
                        className="absolute w-6 h-6 opacity-0 cursor-pointer" 
                        defaultChecked={true}
                        onChange={() => toast.success('Preference saved!')}
                      />
                      <label 
                        htmlFor="product-updates" 
                        className="block h-6 overflow-hidden rounded-full cursor-pointer bg-gray-700"
                      >
                        <span className="block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-blue-500 translate-x-6"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-900/20 rounded-lg p-6 border border-red-800/30">
                <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                <p className="text-gray-400 mb-4">These actions are irreversible. Please proceed with caution.</p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => toast.error('This feature is not available yet.')}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Admin Tools Tab */}
        {activeTab === 'admin' && isAdmin && (
          <div className="glass-panel rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Tools</h2>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Product Management</h3>
              <p className="text-gray-400 mb-4">Manage your store's products.</p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="success"
                  size="md"
                  href="/admin/products"
                >
                  Manage Products
                </Button>
                
                <Button
                  variant="primary"
                  size="md"
                  href="/admin/products/new"
                >
                  Add New Product
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Management</h3>
              <p className="text-gray-400 mb-4">View and manage customer orders.</p>
              
              <Button
                variant="primary"
                size="md"
                href="/admin/orders"
              >
                View All Orders
              </Button>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
              <p className="text-gray-400 mb-4">Manage user accounts and permissions.</p>
              
              <Button
                variant="primary"
                size="md"
                href="/admin/users"
              >
                Manage Users
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}