#!/usr/bin/env node

/**
 * Verify Vercel Environment Variables Script
 * 
 * This script checks if all required environment variables for Vercel deployment
 * are properly configured in your .env.local file.
 * 
 * Usage: node scripts/verify-vercel-env.js
 */

require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = {
  // Supabase
  'NEXT_PUBLIC_SUPABASE_URL': { description: 'Supabase project URL', isPublic: true },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': { description: 'Supabase anonymous key', isPublic: true },
  'SUPABASE_SERVICE_ROLE_KEY': { description: 'Supabase service role key', isPublic: false },
  
  // Stripe
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': { description: 'Stripe publishable key', isPublic: true },
  'STRIPE_SECRET_KEY': { description: 'Stripe secret key', isPublic: false },
  'STRIPE_WEBHOOK_SECRET': { description: 'Stripe webhook secret', isPublic: false },
  
  // Email (at least one email service must be configured)
  'SENDGRID_API_KEY': { description: 'SendGrid API key', isPublic: false, optional: true },
  'EMAIL_FROM': { description: 'Email sender address', isPublic: false, optional: true },
  'RESEND_API_KEY': { description: 'Resend API key', isPublic: false, optional: true },
  
  // NextAuth
  'NEXTAUTH_SECRET': { description: 'NextAuth secret for JWT encryption', isPublic: false },
  'NEXTAUTH_URL': { description: 'NextAuth URL (same as NEXT_PUBLIC_SITE_URL)', isPublic: false, optional: true },
  
  // Site
  'NEXT_PUBLIC_SITE_URL': { description: 'Public site URL', isPublic: true },
};

console.log('\n🔍 Vercel Environment Variables Verification');
console.log('===========================================\n');

let missingVars = 0;
let placeholderVars = 0;
let configuredVars = 0;
let missingOptionalVars = 0;

// Check if at least one email service is configured
let hasEmailService = false;

// Verify each required environment variable
Object.entries(requiredEnvVars).forEach(([varName, config]) => {
  const value = process.env[varName];
  const isOptional = config.optional === true;
  
  // Check if variable exists
  if (!value) {
    if (isOptional) {
      console.log(`⚠️  ${varName}: Missing (optional)`);
      missingOptionalVars++;
    } else {
      console.log(`❌ ${varName}: Missing`);
      missingVars++;
    }
    return;
  }
  
  // Check for placeholder values
  if (
    value.includes('placeholder') ||
    value.includes('your_') ||
    value.includes('example') ||
    value === 'http://localhost:3000' ||
    value === 'https://your-project.supabase.co'
  ) {
    console.log(`⚠️  ${varName}: Contains placeholder value`);
    placeholderVars++;
    return;
  }
  
  // Special check for email services
  if (varName === 'SENDGRID_API_KEY' || varName === 'RESEND_API_KEY') {
    hasEmailService = true;
  }
  
  // Variable is properly configured
  console.log(`✅ ${varName}: Configured`);
  configuredVars++;
});

// Check if NEXTAUTH_URL is missing but can be derived from NEXT_PUBLIC_SITE_URL
if (!process.env.NEXTAUTH_URL && process.env.NEXT_PUBLIC_SITE_URL) {
  console.log('\nℹ️  NEXTAUTH_URL is not set but will use NEXT_PUBLIC_SITE_URL in production');
}

// Summary
console.log('\n📊 Summary:');
console.log(`✅ ${configuredVars} variables properly configured`);
if (placeholderVars > 0) console.log(`⚠️  ${placeholderVars} variables contain placeholder values`);
if (missingVars > 0) console.log(`❌ ${missingVars} required variables missing`);
if (missingOptionalVars > 0) console.log(`ℹ️  ${missingOptionalVars} optional variables missing`);

// Email service check
if (!hasEmailService) {
  console.log('\n⚠️  No email service configured (SENDGRID_API_KEY or RESEND_API_KEY)');
  console.log('   Email notifications will not work without an email service.');
}

// Final verdict
console.log('\n🏁 Verification Result:');
if (missingVars === 0 && placeholderVars === 0) {
  console.log('✅ All required environment variables are properly configured for Vercel deployment!');
  console.log('\n📝 Next Steps:');
  console.log('1. Add these variables to your Vercel project settings');
  console.log('2. Make sure to apply them to Production, Preview, and Development environments');
  console.log('3. Deploy your application');
  process.exit(0);
} else if (missingVars > 0) {
  console.log('❌ Some required environment variables are missing. Please configure them before deploying.');
  process.exit(1);
} else {
  console.log('⚠️  Some environment variables contain placeholder values. Replace them with actual values before deploying.');
  process.exit(1);
}