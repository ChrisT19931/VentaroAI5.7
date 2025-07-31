/**
 * Reset User Session Script
 * 
 * This script resets the authentication session for a specific user.
 * 
 * Usage: node reset-user-session.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// User to reset session for
const targetEmail = 'christroiano1993@hotmail.com';

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

async function resetUserSession() {
  try {
    console.log(`🔍 Looking for user: ${targetEmail}...`);
    
    // Get all users and find the target user
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('❌ Error getting users:', getUserError.message);
      return false;
    }
    
    const targetUser = users.find(user => user.email === targetEmail);
    
    if (!targetUser) {
      console.log(`❌ User ${targetEmail} not found in auth.users`);
      return false;
    }
    
    console.log(`✅ Found user: ${targetEmail} (ID: ${targetUser.id})`);
    
    // Check current user status
    console.log('📊 Current user status:');
    console.log(`   📧 Email: ${targetUser.email}`);
    console.log(`   ✅ Email Confirmed: ${targetUser.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   📅 Created: ${new Date(targetUser.created_at).toLocaleString()}`);
    console.log(`   🔐 Last Sign In: ${targetUser.last_sign_in_at ? new Date(targetUser.last_sign_in_at).toLocaleString() : 'Never'}`);
    
    // Ensure email is confirmed
    if (!targetUser.email_confirmed_at) {
      console.log('🔧 Confirming user email...');
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        targetUser.id,
        { email_confirm: true }
      );
      
      if (confirmError) {
        console.error('❌ Error confirming email:', confirmError.message);
      } else {
        console.log('✅ Email confirmed successfully!');
      }
    }
    
    // Reset password to a known value (same as gmail user)
    console.log('🔧 Resetting password...');
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      { password: 'Rabbit5511$$11' }
    );
    
    if (passwordError) {
      console.error('❌ Error resetting password:', passwordError.message);
    } else {
      console.log('✅ Password reset successfully!');
    }
    
    // Check purchases to ensure access
    console.log('🛒 Verifying purchases...');
    const { data: purchases, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', targetEmail);
    
    if (purchaseError) {
      console.log('❌ Error checking purchases:', purchaseError.message);
    } else if (purchases && purchases.length > 0) {
      console.log(`✅ Found ${purchases.length} purchase(s):`);
      purchases.forEach((purchase, index) => {
        console.log(`   ${index + 1}. ${purchase.product_name} (ID: ${purchase.product_id})`);
      });
    } else {
      console.log('❌ No purchases found - this might be the issue!');
    }
    
    // Provide login instructions
    console.log('\n📋 Login Instructions:');
    console.log(`   📧 Email: ${targetEmail}`);
    console.log(`   🔐 Password: Rabbit5511$$11`);
    console.log(`   🌐 Login URL: http://localhost:3003/login`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the script
resetUserSession().then(success => {
  if (success) {
    console.log('\n🎉 User session reset completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Clear browser cookies/cache');
    console.log('   2. Go to http://localhost:3003/login');
    console.log('   3. Sign in with the credentials above');
    console.log('   4. Navigate to /my-account to verify access');
  } else {
    console.log('\n❌ User session reset failed!');
  }
  process.exit(success ? 0 : 1);
});