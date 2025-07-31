#!/usr/bin/env node

/**
 * Vercel Environment Variables Setup Script
 * 
 * This script helps you configure all required environment variables in Vercel
 * to match your local .env.local configuration.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SENDGRID_API_KEY',
  'SENDGRID_FROM_EMAIL',
  'EMAIL_FROM',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_BASE_URL',
  'ADMIN_EMAIL'
];

console.log('🚀 Vercel Environment Variables Setup');
console.log('=====================================\n');

console.log('📋 Required Environment Variables for Vercel:');
console.log('Copy and paste these into your Vercel project settings:\n');

let allConfigured = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}=${value}`);
  } else {
    console.log(`❌ ${varName}=MISSING`);
    allConfigured = false;
  }
});

console.log('\n📝 Instructions:');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Navigate to Settings > Environment Variables');
console.log('3. Add each variable above with its corresponding value');
console.log('4. Make sure to set them for Production, Preview, and Development environments');
console.log('5. Redeploy your application after adding the variables\n');

if (allConfigured) {
  console.log('✅ All environment variables are configured locally!');
  console.log('📤 Copy the values above to your Vercel dashboard.');
} else {
  console.log('⚠️  Some environment variables are missing from your .env.local file.');
  console.log('🔧 Please configure them locally first, then copy to Vercel.');
}

console.log('\n🔗 Vercel Environment Variables Guide:');
console.log('https://vercel.com/docs/concepts/projects/environment-variables');

console.log('\n🎯 After setting up Vercel environment variables:');
console.log('1. Trigger a new deployment (git push or manual redeploy)');
console.log('2. Check the deployment logs for any environment variable errors');
console.log('3. Test your live site to ensure all features work correctly');

// Generate a Vercel CLI command for quick setup
console.log('\n⚡ Quick Setup with Vercel CLI (optional):');
console.log('If you have Vercel CLI installed, you can run:');
console.log('\nvercel env add NEXT_PUBLIC_SUPABASE_URL');
console.log('vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('vercel env add SUPABASE_SERVICE_ROLE_KEY');
console.log('vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
console.log('vercel env add STRIPE_SECRET_KEY');
console.log('vercel env add STRIPE_WEBHOOK_SECRET');
console.log('vercel env add SENDGRID_API_KEY');
console.log('vercel env add SENDGRID_FROM_EMAIL');
console.log('vercel env add EMAIL_FROM');
console.log('vercel env add NEXT_PUBLIC_SITE_URL');
console.log('vercel env add NEXT_PUBLIC_BASE_URL');
console.log('vercel env add ADMIN_EMAIL');
console.log('\nThen enter the corresponding values when prompted.');