const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client - use placeholder if not configured
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

let supabase = null;
let useSupabase = false;

try {
  if (supabaseKey !== 'placeholder' && !supabaseUrl.includes('xyzcompany')) {
    supabase = createClient(supabaseUrl, supabaseKey);
    useSupabase = true;
    console.log('✅ Supabase client initialized');
  } else {
    console.log('⚠️ Using in-memory mode (Supabase not configured)');
  }
} catch (error) {
  console.log('⚠️ Supabase initialization failed, using in-memory mode');
  useSupabase = false;
}

// Test data for debugging
const testUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User'
};

const testPurchases = [
  {
    id: 'test-purchase-1',
    user_id: testUser.id,
    customer_email: testUser.email,
    product_id: 'prompts',
    product_name: 'AI Prompts Arsenal 2025',
    amount: 10.00,
    currency: 'usd',
    status: 'active',
    stripe_session_id: 'cs_test_123',
    created_at: new Date().toISOString()
  },
  {
    id: 'test-purchase-2',
    user_id: testUser.id,
    customer_email: testUser.email,
    product_id: 'ebook',
    product_name: 'AI Tools Mastery Guide 2025',
    amount: 25.00,
    currency: 'usd',
    status: 'active',
    stripe_session_id: 'cs_test_456',
    created_at: new Date().toISOString()
  }
];

async function debugPurchaseSystem() {
  console.log('🔍 COMPREHENSIVE PURCHASE SYSTEM DEBUG');
  console.log('=====================================\n');

  // Test 1: Database Connection
  console.log('📊 TEST 1: Database Connection');
  console.log('------------------------------');
  
  if (useSupabase) {
    try {
      const { data, error } = await supabase.from('purchases').select('count').limit(1);
      if (error) {
        console.log('❌ Supabase connection failed:', error.message);
        console.log('💡 This might be why purchases aren\'t working!');
      } else {
        console.log('✅ Supabase connection successful');
      }
    } catch (error) {
      console.log('❌ Supabase connection error:', error.message);
    }
  } else {
    console.log('⚠️ Using in-memory storage (development mode)');
  }

  // Test 2: Purchase Table Structure
  console.log('\n📋 TEST 2: Purchase Table Structure');
  console.log('-----------------------------------');
  
  if (useSupabase) {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ Cannot query purchases table:', error.message);
        console.log('💡 The purchases table might not exist or have wrong structure!');
      } else {
        console.log('✅ Purchases table accessible');
        if (data && data.length > 0) {
          console.log('📋 Sample purchase structure:', Object.keys(data[0]));
        } else {
          console.log('📋 No purchases found in database');
        }
      }
    } catch (error) {
      console.log('❌ Purchase table error:', error.message);
    }
  }

  // Test 3: Create Test Purchase
  console.log('\n🛒 TEST 3: Create Test Purchase');
  console.log('-------------------------------');
  
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('purchases')
        .upsert(testPurchases[0])
        .select()
        .single();
      
      if (error) {
        console.log('❌ Failed to create test purchase:', error.message);
        console.log('💡 This is likely why Stripe payments don\'t unlock products!');
      } else {
        console.log('✅ Test purchase created successfully');
        console.log('📋 Purchase data:', data);
      }
    } else {
      console.log('✅ Test purchase would be created in memory');
    }
  } catch (error) {
    console.log('❌ Test purchase creation failed:', error.message);
  }

  // Test 4: Product ID Mapping
  console.log('\n🔄 TEST 4: Product ID Mapping');
  console.log('-----------------------------');
  
  const testMappings = [
    { stripeProduct: 'prod_stripe_prompts', productName: 'AI Prompts Arsenal 2025', expected: 'prompts' },
    { stripeProduct: 'prod_stripe_ebook', productName: 'AI Tools Mastery Guide 2025', expected: 'ebook' },
    { stripeProduct: 'prod_stripe_coaching', productName: 'AI Business Coaching Session', expected: 'coaching' },
    { stripeProduct: 'prod_stripe_video', productName: 'AI Web Creation Masterclass', expected: 'video' },
    { stripeProduct: 'prod_stripe_support', productName: 'Support Package', expected: 'support' }
  ];

  function mapStripeProductToInternal(productName, stripeProductId) {
    let mappedProductId = stripeProductId;
    
    const name = productName.toLowerCase();
    if (name.includes('prompt') || name.includes('ai prompts')) {
      mappedProductId = 'prompts';
    } else if (name.includes('e-book') || name.includes('ebook') || name.includes('mastery guide')) {
      mappedProductId = 'ebook';
    } else if (name.includes('coaching') || name.includes('session')) {
      mappedProductId = 'coaching';
    } else if (name.includes('masterclass') || name.includes('video')) {
      mappedProductId = 'video';
    } else if (name.includes('support')) {
      mappedProductId = 'support';
    }
    
    return mappedProductId;
  }

  testMappings.forEach(test => {
    const result = mapStripeProductToInternal(test.productName, test.stripeProduct);
    const success = result === test.expected;
    console.log(`${success ? '✅' : '❌'} ${test.productName} -> ${result} (expected: ${test.expected})`);
  });

  // Test 5: Purchase Verification API
  console.log('\n🔍 TEST 5: Purchase Verification API');
  console.log('-----------------------------------');
  
  try {
    const testUrl = `http://localhost:3003/api/purchases/confirm?userId=${testUser.id}`;
    console.log('🌐 Testing URL:', testUrl);
    
    // This would normally make an HTTP request, but we'll simulate it
    console.log('⚠️ Cannot test API endpoint in script (requires running server)');
    console.log('💡 To test manually:');
    console.log(`   1. Start your Next.js server (npm run dev)`);
    console.log(`   2. Visit: ${testUrl}`);
    console.log(`   3. Check if it returns purchases for the test user`);
  } catch (error) {
    console.log('❌ API test failed:', error.message);
  }

  // Test 6: Download Page Access Logic
  console.log('\n📄 TEST 6: Download Page Access Logic');
  console.log('------------------------------------');
  
  function testDownloadAccess(userPurchases, productId) {
    console.log(`Testing access for product: ${productId}`);
    console.log(`User purchases:`, userPurchases.map(p => p.product_id));
    
    const hasAccess = userPurchases.some(purchase => purchase.product_id === productId);
    console.log(`${hasAccess ? '✅' : '❌'} Access ${hasAccess ? 'granted' : 'denied'} for ${productId}`);
    return hasAccess;
  }

  testDownloadAccess(testPurchases, 'prompts');
  testDownloadAccess(testPurchases, 'ebook');
  testDownloadAccess(testPurchases, 'coaching');
  testDownloadAccess(testPurchases, 'nonexistent');

  // Test 7: Stripe Webhook Simulation
  console.log('\n🎣 TEST 7: Stripe Webhook Simulation');
  console.log('-----------------------------------');
  
  const mockStripeSession = {
    id: 'cs_test_webhook_123',
    customer: 'cus_test_123',
    customer_details: {
      email: testUser.email
    },
    client_reference_id: testUser.id,
    line_items: {
      data: [
        {
          price: {
            id: 'price_test_123',
            product: 'prod_test_prompts'
          }
        }
      ]
    }
  };

  const mockStripeProduct = {
    id: 'prod_test_prompts',
    name: 'AI Prompts Arsenal 2025',
    description: 'Test product'
  };

  console.log('🎯 Simulating Stripe webhook processing...');
  console.log('📦 Mock product:', mockStripeProduct.name);
  
  const mappedId = mapStripeProductToInternal(mockStripeProduct.name, mockStripeProduct.id);
  console.log(`✅ Product mapping: ${mockStripeProduct.id} -> ${mappedId}`);
  
  console.log('📧 Customer email:', mockStripeSession.customer_details.email);
  console.log('👤 User ID:', mockStripeSession.client_reference_id);

  // Test 8: Environment Variables
  console.log('\n🌍 TEST 8: Environment Variables');
  console.log('--------------------------------');
  
  const requiredEnvVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET'
  ];

  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    const configured = value && value !== 'placeholder' && !value.includes('your-');
    console.log(`${configured ? '✅' : '❌'} ${envVar}: ${configured ? 'Configured' : 'Missing or placeholder'}`);
  });

  // Test 9: User Authentication Flow
  console.log('\n🔐 TEST 9: User Authentication Flow');
  console.log('----------------------------------');
  
  console.log('👤 Admin user check:');
  const adminEmail = 'chris.t@ventarosales.com';
  const isAdmin = testUser.email === adminEmail;
  console.log(`${isAdmin ? '✅' : '❌'} ${testUser.email} ${isAdmin ? 'is' : 'is not'} admin`);
  
  console.log('🎫 User session requirements:');
  console.log('   - User must be logged in (session.user exists)');
  console.log('   - User must have user.id for purchase lookup');
  console.log('   - Download pages check both user.id and email');

  // Test 10: Common Failure Scenarios
  console.log('\n⚠️ TEST 10: Common Failure Scenarios');
  console.log('-----------------------------------');
  
  console.log('🚨 Most likely reasons for purchase unlock failure:');
  console.log('   1. Stripe webhook not reaching your server (ngrok/deployment issue)');
  console.log('   2. Stripe product names don\'t match mapping logic');
  console.log('   3. User ID mismatch between Stripe and NextAuth');
  console.log('   4. Supabase connection or permissions issue');
  console.log('   5. Purchase record created with wrong product_id');
  console.log('   6. Caching preventing immediate access');

  // Summary
  console.log('\n📋 SUMMARY & RECOMMENDATIONS');
  console.log('============================');
  
  if (!useSupabase) {
    console.log('🔥 CRITICAL: Supabase not configured - purchases won\'t persist!');
    console.log('   → Set up SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  console.log('🔧 To fix the $10 purchase issue:');
  console.log('   1. Verify Stripe webhooks are reaching /api/webhook/stripe');
  console.log('   2. Check Stripe product names match mapping logic');
  console.log('   3. Ensure user authentication is working');
  console.log('   4. Verify purchases table exists and is accessible');
  console.log('   5. Test the complete flow end-to-end');
  
  console.log('\n🧪 Next steps:');
  console.log('   1. Run this script: node debug-purchase-system.js');
  console.log('   2. Check server logs during a test purchase');
  console.log('   3. Use browser dev tools to inspect API responses');
  console.log('   4. Test with a real Stripe payment in test mode');

  console.log('\n✅ Debug complete!');
}

// Additional helper functions for manual testing
function createTestPurchaseManually() {
  console.log('\n🛠️ MANUAL TEST PURCHASE CREATION');
  console.log('=================================');
  
  const testPurchase = {
    user_id: 'your-user-id-here',
    customer_email: 'your-email@example.com',
    product_id: 'prompts', // or 'ebook', 'coaching', etc.
    product_name: 'AI Prompts Arsenal 2025',
    amount: 10.00,
    currency: 'usd',
    status: 'active',
    stripe_session_id: 'manual_test_' + Date.now(),
    created_at: new Date().toISOString()
  };

  console.log('📋 SQL to run in Supabase:');
  console.log(`
INSERT INTO purchases (
  user_id, customer_email, product_id, product_name, 
  amount, currency, status, stripe_session_id, created_at
) VALUES (
  '${testPurchase.user_id}',
  '${testPurchase.customer_email}',
  '${testPurchase.product_id}',
  '${testPurchase.product_name}',
  ${testPurchase.amount},
  '${testPurchase.currency}',
  '${testPurchase.status}',
  '${testPurchase.stripe_session_id}',
  '${testPurchase.created_at}'
);
  `);
}

// Run the debug
if (require.main === module) {
  debugPurchaseSystem().catch(console.error);
}

module.exports = {
  debugPurchaseSystem,
  createTestPurchaseManually
}; 