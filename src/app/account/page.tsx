'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
    download_url: string | null;
  }[];
};

export default function AccountPage() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login?redirect=/account');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              price,
              download_url,
              products (name)
            `)
            .eq('order_id', order.id);

          if (itemsError) throw itemsError;

          return {
            ...order,
            items: (itemsData || []).map((item: any) => ({
              id: item.id,
              product_name: item.products?.name || 'Unknown Product',
              quantity: item.quantity,
              price: item.price,
              download_url: item.download_url,
            })),
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-medium text-gray-900">{user.user_metadata?.first_name || ''} {user.user_metadata?.last_name || ''}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'profile' ? 'bg-gray-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'orders' ? 'bg-gray-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('downloads')}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'downloads' ? 'bg-gray-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Downloads
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'settings' ? 'bg-gray-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First name</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                          {user.user_metadata?.first_name || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last name</label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                          {user.user_metadata?.last_name || 'Not provided'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email address</label>
                      <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                        {user.email}
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => setActiveTab('settings')}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-md overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <div>
                              <span className="text-sm text-gray-500">Order placed</span>
                              <p className="text-sm font-medium">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Order number</span>
                              <p className="text-sm font-medium">{order.id.slice(0, 8)}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Total</span>
                              <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-medium mb-2">Items</h3>
                            <ul className="divide-y divide-gray-200">
                              {order.items.map((item) => (
                                <li key={item.id} className="py-4 flex justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900 mr-4">
                                      ${item.price.toFixed(2)}
                                    </span>
                                    {item.download_url && (
                                      <a
                                        href={item.download_url}
                                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Download
                                      </a>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
                      <div className="mt-6">
                        <Link href="/products" className="btn-primary">
                          Browse Products
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Downloads Tab */}
              {activeTab === 'downloads' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">My Downloads</h2>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    <div>
                      {orders.some(order => order.items.some(item => item.download_url)) ? (
                        <div className="space-y-4">
                          {orders.flatMap(order => 
                            order.items
                              .filter(item => item.download_url)
                              .map(item => (
                                <div key={item.id} className="border border-gray-200 rounded-md p-4 flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                                    <p className="text-xs text-gray-500">Purchased on {new Date(order.created_at).toLocaleDateString()}</p>
                                  </div>
                                  <a
                                    href={item.download_url || '#'}
                                    className="btn-primary text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Download
                                  </a>
                                </div>
                              ))
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No downloads available</h3>
                          <p className="mt-1 text-sm text-gray-500">You don't have any downloadable products yet.</p>
                          <div className="mt-6">
                            <Link href="/products" className="btn-primary">
                              Browse Products
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First name</label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          className="mt-1 input-field"
                          defaultValue={user.user_metadata?.first_name || ''}
                        />
                      </div>
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last name</label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          className="mt-1 input-field"
                          defaultValue={user.user_metadata?.last_name || ''}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 input-field"
                        defaultValue={user.email}
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">To change your email, please contact support.</p>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>

                  <div className="mt-10 pt-10 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                    <form className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">Current password</label>
                        <input
                          type="password"
                          id="current_password"
                          name="current_password"
                          className="mt-1 input-field"
                        />
                      </div>
                      <div>
                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">New password</label>
                        <input
                          type="password"
                          id="new_password"
                          name="new_password"
                          className="mt-1 input-field"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm password</label>
                        <input
                          type="password"
                          id="confirm_password"
                          name="confirm_password"
                          className="mt-1 input-field"
                        />
                      </div>
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}