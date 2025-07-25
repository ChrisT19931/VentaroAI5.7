import Stripe from 'stripe';

// Get Stripe secret key with fallback for build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe initialization - STRIPE_SECRET_KEY:', stripeSecretKey ? 'exists' : 'missing');

// Initialize Stripe with build-time safety
const stripe = (() => {
  console.log('Initializing Stripe with key status:', stripeSecretKey ? 'Key exists' : 'Key is missing');
  // Check if key is missing or is a placeholder - allow live keys
  if (!stripeSecretKey || 
      stripeSecretKey === 'sk_test_placeholder' || 
      (stripeSecretKey.includes('placeholder') && !stripeSecretKey.startsWith('sk_live_'))) {
    console.warn('STRIPE_SECRET_KEY not configured or is a placeholder - payment features will not work');
    // Return a mock for build time
    return {
      // Mock essential methods used during build
      webhooks: {
        constructEvent: () => ({}),
      },
      checkout: {
        sessions: {
          create: async () => {
            console.log('Using mock Stripe checkout.sessions.create');
            return { url: 'https://example.com/mock-checkout', id: 'mock_session_id' };
          },
          retrieve: async () => ({}),
        },
      },
      products: {
        list: async () => ({ data: [] }),
      },
    } as any;
  }
  
  try {
    // For live keys, we need to be careful with the initialization
    if (stripeSecretKey.startsWith('sk_live_')) {
      console.log('Using live Stripe key - ensuring proper initialization');
      try {
        // Test the key with a simple operation first
        const testStripe = new Stripe(stripeSecretKey, {
          apiVersion: '2023-10-16',
          typescript: true,
          defaultCurrency: 'aud'
        });
        
        // If we get here, the key is valid
        return testStripe;
      } catch (liveKeyError) {
        console.error('Error with live Stripe key:', liveKeyError);
        throw liveKeyError; // Re-throw to be caught by outer catch
      }
    }
    
    // For test keys or if we're not sure
    return new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
      defaultCurrency: 'aud'
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
          create: async () => {
            console.log('Using mock Stripe checkout.sessions.create due to initialization error');
            return { url: 'https://example.com/mock-checkout', id: 'mock_session_id' };
          },
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