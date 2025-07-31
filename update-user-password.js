/**
 * Update User Password Script
 * 
 * This script updates the password for a specific user in the Supabase auth system.
 * 
 * Usage: node update-user-password.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// User details to update
const targetEmail = 'christroiano1993@gmail.com';
const newPassword = 'Rabbit5511$$11';

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

async function updateUserPassword() {
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
      console.log('Available users:');
      users.forEach(user => console.log(`  - ${user.email} (ID: ${user.id})`));
      return false;
    }
    
    console.log(`✅ Found user: ${targetEmail} (ID: ${targetUser.id})`);
    
    // Update the user's password
    console.log('🔧 Updating password...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      { password: newPassword }
    );
    
    if (updateError) {
      console.error('❌ Error updating password:', updateError.message);
      return false;
    }
    
    console.log('✅ Password updated successfully!');
    
    // Also check if user has a profile
    console.log('🔍 Checking user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', targetEmail)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking profile:', profileError.message);
    } else if (profile) {
      console.log('✅ User profile found:', {
        id: profile.id,
        email: profile.email,
        is_admin: profile.is_admin || false
      });
    } else {
      console.log('⚠️ No profile found for user');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the script
updateUserPassword().then(success => {
  if (success) {
    console.log('\n🎉 Password update completed successfully!');
  } else {
    console.log('\n❌ Password update failed!');
  }
  process.exit(success ? 0 : 1);
});