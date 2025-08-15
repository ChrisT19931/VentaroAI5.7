'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface PurchasedProduct {
  id: string;
  name: string;
  product_id: string;
  access_url: string;
  description: string;
  type: 'ebook' | 'video' | 'prompts' | 'coaching' | 'support';
}

export default function CheckoutSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [unlockStatus, setUnlockStatus] = useState<string>('pending');
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
    
    // Verify payment and auto-unlock products
    verifyPaymentAndUnlockProducts();
  }, [sessionId, orderId, router, clearCart]);

  const verifyPaymentAndUnlockProducts = async () => {
    try {
      setIsLoading(true);
      setUnlockStatus('verifying');
      
      // Step 1: Verify the Stripe session and get order details
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          session_id: sessionId,
          order_id: orderId 
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Failed to verify payment');
      }

      setOrderDetails(verifyData.order);
      setUnlockStatus('unlocking');

      // Step 2: Force auto-unlock by calling the webhook manually as backup
      try {
        const unlockResponse = await fetch('/api/debug/purchase-unlock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'auto_unlock_from_success',
            session_id: sessionId,
            force_unlock: true
          }),
        });

        if (unlockResponse.ok) {
          setUnlockStatus('unlocked');
          toast.success('🎉 Products unlocked successfully!');
        }
      } catch (unlockError) {
        console.warn('Auto-unlock failed, but payment was verified:', unlockError);
        setUnlockStatus('verified');
      }

      // Step 3: Get user's products after unlock
      await fetchUserProducts();
      
      // Step 4: Sync purchases to ensure they're properly recorded
      await fetch(`/api/purchases/sync?session_id=${sessionId}`);
      
      // Refresh router to update UI with new purchases
      router.refresh();
      
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      setError(error.message || 'Failed to verify payment');
      toast.error('Failed to verify payment. Please contact support.');
      setUnlockStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const response = await fetch('/api/user/products');
      if (response.ok) {
        const data = await response.json();
        const products: PurchasedProduct[] = data.products?.map((product: any) => ({
          id: product.id,
          name: product.name || getProductName(product.product_id),
          product_id: product.product_id,
          access_url: getProductAccessUrl(product.product_id),
          description: getProductDescription(product.product_id),
          type: product.product_id
        })) || [];
        
        setPurchasedProducts(products);
      }
    } catch (error) {
      console.error('Failed to fetch user products:', error);
    }
  };

  const getProductName = (productId: string): string => {
    const names: Record<string, string> = {
      'prompts': 'AI Prompts Arsenal 2025',
      'ebook': 'AI Tools Mastery Guide',
      'video': 'AI Web Creation Masterclass',
      'coaching': 'Personal Coaching Session',
      'support': 'Weekly Support Package'
    };
    return names[productId] || productId;
  };

  const getProductAccessUrl = (productId: string): string => {
    const urls: Record<string, string> = {
      'prompts': '/downloads/prompts',
      'ebook': '/downloads/ebook',
      'video': '/products/ai-web-creation-masterclass/video',
      'coaching': '/downloads/coaching',
      'support': '/products/support-package'
    };
    return urls[productId] || '/my-account';
  };

  const getProductDescription = (productId: string): string => {
    const descriptions: Record<string, string> = {
      'prompts': 'Access your comprehensive collection of AI prompts',
      'ebook': 'Read your step-by-step AI tools mastery guide',
      'video': 'Watch your exclusive web creation masterclass',
      'coaching': 'View your coaching session details and resources',
      'support': 'Access your weekly support package and resources'
    };
    return descriptions[productId] || 'Access your purchased content';
  };

  const getProductIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'prompts': '🎯',
      'ebook': '📚',
      'video': '🎬',
      'coaching': '💬',
      'support': '🛠️'
    };
    return icons[type] || '📦';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">
            {unlockStatus === 'verifying' && 'Verifying your payment...'}
            {unlockStatus === 'unlocking' && 'Unlocking your products...'}
            {unlockStatus === 'pending' && 'Processing your order...'}
          </p>
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
              <h2 className="text-2xl font-bold text-white mb-2">
                {unlockStatus === 'unlocked' && '🎉 Products Unlocked!'}
                {unlockStatus === 'verified' && '✅ Order Complete!'}
                {unlockStatus === 'error' && '⚠️ Manual Unlock Required'}
              </h2>
              <p className="text-green-100">
                {unlockStatus === 'unlocked' && 'All your products have been automatically unlocked and are ready to access.'}
                {unlockStatus === 'verified' && 'Your payment was verified. Access your content below.'}
                {unlockStatus === 'error' && 'Please contact support if you cannot access your products.'}
              </p>
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

          {/* Purchased Products - Direct Access */}
          {purchasedProducts.length > 0 && (
            <div className="glass-panel rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">🚀 Your Products - Ready to Access!</h2>
              <div className="grid gap-6">
                {purchasedProducts.map((product) => (
                  <div key={product.id} className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{getProductIcon(product.type)}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{product.name}</h3>
                          <p className="text-gray-300">{product.description}</p>
                        </div>
                      </div>
                      <Link 
                        href={product.access_url}
                        className="btn-primary px-6 py-3 flex items-center space-x-2"
                      >
                        <span>Access Now</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Access Your Content */}
          <div className="glass-panel rounded-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">📚 Manage All Your Content</h2>
              <p className="text-gray-300 mb-6">View and manage all your purchased products in your account dashboard.</p>
              <Link 
                href="/my-account"
                className="btn-primary text-xl px-12 py-4 inline-flex items-center space-x-3"
              >
                <span>📖</span>
                <span>My Account</span>
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