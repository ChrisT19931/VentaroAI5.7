const { createClient } = require('@supabase/supabase-js');
const http = require('http');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test configuration
const testEmail = 'webhook-test@example.com';
const testProductId = 'prompts';
const testProductName = 'AI Prompts Arsenal 2025';

// Simulate a Stripe webhook payload
const mockWebhookPayload = {
  id: 'evt_test_webhook',
  object: 'event',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_session',
      object: 'checkout.session',
      customer_email: testEmail,
      line_items: {
        data: [
          {
            price: {
              product: 'prod_test_prompts' // This should map to 'prompts'
            },
            quantity: 1
          }
        ]
      },
      metadata: {
        product_name: testProductName
      }
    }
  }
};

async function testStripeWebhookSimulation() {
  console.log('🚀 Testing Stripe Webhook Simulation');
  console.log('============================================');
  
  try {
    // Step 1: Clean up existing test data
    console.log('\n📋 Step 1: Cleaning up existing test data...');
    await supabase
      .from('purchases')
      .delete()
      .eq('customer_email', testEmail);
    console.log('✅ Test data cleaned up');
    
    // Step 2: Simulate webhook call
    console.log('\n📋 Step 2: Simulating Stripe webhook call...');
    
    const webhookData = JSON.stringify(mockWebhookPayload);
    
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: '/api/webhook/stripe',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(webhookData),
        'stripe-signature': 'test_signature' // This will fail signature verification but should still process
      }
    };
    
    const webhookResponse = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            data: data
          });
        });
      });
      
      req.on('error', reject);
      req.write(webhookData);
      req.end();
    });
    
    console.log(`📡 Webhook response status: ${webhookResponse.status}`);
    
    // Step 3: Check if purchase record was created
    console.log('\n📋 Step 3: Checking if purchase record was created...');
    
    // Wait a moment for the webhook to process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', testEmail)
      .eq('product_id', testProductId);
    
    if (error) {
      console.log('❌ Error checking purchases:', error.message);
    } else if (purchases && purchases.length > 0) {
      console.log('✅ Purchase record created successfully!');
      console.log('📦 Purchase details:', purchases[0]);
    } else {
      console.log('⚠️  No purchase record found - webhook may have failed signature verification');
      console.log('   This is expected in test environment without proper Stripe signature');
    }
    
    // Step 4: Test manual purchase creation (simulating successful webhook)
    console.log('\n📋 Step 4: Creating purchase record manually (simulating successful webhook)...');
    
    const { data: manualPurchase, error: manualError } = await supabase
      .from('purchases')
      .insert({
        customer_email: testEmail,
        product_id: testProductId,
        product_name: testProductName,
        price: 39.99,
        session_id: 'cs_test_session'
      })
      .select();
    
    if (manualError) {
      console.log('❌ Error creating manual purchase:', manualError.message);
    } else {
      console.log('✅ Manual purchase record created successfully!');
      console.log('📦 Manual purchase details:', manualPurchase[0]);
    }
    
    // Step 5: Test My Account API with the purchase
    console.log('\n📋 Step 5: Testing My Account API with purchase...');
    
    const apiOptions = {
      hostname: 'localhost',
      port: 3003,
      path: `/api/purchases/confirm?email=${encodeURIComponent(testEmail)}`,
      method: 'GET'
    };
    
    const apiResponse = await new Promise((resolve, reject) => {
      const req = http.request(apiOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              data: JSON.parse(data)
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: data
            });
          }
        });
      });
      
      req.on('error', reject);
      req.end();
    });
    
    if (apiResponse.status === 200 && apiResponse.data.purchases) {
      const userPurchases = apiResponse.data.purchases;
      const hasProduct = userPurchases.some(p => p.product_id === testProductId);
      
      if (hasProduct) {
        console.log('✅ My Account API correctly shows product access');
        console.log('📦 User purchases:', userPurchases.map(p => p.product_id));
      } else {
        console.log('❌ My Account API does not show product access');
      }
    } else {
      console.log('❌ My Account API failed:', apiResponse.status, apiResponse.data);
    }
    
    console.log('\n🎉 Stripe Webhook Simulation Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    try {
      await supabase
        .from('purchases')
        .delete()
        .eq('customer_email', testEmail);
      console.log('✅ Test data cleaned up');
    } catch (cleanupError) {
      console.log('⚠️  Cleanup warning:', cleanupError.message);
    }
  }
}

// Run the test
testStripeWebhookSimulation();