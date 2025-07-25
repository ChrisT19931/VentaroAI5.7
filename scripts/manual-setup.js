const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Key:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🔧 Setting up database manually...');
  
  try {
    // First, let's try to create the table using a direct SQL approach
    console.log('📋 Creating products table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.products (
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
    `;
    
    // Try using the SQL editor endpoint directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql: createTableSQL
      })
    });
    
    if (response.ok) {
      console.log('✅ Table creation request sent');
    } else {
      console.log('⚠️ Table creation response:', response.status, await response.text());
    }
    
    // Wait a moment for the table to be created
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Now try to insert data
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
    
    const { data, error } = await supabase
      .from('products')
      .insert(products);
    
    if (error) {
      console.error('❌ Error inserting products:', error);
      
      // Try alternative approach - direct REST API
      console.log('🔄 Trying direct REST API insertion...');
      
      for (const product of products) {
        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(product)
        });
        
        if (insertResponse.ok) {
          console.log(`✅ Inserted: ${product.name}`);
        } else {
          console.log(`❌ Failed to insert ${product.name}:`, insertResponse.status, await insertResponse.text());
        }
      }
    } else {
      console.log('✅ Products inserted successfully');
    }
    
    // Verify the setup
    console.log('🔍 Verifying setup...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('*');
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log(`✅ Database setup complete! Found ${verifyData.length} products.`);
      verifyData.forEach(product => {
        console.log(`  - ${product.name}: $${product.price}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupDatabase();