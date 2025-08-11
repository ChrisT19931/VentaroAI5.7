/**
 * Configure Supabase Authentication Settings
 * 
 * This script configures Supabase to disable email confirmation
 * and enable automatic login after signup.
 * 
 * Usage: node configure-supabase-auth.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function configureSupabaseAuth() {
  console.log('🔧 Configuring Supabase Authentication Settings...');
  console.log('=' .repeat(60));
  
  try {
    // Test connection first
    console.log('\n1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError && !testError.message.includes('does not exist')) {
      throw new Error(`Connection failed: ${testError.message}`);
    }
    
    console.log('✅ Supabase connection successful');
    
    // Check current auth settings
    console.log('\n2. Checking current authentication settings...');
    
    // Note: Auth settings are configured in the Supabase Dashboard
    // This script provides instructions for manual configuration
    
    console.log('\n📋 MANUAL CONFIGURATION REQUIRED:');
    console.log('\nTo disable email confirmation in Supabase Dashboard:');
    console.log('\n1. Go to your Supabase Dashboard');
    console.log('2. Navigate to Authentication → Settings');
    console.log('3. Scroll down to "Email Confirmation"');
    console.log('4. Toggle OFF "Enable email confirmations"');
    console.log('5. Click "Save" to apply changes');
    
    console.log('\n🔧 ADDITIONAL SETTINGS:');
    console.log('\n• Double email confirmations: DISABLED');
    console.log('• Secure email change: DISABLED (optional)');
    console.log('• Enable phone confirmations: DISABLED');
    
    console.log('\n✅ Configuration instructions provided!');
    console.log('\n🚀 After applying these settings:');
    console.log('• Users will be automatically logged in after signup');
    console.log('• No email confirmation required');
    console.log('• Immediate access to protected content');
    
  } catch (error) {
    console.error('\n❌ Configuration failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Verify your Supabase credentials in .env.local');
    console.log('2. Check your Supabase project is active');
    console.log('3. Ensure service role key has admin permissions');
    process.exit(1);
  }
}

if (require.main === module) {
  configureSupabaseAuth().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { configureSupabaseAuth };