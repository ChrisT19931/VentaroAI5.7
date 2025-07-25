const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔧 Testing Supabase connection...');
  
  try {
    // Test basic connection
    console.log('📋 Testing basic query...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Query error:', error);
      return;
    }
    
    console.log('✅ Query successful!');
    console.log('📦 Current products:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('Products found:');
      data.forEach(product => {
        console.log(`  - ${product.name} ($${product.price})`);
      });
    } else {
      console.log('No products found. Attempting to insert a test product...');
      
      const testProduct = {
        name: 'Test Product',
        description: 'This is a test product',
        price: 9.99,
        image_url: '/test.jpg',
        category: 'Test',
        featured: false,
        is_active: true
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([testProduct])
        .select();
      
      if (insertError) {
        console.error('❌ Insert error:', insertError);
      } else {
        console.log('✅ Test product inserted successfully:', insertData);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();