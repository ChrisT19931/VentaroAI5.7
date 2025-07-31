const { createClient } = require('@supabase/supabase-js');

// Use the correct Supabase configuration from .env.local
const supabase = createClient(
  'https://bamqdxclctzwyplecoxt.supabase.co/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbXFkeGNsY3R6d3lwbGVjb3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODIxMzksImV4cCI6MjA2ODc1ODEzOX0.IFwY38wp5MdxDQweGgRic5eIFFKguza-6dGNnvmGoEc'
);

async function addPurchaseToCorrectDB() {
  console.log('🔍 Adding AI Prompts purchase to correct Supabase instance...');
  
  const purchaseData = {
    product_id: 'ai-prompts-arsenal-2025',
    product_name: 'AI Prompts Arsenal 2025',
    price: 10.00,
    customer_email: 'christroiano1993@hotmail.com',
    user_id: null,
    stripe_session_id: 'manual-add-' + Date.now(),
    download_url: 'https://example.com/downloads/ai-prompts-arsenal-2025.zip',
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('purchases')
    .insert([purchaseData])
    .select();

  if (error) {
    console.error('❌ Error adding purchase:', error);
  } else {
    console.log('✅ Purchase added successfully:', data);
  }

  // Verify the purchase was added
  const { data: verifyData, error: verifyError } = await supabase
    .from('purchases')
    .select('*')
    .eq('customer_email', 'christroiano1993@hotmail.com');

  if (verifyError) {
    console.error('❌ Error verifying purchase:', verifyError);
  } else {
    console.log('🔍 Verification - Purchases found:', verifyData.length);
    verifyData.forEach((purchase, index) => {
      console.log(`   ${index + 1}. ${purchase.product_name} - $${purchase.price}`);
    });
  }
}

addPurchaseToCorrectDB().catch(console.error);