import { NextResponse } from 'next/server';
import { validateStripeEnvironment } from '@/lib/env-validation';

// Health check endpoint for Stripe configuration
export async function GET() {
  try {
    const validation = validateStripeEnvironment();
    
    return NextResponse.json({
      status: validation.isValid ? 'healthy' : 'unhealthy',
      stripe: {
        configured: validation.isValid,
        errors: validation.errors
      },
      environment: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}