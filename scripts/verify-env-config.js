#!/usr/bin/env node

/**
 * Vercel Environment Variables Verification Script
 * 
 * This script checks if all required API keys are properly configured
 * to use Vercel's shared environment variables.
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvVar(name, required = true) {
  const value = process.env[name];
  if (value) {
    // Check if the value is a placeholder
    if (value.includes('your_') || value.includes('placeholder') || value === 'https://supabase.co') {
      log(`⚠ ${name}: Contains placeholder value`, 'yellow');
      return false;
    }
    log(`✓ ${name}: Properly configured`, 'green');
    return true;
  } else {
    if (required) {
      log(`✗ ${name}: Missing (Required)`, 'red');
      return false;
    } else {
      log(`⚠ ${name}: Missing (Optional)`, 'yellow');
      return true;
    }
  }
}

async function main() {
  log('\n🔍 Vercel Environment Variables Verification', 'bold');
  log('=' .repeat(50), 'blue');
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  let allConfigured = true;
  
  // Check Supabase configuration
  log('\n📋 Supabase Configuration:', 'bold');
  allConfigured &= checkEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  allConfigured &= checkEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  allConfigured &= checkEnvVar('SUPABASE_SERVICE_ROLE_KEY');
  
  // Check Stripe configuration
  log('\n💳 Stripe Configuration:', 'bold');
  allConfigured &= checkEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  allConfigured &= checkEnvVar('STRIPE_SECRET_KEY');
  allConfigured &= checkEnvVar('STRIPE_WEBHOOK_SECRET');
  
  // Check Email configuration
  log('\n📧 Email Configuration:', 'bold');
  const hasSendGrid = checkEnvVar('SENDGRID_API_KEY', false);
  const hasResend = checkEnvVar('RESEND_API_KEY', false);
  const hasEmailFrom = checkEnvVar('EMAIL_FROM', false);
  
  if (!hasSendGrid && !hasResend) {
    log('✗ Email Service: Neither SendGrid nor Resend configured', 'red');
    allConfigured = false;
  }
  
  // Check Site configuration
  log('\n🌐 Site Configuration:', 'bold');
  allConfigured &= checkEnvVar('NEXT_PUBLIC_SITE_URL');
  
  // Summary
  log('\n📊 Verification Summary:', 'bold');
  if (allConfigured) {
    log('✅ All environment variables are properly configured for Vercel deployment!', 'green');
  } else {
    log('❌ Some environment variables are missing or contain placeholder values.', 'red');
    log('Please configure them in your Vercel dashboard:', 'yellow');
    log('1. Go to https://vercel.com/dashboard', 'cyan');
    log('2. Select your project', 'cyan');
    log('3. Go to Settings > Environment Variables', 'cyan');
    log('4. Add or update the missing/incorrect variables', 'cyan');
    log('\nRefer to VERCEL_ENV_SETUP.md for detailed instructions.', 'blue');
  }
  
  // Return exit code based on configuration status
  return allConfigured ? 0 : 1;
}

// Run the script
main()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error('Error running verification script:', error);
    process.exit(1);
  });