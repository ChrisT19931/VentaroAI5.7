require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUsers() {
  try {
    console.log('Testing auth.users table...');
    const { data, error } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .limit(5);
    
    if (error) {
      console.error('Error accessing auth.users:', error);
      
      // Try alternative approach
      console.log('\nTrying to get user info from purchases...');
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .select('user_id, customer_email')
        .not('user_id', 'is', null)
        .limit(5);
        
      if (purchaseError) {
        console.error('Purchase error:', purchaseError);
      } else {
        console.log('Users from purchases:', JSON.stringify(purchaseData, null, 2));
      }
    } else {
      console.log('Users:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

testUsers();