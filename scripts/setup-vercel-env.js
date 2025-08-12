#!/usr/bin/env node

/**
 * Setup Vercel Environment Variables Script
 * 
 * This script helps you set up your environment variables for Vercel deployment.
 * It reads your local .env.local file and generates commands to set up the same
 * variables in your Vercel project using the Vercel CLI.
 * 
 * Prerequisites:
 * - Vercel CLI installed: npm i -g vercel
 * - Logged in to Vercel: vercel login
 * - .env.local file with your environment variables
 * 
 * Usage: node scripts/setup-vercel-env.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.error('❌ .env.local file not found. Please create it first.');
  process.exit(1);
}

// Read .env.local file
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};

// Parse environment variables
envContent.split('\n').forEach(line => {
  // Skip empty lines and comments
  if (!line || line.startsWith('#')) return;
  
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    envVars[key.trim()] = value.trim();
  }
});

console.log('\n🔧 Vercel Environment Variables Setup');
console.log('======================================\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Vercel CLI not found. Please install it with: npm i -g vercel');
  process.exit(1);
}

// Generate Vercel CLI commands
console.log('📋 Commands to set up environment variables in Vercel:\n');
console.log('# First, link to your Vercel project if not already linked');
console.log('vercel link\n');

console.log('# Set environment variables');
Object.entries(envVars).forEach(([key, value]) => {
  // Escape quotes in the value
  const escapedValue = value.replace(/"/g, '\\"');
  console.log(`vercel env add ${key} "${escapedValue}"`);
});

console.log('\n# After setting all variables, deploy your project');
console.log('vercel --prod\n');

console.log('📝 Instructions:');
console.log('1. Run the commands above one by one');
console.log('2. For each variable, select which environments to apply it to (Production, Preview, Development)');
console.log('3. After setting all variables, deploy your project\n');

console.log('🔒 Security Note:');
console.log('Keep your environment variables secure and never expose them in client-side code or repositories.\n');