const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createCoachingBookingsTable() {
  try {
    console.log('Creating coaching_bookings table...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-coaching-bookings-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Try alternative method if rpc doesn't work
      console.log('RPC method failed, trying direct SQL execution...');
      
      // Split SQL into individual statements
      const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (const statement of statements) {
        const trimmedStatement = statement.trim();
        if (trimmedStatement) {
          console.log('Executing:', trimmedStatement.substring(0, 50) + '...');
          
          // Use the raw query method
          const { error: execError } = await supabase
            .from('coaching_bookings')
            .select('*')
            .limit(0); // This will fail if table doesn't exist, which is expected
          
          // If we get here and the table doesn't exist, we need to create it manually
          // For now, let's just log that we need manual creation
          console.log('Table creation requires manual setup in Supabase dashboard');
          console.log('Please execute the SQL from create-coaching-bookings-table.sql manually');
          break;
        }
      }
    } else {
      console.log('✅ coaching_bookings table created successfully!');
    }
    
  } catch (error) {
    console.error('Error creating coaching_bookings table:', error.message);
    
    // Provide manual instructions
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of scripts/create-coaching-bookings-table.sql');
    console.log('4. Execute the SQL to create the table and policies');
    
    process.exit(1);
  }
}

createCoachingBookingsTable();