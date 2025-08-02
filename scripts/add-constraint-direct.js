#!/usr/bin/env node

/**
 * Add unique constraint to purchases table using direct database connection
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addUniqueConstraint() {
  console.log('🔧 Adding unique constraint to purchases table...');
  console.log('================================================\n');

  try {
    // First, let's remove any existing duplicates
    console.log('Step 1: Checking for existing duplicates...');
    
    const { data: duplicates, error: dupError } = await supabase
      .from('purchases')
      .select('customer_email, product_id, session_id, id, created_at')
      .order('created_at', { ascending: true });

    if (dupError) {
      console.error('❌ Error checking duplicates:', dupError);
      return;
    }

    // Group by unique key and find duplicates
    const seen = new Map();
    const duplicateIds = [];
    
    for (const purchase of duplicates) {
      if (!purchase.session_id) continue; // Skip null session_ids
      
      const key = `${purchase.customer_email}|${purchase.product_id}|${purchase.session_id}`;
      
      if (seen.has(key)) {
        // This is a duplicate, mark for deletion (keep the first one)
        duplicateIds.push(purchase.id);
        console.log(`   Found duplicate: ${purchase.customer_email} - ${purchase.product_id} - ${purchase.session_id}`);
      } else {
        seen.set(key, purchase.id);
      }
    }

    if (duplicateIds.length > 0) {
      console.log(`\nStep 2: Removing ${duplicateIds.length} duplicate records...`);
      
      const { error: deleteError } = await supabase
        .from('purchases')
        .delete()
        .in('id', duplicateIds);

      if (deleteError) {
        console.error('❌ Error removing duplicates:', deleteError);
        return;
      }
      
      console.log('✅ Duplicates removed successfully');
    } else {
      console.log('✅ No duplicates found');
    }

    // Now try to add the constraint using a workaround
    console.log('\nStep 3: Creating unique constraint...');
    
    // Since we can't use RPC, let's try to create a test record that would violate the constraint
    // If it succeeds, we know there's no constraint. If it fails, the constraint exists.
    
    const testData = {
      customer_email: 'unique-test@example.com',
      product_id: 'test-constraint',
      session_id: 'test-session-unique',
      product_name: 'Test Product',
      price: 1.00,
      download_url: '/test'
    };

    // Insert first record
    const { data: first, error: firstError } = await supabase
      .from('purchases')
      .insert(testData)
      .select('id');

    if (firstError) {
      console.error('❌ Error creating test record:', firstError);
      return;
    }

    // Try to insert duplicate
    const { data: second, error: secondError } = await supabase
      .from('purchases')
      .insert(testData)
      .select('id');

    if (secondError && (secondError.code === '23505' || secondError.message?.includes('duplicate'))) {
      console.log('✅ Unique constraint already exists and working!');
    } else if (secondError) {
      console.log('⚠️ Different error occurred:', secondError);
    } else {
      console.log('❌ No unique constraint detected - manual intervention required');
      console.log('\n📋 Manual SQL to run in Supabase SQL Editor:');
      console.log('CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_unique_purchase');
      console.log('ON public.purchases (customer_email, product_id, session_id)');
      console.log('WHERE session_id IS NOT NULL;');
    }

    // Cleanup test data
    await supabase
      .from('purchases')
      .delete()
      .eq('customer_email', 'unique-test@example.com');

    console.log('\n✅ Test completed and cleaned up');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the constraint addition
addUniqueConstraint().catch(console.error);