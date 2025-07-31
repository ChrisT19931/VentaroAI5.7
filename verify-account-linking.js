const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = 'https://ixjqjqjqjqjqjqjqjqjq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4anFqcWpxanFqcWpxanFqcWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzU1NzE5NCwiZXhwIjoyMDUzMTMzMTk0fQ.example';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyAccountLinking() {
  try {
    console.log('🔍 Checking recent purchases and account linking...');
    
    // Get recent purchases (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentPurchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false });
    
    if (purchasesError) {
      console.error('❌ Error fetching recent purchases:', purchasesError);
      return;
    }
    
    console.log(`📊 Found ${recentPurchases.length} recent purchases`);
    
    if (recentPurchases.length === 0) {
      console.log('ℹ️ No recent purchases found. Checking all purchases...');
      
      // Get all purchases if no recent ones
      const { data: allPurchases, error: allError } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (allError) {
        console.error('❌ Error fetching all purchases:', allError);
        return;
      }
      
      console.log(`📊 Found ${allPurchases.length} total purchases (showing last 10)`);
      
      for (const purchase of allPurchases) {
        await analyzePurchase(purchase);
      }
    } else {
      // Analyze recent purchases
      for (const purchase of recentPurchases) {
        await analyzePurchase(purchase);
      }
    }
    
  } catch (error) {
    console.error('❌ Error in verification:', error);
  }
}

async function analyzePurchase(purchase) {
  console.log('\n' + '='.repeat(50));
  console.log(`📦 Purchase Analysis:`);
  console.log(`   ID: ${purchase.id}`);
  console.log(`   Email: ${purchase.customer_email}`);
  console.log(`   Product: ${purchase.product_name} (${purchase.product_id})`);
  console.log(`   Price: $${purchase.price}`);
  console.log(`   User ID: ${purchase.user_id || 'NULL (not linked)'}`);
  console.log(`   Session ID: ${purchase.session_id}`);
  console.log(`   Created: ${purchase.created_at}`);
  
  // Check if there's a matching user account
  if (purchase.customer_email) {
    const { data: user, error: userError } = await supabase.auth.admin.listUsers();
    
    if (!userError && user.users) {
      const matchingUser = user.users.find(u => u.email === purchase.customer_email);
      
      if (matchingUser) {
        console.log(`✅ Matching user account found:`);
        console.log(`   User ID: ${matchingUser.id}`);
        console.log(`   Email: ${matchingUser.email}`);
        console.log(`   Created: ${matchingUser.created_at}`);
        
        // Check if purchase is properly linked
        if (purchase.user_id === matchingUser.id) {
          console.log(`✅ Purchase is properly linked to user account`);
        } else if (purchase.user_id === null) {
          console.log(`⚠️ Purchase exists but not linked to user account`);
          console.log(`   Recommendation: Update purchase.user_id to ${matchingUser.id}`);
        } else {
          console.log(`❌ Purchase linked to different user ID: ${purchase.user_id}`);
        }
      } else {
        console.log(`❌ No matching user account found for ${purchase.customer_email}`);
        console.log(`   Recommendation: User should create account with this email`);
      }
    }
  }
  
  // Test API access
  console.log(`\n🧪 Testing API access for this purchase...`);
  
  try {
    const response = await fetch(`http://localhost:3000/api/purchases/confirm?email=${encodeURIComponent(purchase.customer_email)}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API accessible - Found ${data.purchases?.length || 0} purchases`);
      
      if (data.purchases && data.purchases.length > 0) {
        const foundPurchase = data.purchases.find(p => p.id === purchase.id);
        if (foundPurchase) {
          console.log(`✅ This specific purchase is accessible via API`);
        } else {
          console.log(`⚠️ This purchase not found in API response`);
        }
      }
    } else {
      console.log(`❌ API not accessible - Status: ${response.status}`);
    }
  } catch (apiError) {
    console.log(`❌ API test failed: ${apiError.message}`);
  }
}

// Run the verification
verifyAccountLinking().then(() => {
  console.log('\n🏁 Verification complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});