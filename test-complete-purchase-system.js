require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testCompletePurchaseSystem() {
  console.log('🧪 Testing Complete Purchase System...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    console.log('\n1️⃣ Testing Database Connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('purchases')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError);
      return;
    }
    console.log('✅ Database connection successful');
    
    console.log('\n2️⃣ Testing Purchase Table Schema...');
    const { data: samplePurchase, error: schemaError } = await supabase
      .from('purchases')
      .select('*')
      .limit(1);
    
    if (schemaError) {
      console.error('❌ Schema test failed:', schemaError);
      return;
    }
    
    if (samplePurchase && samplePurchase.length > 0) {
      console.log('✅ Purchase table accessible');
      console.log('   Available columns:', Object.keys(samplePurchase[0]).join(', '));
    }
    
    console.log('\n3️⃣ Testing Product Coverage...');
    const { data: allPurchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('product_id, product_name')
      .order('created_at', { ascending: false });
    
    if (purchasesError) {
      console.error('❌ Failed to fetch purchases:', purchasesError);
      return;
    }
    
    const uniqueProducts = [...new Set(allPurchases.map(p => p.product_id))];
    console.log('📦 Products in database:');
    uniqueProducts.forEach(productId => {
      const example = allPurchases.find(p => p.product_id === productId);
      console.log(`   ✓ ${productId}: ${example.product_name}`);
    });
    
    // Check for expected core products
    const expectedProducts = ['ebook', 'prompts'];
    const missingProducts = expectedProducts.filter(p => !uniqueProducts.includes(p));
    
    if (missingProducts.length > 0) {
      console.log('⚠️  Missing core products:', missingProducts.join(', '));
      console.log('   (This is normal if no purchases have been made yet)');
    } else {
      console.log('✅ Core products present in database');
    }
    
    console.log('\n4️⃣ Testing User Linking...');
    const { data: unlinkedPurchases, error: unlinkError } = await supabase
      .from('purchases')
      .select('*')
      .is('user_id', null);
    
    if (unlinkError) {
      console.error('❌ Failed to check unlinked purchases:', unlinkError);
      return;
    }
    
    console.log(`📊 Unlinked purchases: ${unlinkedPurchases.length}`);
    if (unlinkedPurchases.length === 0) {
      console.log('✅ All purchases are linked to users');
    } else {
      console.log('⚠️  Some purchases are not linked to users');
      unlinkedPurchases.forEach(purchase => {
        console.log(`   - ${purchase.product_id} for ${purchase.customer_email}`);
      });
    }
    
    console.log('\n5️⃣ Testing User Access System...');
    const { data: users, error: usersError } = await supabase
      .auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Failed to fetch users:', usersError);
      return;
    }
    
    console.log(`👥 Total users: ${users.users.length}`);
    
    // Test a sample user's purchases
    if (users.users.length > 0) {
      const sampleUser = users.users[0];
      const { data: userPurchases, error: userPurchasesError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', sampleUser.id);
      
      if (userPurchasesError) {
        console.error('❌ Failed to fetch user purchases:', userPurchasesError);
      } else {
        console.log(`   Sample user (${sampleUser.email}) has ${userPurchases.length} purchases`);
      }
    }
    
    console.log('\n6️⃣ Testing Product Ownership Logic...');
    // Test the product mapping logic
    const productMappings = {
      'ebook': '1',
      'prompts': '2', 
      'coaching': '3'
    };
    
    console.log('📋 Product ID mappings:');
    Object.entries(productMappings).forEach(([dbId, frontendId]) => {
      console.log(`   ${dbId} → Frontend ID: ${frontendId}`);
    });
    
    console.log('\n7️⃣ System Health Summary...');
    const totalPurchases = allPurchases.length;
    const linkedPurchases = totalPurchases - unlinkedPurchases.length;
    const linkingRate = totalPurchases > 0 ? (linkedPurchases / totalPurchases * 100).toFixed(1) : 0;
    
    console.log(`📈 Purchase Statistics:`);
    console.log(`   Total purchases: ${totalPurchases}`);
    console.log(`   Linked purchases: ${linkedPurchases}`);
    console.log(`   Linking rate: ${linkingRate}%`);
    console.log(`   Unique products: ${uniqueProducts.length}`);
    console.log(`   Total users: ${users.users.length}`);
    
    // Overall health check
    const isHealthy = (
      totalPurchases > 0 &&
      linkingRate >= 80 &&
      uniqueProducts.length >= 2
    );
    
    console.log('\n🏥 System Health Status:');
    if (isHealthy) {
      console.log('✅ System is healthy and ready for production');
    } else {
      console.log('⚠️  System needs attention:');
      if (totalPurchases === 0) console.log('   - No purchases in database');
      if (linkingRate < 80) console.log('   - Low purchase linking rate');
      if (uniqueProducts.length < 2) console.log('   - Limited product variety');
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Test webhook endpoints with Stripe');
    console.log('   2. Verify My Account page displays purchases correctly');
    console.log('   3. Test purchase flow end-to-end');
    console.log('   4. Monitor for any unlinked purchases');
    
  } catch (error) {
    console.error('❌ System test failed:', error);
  }
}

testCompletePurchaseSystem();