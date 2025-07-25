#!/usr/bin/env node

/**
 * Setup Admin User Script
 * 
 * This script sets up an admin user in the Supabase auth system.
 * 
 * Usage: node scripts/setup-admin-user.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'chris.t@ventarosales.com';
const adminPassword = 'Rabbit5511$$11'; // The password provided by the user

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

async function setupAdminUser() {
  try {
    console.log(`🔍 Checking if user ${adminEmail} exists...`);
    
    // Check if the user exists
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('❌ Error getting users:', getUserError.message);
      return false;
    }
    
    let adminUser = users.find(user => user.email === adminEmail);
    
    if (!adminUser) {
      console.log(`User ${adminEmail} not found. Creating new user...`);
      
      // Create the user
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true // Auto-confirm the email
      });
      
      if (createUserError) {
        console.error('❌ Error creating user:', createUserError.message);
        return false;
      }
      
      console.log('✅ User created successfully!');
      adminUser = newUser.user;
    } else {
      console.log('✅ User already exists!');
      
      // Update the user's password
      const { error: updateUserError } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { password: adminPassword }
      );
      
      if (updateUserError) {
        console.error('❌ Error updating user password:', updateUserError.message);
      } else {
        console.log('✅ User password updated successfully!');
      }
    }
    
    // Now we need to set the user as an admin in the metadata
    console.log('🔧 Setting user as admin...');
    
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { user_metadata: { is_admin: true } }
    );
    
    if (updateError) {
      console.error('❌ Error setting admin status:', updateError.message);
      return false;
    }
    
    console.log('✅ User set as admin in metadata successfully!');
    
    // Check if we need to create the profiles table
    console.log('🔍 Checking if profiles table exists...');
    
    try {
      const { error: checkTableError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (checkTableError && checkTableError.code === 'PGRST116') {
        console.log('❌ Profiles table does not exist.');
        console.log('Please create the profiles table using the SQL in scripts/create-profiles-sql.md');
      } else {
        console.log('✅ Profiles table exists!');
        
        // Check if the user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', adminUser.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('❌ Error checking profile:', profileError.message);
        } else if (!profile) {
          // Create a profile for the user
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: adminUser.id,
              email: adminEmail,
              is_admin: true
            });
          
          if (insertError) {
            console.error('❌ Error creating profile:', insertError.message);
          } else {
            console.log('✅ Admin profile created successfully!');
          }
        } else {
          // Update the profile
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', adminUser.id);
          
          if (updateProfileError) {
            console.error('❌ Error updating profile:', updateProfileError.message);
          } else {
            console.log('✅ Admin profile updated successfully!');
          }
        }
      }
    } catch (tableError) {
      console.error('❌ Error checking profiles table:', tableError.message);
      console.log('Please create the profiles table using the SQL in scripts/create-profiles-sql.md');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔧 Ventaro AI Digital Store Admin Setup');
  console.log('======================================\n');
  
  const success = await setupAdminUser();
  
  if (success) {
    console.log('\n🎉 Admin user setup completed successfully!');
  } else {
    console.log('\n⚠️ Admin user setup completed with some issues.');
    console.log('Please check the logs above for details.');
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Visit http://localhost:3003');
  console.log(`3. Login with ${adminEmail} and password: Rabbit5511$$11`);
  console.log('4. Access admin panel at /admin');
}

main().catch(console.error);