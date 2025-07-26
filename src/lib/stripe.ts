import Stripe from 'stripe';

// Get Stripe secret key with fallback for build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe initialization - STRIPE_SECRET_KEY:', stripeSecretKey ? 'exists and configured' : 'missing');

// Enhanced Stripe configuration for optimal performance
const stripeConfig: Stripe.StripeConfig = {
  apiVersion: '2023-10-16',
  typescript: true,
  maxNetworkRetries: 3,
  timeout: 30000, // 30 seconds
  telemetry: false, // Disable telemetry for better performance
  appInfo: {
    name: 'Ventaro Digital Store',
    version: '1.0.0',
    url: 'https://ventaroai.com',
  },
};

// Connection health monitoring for Stripe
let stripeHealth = {
  lastCheck: 0,
  isHealthy: true,
  consecutiveFailures: 0,
};

// Enhanced Stripe health check
export async function checkStripeHealth(stripeInstance: Stripe): Promise<boolean> {
  const now = Date.now();
  
  // Only check health every 60 seconds to avoid excessive requests
  if (now - stripeHealth.lastCheck < 60000 && stripeHealth.isHealthy) {
    return stripeHealth.isHealthy;
  }
  
  try {
    // Simple health check - retrieve account info
    await stripeInstance.accounts.retrieve();
    
    stripeHealth.isHealthy = true;
    stripeHealth.consecutiveFailures = 0;
    stripeHealth.lastCheck = now;
    
    return true;
  } catch (error) {
    stripeHealth.consecutiveFailures++;
    stripeHealth.isHealthy = stripeHealth.consecutiveFailures < 3;
    stripeHealth.lastCheck = now;
    
    console.warn(`Stripe health check failed (${stripeHealth.consecutiveFailures}/3):`, error);
    return stripeHealth.isHealthy;
  }
}

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
        // Test the key with enhanced configuration
        const testStripe = new Stripe(stripeSecretKey, stripeConfig);
        
        // Perform initial health check
        checkStripeHealth(testStripe).catch(error => {
          console.warn('Initial Stripe health check failed:', error);
        });
        
        return testStripe;
      } catch (liveKeyError) {
        console.error('Error with live Stripe key:', liveKeyError);
        throw liveKeyError; // Re-throw to be caught by outer catch
      }
    }
    
    // For test keys or if we're not sure
    const stripeInstance = new Stripe(stripeSecretKey, stripeConfig);
    
    // Perform initial health check for test keys too
    checkStripeHealth(stripeInstance).catch(error => {
      console.warn('Initial Stripe health check failed:', error);
    });
    
    return stripeInstance;
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