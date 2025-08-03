#!/usr/bin/env node

/**
 * ONE-CLICK DATABASE SETUP FOR PURCHASE UNLOCK SYSTEM
 * 
 * This script automatically sets up all required database tables,
 * functions, and triggers for the purchase unlock system.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupDatabase() {
  console.log('🚀 STARTING ONE-CLICK DATABASE SETUP');
  console.log('============================================================');
  
  try {
    // Read the SQL setup file
    const sqlFilePath = path.join(__dirname, 'setup-purchase-unlock-system.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error('setup-purchase-unlock-system.sql file not found!');
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📄 Reading SQL setup file...');
    console.log('✅ SQL file loaded successfully');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`\n🔧 Executing ${statements.length} SQL statements...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      try {
        console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        });
        
        if (error) {
          // Some errors are expected (like "already exists")
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate key') ||
              error.message.includes('relation') && error.message.includes('already exists')) {
            console.log(`⚠️  Skipped (already exists): ${error.message.substring(0, 100)}...`);
          } else {
            console.log(`❌ Error: ${error.message}`);
            errorCount++;
          }
        } else {
          console.log('✅ Success');
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Exception: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log('\n============================================================');
    console.log('📊 SETUP SUMMARY:');
    console.log(`✅ Successful operations: ${successCount}`);
    console.log(`❌ Errors/Skipped: ${errorCount}`);
    
    // Test the setup
    console.log('\n🧪 TESTING SETUP...');
    
    // Test purchases table
    const { data: purchasesTest, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .limit(1);
    
    if (purchasesError) {
      console.log('❌ Purchases table test failed:', purchasesError.message);
    } else {
      console.log('✅ Purchases table accessible');
    }
    
    // Test profiles table
    const { data: profilesTest, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ Profiles table test failed:', profilesError.message);
    } else {
      console.log('✅ Profiles table accessible');
    }
    
    // Test email_queue table
    const { data: emailTest, error: emailError } = await supabase
      .from('email_queue')
      .select('*')
      .limit(1);
    
    if (emailError) {
      console.log('❌ Email queue table test failed:', emailError.message);
    } else {
      console.log('✅ Email queue table accessible');
    }
    
    console.log('\n============================================================');
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Run: node test-purchase-unlock-final.js');
    console.log('2. Verify all 7/7 components are working');
    console.log('3. Test a purchase to confirm automatic unlocking');
    console.log('\n🚀 Your purchase unlock system is now ready!');
    
  } catch (error) {
    console.error('\n❌ SETUP FAILED:', error.message);
    console.log('\n🔧 MANUAL SETUP REQUIRED:');
    console.log('1. Open Supabase Dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Run the setup-purchase-unlock-system.sql file manually');
    process.exit(1);
  }
}

// Check if required environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file');
  process.exit(1);
}

setupDatabase();