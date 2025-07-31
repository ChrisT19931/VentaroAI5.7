'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  productType?: 'digital' | 'physical';
};

interface BuyNowButtonProps {
  product: Product;
  className?: string;
}

export default function BuyNowButton({ product, className = '' }: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useSimpleAuth();
  const router = useRouter();

  const handleBuyNow = async () => {
    // Check if user is authenticated before proceeding with purchase
    if (!isAuthenticated || !user) {
      toast.error('Please sign up or log in to make a purchase');
      // Pass current page as redirect parameter so user returns here after signup
      const currentPath = window.location.pathname;
      router.push(`/signup?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Create checkout session directly for this product
      console.log('Initiating checkout for product:', product);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image_url,
            productType: product.productType || 'digital'
          }]
        }),
      });

      const data = await response.json();
      console.log('Checkout response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL in response:', data);
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Buy now error:', error);
      toast.error(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={isLoading}
      className={`btn-primary w-full flex items-center justify-center py-4 text-lg font-semibold rounded-lg transition-all duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Buy Now - A${product.price.toFixed(2)} AUD
        </>
      )}
    </button>
  );
}