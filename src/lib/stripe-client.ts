'use client';

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
let stripePromise: ReturnType<typeof loadStripe>;

export const getStripe = () => {
  if (!stripePromise) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Missing environment variable NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
    }
    
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  
  return stripePromise;
};