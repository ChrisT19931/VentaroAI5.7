const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or service key is missing. Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file.');
  process.exit(1);
}

const adminSupabase = createClient(supabaseUrl, supabaseKey);

const updateUserProductId = async () => {
  const userEmail = 'christroiano1993@hotmail.com';
  const newProductId = 'prompts';

  try {
    // Update the product_id for all purchases by this user's email
    const { data: updatedPurchases, error: updateError } = await adminSupabase
      .from('purchases')
      .update({ product_id: newProductId })
      .eq('customer_email', userEmail);

    if (updateError) {
      console.error(`Error updating product_id for user ${userEmail}:`, updateError.message);
      return;
    }

    console.log(`Successfully updated product_id to '${newProductId}' for user ${userEmail}.`);

  } catch (error) {
    console.error('An unexpected error occurred:', error.message);
  }
};

updateUserProductId();