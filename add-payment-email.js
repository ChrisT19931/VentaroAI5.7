require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function addPaymentEmailColumn() {
  console.log('🔧 Adding payment_email column to purchases table...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // First, check if the column already exists by trying to select it
    const { data, error } = await supabase
      .from('purchases')
      .select('payment_email')
      .limit(1);
    
    if (!error) {
      console.log('✅ payment_email column already exists');
      return;
    }
    
    console.log('⚠️  payment_email column does not exist');
    console.log('\n📋 Manual SQL execution required in Supabase dashboard:');
    console.log('\n1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Run the following SQL:');
    console.log('\n```sql');
    console.log('-- Add payment_email column');
    console.log('ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS payment_email TEXT;');
    console.log('');
    console.log('-- Create index for performance');
    console.log('CREATE INDEX IF NOT EXISTS idx_purchases_payment_email ON public.purchases(payment_email);');
    console.log('');
    console.log('-- Populate existing records');
    console.log('UPDATE public.purchases SET payment_email = customer_email WHERE payment_email IS NULL;');
    console.log('```');
    console.log('\n3. After running the SQL, test again with: node add-payment-email.js');
    
  } catch (error) {
    console.error('❌ Error checking payment_email column:', error);
  }
}

addPaymentEmailColumn();