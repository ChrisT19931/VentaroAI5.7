#!/usr/bin/env node

/**
 * Check database schema and constraints for the purchases table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabaseSchema() {
  console.log('🔍 Checking Database Schema and Constraints');
  console.log('============================================\n');

  try {
    // Check if purchases table exists and get its structure
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'purchases' })
      .single();

    if (tableError) {
      console.log('Table info RPC not available, checking manually...');
      
      // Try to get some sample data to understand the structure
      const { data: sampleData, error: sampleError } = await supabase
        .from('purchases')
        .select('*')
        .limit(1);

      if (sampleError) {
        console.error('❌ Error accessing purchases table:', sampleError);
        return;
      }

      if (sampleData && sampleData.length > 0) {
        console.log('✅ Purchases table exists');
        console.log('Sample record structure:');
        console.log(JSON.stringify(sampleData[0], null, 2));
        console.log('\nColumns:', Object.keys(sampleData[0]).join(', '));
      } else {
        console.log('✅ Purchases table exists but is empty');
      }
    }

    // Check for existing constraints by trying to query system tables
    console.log('\nChecking for unique constraints...');
    
    // Try to create a test record to see what constraints exist
    const testData = {
      customer_email: 'constraint-test@example.com',
      product_id: 'test-product',
      session_id: 'test-session-constraint',
      product_name: 'Test Product',
      price: 1.00,
      download_url: '/test'
    };

    // First insert
    const { data: firstInsert, error: firstError } = await supabase
      .from('purchases')
      .insert(testData)
      .select('id');

    if (firstError) {
      console.error('❌ First test insert failed:', firstError);
      return;
    }
    console.log('✅ First test record created');

    // Second insert with same data
    const { data: secondInsert, error: secondError } = await supabase
      .from('purchases')
      .insert(testData)
      .select('id');

    if (secondError) {
      console.log('✅ Unique constraint detected:');
      console.log('   Error code:', secondError.code);
      console.log('   Error message:', secondError.message);
      
      if (secondError.message?.includes('idx_purchases_unique_purchase')) {
        console.log('✅ Expected unique constraint is working');
      } else {
        console.log('⚠️ Different constraint than expected');
      }
    } else {
      console.log('❌ CRITICAL: No unique constraint found - duplicates allowed!');
      console.log('   Second record ID:', secondInsert[0]?.id);
    }

    // Cleanup test data
    await supabase
      .from('purchases')
      .delete()
      .eq('customer_email', 'constraint-test@example.com');

    console.log('\n✅ Test data cleaned up');

  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }
}

// Run the check
checkDatabaseSchema().catch(console.error);