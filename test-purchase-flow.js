require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testPurchaseFlow() {
  console.log('🔍 Testing Purchase Flow System...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // 1. Check existing purchases
    console.log('\n1. Checking existing purchases...');
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (purchasesError) {
      console.error('❌ Error fetching purchases:', purchasesError);
      return;
    }
    
    console.log(`✅ Found ${purchases.length} recent purchases`);
    
    // 2. Check product ID mapping
    console.log('\n2. Checking product ID mapping...');
    const productIds = [...new Set(purchases.map(p => p.product_id))];
    console.log('Product IDs in database:', productIds);
    
    // Expected product IDs based on the code analysis
    const expectedProductIds = ['ebook', 'prompts', 'coaching'];
    console.log('Expected product IDs:', expectedProductIds);
    
    const missingProducts = expectedProductIds.filter(id => !productIds.includes(id));
    if (missingProducts.length > 0) {
      console.log('⚠️  Missing product IDs:', missingProducts);
    } else {
      console.log('✅ All expected product IDs found');
    }
    
    // 3. Check user linking
    console.log('\n3. Checking user linking...');
    const purchasesWithUsers = purchases.filter(p => p.user_id);
    const purchasesWithoutUsers = purchases.filter(p => !p.user_id);
    
    console.log(`✅ Purchases with user_id: ${purchasesWithUsers.length}`);
    console.log(`⚠️  Purchases without user_id: ${purchasesWithoutUsers.length}`);
    
    if (purchasesWithoutUsers.length > 0) {
      console.log('Unlinked purchases:', purchasesWithoutUsers.map(p => ({
        id: p.id,
        email: p.customer_email,
        product: p.product_id,
        created: p.created_at
      })));
    }
    
    // 4. Test a specific user's purchases
    console.log('\n4. Testing user purchase retrieval...');
    if (purchasesWithUsers.length > 0) {
      const testUserId = purchasesWithUsers[0].user_id;
      const { data: userPurchases, error: userError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', testUserId);
      
      if (userError) {
        console.error('❌ Error fetching user purchases:', userError);
      } else {
        console.log(`✅ User ${testUserId} has ${userPurchases.length} purchases`);
        console.log('User products:', userPurchases.map(p => p.product_id));
      }
    }
    
    // 5. Check for payment_email column
    console.log('\n5. Checking payment_email column...');
    const samplePurchase = purchases[0];
    if (samplePurchase && 'payment_email' in samplePurchase) {
      console.log('✅ payment_email column exists');
      const withPaymentEmail = purchases.filter(p => p.payment_email).length;
      console.log(`Records with payment_email: ${withPaymentEmail}/${purchases.length}`);
    } else {
      console.log('⚠️  payment_email column missing - this may cause issues');
    }
    
    // 6. Summary
    console.log('\n📊 SUMMARY:');
    console.log('- Database connection: ✅ Working');
    console.log('- Purchases table: ✅ Accessible');
    console.log(`- Total purchases: ${purchases.length}`);
    console.log(`- Linked to users: ${purchasesWithUsers.length}`);
    console.log(`- Unlinked: ${purchasesWithoutUsers.length}`);
    console.log(`- Product variety: ${productIds.length} different products`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPurchaseFlow();