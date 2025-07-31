const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUserPurchases() {
  try {
    console.log('🔍 Fetching user purchases...');
    
    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }
    
    console.log('Users data type:', typeof users);
    console.log('Users data:', users);
    
    // Handle the case where users might be wrapped in a users property
    const usersList = Array.isArray(users) ? users : (users?.users || []);
    console.log('Users list length:', usersList.length);
    
    // Get all purchases
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (purchasesError) {
      console.error('❌ Error fetching purchases:', purchasesError.message);
      console.log('Note: This might be because the purchases table doesn\'t exist yet.');
      return;
    }
    
    console.log('\n📋 User Purchase Summary:');
    console.log('=' .repeat(70));
    
    // Group purchases by user
    const purchasesByUser = {};
    const purchasesByEmail = {};
    
    purchases.forEach(purchase => {
      if (purchase.user_id) {
        if (!purchasesByUser[purchase.user_id]) {
          purchasesByUser[purchase.user_id] = [];
        }
        purchasesByUser[purchase.user_id].push(purchase);
      }
      
      if (purchase.customer_email) {
        if (!purchasesByEmail[purchase.customer_email]) {
          purchasesByEmail[purchase.customer_email] = [];
        }
        purchasesByEmail[purchase.customer_email].push(purchase);
      }
    });
    
    // Display purchases for each user
    usersList.forEach((user, index) => {
      console.log(`\n${index + 1}. 👤 ${user.email}`);
      console.log(`   🆔 User ID: ${user.id}`);
      console.log(`   📅 Account Created: ${new Date(user.created_at).toLocaleString()}`);
      
      // Check purchases by user_id
      const userPurchases = purchasesByUser[user.id] || [];
      // Check purchases by email (for guest purchases)
      const emailPurchases = purchasesByEmail[user.email] || [];
      
      // Combine and deduplicate
      const allPurchases = [...userPurchases];
      emailPurchases.forEach(emailPurchase => {
        if (!allPurchases.find(p => p.id === emailPurchase.id)) {
          allPurchases.push(emailPurchase);
        }
      });
      
      if (allPurchases.length === 0) {
        console.log(`   🛒 Purchases: None`);
      } else {
        console.log(`   🛒 Purchases: ${allPurchases.length} item(s)`);
        
        allPurchases.forEach((purchase, pIndex) => {
          console.log(`      ${pIndex + 1}. 📦 ${purchase.product_name || 'Unknown Product'}`);
          console.log(`         💰 Price: $${purchase.price || 'N/A'}`);
          console.log(`         📅 Purchased: ${new Date(purchase.created_at).toLocaleString()}`);
          console.log(`         🆔 Product ID: ${purchase.product_id}`);
          console.log(`         📧 Email: ${purchase.customer_email}`);
          console.log(`         🔗 Session ID: ${purchase.session_id || 'N/A'}`);
          if (purchase.download_url) {
            console.log(`         📥 Download: Available`);
          }
          console.log(`         ---`);
        });
      }
      
      console.log('   ' + '-'.repeat(60));
    });
    
    // Summary statistics
    console.log(`\n📊 Purchase Statistics:`);
    console.log(`   👥 Total Users: ${usersList.length}`);
    console.log(`   🛒 Total Purchases: ${purchases.length}`);
    console.log(`   💰 Total Revenue: $${purchases.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0).toFixed(2)}`);
    
    const usersWithPurchases = usersList.filter(user => {
      const userPurchases = purchasesByUser[user.id] || [];
      const emailPurchases = purchasesByEmail[user.email] || [];
      return userPurchases.length > 0 || emailPurchases.length > 0;
    });
    
    console.log(`   🛍️  Users with Purchases: ${usersWithPurchases.length}`);
    console.log(`   📈 Conversion Rate: ${((usersWithPurchases.length / usersList.length) * 100).toFixed(1)}%`);
    
    // Show recent purchases
    if (purchases.length > 0) {
      console.log(`\n🕒 Recent Purchases (Last 5):`);
      purchases.slice(0, 5).forEach((purchase, index) => {
        console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price} by ${purchase.customer_email}`);
        console.log(`      📅 ${new Date(purchase.created_at).toLocaleString()}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkUserPurchases();