const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProductsTable() {
  console.log('🔧 Creating products table in Supabase...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-products-table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into separate statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement + ';'
      });
      
      if (error) {
        // If exec_sql function doesn't exist, try direct query
        console.log('⚠️ exec_sql function not found, trying direct query...');
        const { error: directError } = await supabase.from('products').select('count(*)').limit(1);
        
        if (directError && directError.code === 'PGRST116') {
          console.log('❌ Products table does not exist and cannot be created via API.');
          console.log('Please follow the instructions in SUPABASE_SETUP_INSTRUCTIONS.md to create the table manually.');
          process.exit(1);
        }
      }
    }
    
    console.log('✅ Products table setup completed successfully');
    
    // Verify the table exists
    const { data, error: verifyError } = await supabase.from('products').select('id').limit(1);
    
    if (verifyError) {
      console.log('❌ Failed to verify products table:', verifyError.message);
      process.exit(1);
    } else {
      console.log('✅ Products table verified successfully');
    }
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

createProductsTable();