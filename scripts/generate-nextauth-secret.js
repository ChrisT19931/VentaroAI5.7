#!/usr/bin/env node

/**
 * Generate NextAuth Secret Script
 * 
 * This script generates a secure random string for use as NEXTAUTH_SECRET
 * and provides instructions for adding it to Vercel environment variables.
 * 
 * Usage: node scripts/generate-nextauth-secret.js
 */

const crypto = require('crypto');

// Generate a secure random string (equivalent to `openssl rand -base64 32`)
function generateSecureSecret() {
  return crypto.randomBytes(32).toString('base64');
}

const secret = generateSecureSecret();

console.log('\n🔐 NextAuth Secret Generator');
console.log('============================\n');

console.log('Generated NEXTAUTH_SECRET:');
console.log('\n' + secret + '\n');

console.log('Instructions:');
console.log('1. Copy the above secret');
console.log('2. Add it to your Vercel project as an environment variable:');
console.log('   - Go to your Vercel project dashboard');
console.log('   - Navigate to Settings > Environment Variables');
console.log('   - Add a new variable with key "NEXTAUTH_SECRET" and the generated value');
console.log('   - Make sure to apply it to Production, Preview, and Development environments');
console.log('\n3. Also add NEXTAUTH_URL with the same value as NEXT_PUBLIC_SITE_URL');
console.log('\nNote: Keep this secret secure and never expose it in client-side code or repositories.\n');