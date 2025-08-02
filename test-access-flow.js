const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Product mappings from the config
const PRODUCT_MAPPINGS = {
  'ebook': '1',
  'prompts': '2',
  'coaching': '3'
};

const LEGACY_PRODUCT_MAPPINGS = {
  'ai-prompts-arsenal-2025': '2',
  'ai-tools-mastery-guide-2025': '1',
  'course-web-development': '1',
  'ebook-productivity-guide': '1',
  'graphics-icon-set': '1'
};

// Simulate the product ownership check logic
function checkProductOwnership(userPurchases, targetProductId) {
  console.log(`\n  Checking ownership for product ID: ${targetProductId}`);
  
  for (const purchase of userPurchases) {
    console.log(`    Checking purchase: ${purchase.product_id} (${purchase.product_name})`);
    
    // Direct match
    if (purchase.product_id === targetProductId) {
      console.log(`    ✅ Direct match found: ${purchase.product_id}`);
      return true;
    }
    
    // Check product mappings
    const mappedId = PRODUCT_MAPPINGS[purchase.product_id];
    if (mappedId === targetProductId) {
      console.log(`    ✅ Product mapping match: ${purchase.product_id} -> ${mappedId}`);
      return true;
    }
    
    // Check legacy mappings
    const legacyMappedId = LEGACY_PRODUCT_MAPPINGS[purchase.product_id];
    if (legacyMappedId === targetProductId) {
      console.log(`    ✅ Legacy mapping match: ${purchase.product_id} -> ${legacyMappedId}`);
      return true;
    }
  }
  
  console.log(`    ❌ No ownership found for product ${targetProductId}`);
  return false;
}

async function testAccessFlow() {
  console.log('Testing access flow for purchased content...');
  
  try {
    // Get all purchases
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching purchases:', error);
      return;
    }
    
    // Group purchases by user
    const userPurchases = {};
    purchases.forEach(purchase => {
      if (purchase.user_id) {
        if (!userPurchases[purchase.user_id]) {
          userPurchases[purchase.user_id] = {
            email: purchase.customer_email,
            purchases: []
          };
        }
        userPurchases[purchase.user_id].purchases.push(purchase);
      }
    });
    
    console.log('\n=== TESTING ACCESS FOR EACH USER ===');
    
    // Test access for each user
    Object.keys(userPurchases).forEach(userId => {
      const userData = userPurchases[userId];
      console.log(`\n👤 User: ${userData.email} (ID: ${userId})`);
      console.log(`   Purchases: ${userData.purchases.length}`);
      
      // Test access to different product types
      const testProducts = [
        { id: '1', name: 'eBook/Course Content' },
        { id: '2', name: 'AI Prompts' },
        { id: '3', name: 'Coaching' }
      ];
      
      testProducts.forEach(product => {
        console.log(`\n  🔍 Testing access to ${product.name} (ID: ${product.id}):`);
        const hasAccess = checkProductOwnership(userData.purchases, product.id);
        console.log(`     Result: ${hasAccess ? '✅ ACCESS GRANTED' : '❌ ACCESS DENIED'}`);
      });
      
      // Specific test for prompts access (the main concern)
      console.log(`\n  🎯 PROMPTS ACCESS TEST:`);
      const promptsAccess = checkProductOwnership(userData.purchases, '2') || 
                           userData.purchases.some(p => p.product_id === 'prompts') ||
                           userData.purchases.some(p => p.product_id === 'ai-prompts-arsenal-2025');
      console.log(`     Can access prompts: ${promptsAccess ? '✅ YES' : '❌ NO'}`);
      
      if (promptsAccess) {
        const promptPurchases = userData.purchases.filter(p => 
          p.product_id === 'prompts' || 
          p.product_id === 'ai-prompts-arsenal-2025' ||
          PRODUCT_MAPPINGS[p.product_id] === '2' ||
          LEGACY_PRODUCT_MAPPINGS[p.product_id] === '2'
        );
        console.log(`     Prompt purchases found:`);
        promptPurchases.forEach(p => {
          console.log(`       - ${p.product_name} (${p.product_id}) - ${p.created_at}`);
        });
      }
    });
    
    // Test the API endpoint simulation
    console.log('\n=== SIMULATING /api/purchases/confirm ENDPOINT ===');
    
    for (const userId of Object.keys(userPurchases)) {
      const userData = userPurchases[userId];
      console.log(`\n📡 API Test for ${userData.email}:`);
      
      // Simulate GET request with userId
      const { data: apiPurchases, error: apiError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId);
      
      if (apiError) {
        console.log(`   ❌ API Error: ${apiError.message}`);
      } else {
        console.log(`   ✅ API returned ${apiPurchases.length} purchases`);
        apiPurchases.forEach(p => {
          console.log(`     - ${p.product_name} (${p.product_id})`);
        });
      }
      
      // Test email-based lookup as fallback
      const { data: emailPurchases, error: emailError } = await supabase
        .from('purchases')
        .select('*')
        .eq('customer_email', userData.email);
      
      if (emailError) {
        console.log(`   ❌ Email API Error: ${emailError.message}`);
      } else {
        console.log(`   ✅ Email lookup returned ${emailPurchases.length} purchases`);
      }
    }
    
  } catch (error) {
    console.error('Error testing access flow:', error);
  }
}

testAccessFlow();