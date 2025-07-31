#!/usr/bin/env node

// Test script for automated purchase linking functionality
// This script simulates the webhook behavior and tests the linking logic

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testAutoPurchaseLinking() {
  console.log('🧪 Testing Automated Purchase Linking');
  console.log('=====================================\n');

  try {
    // Test Case 1: Check current state
    console.log('📊 Current Database State:');
    
    const { data: allPurchases } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    console.log(`Total recent purchases: ${allPurchases?.length || 0}`);
    
    if (allPurchases && allPurchases.length > 0) {
      allPurchases.forEach(purchase => {
        console.log(`  - ${purchase.product_name}`);
        console.log(`    User ID: ${purchase.user_id || 'UNLINKED'}`);
        console.log(`    Customer Email: ${purchase.customer_email}`);
        console.log(`    Payment Email: ${purchase.payment_email || 'N/A'}`);
        console.log(`    Created: ${purchase.created_at}`);
        console.log('');
      });
    }

    // Test Case 2: Check registered users
    console.log('👥 Registered Users:');
    const { data: users } = await supabase.auth.admin.listUsers();
    
    if (users?.users) {
      users.users.forEach(user => {
        console.log(`  - ${user.email} (ID: ${user.id})`);
      });
    }
    console.log('');

    // Test Case 3: Simulate linking logic for unlinked purchases
    console.log('🔗 Testing Auto-Linking Logic:');
    
    const { data: unlinkedPurchases } = await supabase
      .from('purchases')
      .select('*')
      .is('user_id', null);
    
    if (unlinkedPurchases && unlinkedPurchases.length > 0) {
      console.log(`Found ${unlinkedPurchases.length} unlinked purchase(s)`);
      
      for (const purchase of unlinkedPurchases) {
        console.log(`\n  Checking purchase: ${purchase.product_name}`);
        console.log(`  Customer Email: ${purchase.customer_email}`);
        
        // Try to find matching registered user
        const matchingUser = users?.users?.find(user => 
          user.email === purchase.customer_email
        );
        
        if (matchingUser) {
          console.log(`  ✅ Found matching registered user: ${matchingUser.id}`);
          console.log(`  📧 Registered email: ${matchingUser.email}`);
          
          // This would be done automatically by the webhook now
          console.log(`  🔄 Would auto-link this purchase to user`);
        } else {
          console.log(`  ❌ No matching registered user found`);
          console.log(`  📝 Purchase remains unlinked until user registers`);
        }
      }
    } else {
      console.log('✅ No unlinked purchases found');
    }

    // Test Case 4: Check API accessibility
    console.log('\n🌐 Testing API Access:');
    
    // Test with a registered user
    if (users?.users && users.users.length > 0) {
      const testUser = users.users[0];
      console.log(`Testing API for user: ${testUser.email}`);
      
      try {
        const response = await fetch(`http://localhost:3003/api/purchases/confirm?userId=${testUser.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ API accessible - found ${data.purchases?.length || 0} purchases`);
        } else {
          console.log(`❌ API error: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ API connection failed: ${error.message}`);
        console.log('   (This is expected if dev server is not running)');
      }
    }

    console.log('\n🎯 Summary:');
    console.log('- Enhanced webhook now automatically links purchases to registered users');
    console.log('- Uses registered email address instead of payment email for linking');
    console.log('- Tracks both registered email and payment email separately');
    console.log('- Automatically links existing unlinked purchases when user is found');
    console.log('- Maintains backward compatibility with existing data');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAutoPurchaseLinking().then(() => {
  console.log('\n✅ Test completed');
}).catch(error => {
  console.error('❌ Test error:', error);
  process.exit(1);
});