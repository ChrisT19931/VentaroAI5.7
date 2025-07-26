#!/usr/bin/env node

/**
 * Quick Admin Setup Script
 * 
 * This script creates the profiles table and sets up the admin user using Supabase client.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user directly...');
    
    // First, let's try to insert the admin user directly
    // This will work if the table exists, or fail gracefully if it doesn't
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: '67eb6090-0146-4263-b0f1-a7f54b60e870',
        email: 'chris.t@ventarosales.com',
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select();
    
    if (error) {
      console.log('❌ Error setting up admin user:', error);
      
      // If the table doesn't exist, let's try to create it using a different approach
      if (error.message && error.message.includes('relation "public.profiles" does not exist')) {
        console.log('🔧 Table does not exist. Let\'s try to create it manually...');
        
        // Try to create the table using raw SQL through the REST API
        const createTableResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: `
              CREATE TABLE IF NOT EXISTS public.profiles (
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
        
        console.log('Table creation response status:', createTableResponse.status);
        
        // Now try to insert the admin user again
        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .upsert({
            id: '67eb6090-0146-4263-b0f1-a7f54b60e870',
            email: 'chris.t@ventarosales.com',
            is_admin: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })
          .select();
        
        if (retryError) {
          console.log('❌ Retry error:', retryError.message);
        } else {
          console.log('✅ Admin user set up successfully on retry!');
          console.log('Admin profile:', retryData[0]);
        }
      }
    } else {
      console.log('✅ Admin user set up successfully!');
      console.log('Admin profile:', data[0]);
    }
    
    // Verify the setup
    console.log('🔍 Verifying admin setup...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'chris.t@ventarosales.com')
      .single();
    
    if (verifyError) {
      console.log('❌ Error verifying admin setup:', verifyError.message);
    } else {
      console.log('✅ Verification successful!');
      console.log('Admin user details:', verifyData);
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
  }
}

setupAdmin().then(() => {
  console.log('\n🎉 Setup complete! You should now have admin access.');
  console.log('Please refresh your browser and try accessing the content again.');
}).catch(console.error);