require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPurchases() {
  try {
    console.log('Testing purchases table...');
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Sample purchases:', JSON.stringify(data, null, 2));
      console.log('Total purchases found:', data.length);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

testPurchases();