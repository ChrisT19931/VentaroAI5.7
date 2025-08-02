#!/usr/bin/env node

/**
 * Test script to verify duplicate prevention in Stripe webhook processing
 * This script simulates multiple webhook calls with the same session ID
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDuplicatePrevention() {
  console.log('🧪 Testing Duplicate Prevention Mechanisms');
  console.log('==========================================\n');

  const testSessionId = `test_session_${Date.now()}`;
  const testEmail = 'test@example.com';
  const testProductId = 'ebook';

  try {
    // Test 1: Check if we can insert the same purchase multiple times
    console.log('Test 1: Attempting to create duplicate purchases...');
    
    const purchaseData = {
      customer_email: testEmail,
      product_id: testProductId,
      product_name: 'Test E-book',
      price: 10.00,
      session_id: testSessionId,
      download_url: '/my-account',
      created_at: new Date().toISOString()
    };

    // First insert - should succeed
    const { data: firstInsert, error: firstError } = await supabase
      .from('purchases')
      .insert(purchaseData)
      .select('id');

    if (firstError) {
      console.error('❌ First insert failed:', firstError);
      return;
    }
    console.log('✅ First purchase created successfully:', firstInsert[0].id);

    // Second insert - should fail due to unique constraint
    const { data: secondInsert, error: secondError } = await supabase
      .from('purchases')
      .insert(purchaseData)
      .select('id');

    if (secondError) {
      if (secondError.code === '23505' || secondError.message?.includes('duplicate')) {
        console.log('✅ Duplicate prevention working: Second insert properly rejected');
        console.log('   Error:', secondError.message);
      } else {
        console.error('❌ Unexpected error on second insert:', secondError);
      }
    } else {
      console.error('❌ CRITICAL: Duplicate purchase was allowed!', secondInsert);
    }

    // Test 2: Check existing purchases query
    console.log('\nTest 2: Checking session lookup...');
    const { data: existingPurchases } = await supabase
      .from('purchases')
      .select('id, session_id, customer_email, product_id')
      .eq('session_id', testSessionId);

    console.log(`✅ Found ${existingPurchases?.length || 0} purchases for session ${testSessionId}`);
    if (existingPurchases && existingPurchases.length > 0) {
      console.log('   Purchase details:', existingPurchases[0]);
    }

    // Test 3: Simulate webhook endpoint duplicate check
    console.log('\nTest 3: Simulating webhook duplicate check...');
    const { data: webhookCheck } = await supabase
      .from('purchases')
      .select('id')
      .eq('session_id', testSessionId)
      .limit(1);

    if (webhookCheck && webhookCheck.length > 0) {
      console.log('✅ Webhook duplicate check would prevent processing');
      console.log('   Found existing purchase ID:', webhookCheck[0].id);
    } else {
      console.log('❌ Webhook duplicate check failed - no existing purchase found');
    }

    // Cleanup
    console.log('\nCleaning up test data...');
    const { error: deleteError } = await supabase
      .from('purchases')
      .delete()
      .eq('session_id', testSessionId);

    if (deleteError) {
      console.error('⚠️ Cleanup failed:', deleteError);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }

  console.log('\n🎉 Duplicate prevention test completed!');
}

// Run the test
testDuplicatePrevention().catch(console.error);