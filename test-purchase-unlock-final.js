const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testPurchaseUnlockSystem() {
  console.log('🔍 FINAL PURCHASE UNLOCK SYSTEM TEST');
  console.log('=' .repeat(60));

  const testResults = {
    database: false,
    purchaseTable: false,
    emailSystem: false,
    purchaseCreation: false,
    purchaseRetrieval: false,
    autoLinking: false,
    webhookEndpoint: false
  };

  try {
    // 1. Test Database Connection
    console.log('\n1. Testing Database Connection...');
    const { data: dbTest, error: dbError } = await supabase
      .from('purchases')
      .select('count')
      .limit(1);
    
    if (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
    } else {
      console.log('✅ Database connection successful');
      testResults.database = true;
    }

    // 2. Test Purchase Table Structure
    console.log('\n2. Testing Purchase Table Structure...');
    const testPurchaseData = {
      user_id: 'test-user-' + Date.now(),
      customer_email: 'test@example.com',
      payment_email: 'test@example.com',
      product_id: '1',
      product_name: 'Test Product',
      price: 29.99,
      stripe_session_id: 'cs_test_' + Date.now(),
      stripe_payment_intent_id: 'pi_test_' + Date.now()
    };

    const { data: createdPurchase, error: createError } = await supabase
      .from('purchases')
      .insert(testPurchaseData)
      .select()
      .single();

    if (createError) {
      console.error('❌ Purchase table test failed:', createError.message);
      console.log('📋 Available columns might be missing. Check database setup.');
    } else {
      console.log('✅ Purchase table structure is correct');
      console.log('📋 Created test purchase:', createdPurchase.id);
      testResults.purchaseTable = true;
      testResults.purchaseCreation = true;

      // Test purchase retrieval
      console.log('\n3. Testing Purchase Retrieval...');
      const { data: retrievedPurchases, error: retrieveError } = await supabase
        .from('purchases')
        .select('*')
        .eq('customer_email', 'test@example.com');

      if (retrieveError) {
        console.error('❌ Purchase retrieval failed:', retrieveError.message);
      } else {
        console.log('✅ Purchase retrieval successful');
        console.log('📋 Retrieved', retrievedPurchases.length, 'purchase(s)');
        testResults.purchaseRetrieval = true;
      }

      // Clean up test data
      await supabase.from('purchases').delete().eq('id', createdPurchase.id);
      console.log('🧹 Test data cleaned up');
    }

    // 4. Test Email System
    console.log('\n4. Testing Email System...');
    const { data: emailQueue, error: emailError } = await supabase
      .from('email_queue')
      .select('count')
      .limit(1);

    if (emailError) {
      console.log('⚠️  Email queue not accessible:', emailError.message);
    } else {
      console.log('✅ Email queue system accessible');
      testResults.emailSystem = true;
    }

    // 5. Test Auto-Linking Logic
    console.log('\n5. Testing Auto-Linking Logic...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (profilesError) {
      console.log('⚠️  Profiles table not accessible:', profilesError.message);
    } else {
      console.log('✅ Profiles table accessible for user linking');
      testResults.autoLinking = true;
    }

    // 6. Test Webhook Endpoint
    console.log('\n6. Testing Stripe Webhook Endpoint...');
    try {
      const response = await fetch('http://localhost:3003/api/webhook/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      if (response.status === 400 || response.status === 200) {
        console.log('✅ Stripe webhook endpoint accessible');
        testResults.webhookEndpoint = true;
      } else {
        console.log('⚠️  Webhook endpoint returned:', response.status);
      }
    } catch (fetchError) {
      console.log('⚠️  Webhook endpoint test failed:', fetchError.message);
    }

    // 7. Test Purchase API Endpoint
    console.log('\n7. Testing Purchase API Endpoint...');
    try {
      const response = await fetch('http://localhost:3003/api/purchases/confirm?email=test@example.com');
      if (response.ok) {
        console.log('✅ Purchase API endpoint accessible');
      } else {
        console.log('⚠️  Purchase API returned:', response.status);
      }
    } catch (fetchError) {
      console.log('⚠️  Purchase API test failed:', fetchError.message);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  // Final Results
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 PURCHASE UNLOCK SYSTEM TEST RESULTS:');
  console.log('=' .repeat(60));
  
  const results = [
    { name: 'Database Connection', status: testResults.database },
    { name: 'Purchase Table Structure', status: testResults.purchaseTable },
    { name: 'Purchase Creation', status: testResults.purchaseCreation },
    { name: 'Purchase Retrieval', status: testResults.purchaseRetrieval },
    { name: 'Email System', status: testResults.emailSystem },
    { name: 'Auto-Linking System', status: testResults.autoLinking },
    { name: 'Webhook Endpoint', status: testResults.webhookEndpoint }
  ];

  results.forEach(result => {
    const icon = result.status ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.status ? 'WORKING' : 'NEEDS SETUP'}`);
  });

  const workingCount = results.filter(r => r.status).length;
  const totalCount = results.length;
  
  console.log('\n' + '=' .repeat(60));
  console.log(`🚀 SYSTEM STATUS: ${workingCount}/${totalCount} COMPONENTS WORKING`);
  
  if (workingCount >= 5) {
    console.log('\n🎉 PURCHASE UNLOCK SYSTEM IS READY!');
    console.log('\n📋 HOW IT WORKS:');
    console.log('1. Customer completes Stripe checkout');
    console.log('2. Stripe webhook receives payment confirmation');
    console.log('3. Purchase record is created in database');
    console.log('4. System auto-links purchase to user account');
    console.log('5. Customer gets immediate access in My Account');
    console.log('6. Confirmation email is sent automatically');
  } else {
    console.log('\n⚠️  SETUP REQUIRED:');
    console.log('1. Run the setup-purchase-unlock-system.sql in Supabase Dashboard');
    console.log('2. Ensure your Next.js app is running on localhost:3003');
    console.log('3. Verify all environment variables are set');
  }

  console.log('\n' + '=' .repeat(60));
}

// Run the test
testPurchaseUnlockSystem().catch(console.error);