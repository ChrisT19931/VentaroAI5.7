#!/usr/bin/env node

/**
 * Test script for support form functionality
 * This script tests the support request API endpoint
 */

// Use built-in fetch for Node.js 18+
const fetch = globalThis.fetch || require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004';

async function testSupportForm() {
  console.log('🧪 Testing Support Form Functionality\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET'}`);
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || 'NOT SET'}`);
  console.log(`SENDGRID_FROM_EMAIL: ${process.env.SENDGRID_FROM_EMAIL || 'NOT SET'}`);
  console.log('');
  
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'SG.placeholder_api_key_replace_with_real_key') {
    console.log('⚠️  SendGrid not configured properly!');
    console.log('📧 Emails will be logged to console instead of being sent.');
    console.log('');
    console.log('🔧 To fix this:');
    console.log('1. Get a SendGrid API key from https://sendgrid.com');
    console.log('2. Update .env.local with your real API key');
    console.log('3. Verify your sender email in SendGrid');
    console.log('');
  }
  
  // Test data
  const testData = {
    subject: 'Test Support Request',
    description: 'This is a test support request to verify the form is working correctly.',
    priority: 'medium',
    preferredDate: '2025-01-10',
    preferredTime: '14:00',
    contactMethod: 'email',
    phoneNumber: '+1234567890',
    userEmail: 'test@example.com',
    userName: 'Test User',
    userId: 'test-user-123'
  };
  
  try {
    console.log('🚀 Sending test support request...');
    
    const response = await fetch(`${BASE_URL}/api/support-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Support form test PASSED!');
      
      if (result.emailStatus) {
        console.log('\n📧 Email Status:');
        console.log(`- Email Configured: ${result.emailStatus.emailConfigured ? '✅' : '❌'}`);
        console.log(`- Admin Email Sent: ${result.emailStatus.adminEmailSent ? '✅' : '❌'}`);
        console.log(`- Client Email Sent: ${result.emailStatus.clientEmailSent ? '✅' : '❌'}`);
      }
      
      if (!result.emailStatus?.emailConfigured) {
        console.log('\n🔧 Next Steps:');
        console.log('1. Configure SendGrid API key in .env.local');
        console.log('2. Verify sender email in SendGrid dashboard');
        console.log('3. Test again to confirm emails are being sent');
      }
    } else {
      console.log('\n❌ Support form test FAILED!');
      console.log('Error:', result.error || result.message);
    }
    
  } catch (error) {
    console.log('\n❌ Support form test FAILED!');
    console.error('Error:', error.message);
  }
}

// Run the test
testSupportForm().catch(console.error);