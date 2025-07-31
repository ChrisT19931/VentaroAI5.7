const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupFakePurchases() {
  console.log('Cleaning up fake test purchases for christroiano1993@hotmail.com...');
  
  try {
    // Get all purchases for this email
    const { data: allPurchases, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', 'christroiano1993@hotmail.com');
    
    if (fetchError) {
      console.error('Error fetching purchases:', fetchError);
      return;
    }
    
    console.log('Current purchases:', allPurchases.length);
    
    // Find the real AI Prompts purchase
    const realPurchase = allPurchases.find(p => p.product_name === 'AI Prompts Arsenal 2025');
    
    if (!realPurchase) {
      console.log('Real AI Prompts purchase not found!');
      return;
    }
    
    // Find fake purchases (everything except AI Prompts)
    const fakePurchases = allPurchases.filter(p => p.product_name !== 'AI Prompts Arsenal 2025');
    
    console.log('Removing', fakePurchases.length, 'fake purchases...');
    
    // Delete fake purchases
    for (const fake of fakePurchases) {
      const { error: deleteError } = await supabase
        .from('purchases')
        .delete()
        .eq('id', fake.id);
      
      if (deleteError) {
        console.error('Error deleting purchase:', fake.product_name, deleteError);
      } else {
        console.log('✅ Removed fake purchase:', fake.product_name);
      }
    }
    
    // Final verification
    console.log('\nFinal verification - remaining purchases:');
    const { data: finalPurchases } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', 'christroiano1993@hotmail.com');
    
    finalPurchases.forEach(p => console.log('✅', p.product_name, '-', '$' + p.price));
    console.log('\nTotal real purchases:', finalPurchases.length);
    
  } catch (err) {
    console.error('Cleanup failed:', err);
  }
}

cleanupFakePurchases();