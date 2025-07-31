'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

export default function CheckoutSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id') || null;
  const orderId = searchParams?.get('order_id') || null;
  const isGuest = searchParams?.get('guest') === 'true';

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid checkout session');
      setIsLoading(false);
      return;
    }

    // Clear the cart after successful checkout
    clearCart();
    
    // Verify payment and get download links
    verifyPaymentAndGetDownloads();
  }, [sessionId, orderId, router, clearCart]);

  const verifyPaymentAndGetDownloads = async () => {
    try {
      setIsLoading(true);
      
      // Verify the Stripe session and get order details
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          session_id: sessionId,
          order_id: orderId 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify payment');
      }

      setOrderDetails(data.order);
      setDownloadLinks(data.downloadLinks || []);
      
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      setError(error.message || 'Failed to verify payment');
      toast.error('Failed to verify payment. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Verification Failed</h1>
          <p className="text-gray-300 mb-8">{error}</p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary w-full"
            >
              Try Again
            </button>
            <Link href="/contact" className="btn-secondary w-full">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="text-green-400 text-6xl mb-4">✅</div>
            <h1 className="text-4xl font-bold text-white mb-4">Thank You for Your Purchase!</h1>
            <p className="text-xl text-gray-300 mb-4">Congratulations! Your order has been successfully processed.</p>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">🎉 Order Complete!</h2>
              <p className="text-green-100">You can now access your purchased content below.</p>
            </div>
          </div>

          {/* Order Summary */}
          {orderDetails && (
            <div className="glass-panel rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-600 pb-4">
                  <span className="text-gray-300">Order ID:</span>
                  <span className="text-white font-mono">{orderDetails.id}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-600 pb-4">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-white font-bold text-xl">A${orderDetails.total?.toFixed(2) || '0.00'} AUD</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status:</span>
                  <span className="text-green-400 font-semibold">Completed</span>
                </div>
              </div>
            </div>
          )}



          {/* Access Your Content */}
          <div className="glass-panel rounded-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">📚 Access Your Content</h2>
              <p className="text-gray-300 mb-6">View and manage all your purchased products in your account.</p>
              <Link 
                href="/my-account"
                className="btn-primary text-xl px-12 py-4 inline-flex items-center space-x-3"
              >
                <span>📖</span>
                <span>View Content</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-secondary px-8 py-3">
                Continue Shopping
              </Link>
              <Link href="/" className="btn-secondary px-8 py-3">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}