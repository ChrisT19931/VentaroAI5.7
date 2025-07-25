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

async function setupDatabase() {
  console.log('🔧 Setting up Supabase database tables...');
  
  try {
    console.log('📋 Checking if tables exist...');
    
    // Check if products table exists by trying to query it
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('❌ Products table does not exist. Please create the database tables manually.');
      console.log('\n📋 To create tables, run these SQL commands in your Supabase dashboard:');
      console.log('\n1. Go to your Supabase project dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Run the SQL commands from SUPABASE_SETUP.md');
      console.log('\nOr copy and paste this SQL:');
      console.log(`
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  file_url TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);`);
      process.exit(1);
    }
    
    console.log('✅ Tables exist, proceeding with product insertion...');
    
    // Insert sample products
    console.log('📦 Inserting sample products...');
    
    const products = [
      {
        name: 'AI Tools Mastery Guide 2025',
        description: '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
        price: 25.00,
        image_url: '/images/products/ai-tools-mastery-guide.svg',
        category: 'E-book',
        featured: true,
        is_active: true
      },
      {
        name: 'AI Prompts Arsenal 2025',
        description: '30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
        price: 10.00,
        image_url: '/images/products/ai-prompts-arsenal.svg',
        category: 'AI Prompts',
        featured: true,
        is_active: true
      },
      {
        name: 'AI Business Strategy Session 2025',
        description: '60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies to build profitable AI-powered businesses in 2025.',
        price: 497.00,
        image_url: '/images/products/ai-business-strategy-session.svg',
        category: 'Coaching',
        featured: true,
        is_active: true
      }
    ];
    
    // Check if products already exist
    const { data: currentProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (currentProducts && currentProducts.length > 0) {
      console.log('✅ Products already exist, skipping insertion.');
    } else {
      const { data: insertedProducts, error: insertError } = await supabase
        .from('products')
        .insert(products)
        .select();
      
      if (insertError) {
        console.error('❌ Error inserting products:', insertError);
        console.error('Error details:', JSON.stringify(insertError, null, 2));
      } else {
        console.log(`✅ Inserted ${insertedProducts.length} products successfully!`);
        insertedProducts.forEach(product => {
          console.log(`   - ${product.name} ($${product.price})`);
        });
      }
    }
    
    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the products API: curl http://localhost:3000/api/products');
    console.log('2. Try adding products to cart and checkout');
    console.log('3. Check payment flow with Stripe');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();