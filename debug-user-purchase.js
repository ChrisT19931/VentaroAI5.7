const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key from .env.local
const supabaseUrl = 'https://bamqdxclctzwyplecoxt.supabase.co/';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbXFkeGNsY3R6d3lwbGVjb3h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE4MjEzOSwiZXhwIjoyMDY4NzU4MTM5fQ.CXjE_ervKvj8ySUEYRbIUSrTQWhC-fy0VpMziKZNA2A';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const targetUserId = '5383d4eb-8971-41d5-80ca-1798bd23ab7b';

async function debugUserPurchase() {
  try {
    console.log(`🔍 Debugging purchase issue for user: ${targetUserId}`);
    
    // 1. Check if user exists in auth system
    console.log('\n1. Checking user in auth system...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    const targetUser = authUsers.users.find(u => u.id === targetUserId);
    if (targetUser) {
      console.log('✅ User found in auth system:');
      console.log(`   Email: ${targetUser.email}`);
      console.log(`   Created: ${targetUser.created_at}`);
      console.log(`   Email confirmed: ${targetUser.email_confirmed_at ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ User NOT found in auth system');
    }
    
    // 2. Check purchases by user_id
    console.log('\n2. Checking purchases by user_id...');
    const { data: purchasesByUserId, error: purchasesError1 } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });
    
    if (purchasesError1) {
      console.error('❌ Error fetching purchases by user_id:', purchasesError1);
    } else {
      console.log(`📦 Found ${purchasesByUserId.length} purchases by user_id`);
      purchasesByUserId.forEach((purchase, index) => {
        console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price} (${purchase.created_at})`);
      });
    }
    
    // 3. If user exists, check purchases by email
    if (targetUser) {
      console.log('\n3. Checking purchases by email...');
      const { data: purchasesByEmail, error: purchasesError2 } = await supabase
        .from('purchases')
        .select('*')
        .eq('customer_email', targetUser.email)
        .order('created_at', { ascending: false });
      
      if (purchasesError2) {
        console.error('❌ Error fetching purchases by email:', purchasesError2);
      } else {
        console.log(`📧 Found ${purchasesByEmail.length} purchases by email`);
        purchasesByEmail.forEach((purchase, index) => {
          console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price}`);
          console.log(`      User ID: ${purchase.user_id || 'NULL'}`);
          console.log(`      Email: ${purchase.customer_email}`);
          console.log(`      Created: ${purchase.created_at}`);
        });
        
        // Check if any purchases need linking
        const unlinkePurchases = purchasesByEmail.filter(p => p.user_id !== targetUserId);
        if (unlinkePurchases.length > 0) {
          console.log(`\n⚠️ Found ${unlinkePurchases.length} purchases that need linking:`);
          unlinkePurchases.forEach((purchase, index) => {
            console.log(`   ${index + 1}. Purchase ID: ${purchase.id} (user_id: ${purchase.user_id || 'NULL'})`);
          });
        }
      }
    }
    
    // 4. Test API endpoint
    if (targetUser) {
      console.log('\n4. Testing API endpoint...');
      try {
        // Test with user ID
        console.log('   Testing with userId...');
        const response1 = await fetch(`http://localhost:3000/api/purchases/confirm?userId=${targetUserId}`);
        if (response1.ok) {
          const data1 = await response1.json();
          console.log(`   ✅ API with userId: Found ${data1.purchases?.length || 0} purchases`);
        } else {
          console.log(`   ❌ API with userId failed: ${response1.status}`);
        }
        
        // Test with email
        console.log('   Testing with email...');
        const response2 = await fetch(`http://localhost:3000/api/purchases/confirm?email=${encodeURIComponent(targetUser.email)}`);
        if (response2.ok) {
          const data2 = await response2.json();
          console.log(`   ✅ API with email: Found ${data2.purchases?.length || 0} purchases`);
        } else {
          console.log(`   ❌ API with email failed: ${response2.status}`);
        }
      } catch (apiError) {
        console.log(`   ❌ API test failed: ${apiError.message}`);
      }
    }
    
    // 5. Check recent purchases (last 24 hours) for any clues
    console.log('\n5. Checking recent purchases...');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentPurchases, error: recentError } = await supabase
      .from('purchases')
      .select('*')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false });
    
    if (recentError) {
      console.error('❌ Error fetching recent purchases:', recentError);
    } else {
      console.log(`📅 Found ${recentPurchases.length} recent purchases (last 24h)`);
      recentPurchases.forEach((purchase, index) => {
        console.log(`   ${index + 1}. ${purchase.customer_email} - ${purchase.product_name}`);
        console.log(`      User ID: ${purchase.user_id || 'NULL'}`);
        console.log(`      Created: ${purchase.created_at}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug
debugUserPurchase().then(() => {
  console.log('\n🏁 Debug complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
});