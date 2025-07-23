import Stripe from 'stripe';

// Get Stripe secret key with fallback for build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Initialize Stripe with build-time safety
const stripe = (() => {
  // Check if key is missing or is a placeholder
  if (!stripeSecretKey || 
      stripeSecretKey === 'sk_test_placeholder' || 
      stripeSecretKey.includes('placeholder')) {
    console.warn('STRIPE_SECRET_KEY not configured or is a placeholder - payment features will not work');
    // Return a mock for build time
    return {
      // Mock essential methods used during build
      webhooks: {
        constructEvent: () => ({}),
      },
      checkout: {
        sessions: {
          create: async () => ({}),
          retrieve: async () => ({}),
        },
      },
      products: {
        list: async () => ({ data: [] }),
      },
    } as any;
  }
  
  try {
    return new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    // Return a mock in case of initialization error
    return {
      webhooks: {
        constructEvent: () => ({}),
      },
      checkout: {
        sessions: {
          create: async () => ({}),
          retrieve: async () => ({}),
        },
      },
      products: {
        list: async () => ({ data: [] }),
      },
    } as any;
  }
})();

export default stripe;
export { stripe };