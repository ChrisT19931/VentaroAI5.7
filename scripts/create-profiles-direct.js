#!/usr/bin/env node

/**
 * Create Profiles Table Script (Direct SQL Execution)
 * 
 * This script creates the profiles table in Supabase using direct SQL execution.
 * 
 * Usage: node scripts/create-profiles-direct.js
 */

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'chris.t@ventarosales.com';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function executeSQL(sql) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql_query: sql
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SQL execution failed: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error executing SQL: ${error.message}`);
    return { error: error.message };
  }
}

async function getUserId() {
  try {
    // Get user ID from auth.users
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_user_id_by_email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        email: adminEmail
      })
    });

    if (!response.ok) {
      // If the RPC function doesn't exist, try a direct query
      console.log('⚠️ RPC function not found, trying direct query...');
      
      // Create the function first
      await executeSQL(`
        CREATE OR REPLACE FUNCTION get_user_id_by_email(email_param TEXT)
        RETURNS UUID
        LANGUAGE SQL
        SECURITY DEFINER
        AS $$
          SELECT id FROM auth.users WHERE email = email_param LIMIT 1;
        $$;
      `);
      
      // Try again
      const retryResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/get_user_id_by_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          email_param: adminEmail
        })
      });
      
      if (!retryResponse.ok) {
        throw new Error('Failed to get user ID after creating function');
      }
      
      const userId = await retryResponse.json();
      return userId;
    }

    const userId = await response.json();
    return userId;
  } catch (error) {
    console.error(`❌ Error getting user ID: ${error.message}`);
    
    // Fallback: Try to create the execute_sql function and query directly
    console.log('Trying fallback method to get user ID...');
    
    try {
      // Create execute_sql function
      await executeSQL(`
        CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          EXECUTE sql_query;
          result := '{"success": true}'::JSONB;
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          result := jsonb_build_object('error', SQLERRM);
          RETURN result;
        END;
        $$;
      `);
      
      // Query for the user ID
      const result = await executeSQL(`
        SELECT id FROM auth.users WHERE email = '${adminEmail}' LIMIT 1;
      `);
      
      if (result && result[0] && result[0].id) {
        return result[0].id;
      }
      
      throw new Error('User ID not found in fallback query');
    } catch (fallbackError) {
      console.error(`❌ Fallback method failed: ${fallbackError.message}`);
      return null;
    }
  }
}

async function createProfilesTable() {
  console.log('🔧 Creating profiles table...');
  
  const createTableResult = await executeSQL(`
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      first_name TEXT,
      last_name TEXT,
      email TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE
    );

    -- Set up Row Level Security (RLS)
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Create policies
    -- Allow users to view their own profile
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
      ) THEN
        CREATE POLICY "Users can view own profile"
          ON public.profiles
          FOR SELECT
          USING (auth.uid() = id);
      END IF;
    END
    $$;

    -- Allow users to update their own profile
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
      ) THEN
        CREATE POLICY "Users can update own profile"
          ON public.profiles
          FOR UPDATE
          USING (auth.uid() = id);
      END IF;
    END
    $$;

    -- Allow users to insert their own profile
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
      ) THEN
        CREATE POLICY "Users can insert own profile"
          ON public.profiles
          FOR INSERT
          WITH CHECK (auth.uid() = id);
      END IF;
    END
    $$;
  `);
  
  if (createTableResult && createTableResult.error) {
    console.log(`⚠️ Table creation might have issues: ${createTableResult.error}`);
  } else {
    console.log('✅ Profiles table created or already exists');
  }
  
  // Get the admin user ID
  const userId = await getUserId();
  
  if (!userId) {
    console.log(`❌ Could not find user with email ${adminEmail}`);
    console.log('Please sign up with this email first.');
    return;
  }
  
  console.log(`✅ Found admin user with ID: ${userId}`);
  
  // Set the user as admin
  console.log('🔧 Setting user as admin...');
  
  const setAdminResult = await executeSQL(`
    INSERT INTO public.profiles (id, email, is_admin)
    VALUES ('${userId}', '${adminEmail}', true)
    ON CONFLICT (id) 
    DO UPDATE SET is_admin = true, updated_at = NOW();
  `);
  
  if (setAdminResult && setAdminResult.error) {
    console.log(`❌ Error setting admin status: ${setAdminResult.error}`);
  } else {
    console.log('✅ User set as admin successfully!');
  }
  
  // Verify admin status
  console.log('🔍 Verifying admin status...');
  
  const verifyResult = await executeSQL(`
    SELECT * FROM public.profiles WHERE email = '${adminEmail}';
  `);
  
  if (verifyResult && verifyResult.error) {
    console.log(`❌ Error verifying admin status: ${verifyResult.error}`);
  } else if (verifyResult && verifyResult.length > 0) {
    const profile = verifyResult[0];
    console.log('✅ Admin profile verified:');
    console.log(`ID: ${profile.id}`);
    console.log(`Email: ${profile.email}`);
    console.log(`Admin Status: ${profile.is_admin}`);
  } else {
    console.log('❌ Admin profile not found in verification query');
  }
}

async function main() {
  console.log('🔧 Ventaro AI Digital Store Profiles Setup');
  console.log('=========================================\n');
  
  try {
    // First, try to create the execute_sql function
    console.log('🔧 Creating SQL execution function...');
    
    await executeSQL(`
      CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result JSONB;
      BEGIN
        EXECUTE sql_query;
        result := '{"success": true}'::JSONB;
        RETURN result;
      EXCEPTION WHEN OTHERS THEN
        result := jsonb_build_object('error', SQLERRM);
        RETURN result;
      END;
      $$;
    `);
    
    console.log('✅ SQL execution function created');
    
    await createProfilesTable();
  } catch (error) {
    console.error(`❌ Setup error: ${error.message}`);
    console.log('\nPlease follow the manual setup instructions in scripts/create-profiles-sql.md');
  }
  
  console.log('\n🎉 Setup process completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Visit http://localhost:3003');
  console.log(`3. Login with ${adminEmail}`);
  console.log('4. Access admin panel at /admin');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  console.log('\nPlease follow the manual setup instructions in scripts/create-profiles-sql.md');
});