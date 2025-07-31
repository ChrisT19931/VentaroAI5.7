/**
 * Check User Authentication Status Script
 * 
 * This script checks the authentication status and access for specific users.
 * 
 * Usage: node check-user-auth-status.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Users to check
const usersToCheck = [
  'christroiano1993@gmail.com',
  'christroiano1993@hotmail.com'
];

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

async function checkUserAuthStatus() {
  try {
    console.log('🔍 Checking user authentication status...\n');
    
    // Get all users from auth
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('❌ Error getting users:', getUserError.message);
      return false;
    }
    
    for (const email of usersToCheck) {
      console.log(`👤 Checking: ${email}`);
      console.log('=' .repeat(50));
      
      // Find user in auth.users
      const authUser = users.find(user => user.email === email);
      
      if (!authUser) {
        console.log('❌ User NOT found in auth.users');
        console.log('🔧 This user needs to be created in the authentication system\n');
        continue;
      }
      
      console.log('✅ User found in auth.users');
      console.log(`   🆔 User ID: ${authUser.id}`);
      console.log(`   📧 Email: ${authUser.email}`);
      console.log(`   ✅ Email Confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   📅 Created: ${new Date(authUser.created_at).toLocaleString()}`);
      console.log(`   🔐 Last Sign In: ${authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at).toLocaleString() : 'Never'}`);
      
      // Check user metadata
      if (authUser.user_metadata && Object.keys(authUser.user_metadata).length > 0) {
        console.log(`   📝 Metadata:`, authUser.user_metadata);
      }
      
      // Check purchases for this user
      console.log('\n🛒 Checking purchases...');
      const { data: purchases, error: purchaseError } = await supabase
        .from('purchases')
        .select('*')
        .eq('customer_email', email);
      
      if (purchaseError) {
        console.log('❌ Error checking purchases:', purchaseError.message);
      } else if (purchases && purchases.length > 0) {
        console.log(`✅ Found ${purchases.length} purchase(s):`);
        purchases.forEach((purchase, index) => {
          console.log(`   ${index + 1}. Product: ${purchase.product_name}`);
          console.log(`      🆔 Product ID: ${purchase.product_id}`);
          console.log(`      💰 Amount: $${purchase.amount}`);
          console.log(`      📅 Date: ${new Date(purchase.created_at).toLocaleString()}`);
          console.log(`      🔗 Session: ${purchase.session_id}`);
        });
      } else {
        console.log('❌ No purchases found');
      }
      
      console.log('\n');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the script
checkUserAuthStatus().then(success => {
  if (success) {
    console.log('🎉 User authentication status check completed!');
  } else {
    console.log('❌ User authentication status check failed!');
  }
  process.exit(success ? 0 : 1);
});