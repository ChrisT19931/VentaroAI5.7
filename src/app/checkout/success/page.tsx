'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

export default function CheckoutSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!sessionId || !orderId) {
      setError('Invalid checkout session');
      setIsLoading(false);
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    // Clear the cart after successful checkout
    clearCart();
    
    // Fetch order details
    fetchOrderDetails();
  }, [sessionId, orderId, user, router, clearCart]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);

      // Update order status to completed
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId)
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      // Fetch order with items
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single();

      if (orderError) throw orderError;

      // Fetch order items with product details
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          download_url,
          products (id, name, image_url, file_url)
        `)
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Generate download URLs for digital products
      const itemsWithDownloadUrls = await Promise.all(
        (orderItems || []).map(async (item: any) => {
          // If download URL already exists, use it
          if (item.download_url) {
            return item;
          }

          // Generate a download URL for the product file
          if (item.products?.file_url) {
            // Create a signed URL that expires in 7 days (604800 seconds)
            const fileUrl = item.products.file_url;
            const fileName = fileUrl.split('/').pop() || 'product-file';
            
            // Update the order item with the download URL
            const { error: updateItemError } = await supabase
              .from('order_items')
              .update({ 
                download_url: item.products.file_url 
              })
              .eq('id', item.id);

            if (updateItemError) {
              console.error('Error updating download URL:', updateItemError);
            }

            return {
              ...item,
              download_url: item.products.file_url
            };
          }

          return item;
        })
      );

      setOrderDetails({
        ...order,
        items: itemsWithDownloadUrls
      });
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
              <p className="mt-2 text-gray-600">{error}</p>
              <div className="mt-6">
                <Link href="/" className="btn-primary">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Thank you for your purchase!</h1>
              <p className="mt-2 text-lg text-gray-600">Your order has been successfully processed.</p>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Order number</span>
                  <p className="text-sm font-medium">{orderDetails?.id.slice(0, 8)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Date</span>
                  <p className="text-sm font-medium">
                    {orderDetails?.created_at && new Date(orderDetails.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total</span>
                  <p className="text-sm font-medium">${orderDetails?.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">Items</h3>
                <ul className="divide-y divide-gray-200">
                  {orderDetails?.items.map((item: any) => (
                    <li key={item.id} className="py-4 flex justify-between">
                      <div className="flex items-center">
                        {item.products?.image_url && (
                          <img 
                            src={item.products.image_url} 
                            alt={item.products.name} 
                            className="h-16 w-16 object-cover rounded-md mr-4"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.products?.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.download_url && (
                          <a
                            href={item.download_url}
                            className="text-primary-600 hover:text-primary-500 text-sm font-medium mt-2"
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

            <div className="mt-8 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Your Purchase Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your digital products (E-book and AI Prompts) are available for immediate download using the links above. For coaching calls, you&apos;ll receive an email with scheduling instructions within 24 hours.
                      </p>
                      <p className="mt-2">
                        All purchase information and download links are also accessible from your account page at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Link href="/products" className="btn-outline">
                  Continue Shopping
                </Link>
                <Link href="/account" className="btn-primary">
                  View My Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}