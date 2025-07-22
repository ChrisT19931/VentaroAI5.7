'use client';

import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe promise
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    if (!stripePublishableKey) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is required');
      return null;
    }
    
    stripePromise = loadStripe(stripePublishableKey);
  }
  
  return stripePromise;
};

// Export the key for debugging purposes
export const getStripePublishableKey = () => stripePublishableKey;