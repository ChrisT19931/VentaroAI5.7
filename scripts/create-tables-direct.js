const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🔧 Creating database tables...');
  
  try {
    // Create products table
    const { error: productsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    
    if (productsError) {
      console.log('⚠️ Products table might already exist or using direct SQL...');
    } else {
      console.log('✅ Products table created');
    }
    
    // Enable RLS and create policy
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Anyone can view active products" ON products;
        CREATE POLICY "Anyone can view active products" ON products
          FOR SELECT USING (is_active = true);
      `
    });
    
    if (rlsError) {
      console.log('⚠️ RLS policy might already exist...');
    }
    
    // Insert sample products
    const { error: insertError } = await supabase
      .from('products')
      .upsert([
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
      ], { onConflict: 'name' });
    
    if (insertError) {
      console.error('❌ Error inserting products:', insertError);
    } else {
      console.log('✅ Sample products inserted');
    }
    
    // Verify products exist
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
    } else {
      console.log(`✅ Found ${products.length} products in database`);
      products.forEach(product => {
        console.log(`  - ${product.name}: $${product.price}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTables();