#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script helps verify that your Vercel deployment is working correctly
 * by testing key endpoints and functionality.
 */

const https = require('https');
const http = require('http');

// Configuration
const VERCEL_URL = process.env.VERCEL_URL || 'https://ventaroai.com';
const LOCAL_URL = 'http://localhost:3003';

console.log('🔍 Deployment Verification');
console.log('=========================\n');

// Test endpoints
const endpoints = [
  '/',
  '/my-account',
  '/api/purchases/confirm?user_id=test&email=test@example.com',
  '/api/webhook/stripe'
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 200) // First 200 chars
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testEndpoint(baseUrl, endpoint) {
  const url = baseUrl + endpoint;
  console.log(`Testing: ${url}`);
  
  try {
    const result = await makeRequest(url);
    console.log(`✅ Status: ${result.status}`);
    
    if (result.status >= 400) {
      console.log(`⚠️  Response preview: ${result.body.substring(0, 100)}...`);
    }
    
    return result.status < 500; // Consider 4xx as "working" (expected for some endpoints)
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function verifyDeployment() {
  console.log(`🌐 Testing Vercel deployment: ${VERCEL_URL}`);
  console.log('─'.repeat(50));
  
  let vercelWorking = true;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(VERCEL_URL, endpoint);
    if (!success) vercelWorking = false;
    console.log('');
  }
  
  console.log('🏠 Testing local development: ' + LOCAL_URL);
  console.log('─'.repeat(50));
  
  let localWorking = true;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(LOCAL_URL, endpoint);
    if (!success) localWorking = false;
    console.log('');
  }
  
  console.log('📊 Summary');
  console.log('─'.repeat(20));
  console.log(`Local Development: ${localWorking ? '✅ Working' : '❌ Issues detected'}`);
  console.log(`Vercel Deployment: ${vercelWorking ? '✅ Working' : '❌ Issues detected'}`);
  
  if (!vercelWorking) {
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check Vercel environment variables are configured');
    console.log('2. Verify Stripe webhook endpoint is set correctly');
    console.log('3. Check deployment logs in Vercel dashboard');
    console.log('4. Ensure Supabase database is accessible from Vercel');
    console.log('5. Verify domain/URL configuration');
  }
  
  if (vercelWorking && localWorking) {
    console.log('\n🎉 Both local and Vercel deployments are working!');
    console.log('Your order-to-unlock system should be fully functional.');
  }
}

// Run verification
verifyDeployment().catch(console.error);