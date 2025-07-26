#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script sets up the profiles table using a different approach.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
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

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    // Let's try a simpler approach - just create the admin user record
    // by bypassing the profiles table and updating the auth.users metadata directly
    
    console.log('🔧 Updating user metadata...');
    
    // Update the user's metadata to include admin flag
    const { data: userData, error: userError } = await supabase.auth.admin.updateUserById(
      '67eb6090-0146-4263-b0f1-a7f54b60e870',
      {
        user_metadata: {
          is_admin: true,
          email: 'chris.t@ventarosales.com'
        }
      }
    );
    
    if (userError) {
      console.log('❌ Error updating user metadata:', userError.message);
    } else {
      console.log('✅ User metadata updated successfully!');
      console.log('User data:', userData.user);
    }
    
    // Also try to create a simple profiles table without RLS for now
    console.log('🔧 Creating simple profiles table...');
    
    // Try using the SQL through a different method
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Try to execute using a raw query approach
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: createTableSQL
        })
      });
      
      console.log('Table creation response:', response.status, response.statusText);
    } catch (fetchError) {
      console.log('Fetch error:', fetchError.message);
    }
    
    // Now try to insert the admin record
    console.log('🔧 Inserting admin record...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: '67eb6090-0146-4263-b0f1-a7f54b60e870',
        email: 'chris.t@ventarosales.com',
        is_admin: true
      })
      .select();
    
    if (insertError) {
      console.log('❌ Insert error:', insertError);
    } else {
      console.log('✅ Admin record inserted successfully!');
      console.log('Insert data:', insertData);
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
  }
}

setupDatabase().then(() => {
  console.log('\n🎉 Database setup complete!');
  console.log('Please refresh your browser and try accessing the content again.');
}).catch(console.error);