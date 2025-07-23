'use client';

import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe promise
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    // Check if key is missing or is a placeholder
    if (!stripePublishableKey || 
        stripePublishableKey === 'pk_test_placeholder' || 
        stripePublishableKey.includes('placeholder')) {
      console.warn('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not configured or is a placeholder - payment features will not work');
      return null;
    }
    
    try {
      stripePromise = loadStripe(stripePublishableKey);
    } catch (error) {
      console.error('Failed to initialize Stripe client:', error);
      return null;
    }
  }
  
  return stripePromise;
};

// Export the key for debugging purposes (with safety check)
export const getStripePublishableKey = () => {
  if (stripePublishableKey === 'pk_test_placeholder' || 
      (stripePublishableKey && stripePublishableKey.includes('placeholder'))) {
    return 'PLACEHOLDER_KEY';
  }
  return stripePublishableKey;
};