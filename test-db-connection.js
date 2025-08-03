require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
  console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables');
    return;
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Test purchases table access
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing purchases table:', error);
      return;
    }
    
    console.log('✅ Purchases table accessible');
    console.log('Records found:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('Sample record structure:');
      console.log(JSON.stringify(data[0], null, 2));
    }
    
    // Test table schema
    const { data: schemaData, error: schemaError } = await supabase
      .from('purchases')
      .select('*')
      .limit(0);
    
    if (!schemaError) {
      console.log('✅ Table schema accessible');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testDatabaseConnection();