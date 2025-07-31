const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addUniqueConstraint() {
  try {
    console.log('Adding unique constraint to purchases table...');
    
    // First, let's check if the constraint already exists
    const { data: constraints, error: checkError } = await supabase
      .rpc('sql', {
        query: `
          SELECT constraint_name 
          FROM information_schema.table_constraints 
          WHERE table_name = 'purchases' 
          AND constraint_type = 'UNIQUE'
          AND constraint_name = 'idx_purchases_unique_purchase';
        `
      });
    
    if (checkError) {
      console.log('Cannot check existing constraints, proceeding with creation...');
    } else if (constraints && constraints.length > 0) {
      console.log('✅ Unique constraint already exists');
      return;
    }
    
    // Add the unique constraint
    const { data, error } = await supabase
      .rpc('sql', {
        query: `
          CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_unique_purchase 
          ON public.purchases (customer_email, product_id, session_id) 
          WHERE session_id IS NOT NULL;
        `
      });
    
    if (error) {
      console.error('Error adding unique constraint:', error);
      
      // Try alternative approach using ALTER TABLE
      console.log('Trying alternative approach...');
      const { data: altData, error: altError } = await supabase
        .rpc('sql', {
          query: `
            ALTER TABLE public.purchases 
            ADD CONSTRAINT idx_purchases_unique_purchase 
            UNIQUE (customer_email, product_id, session_id);
          `
        });
      
      if (altError) {
        console.error('Alternative approach also failed:', altError);
        return;
      }
      
      console.log('✅ Unique constraint added successfully (alternative method)');
    } else {
      console.log('✅ Unique constraint added successfully');
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

addUniqueConstraint();