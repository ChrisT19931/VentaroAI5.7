// Script to create products table in Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createProductsTable() {
  console.log('🔧 Creating products table...');
  
  try {
    // Execute SQL to create products table
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      query: `
        -- Create products table
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
    
    if (createTableError) {
      console.error('❌ Error creating products table:', createTableError);
      // Continue anyway as the table might already exist
    } else {
      console.log('✅ Products table created successfully');
    }
    
    // Enable Row Level Security
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      query: `
        -- Enable Row Level Security
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError);
    } else {
      console.log('✅ Row Level Security enabled');
    }
    
    // Create policy for public access
    const { error: policyError } = await supabase.rpc('exec_sql', {
      query: `
        -- Create policy for public access
        CREATE POLICY IF NOT EXISTS "Anyone can view active products" ON products
          FOR SELECT USING (is_active = true);
      `
    });
    
    if (policyError) {
      console.error('❌ Error creating policy:', policyError);
    } else {
      console.log('✅ Policy created successfully');
    }
    
    // Insert sample products
    const { error: insertError } = await supabase.rpc('exec_sql', {
      query: `
        -- Insert sample products if they don't exist
        INSERT INTO products (name, description, price, image_url, category, featured, is_active)
        SELECT 
          'AI Tools Mastery Guide 2025',
          '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
          25.00,
          '/images/products/ai-tools-mastery-guide.svg',
          'E-book',
          true,
          true
        WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'AI Tools Mastery Guide 2025');
        
        INSERT INTO products (name, description, price, image_url, category, featured, is_active)
        SELECT 
          'AI Prompts Arsenal 2025',
          '30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
          10.00,
          '/images/products/ai-prompts-arsenal.svg',
          'AI Prompts',
          true,
          true
        WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'AI Prompts Arsenal 2025');
        
        INSERT INTO products (name, description, price, image_url, category, featured, is_active)
        SELECT 
          'AI Business Strategy Session 2025',
          '60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies to build profitable AI-powered businesses in 2025.',
          497.00,
          '/images/products/ai-business-strategy-session.svg',
          'Coaching',
          true,
          true
        WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'AI Business Strategy Session 2025');
      `
    });
    
    if (insertError) {
      console.error('❌ Error inserting sample products:', insertError);
    } else {
      console.log('✅ Sample products inserted successfully');
    }
    
    // Verify table exists by querying it
    const { data, error: queryError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (queryError) {
      console.error('❌ Error verifying products table:', queryError);
      return false;
    }
    
    console.log('✅ Products table verified successfully');
    console.log('📋 Sample product:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the function
createProductsTable()
  .then(success => {
    if (success) {
      console.log('✅ Database setup completed successfully');
    } else {
      console.error('❌ Database setup failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });