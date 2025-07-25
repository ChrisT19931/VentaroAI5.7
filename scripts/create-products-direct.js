const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProductsTable() {
  console.log('🔧 Creating products table in Supabase...');
  
  try {
    // First check if the table exists
    console.log('Checking if products table exists...');
    const { data: checkData, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.log('❌ Error checking products table:', checkError.code, checkError.message);
      console.log('The products table likely does not exist. Please create it manually using the SQL in SUPABASE_SETUP_INSTRUCTIONS.md');
      process.exit(1);
    }
    
    console.log('✅ Products table exists, attempting to insert a test product...');
    
    // Try to insert a product
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: 'AI Tools Mastery Guide 2025',
          description: '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
          price: 25.00,
          image_url: '/images/products/ai-tools-mastery-guide.svg',
          category: 'E-book',
          featured: true,
          is_active: true,
          product_type: 'digital'
        }
      ])
      .select();
    
    if (error) {
      console.log('❌ Error inserting product:', error.code, error.message);
      process.exit(1);
    }
    
    console.log('✅ Product inserted successfully');
    console.log('✅ Products table exists and is working properly');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createProductsTable();