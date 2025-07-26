const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test basic connection
    console.log('\n📡 Testing basic connection...');
    const { data, error } = await supabase.from('products').select('count');
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      console.log('Error details:', error);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test authentication
    console.log('\n🔐 Testing authentication...');
    const { data: session, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  Auth check failed:', authError.message);
    } else {
      console.log('✅ Auth system accessible');
    }
    
    // Test products table
    console.log('\n📦 Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .limit(5);
    
    if (productsError) {
      console.log('❌ Products table error:', productsError.message);
    } else {
      console.log('✅ Products table accessible');
      console.log('Found', products?.length || 0, 'products');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  console.log('\n' + (success ? '🎉 All tests passed!' : '💥 Some tests failed'));
  process.exit(success ? 0 : 1);
});