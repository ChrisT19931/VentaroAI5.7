const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing required environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('🔧 Setting up Supabase database...');

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  try {
    console.log('\n📝 Inserting sample products directly...');
    
    // Try to insert products - this will work if the table exists
    const { data: insertData, error: insertError } = await supabase
      .from('products')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'AI Tools Mastery Guide 2025',
          description: '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
          price: 25.00,
          image_url: '/images/products/ai-tools-mastery-guide.svg',
          category: 'E-book',
          featured: true,
          is_active: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'AI Prompts Arsenal 2025',
          description: '30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
          price: 10.00,
          image_url: '/images/products/ai-prompts-arsenal.svg',
          category: 'AI Prompts',
          featured: true,
          is_active: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'AI Business Strategy Session 2025',
          description: '60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies to build profitable AI-powered businesses in 2025.',
          price: 497.00,
          image_url: '/images/products/ai-business-strategy-session.svg',
          category: 'Coaching',
          featured: true,
          is_active: true
        }
      ], {
        onConflict: 'id'
      });
    
    if (insertError) {
      console.log('⚠️  Products table might not exist. Error:', insertError.message);
      console.log('\n🔍 Let me check what tables exist...');
      
      // Try to query system tables to see what exists
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_schema_tables');
      
      if (tablesError) {
        console.log('❌ Cannot check existing tables:', tablesError.message);
        console.log('\n💡 The database might need to be set up manually in Supabase dashboard.');
        console.log('\n📋 Please run this SQL in your Supabase SQL Editor:');
        console.log('\n```sql');
        console.log('-- Create products table');
        console.log('CREATE TABLE IF NOT EXISTS products (');
        console.log('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
        console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
        console.log('  name TEXT NOT NULL,');
        console.log('  description TEXT NOT NULL,');
        console.log('  price DECIMAL(10,2) NOT NULL,');
        console.log('  image_url TEXT,');
        console.log('  file_url TEXT,');
        console.log('  category TEXT,');
        console.log('  featured BOOLEAN DEFAULT FALSE,');
        console.log('  is_active BOOLEAN DEFAULT TRUE');
        console.log(');');
        console.log('');
        console.log('-- Enable RLS');
        console.log('ALTER TABLE products ENABLE ROW LEVEL SECURITY;');
        console.log('');
        console.log('-- Create policy for public access');
        console.log('CREATE POLICY "Anyone can view active products" ON products');
        console.log('  FOR SELECT USING (is_active = true);');
        console.log('```');
        return false;
      }
    } else {
      console.log('✅ Sample products inserted successfully');
    }
    
    // Test the connection
    console.log('\n🧪 Testing database connection...');
    const { data: products, error: testError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(5);
    
    if (testError) {
      console.log('❌ Database test failed:', testError.message);
      return false;
    } else {
      console.log('✅ Database test successful!');
      console.log('📊 Found', products?.length || 0, 'products:');
      products?.forEach(product => {
        console.log(`  - ${product.name}: $${product.price}`);
      });
      return true;
    }
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    return false;
  }
}

setupDatabase().then(success => {
  console.log('\n' + (success ? '🎉 Database setup completed successfully!' : '💥 Database setup failed - please check Supabase dashboard'));
  process.exit(success ? 0 : 1);
});