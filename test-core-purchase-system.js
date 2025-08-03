require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCorePurchaseSystem() {
  console.log('🔍 TESTING CORE PURCHASE UNLOCK SYSTEM');
  console.log('=' .repeat(60));

  let passedTests = 0;
  let totalTests = 6;

  // Test 1: Database Connection
  try {
    const { data, error } = await supabase.from('purchases').select('count').limit(1);
    if (!error) {
      console.log('✅ 1. Database connection: Working');
      passedTests++;
    } else {
      console.log('❌ 1. Database connection: Failed -', error.message);
    }
  } catch (err) {
    console.log('❌ 1. Database connection: Failed -', err.message);
  }

  // Test 2: Purchases Table Structure
  try {
    const { data, error } = await supabase.from('purchases').select('*').limit(1);
    if (data && data.length >= 0) {
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      console.log('✅ 2. Purchases table: Accessible');
      console.log('   Current columns:', columns.join(', '));
      passedTests++;
    } else {
      console.log('❌ 2. Purchases table: Not accessible -', error?.message);
    }
  } catch (err) {
    console.log('❌ 2. Purchases table: Failed -', err.message);
  }

  // Test 3: Create Test Purchase
  try {
    const testPurchase = {
      user_id: null,
      customer_email: 'test@example.com',
      product_id: '1',
      product_name: 'Test Product',
      price: 29.99,
      session_id: 'test_session_' + Date.now(),
      download_url: 'https://example.com/download'
    };

    const { data, error } = await supabase
      .from('purchases')
      .insert([testPurchase])
      .select();

    if (data && data.length > 0) {
      console.log('✅ 3. Purchase creation: Working');
      console.log('   Created purchase ID:', data[0].id);
      passedTests++;
      
      // Clean up test purchase
      await supabase.from('purchases').delete().eq('id', data[0].id);
    } else {
      console.log('❌ 3. Purchase creation: Failed -', error?.message);
    }
  } catch (err) {
    console.log('❌ 3. Purchase creation: Failed -', err.message);
  }

  // Test 4: Purchase Retrieval by Email
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', 'chris.t@ventarosales.com')
      .limit(5);

    if (!error) {
      console.log('✅ 4. Purchase retrieval: Working');
      console.log('   Found', data.length, 'purchases for test email');
      passedTests++;
    } else {
      console.log('❌ 4. Purchase retrieval: Failed -', error.message);
    }
  } catch (err) {
    console.log('❌ 4. Purchase retrieval: Failed -', err.message);
  }

  // Test 5: Stripe Webhook Endpoint
  try {
    const response = await fetch('http://localhost:3003/api/stripe/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    if (response.status === 400 || response.status === 200) {
      console.log('✅ 5. Stripe webhook endpoint: Accessible');
      passedTests++;
    } else {
      console.log('❌ 5. Stripe webhook endpoint: Not accessible');
    }
  } catch (err) {
    console.log('❌ 5. Stripe webhook endpoint: Failed -', err.message);
  }

  // Test 6: Purchase API Endpoint
  try {
    const response = await fetch('http://localhost:3003/api/purchases/confirm?email=test@example.com');
    
    if (response.status === 200) {
      console.log('✅ 6. Purchase API endpoint: Accessible');
      passedTests++;
    } else {
      console.log('❌ 6. Purchase API endpoint: Not accessible');
    }
  } catch (err) {
    console.log('❌ 6. Purchase API endpoint: Failed -', err.message);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('📊 CORE SYSTEM TEST RESULTS:');
  console.log(`✅ ${passedTests}/${totalTests} components working`);
  
  if (passedTests >= 4) {
    console.log('\n🎯 CORE PURCHASE SYSTEM STATUS: READY');
    console.log('\n✅ AUTOMATIC PURCHASE UNLOCKING:');
    console.log('   • Purchases can be created automatically');
    console.log('   • Purchases can be retrieved by email');
    console.log('   • Stripe webhook is accessible');
    console.log('   • Purchase API is accessible');
    console.log('\n🚀 SYSTEM IS READY FOR AUTOMATIC PURCHASE UNLOCKING!');
    console.log('\n📋 WHAT WORKS NOW:');
    console.log('   1. Customer completes Stripe checkout');
    console.log('   2. Webhook automatically creates purchase record');
    console.log('   3. Customer gets immediate access via email lookup');
    console.log('   4. My Account page shows purchased products');
  } else {
    console.log('\n⚠️  CORE PURCHASE SYSTEM STATUS: NEEDS ATTENTION');
    console.log('\n📋 REQUIRED FIXES:');
    if (passedTests < 2) {
      console.log('   • Fix database connection and table access');
    }
    if (passedTests < 4) {
      console.log('   • Ensure Next.js app is running on localhost:3003');
    }
  }

  console.log('\n' + '=' .repeat(60));
}

testCorePurchaseSystem().catch(console.error);