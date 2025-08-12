'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';

export default function OrdersAdmin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Set isAdmin to true for all users to make admin dashboard accessible to everyone
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin?callbackUrl=/admin/orders');
        return;
      }
      
      setUser(session.user);
      fetchOrders();
    };
    
    checkAuth();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (email),
          products:product_id (name, price)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      'completed': { bg: 'bg-green-100', text: 'text-green-800' },
      'processing': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'failed': { bg: 'bg-red-100', text: 'text-red-800' },
      'refunded': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    };
    
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spinner size="lg" color="primary" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Order Management</h1>
            <p className="text-gray-300 mt-2">View and manage customer orders</p>
          </div>
          <Button
            variant="outline"
            size="md"
            href="/admin"
          >
            Back to Dashboard
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="glass-panel rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">No Orders Found</h2>
            <p className="text-gray-400 mb-6">There are no customer orders in the system yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full glass-panel rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 text-sm text-gray-300">{order.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{order.profiles?.email || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{order.products?.name || 'Unknown Product'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      ${(order.products?.price || order.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(order.status || 'processing')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        href={`/admin/orders/${order.id}`}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}