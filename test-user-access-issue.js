require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUserAccess() {
  console.log('🔍 Testing user access issue...');
  console.log('============================================');
  
  const testUserId = '48addffc-6a70-451a-8944-0b86656716c9';
  const testEmail = 'christroiano1993@hotmail.com';
  
  // Test 1: Check purchase records directly from database
  console.log('\n1️⃣ Checking purchase records in database...');
  try {
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', testUserId);
    
    if (error) {
      console.log('❌ Database error:', error.message);
    } else {
      console.log(`✅ Found ${purchases.length} purchase(s):`);
      purchases.forEach(purchase => {
        console.log(`   📦 ${purchase.product_name} (${purchase.product_id})`);
        console.log(`   📧 ${purchase.customer_email}`);
        console.log(`   🆔 ${purchase.user_id}`);
        console.log(`   ---`);
      });
    }
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
  }
  
  // Test 2: Test API endpoint
  console.log('\n2️⃣ Testing API endpoint...');
  const apiUrl = `http://localhost:3003/api/purchases/confirm?userId=${testUserId}&email=${encodeURIComponent(testEmail)}`;
  
  return new Promise((resolve) => {
    const req = http.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(data);
          console.log('   Response:', JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('   Raw response:', data);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ API request error:', err.message);
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ API request timeout');
      req.destroy();
      resolve();
    });
  });
}

// Test 3: Check user authentication
async function testUserAuth() {
  console.log('\n3️⃣ Testing user authentication...');
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Auth error:', error.message);
      return;
    }
    
    const hotmailUser = users.users.find(u => u.email === 'christroiano1993@hotmail.com');
    if (hotmailUser) {
      console.log('✅ Hotmail user found in auth:');
      console.log(`   🆔 ID: ${hotmailUser.id}`);
      console.log(`   📧 Email: ${hotmailUser.email}`);
      console.log(`   ✅ Confirmed: ${hotmailUser.email_confirmed_at ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Hotmail user not found in auth');
    }
  } catch (err) {
    console.log('❌ Auth check error:', err.message);
  }
}

async function main() {
  await testUserAccess();
  await testUserAuth();
  
  console.log('\n🎯 Diagnosis complete!');
  console.log('============================================');
  console.log('If you see purchase records but API fails, there might be:');
  console.log('- Authentication cookie issues');
  console.log('- API endpoint problems');
  console.log('- CORS or request format issues');
  console.log('\n🔗 Try accessing: http://localhost:3003/my-account');
  console.log('🔑 Login with: christroiano1993@hotmail.com / Rabbit5511$$11');
}

main().catch(console.error);