// Import Stripe dynamically to prevent build-time initialization
// This ensures Stripe is only loaded at runtime
import type { Stripe as StripeType } from 'stripe';
let Stripe: any = null;

// Enhanced Stripe configuration for optimal performance
const stripeConfig: StripeType.StripeConfig = {
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
export async function checkStripeHealth(stripeInstance: StripeType | any): Promise<boolean> {
  // Skip health check during build time
  if (process.env.VERCEL_BUILD === 'true') {
    return true;
  }

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

// Initialize Stripe with build-time safety (lazy-loaded)
let _stripeInstance: any = null;

export const getStripeInstance = async (): Promise<StripeType | any> => {
  // Only skip Stripe initialization during actual build time, not runtime
  if (process.env.VERCEL_BUILD === 'true') {
    console.warn('Stripe not initialized during build time');
    // Return a mock object that won't cause build failures
    return createMockStripeInstance();
  }

  // Return cached instance if available
  if (_stripeInstance) {
    return _stripeInstance;
  }
  
  // Dynamically import Stripe only at runtime
  if (!Stripe) {
    try {
      Stripe = (await import('stripe')).default;
    } catch (error) {
      console.error('Failed to import Stripe:', error);
      return createMockStripeInstance();
    }
  }
  
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey ||
      stripeSecretKey === 'sk_test_placeholder' ||
      (stripeSecretKey.includes('placeholder') && !stripeSecretKey.startsWith('sk_live_'))) {
    console.warn('STRIPE_SECRET_KEY not configured or is a placeholder - payment features will not work');
    return createMockStripeInstance();
  }
  
  try {
    _stripeInstance = new Stripe(stripeSecretKey, stripeConfig);
    checkStripeHealth(_stripeInstance).catch(error => {
      console.warn('Initial Stripe health check failed:', error);
    });
    return _stripeInstance;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return createMockStripeInstance();
  }
};

// Create a mock Stripe instance for build time or when Stripe initialization fails
function createMockStripeInstance(): any {
  // Return a minimal mock object with the necessary methods
  return {
    checkout: {
      sessions: {
        list: async () => ({ data: [], object: 'list', hasMore: false }),
        expire: async () => ({ id: 'mock_session_id', object: 'checkout.session', status: 'expired' }),
        listLineItems: async () => ({ data: [], object: 'list', hasMore: false }),
        create: async () => ({
          id: 'mock_session_id',
          object: 'checkout.session',
          url: 'https://example.com/mock-checkout',
          payment_status: 'unpaid'
        }),
        retrieve: async () => ({
          id: 'mock_session_id',
          object: 'checkout.session',
          payment_status: 'unpaid',
          url: 'https://example.com/mock-checkout'
        })
      }
    },
    accounts: {
      retrieve: async () => ({ id: 'mock_account_id', object: 'account' })
    },
    webhooks: {
      constructEvent: () => ({ type: 'mock_event', data: { object: {} } })
    }
  };
}

// Export only the getter function to prevent build-time initialization
export default getStripeInstance;