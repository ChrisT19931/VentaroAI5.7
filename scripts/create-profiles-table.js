#!/usr/bin/env node

/**
 * Create Profiles Table Script
 * 
 * This script creates the profiles table in Supabase.
 * 
 * Usage: node scripts/create-profiles-table.js
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

async function createProfilesTable() {
  try {
    console.log('🔧 Creating profiles table...');
    
    // Create profiles table
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000000', // Dummy ID that will be replaced
        email: 'dummy@example.com',
        is_admin: false
      });
    
    if (createError && createError.code === 'PGRST116') {
      console.log('❌ Profiles table does not exist. Creating it...');
      
      // Try to create the table using REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          command: `
            CREATE TABLE IF NOT EXISTS profiles (
              id UUID REFERENCES auth.users(id) PRIMARY KEY,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              first_name TEXT,
              last_name TEXT,
              email TEXT NOT NULL,
              is_admin BOOLEAN DEFAULT FALSE
            );
          `
        })
      });
      
      if (!response.ok) {
        console.log('❌ Failed to create profiles table via REST API');
        console.log('Please create the profiles table manually in the Supabase dashboard:');
        console.log(`
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);
`);
      } else {
        console.log('✅ Profiles table created successfully');
      }
    } else if (createError) {
      console.log(`❌ Error checking profiles table: ${createError.message}`);
    } else {
      console.log('✅ Profiles table already exists');
    }
    
    // Verify the admin user exists in auth.users
    const adminEmail = process.env.ADMIN_EMAIL || 'chris.t@ventarosales.com';
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('❌ Error getting users:', getUserError.message);
      return;
    }
    
    const adminUser = users.find(user => user.email === adminEmail);
    
    if (!adminUser) {
      console.log(`❌ User with email ${adminEmail} not found in auth.users`);
      console.log('Please sign up with this email first.');
      return;
    }
    
    console.log('✅ Found admin user in auth system!');
    console.log(`User ID: ${adminUser.id}`);
    console.log(`Email: ${adminUser.email}`);
    
    // Check if admin user exists in profiles
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.log(`❌ Error checking admin profile: ${profileError.message}`);
    } else if (!adminProfile) {
      // Create admin profile
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
        console.log(`❌ Error creating admin profile: ${insertError.message}`);
      } else {
        console.log('✅ Created admin profile successfully!');
        console.log(`Admin Status: ${newProfile.is_admin}`);
      }
    } else {
      // Update existing profile to admin
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', adminUser.id)
        .select()
        .single();
      
      if (updateError) {
        console.log(`❌ Error updating profile to admin: ${updateError.message}`);
      } else {
        console.log('✅ Updated user to admin successfully!');
        console.log(`Admin Status: ${updatedProfile.is_admin}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating profiles table:', error.message);
  }
}

async function main() {
  console.log('🔧 Ventaro AI Digital Store Profiles Setup');
  console.log('=========================================\n');
  
  await createProfilesTable();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Visit http://localhost:3003');
  console.log(`3. Login with ${process.env.ADMIN_EMAIL || 'chris.t@ventarosales.com'}`);
  console.log('4. Access admin panel at /admin');
}

main().catch(console.error);