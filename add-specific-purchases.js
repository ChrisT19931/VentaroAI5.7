const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addSpecificPurchases() {
  console.log('Adding specific purchases...');

  const purchases = [
    {
      product_id: 'ai-prompts-arsenal-2025',
      product_name: 'AI Prompts Arsenal 2025',
      price: 10.00,
      customer_email: 'christroiano1993@hotmail.com',
      user_id: null,
      stripe_session_id: 'manual-add-' + Date.now(),
      download_url: 'https://example.com/downloads/ai-prompts-arsenal-2025.zip',
      created_at: new Date().toISOString()
    },
    {
      product_id: 'ai-tools-mastery-guide-2025',
      product_name: 'AI Tools Mastery Guide 2025',
      price: 10.00,
      customer_email: 'christroiano1993@gmail.com',
      user_id: null,
      stripe_session_id: 'manual-add-' + Date.now(),
      download_url: 'https://example.com/downloads/ai-tools-mastery-guide-2025.pdf',
      created_at: new Date().toISOString()
    }
  ];

  for (const purchase of purchases) {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchase])
      .select();

    if (error) {
      console.error('Error adding purchase:', error);
    } else {
      console.log('Purchase added successfully:', data);
    }
  }

  // Verify
  for (const email of ['christroiano1993@hotmail.com', 'christroiano1993@gmail.com']) {
    const { data: verifyData, error: verifyError } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', email);

    if (verifyError) {
      console.error('Error verifying purchase for ' + email + ':', verifyError);
    } else {
      console.log('Purchases for ' + email + ':', verifyData);
    }
  }
}

addSpecificPurchases().catch(console.error);