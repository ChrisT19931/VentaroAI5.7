require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function addCoachingProduct() {
  console.log('🔧 Adding coaching product to database...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Check if coaching product already exists in purchases
    const { data: existingCoaching, error: checkError } = await supabase
      .from('purchases')
      .select('*')
      .eq('product_id', 'coaching')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking for coaching product:', checkError);
      return;
    }
    
    if (existingCoaching && existingCoaching.length > 0) {
      console.log('✅ Coaching product already exists in purchases table');
      return;
    }
    
    console.log('ℹ️  No coaching product found in purchases table');
    console.log('   This is normal if no coaching sessions have been purchased yet');
    console.log('   The webhook will handle coaching purchases when they occur');
    
    // Let's also check what products currently exist
    const { data: allProducts, error: productsError } = await supabase
      .from('purchases')
      .select('product_id, product_name')
      .order('created_at', { ascending: false });
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    const uniqueProducts = [...new Set(allProducts.map(p => p.product_id))];
    console.log('\n📦 Current products in database:');
    uniqueProducts.forEach(productId => {
      const example = allProducts.find(p => p.product_id === productId);
      console.log(`   - ${productId}: ${example.product_name}`);
    });
    
    console.log('\n✅ System is ready to handle coaching purchases when they occur');
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

addCoachingProduct();