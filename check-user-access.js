require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserAccess() {
  const userEmail = 'christrabbit11@outlook.com';
  
  console.log(`\n=== Checking access for ${userEmail} ===\n`);
  
  // 1. Check user in auth system
  console.log('1. Checking user in auth system...');
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Auth error:', authError);
  } else {
    const user = authUsers.users.find(u => u.email === userEmail);
    if (user) {
      console.log(`✓ User found in auth: ID ${user.id}, Email: ${user.email}`);
      console.log(`  Created: ${user.created_at}`);
      console.log(`  Last sign in: ${user.last_sign_in_at || 'Never'}`);
    } else {
      console.log('✗ User not found in auth system');
    }
  }
  
  // 2. Check purchases by customer_email
  console.log('\n2. Checking purchases by customer_email...');
  const { data: customerPurchases, error: customerError } = await supabase
    .from('purchases')
    .select('*')
    .eq('customer_email', userEmail);
    
  if (customerError) {
    console.error('Customer purchases error:', customerError);
  } else {
    console.log(`Found ${customerPurchases.length} purchases by customer_email:`);
    customerPurchases.forEach(purchase => {
      console.log(`  - ${purchase.product_name} (ID: ${purchase.id})`);
      console.log(`    User ID: ${purchase.user_id}`);
      console.log(`    Customer Email: ${purchase.customer_email}`);
      console.log(`    Payment Email: ${purchase.payment_email || 'N/A'}`);
      console.log(`    Created: ${purchase.created_at}`);
      console.log('');
    });
  }
  
  // 3. Check purchases by payment_email
  console.log('3. Checking purchases by payment_email...');
  const { data: paymentPurchases, error: paymentError } = await supabase
    .from('purchases')
    .select('*')
    .eq('payment_email', userEmail);
    
  if (paymentError) {
    console.error('Payment purchases error:', paymentError);
  } else {
    console.log(`Found ${paymentPurchases.length} purchases by payment_email:`);
    paymentPurchases.forEach(purchase => {
      console.log(`  - ${purchase.product_name} (ID: ${purchase.id})`);
      console.log(`    User ID: ${purchase.user_id}`);
      console.log(`    Customer Email: ${purchase.customer_email}`);
      console.log(`    Payment Email: ${purchase.payment_email}`);
      console.log(`    Created: ${purchase.created_at}`);
      console.log('');
    });
  }
  
  // 4. Test API access
  console.log('4. Testing API access...');
  try {
    const response = await fetch('http://localhost:3003/api/purchases/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail })
    });
    
    if (response.ok) {
      const apiData = await response.json();
      console.log(`✓ API returned ${apiData.length} purchases:`);
      apiData.forEach(purchase => {
        console.log(`  - ${purchase.product_name}`);
      });
    } else {
      console.log(`✗ API error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`✗ API request failed: ${error.message}`);
  }
  
  console.log('\n=== Check complete ===');
}

checkUserAccess().catch(console.error);