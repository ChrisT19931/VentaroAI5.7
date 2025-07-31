const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = 'https://bamqdxclctzwyplecoxt.supabase.co/';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbXFkeGNsY3R6d3lwbGVjb3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE4MjEzOSwiZXhwIjoyMDY4NzU4MTM5fQ.CXjE_ervKvj8ySUEYRbIUSrTQWhC-fy0VpMziKZNA2A';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const targetUserId = '5383d4eb-8971-41d5-80ca-1798bd23ab7b';
const userEmail = 'christrabbit11@outlook.com';

async function testFixedPurchase() {
  try {
    console.log(`🧪 Testing fixed purchase access for user: ${targetUserId}`);
    console.log(`   Email: ${userEmail}`);
    
    // 1. Verify database state
    console.log('\n1. Verifying database state...');
    const { data: purchases, error: dbError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });
    
    if (dbError) {
      console.error('❌ Database error:', dbError);
      return;
    }
    
    console.log(`✅ Database shows ${purchases.length} purchases for user:`);
    purchases.forEach((purchase, index) => {
      console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price}`);
      console.log(`      Email: ${purchase.customer_email}`);
      console.log(`      User ID: ${purchase.user_id}`);
      console.log(`      Product ID: ${purchase.product_id}`);
    });
    
    // 2. Test API endpoint with userId
    console.log('\n2. Testing API endpoint with userId...');
    try {
      const response = await fetch(`http://localhost:3003/api/purchases/confirm?userId=${targetUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API response successful:`);
        console.log(`   Found ${data.purchases?.length || 0} purchases`);
        
        if (data.purchases && data.purchases.length > 0) {
          data.purchases.forEach((purchase, index) => {
            console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price}`);
          });
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ API failed with status ${response.status}:`);
        console.log(`   ${errorText}`);
      }
    } catch (apiError) {
      console.log(`❌ API request failed: ${apiError.message}`);
    }
    
    // 3. Test API endpoint with email
    console.log('\n3. Testing API endpoint with email...');
    try {
      const response = await fetch(`http://localhost:3003/api/purchases/confirm?email=${encodeURIComponent(userEmail)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API response successful:`);
        console.log(`   Found ${data.purchases?.length || 0} purchases`);
        
        if (data.purchases && data.purchases.length > 0) {
          data.purchases.forEach((purchase, index) => {
            console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price}`);
          });
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ API failed with status ${response.status}:`);
        console.log(`   ${errorText}`);
      }
    } catch (apiError) {
      console.log(`❌ API request failed: ${apiError.message}`);
    }
    
    // 4. Check product ownership
    console.log('\n4. Testing product ownership...');
    const productIds = purchases.map(p => p.product_id);
    
    for (const productId of productIds) {
      try {
        const response = await fetch(`http://localhost:3003/api/products/${productId}/check-ownership?userId=${targetUserId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Product ${productId}: Owned = ${data.owned}`);
        } else {
          console.log(`❌ Product ${productId}: Check failed (${response.status})`);
        }
      } catch (error) {
        console.log(`❌ Product ${productId}: Check error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testFixedPurchase().then(() => {
  console.log('\n🏁 Test complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});