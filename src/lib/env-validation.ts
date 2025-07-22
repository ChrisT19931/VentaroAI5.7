// Environment variable validation for Stripe integration

export function validateStripeEnvironment() {
  const errors: string[] = [];
  
  // Check server-side Stripe secret key
  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY environment variable is required');
  }
  
  // Check webhook secret
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    errors.push('STRIPE_WEBHOOK_SECRET environment variable is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateStripeClientEnvironment() {
  const errors: string[] = [];
  
  // Check client-side Stripe publishable key
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Log environment status for debugging
export function logStripeEnvironmentStatus() {
  const serverValidation = validateStripeEnvironment();
  const clientValidation = validateStripeClientEnvironment();
  
  console.log('Stripe Environment Status:');
  console.log('Server-side validation:', serverValidation.isValid ? '✅ Valid' : '❌ Invalid');
  console.log('Client-side validation:', clientValidation.isValid ? '✅ Valid' : '❌ Invalid');
  
  if (!serverValidation.isValid) {
    console.error('Server-side errors:', serverValidation.errors);
  }
  
  if (!clientValidation.isValid) {
    console.error('Client-side errors:', clientValidation.errors);
  }
  
  return {
    server: serverValidation,
    client: clientValidation,
    allValid: serverValidation.isValid && clientValidation.isValid
  };
}