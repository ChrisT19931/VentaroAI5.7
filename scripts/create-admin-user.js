#!/usr/bin/env node

/**
 * Create Admin User Script
 * 
 * This script creates a user with the provided email and password,
 * and then sets the user as an admin.
 * 
 * Usage: node scripts/create-admin-user.js
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

async function createAdminUser() {
  try {
    console.log('🚀 Setting up admin user...');
    
    // Admin user details
    const adminEmail = process.env.ADMIN_EMAIL || 'chris.t@ventarosales.com';
    
    // First, get the user's auth data to get the ID
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('❌ Error getting users:', getUserError.message);
      return;
    }
    
    const adminUser = users.find(user => user.email === adminEmail);
    
    if (!adminUser) {
      console.error(`❌ User with email ${adminEmail} not found in auth.users`);
      console.log('Please sign up with this email first.');
      return;
    }
    
    console.log('✅ Found user in auth system!');
    console.log(`User ID: ${adminUser.id}`);
    console.log(`Email: ${adminUser.email}`);
    
    // Check if user exists in profiles table
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      console.error('❌ Error checking profile:', profileError.message);
      
      // Try to create the profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: adminUser.id,
          email: adminEmail,
          is_admin: true
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Error creating profile:', insertError.message);
        return;
      }
      
      console.log('✅ Created new profile with admin privileges!');
      console.log(`Admin Status: ${newProfile.is_admin}`);
      return;
    }
    
    // Update existing profile to admin
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', adminUser.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Error updating profile to admin:', updateError.message);
      return;
    }
    
    console.log('✅ User updated to admin successfully!');
    console.log(`Admin Status: ${updatedProfile.is_admin}`);
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
  }
}

async function main() {
  console.log('🔧 Ventaro AI Digital Store Admin Setup');
  console.log('======================================\n');
  
  await createAdminUser();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Visit http://localhost:3003');
  console.log(`3. Login with ${process.env.ADMIN_EMAIL || 'chris.t@ventarosales.com'}`);
  console.log('4. Access admin panel at /admin');
}

main().catch(console.error);