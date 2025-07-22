'use client';

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
let stripePromise: ReturnType<typeof loadStripe>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.error('Warning: Missing environment variable NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      return null;
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
};