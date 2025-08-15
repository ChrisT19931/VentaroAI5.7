const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client
const supabase = createClient(
  'https://xyzcompany.supabase.co', // Replace with actual URL
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Product ID mapping function
function mapStripeProductToInternal(productName, stripeProductId) {
  if (!productName) return stripeProductId;
  
  const name = productName.toLowerCase();
  
  if (name.includes('prompt') || name.includes('ai prompts')) {
    return 'prompts';
  } else if (name.includes('e-book') || name.includes('ebook') || name.includes('mastery guide')) {
    return 'ebook';
  } else if (name.includes('coaching') || name.includes('session')) {
    return 'coaching';
  } else if (name.includes('masterclass') || name.includes('video')) {
    return 'video';
  } else if (name.includes('support')) {
    return 'support';
  }
  
  return stripeProductId; // Keep original if no mapping found
}

async function fixPurchaseProductIds() {
  try {
    console.log('🔧 Starting purchase product ID fix...');
    
    // Get all purchases
    const { data: purchases, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching purchases:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${purchases.length} purchases to check`);
    
    let fixedCount = 0;
    
    for (const purchase of purchases) {
      const currentProductId = purchase.product_id;
      const productName = purchase.product_name || '';
      
      // Check if this looks like a Stripe product ID (starts with prod_)
      if (currentProductId && currentProductId.startsWith('prod_')) {
        const mappedId = mapStripeProductToInternal(productName, currentProductId);
        
        if (mappedId !== currentProductId) {
          console.log(`🔄 Fixing purchase ${purchase.id}: ${currentProductId} -> ${mappedId} (${productName})`);
          
          const { error: updateError } = await supabase
            .from('purchases')
            .update({ 
              product_id: mappedId,
              updated_at: new Date().toISOString() 
            })
            .eq('id', purchase.id);
          
          if (updateError) {
            console.error(`❌ Error updating purchase ${purchase.id}:`, updateError);
          } else {
            fixedCount++;
            console.log(`✅ Fixed purchase ${purchase.id} for ${purchase.customer_email}`);
          }
        }
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} purchases with incorrect product IDs`);
    console.log('✅ Purchase product ID fix completed!');
    
  } catch (error) {
    console.error('❌ Error in fix script:', error);
  }
}

// Run the fix
fixPurchaseProductIds(); 