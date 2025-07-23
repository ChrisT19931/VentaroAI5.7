import Stripe from 'stripe';

// Get Stripe secret key with fallback for build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Initialize Stripe with build-time safety
const stripe = (() => {
  if (!stripeSecretKey) {
    console.warn('STRIPE_SECRET_KEY not configured - payment features will not work');
    // Return a mock for build time
    return null as any;
  }
  
  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    typescript: true,
  });
})();

export default stripe;
export { stripe };