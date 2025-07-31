require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

async function updatePurchaseProductId() {
  const updates = [
    { email: 'christroiano1993@hotmail.com', productId: 'prompts' },
    { email: 'christroiano1993@gmail.com', productId: 'ebook' }
  ];
  for (const { email, productId } of updates) {
    const { data, error } = await adminSupabase.from('purchases').update({ product_id: productId }).eq('customer_email', email);
    if (error) {
      console.error(`Error updating product_id for ${email}:`, error);
    } else {
      console.log(`Updated product_id for ${email}:`, data);
    }
    // Verify
    const { data: verified, error: verifyError } = await adminSupabase.from('purchases').select('id, product_id, customer_email').eq('customer_email', email);
    if (verifyError) {
      console.error(`Error verifying for ${email}:`, verifyError);
    } else {
      console.log(`Verified for ${email}:`, verified);
    }
  }
}

updatePurchaseProductId().catch(console.error);