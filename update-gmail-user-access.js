require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateGmailUserAccess() {
  const email = 'christroiano1993@gmail.com';
  
  try {
    console.log(`Checking current purchases for ${email}...`);
    
    // First, check current purchases
    const { data: currentPurchases, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', email);
    
    if (fetchError) {
      console.error('Error fetching current purchases:', fetchError);
      return;
    }
    
    console.log('Current purchases:', currentPurchases);
    
    if (currentPurchases && currentPurchases.length > 0) {
      // Update existing purchase to have access to AI Tools Mastery Guide
      const { data: updateData, error: updateError } = await supabase
        .from('purchases')
        .update({ product_id: 'ebook' })
        .eq('customer_email', email)
        .select();
      
      if (updateError) {
        console.error('Error updating purchase:', updateError);
        return;
      }
      
      console.log('Successfully updated purchase:', updateData);
    } else {
      // Create new purchase record for AI Tools Mastery Guide
      const { data: insertData, error: insertError } = await supabase
        .from('purchases')
        .insert({
          customer_email: email,
          product_id: 'ebook',
          created_at: new Date().toISOString()
        })
        .select();
      
      if (insertError) {
        console.error('Error creating purchase:', insertError);
        return;
      }
      
      console.log('Successfully created purchase:', insertData);
    }
    
    console.log(`✅ ${email} now has access to AI Tools Mastery Guide (product_id: 'ebook')`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateGmailUserAccess();