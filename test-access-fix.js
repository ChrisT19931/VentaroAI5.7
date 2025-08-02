const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './fresh-ventaro/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAccessFix() {
  console.log('🔍 Testing AI Prompts Access Fix...');
  
  try {
    // Test user ID from the purchases we saw
    const testUserId = '48addffc-6a70-451a-8944-0b86656716c9';
    
    console.log('\n📋 Checking user purchases...');
    const { data: purchases, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false });
    
    if (purchaseError) {
      console.error('❌ Error fetching purchases:', purchaseError);
      return;
    }
    
    console.log(`✅ Found ${purchases.length} purchases for user:`);
    purchases.forEach(purchase => {
      console.log(`   - Product ID: ${purchase.product_id}`);
      console.log(`   - Product Name: ${purchase.product_name}`);
      console.log(`   - Price: $${purchase.price}`);
      console.log(`   - Created: ${purchase.created_at}`);
      console.log('');
    });
    
    // Test access logic (same as prompts page)
    const hasAccess = purchases.some(purchase => 
      ['prompts', '2', 'ai-prompts-arsenal-2025'].includes(purchase.product_id)
    );
    
    console.log('🔐 Access Check Results:');
    console.log(`   - Has Access: ${hasAccess ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Checking for product_ids: ['prompts', '2', 'ai-prompts-arsenal-2025']`);
    
    const matchingPurchases = purchases.filter(purchase => 
      ['prompts', '2', 'ai-prompts-arsenal-2025'].includes(purchase.product_id)
    );
    
    if (matchingPurchases.length > 0) {
      console.log('\n✅ Matching purchases found:');
      matchingPurchases.forEach(purchase => {
        console.log(`   - ${purchase.product_id}: ${purchase.product_name}`);
      });
    } else {
      console.log('\n❌ No matching purchases found!');
      console.log('Available product_ids in purchases:');
      purchases.forEach(purchase => {
        console.log(`   - ${purchase.product_id}`);
      });
    }
    
    // Test API endpoint
    console.log('\n🌐 Testing /api/purchases/confirm endpoint...');
    const response = await fetch(`http://localhost:3003/api/purchases/confirm?userId=${testUserId}`);
    
    if (response.ok) {
      const apiData = await response.json();
      console.log('✅ API Response:', JSON.stringify(apiData, null, 2));
      
      const apiHasAccess = apiData.purchases?.some(purchase => 
        ['prompts', '2', 'ai-prompts-arsenal-2025'].includes(purchase.product_id)
      );
      
      console.log(`🔐 API Access Check: ${apiHasAccess ? '✅ YES' : '❌ NO'}`);
    } else {
      console.error('❌ API request failed:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAccessFix();