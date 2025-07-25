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
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const isGuest = searchParams.get('guest') === 'true';

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
            <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-300">Thank you for your purchase. Your digital products are ready for download.</p>
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

          {/* Download Links */}
          {downloadLinks && downloadLinks.length > 0 && (
            <div className="glass-panel rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Downloads</h2>
              
              <div className="space-y-4">
                {downloadLinks.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-6 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex items-center space-x-4">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                          <h3 className="text-white font-semibold text-lg">{item.name || 'Digital Product'}</h3>
                          <p className="text-gray-400">Quantity: {item.quantity}</p>
                          <p className="text-green-400 font-semibold">A${item.price?.toFixed(2)} AUD</p>
                        </div>
                    </div>
                    
                    {item.download_url && (
                      <a
                        href={item.download_url}
                        className="btn-primary flex items-center space-x-2 px-6 py-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download Now</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-200 text-sm font-semibold mb-1">Important Information:</p>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• Your download links are secure and will remain active</li>
                      <li>• Save these links for future access to your purchases</li>
                      <li>• If you have any issues, please contact our support team</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary px-8 py-3">
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