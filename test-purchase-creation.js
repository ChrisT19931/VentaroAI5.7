const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testPurchaseCreation() {
  console.log('Testing purchase creation...');
  
  try {
    // Test inserting a purchase record
    const testPurchase = {
      user_id: null, // Simulating guest purchase
      customer_email: 'test@example.com',
      product_id: 'test-product-1',
      product_name: 'Test Digital Product',
      price: 29.99,
      session_id: 'test-session-123',
      download_url: '/downloads/test-product.pdf'
    };
    
    const { data, error } = await supabase
      .from('purchases')
      .insert(testPurchase)
      .select();
    
    if (error) {
      console.error('Error creating test purchase:', error);
      return false;
    }
    
    console.log('✅ Test purchase created successfully:', data);
    
    // Now test fetching the purchase
    const { data: fetchedPurchases, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', 'test@example.com');
    
    if (fetchError) {
      console.error('Error fetching test purchase:', fetchError);
      return false;
    }
    
    console.log('✅ Test purchase fetched successfully:', fetchedPurchases);
    
    // Clean up - delete the test purchase
    const { error: deleteError } = await supabase
      .from('purchases')
      .delete()
      .eq('customer_email', 'test@example.com');
    
    if (deleteError) {
      console.error('Error deleting test purchase:', deleteError);
    } else {
      console.log('✅ Test purchase cleaned up successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

testPurchaseCreation().then(success => {
  if (success) {
    console.log('\n🎉 Purchase creation test passed!');
  } else {
    console.log('\n❌ Purchase creation test failed!');
  }
  process.exit(success ? 0 : 1);
});