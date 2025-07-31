const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchemaUpdate() {
  try {
    console.log('Checking purchases table structure...');
    
    // First, let's check if the table exists and see its structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('purchases')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking table:', tableError);
      return;
    }
    
    console.log('Purchases table exists and is accessible');
    console.log('Sample data structure:', tableInfo?.[0] || 'No data found');
    
    // Check if we can query the table successfully
    const { data: purchases, error: queryError } = await supabase
      .from('purchases')
      .select('customer_email, product_id, session_id')
      .limit(5);
    
    if (queryError) {
      console.error('Error querying purchases:', queryError);
    } else {
      console.log('Successfully queried purchases table');
      console.log('Found', purchases?.length || 0, 'purchase records');
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

applySchemaUpdate();