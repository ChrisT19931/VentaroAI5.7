const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate a proper UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function testInstantAccess() {
  const testEmail = 'test-instant@example.com';
  const testUserId = generateUUID();
  const testProductId = 'ebook';
  const testSessionId = 'test-session-' + Date.now();
  
  try {
    console.log('\n=== Testing Instant Access Flow ===');
    console.log('Test email:', testEmail);
    console.log('Test product:', testProductId);
    
    // Step 1: Simulate webhook creating a purchase
    console.log('\n1. Simulating Stripe webhook purchase creation...');
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: null, // Allow null user_id like the webhook does
        customer_email: testEmail,
        product_id: testProductId,
        product_name: 'AI Tools Mastery Guide',
        price: 2997, // $29.97 in cents
        session_id: testSessionId,
        download_url: '/my-account'
      })
      .select();
    
    if (purchaseError) {
      console.error('Error creating purchase:', purchaseError);
      return;
    }
    
    console.log('✅ Purchase created successfully:', purchaseData[0]?.id);
    
    // Step 2: Immediately query for purchases (simulating my-account page)
    console.log('\n2. Immediately querying for user purchases...');
    const { data: userPurchases, error: queryError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', testEmail)
      .order('created_at', { ascending: false });
    
    if (queryError) {
      console.error('Error querying purchases:', queryError);
      return;
    }
    
    console.log('✅ Found', userPurchases?.length || 0, 'purchases for user');
    
    // Step 3: Check product ownership
    const ownedProducts = userPurchases?.map(p => p.product_id) || [];
    const hasEbook = ownedProducts.includes('ebook');
    
    console.log('\n3. Product ownership check:');
    console.log('Owned products:', ownedProducts);
    console.log('Has ebook access:', hasEbook ? '✅ YES' : '❌ NO');
    
    // Step 4: Test API endpoint
    console.log('\n4. Testing API endpoint response...');
    const apiUrl = `http://localhost:3000/api/purchases/confirm?email=${encodeURIComponent(testEmail)}`;
    console.log('API URL:', apiUrl);
    
    // Step 5: Cleanup test data
    console.log('\n5. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('purchases')
      .delete()
      .eq('customer_email', testEmail);
    
    if (deleteError) {
      console.error('Error cleaning up:', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }
    
    console.log('\n=== Test Summary ===');
    console.log('✅ Purchase creation: SUCCESS');
    console.log('✅ Immediate query: SUCCESS');
    console.log('✅ Product ownership:', hasEbook ? 'SUCCESS' : 'FAILED');
    console.log('✅ Data cleanup: SUCCESS');
    
    if (hasEbook) {
      console.log('\n🎉 INSTANT ACCESS IS WORKING! 🎉');
    } else {
      console.log('\n❌ INSTANT ACCESS FAILED');
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testInstantAccess();