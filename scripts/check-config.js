#!/usr/bin/env node

/**
 * Configuration Check Script for Ventaro AI Digital Store
 * 
 * This script validates that all required environment variables and
 * configurations are properly set up for deployment.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvVar(name, required = true) {
  const value = process.env[name];
  if (value) {
    log(`✓ ${name}: Set`, 'green');
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

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✓ ${description}: Found`, 'green');
    return true;
  } else {
    log(`✗ ${description}: Missing`, 'red');
    return false;
  }
}

async function checkSupabaseConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error) {
      log(`✗ Supabase Connection: Failed - ${error.message}`, 'red');
      return false;
    } else {
      log(`✓ Supabase Connection: Success`, 'green');
      return true;
    }
  } catch (error) {
    log(`✗ Supabase Connection: Failed - ${error.message}`, 'red');
    return false;
  }
}

async function checkStripeConnection() {
  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    await stripe.products.list({ limit: 1 });
    log(`✓ Stripe Connection: Success`, 'green');
    return true;
  } catch (error) {
    log(`✗ Stripe Connection: Failed - ${error.message}`, 'red');
    return false;
  }
}

async function checkEmailService() {
  const hasSendGrid = process.env.SENDGRID_API_KEY;
  const hasResend = process.env.RESEND_API_KEY;
  
  if (!hasSendGrid && !hasResend) {
    log(`✗ Email Service: No email service configured`, 'red');
    return false;
  }
  
  if (hasSendGrid) {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      log(`✓ SendGrid: Configured`, 'green');
      return true;
    } catch (error) {
      log(`✗ SendGrid: Configuration error - ${error.message}`, 'red');
    }
  }
  
  if (hasResend) {
    try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      log(`✓ Resend: Configured`, 'green');
      return true;
    } catch (error) {
      log(`✗ Resend: Configuration error - ${error.message}`, 'red');
    }
  }
  
  return false;
}

async function main() {
  log('\n🔍 Ventaro AI Digital Store - Configuration Check', 'bold');
  log('=' .repeat(50), 'blue');
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  let allChecks = true;
  
  // Check required environment variables
  log('\n📋 Environment Variables:', 'bold');
  allChecks &= checkEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  allChecks &= checkEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  allChecks &= checkEnvVar('SUPABASE_SERVICE_ROLE_KEY');
  allChecks &= checkEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  allChecks &= checkEnvVar('STRIPE_SECRET_KEY');
  allChecks &= checkEnvVar('STRIPE_WEBHOOK_SECRET');
  allChecks &= checkEnvVar('NEXT_PUBLIC_SITE_URL');
  
  // Check email service (at least one required)
  const hasSendGrid = checkEnvVar('SENDGRID_API_KEY', false);
  const hasResend = checkEnvVar('RESEND_API_KEY', false);
  const hasEmailFrom = checkEnvVar('EMAIL_FROM', false);
  
  if (!hasSendGrid && !hasResend) {
    log('✗ Email Service: Neither SendGrid nor Resend configured', 'red');
    allChecks = false;
  }
  
  // Check required files
  log('\n📁 Required Files:', 'bold');
  allChecks &= checkFileExists('public/downloads/premium-ai-ebook.pdf', 'E-book PDF');
  allChecks &= checkFileExists('public/downloads/ai-prompts-collection.pdf', 'AI Prompts PDF');
  allChecks &= checkFileExists('SUPABASE_SETUP.md', 'Supabase Setup Guide');
  allChecks &= checkFileExists('DEPLOYMENT.md', 'Deployment Guide');
  
  // Check connections
  log('\n🔗 Service Connections:', 'bold');
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    allChecks &= await checkSupabaseConnection();
  } else {
    log('⚠ Skipping Supabase connection test (missing credentials)', 'yellow');
  }
  
  if (process.env.STRIPE_SECRET_KEY) {
    allChecks &= await checkStripeConnection();
  } else {
    log('⚠ Skipping Stripe connection test (missing credentials)', 'yellow');
  }
  
  allChecks &= await checkEmailService();
  
  // Final result
  log('\n' + '=' .repeat(50), 'blue');
  
  if (allChecks) {
    log('🎉 All checks passed! Your application is ready for deployment.', 'green');
    log('\n📚 Next steps:', 'bold');
    log('1. Deploy to Vercel with the environment variables', 'blue');
    log('2. Configure Stripe webhooks with your production URL', 'blue');
    log('3. Run the test suite to verify functionality', 'blue');
    log('4. Follow the DEPLOYMENT.md guide for complete setup', 'blue');
  } else {
    log('❌ Some checks failed. Please fix the issues above before deploying.', 'red');
    log('\n📖 For help, refer to:', 'bold');
    log('- SUPABASE_SETUP.md for database configuration', 'blue');
    log('- DEPLOYMENT.md for deployment instructions', 'blue');
    log('- .env.local.example for environment variable examples', 'blue');
    process.exit(1);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

// Run the configuration check
main().catch((error) => {
  log(`\n❌ Configuration check failed: ${error.message}`, 'red');
  process.exit(1);
});