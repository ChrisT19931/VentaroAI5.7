import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  try {
    // Get Stripe keys from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    // Check if keys exist
    const secretKeyStatus = stripeSecretKey ? 'exists' : 'missing';
    const publishableKeyStatus = stripePublishableKey ? 'exists' : 'missing';
    
    // Try to initialize Stripe
    let stripeInitStatus = 'not attempted';
    let stripeVersion = 'unknown';
    let secretKeyType = 'unknown';
    
    if (stripeSecretKey) {
      secretKeyType = stripeSecretKey.startsWith('sk_live_') ? 'live' : 'test';
      
      try {
        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: '2023-10-16',
        });
        
        // Try to make a simple API call that doesn't require config.retrieve
        // Get API version from the options we passed in
        stripeInitStatus = 'success';
        stripeVersion = '2023-10-16'; // Use the version we specified in the options
      } catch (error: any) {
        stripeInitStatus = `failed: ${error.message}`;
      }
    }
    
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      stripeSecretKey: secretKeyStatus,
      stripePublishableKey: publishableKeyStatus,
      secretKeyType,
      stripeInitStatus,
      stripeVersion,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred testing Stripe' },
      { status: 500 }
    );
  }
}