/**
 * Test User Login Script
 * 
 * This script tests the login functionality for both users to ensure they can authenticate.
 * 
 * Usage: node test-user-login.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const testUsers = [
  {
    email: 'christroiano1993@gmail.com',
    password: 'Rabbit5511$$11',
    expectedProduct: 'ebook'
  },
  {
    email: 'christroiano1993@hotmail.com',
    password: 'Rabbit5511$$11',
    expectedProduct: 'prompts'
  }
];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function testUserLogin(userInfo) {
  console.log(`\n🧪 Testing login for: ${userInfo.email}`);
  
  // Create a fresh Supabase client for each test
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userInfo.email,
      password: userInfo.password
    });
    
    if (error) {
      console.log(`❌ Login failed: ${error.message}`);
      return false;
    }
    
    if (!data.user) {
      console.log('❌ Login failed: No user returned');
      return false;
    }
    
    console.log(`✅ Login successful!`);
    console.log(`   📧 User ID: ${data.user.id}`);
    console.log(`   📧 Email: ${data.user.email}`);
    console.log(`   ✅ Email Confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`);
    
    // Check purchases
    const { data: purchases, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', userInfo.email);
    
    if (purchaseError) {
      console.log(`❌ Error checking purchases: ${purchaseError.message}`);
    } else if (purchases && purchases.length > 0) {
      console.log(`✅ Found ${purchases.length} purchase(s):`);
      purchases.forEach((purchase, index) => {
        console.log(`   ${index + 1}. ${purchase.product_name} (ID: ${purchase.product_id})`);
        if (purchase.product_id === userInfo.expectedProduct) {
          console.log(`   ✅ Expected product '${userInfo.expectedProduct}' found!`);
        }
      });
      
      const hasExpectedProduct = purchases.some(p => p.product_id === userInfo.expectedProduct);
      if (!hasExpectedProduct) {
        console.log(`⚠️  Expected product '${userInfo.expectedProduct}' not found`);
      }
    } else {
      console.log('❌ No purchases found');
    }
    
    // Sign out to clean up
    await supabase.auth.signOut();
    
    return true;
    
  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting user login tests...');
  
  let allPassed = true;
  
  for (const userInfo of testUsers) {
    const success = await testUserLogin(userInfo);
    if (!success) {
      allPassed = false;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Test Results:');
  if (allPassed) {
    console.log('🎉 All login tests passed!');
    console.log('\n✅ Both users should now be able to:');
    console.log('   1. Sign in at http://localhost:3003/login');
    console.log('   2. Access their My Account page');
    console.log('   3. View their purchased products');
  } else {
    console.log('❌ Some login tests failed!');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Check that the development server is running');
    console.log('   2. Verify Supabase credentials in .env.local');
    console.log('   3. Check database connectivity');
  }
  
  return allPassed;
}

// Run the tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});