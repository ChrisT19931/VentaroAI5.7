'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';
import { getStripe } from '@/lib/stripe-client';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeItem, updateItemQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract items and total from cart
  const { items, total } = cart;

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsLoading(true);
      
      // Call the checkout API to create a Stripe session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const { sessionId, url } = await response.json();

      // If we have a direct URL from Stripe, use it (preferred method)
      if (url) {
        window.location.href = url;
        return;
      }
      
      // Fallback to redirectToCheckout if URL is not provided
      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Failed to initialize Stripe - check your Stripe publishable key');
      }
      
      // Fallback to redirectToCheckout if URL is not provided
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        toast.error(error.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error instanceof Error ? error.message : 'There was a problem with checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven&apos;t added any products to your cart yet.</p>
            <Button
              href="/products"
              variant="success"
              size="lg"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={item.id} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border border-gray-200 bg-gray-100 relative">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <Link href={`/products/${item.id}`} className="hover:text-primary-600">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="ml-4">A${(item.price * item.quantity).toFixed(2)} AUD</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">A${item.price.toFixed(2)} AUD each</p>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="text-gray-500 hover:text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="mx-2 text-gray-700">{item.quantity}</span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="font-medium text-primary-600 hover:text-primary-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => clearCart()}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Clear Cart
                  </button>
                  <Link
                    href="/products"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">A${total.toFixed(2)} AUD</dd>
                  </div>
                  
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Tax</dt>
                    <dd className="font-medium text-gray-900">A$0.00 AUD</dd>
                  </div>
                  
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                    <dd className="text-base font-medium text-gray-900">A${total.toFixed(2)} AUD</dd>
                  </div>
                </dl>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Secure Payment</h3>
                  <p className="text-sm text-gray-600 mb-3">Complete your purchase securely and get instant access to your digital products.</p>
                  
                  {/* Payment Method Logos */}
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    {/* Stripe Logo */}
                    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border">
                      <svg className="h-6 w-auto" viewBox="0 0 60 25" fill="none">
                        <path d="M59.5 12.5c0-6.9-5.6-12.5-12.5-12.5S34.5 5.6 34.5 12.5 40.1 25 47 25s12.5-5.6 12.5-12.5z" fill="#635bff"/>
                        <path d="M47 7.5c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z" fill="white"/>
                        <text x="2" y="18" fontSize="12" fill="#635bff" fontWeight="bold">stripe</text>
                      </svg>
                    </div>
                    
                    {/* Visa Logo */}
                    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border">
                      <svg className="h-6 w-auto" viewBox="0 0 78 25" fill="none">
                        <path d="M35.5 2L30.5 23h-5L20.5 2h5l2.5 16L31 2h4.5zM40 2v21h-4V2h4zM53 9c-2 0-3 1-3 2s1 2 3 2 3-1 3-2-1-2-3-2zM60 2l-4 21h-4l4-21h4z" fill="#1a1f71"/>
                        <text x="2" y="18" fontSize="12" fill="#1a1f71" fontWeight="bold">VISA</text>
                      </svg>
                    </div>
                    
                    {/* Mastercard Logo */}
                    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border">
                      <svg className="h-6 w-auto" viewBox="0 0 48 30" fill="none">
                        <circle cx="15" cy="15" r="12" fill="#eb001b"/>
                        <circle cx="33" cy="15" r="12" fill="#f79e1b"/>
                        <path d="M24 6c2.5 2 4 5 4 9s-1.5 7-4 9c-2.5-2-4-5-4-9s1.5-7 4-9z" fill="#ff5f00"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>SSL Encrypted • PCI Compliant • 256-bit Security</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    isLoading={isLoading}
                    loadingText="Processing..."
                    variant="success"
                    size="lg"
                    fullWidth
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
                  >
                    🔒 Secure Checkout - A${total.toFixed(2)} AUD
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>or</p>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/products')}
                  className="text-green-600 hover:text-green-700 mt-2"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}