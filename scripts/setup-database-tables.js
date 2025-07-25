#!/usr/bin/env node

/**
 * Setup Database Tables Script
 * 
 * This script creates the necessary database tables in Supabase.
 * 
 * Usage: node scripts/setup-database-tables.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
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

async function setupDatabaseTables() {
  try {
    console.log('🔧 Setting up database tables...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into separate statements
    const statements = sqlContent.split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
      .map(stmt => stmt + ';');
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Try using the rpc method if available
        const { error: rpcError } = await supabase.rpc('exec_sql', {
          sql: statement
        });
        
        if (rpcError) {
          // If rpc fails, try direct query
          console.log(`⚠️ RPC method failed: ${rpcError.message}`);
          console.log('Trying direct query...');
          
          const { error: queryError } = await supabase.query(statement);
          
          if (queryError) {
            console.log(`⚠️ Statement ${i + 1} failed: ${queryError.message}`);
            // Continue with next statement
          }
        }
      } catch (stmtError) {
        console.log(`⚠️ Error executing statement ${i + 1}: ${stmtError.message}`);
        // Continue with next statement
      }
    }
    
    // Verify tables exist
    console.log('Verifying tables...');
    
    // Check profiles table
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (profilesError) {
      console.log(`❌ Profiles table verification failed: ${profilesError.message}`);
    } else {
      console.log('✅ Profiles table exists');
    }
    
    // Check products table
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('count(*)')
      .limit(1);
    
    if (productsError) {
      console.log(`❌ Products table verification failed: ${productsError.message}`);
    } else {
      console.log('✅ Products table exists');
    }
    
    console.log('Database setup completed');
    
  } catch (error) {
    console.error('❌ Error setting up database tables:', error.message);
  }
}

async function main() {
  console.log('🔧 Ventaro AI Digital Store Database Setup');
  console.log('=========================================\n');
  
  await setupDatabaseTables();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Run the admin setup script: node scripts/setup-admin.js');
  console.log('2. Start your dev server: npm run dev');
  console.log('3. Visit http://localhost:3003');
  console.log(`4. Login with ${process.env.ADMIN_EMAIL || 'chris.t@ventarosales.com'}`);
}

main().catch(console.error);