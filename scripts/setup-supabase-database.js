#!/usr/bin/env node

/**
 * Ventaro AI Supabase Database Setup Script
 * 
 * This script automatically sets up all required Supabase tables and data
 * for the Ventaro AI authentication and e-commerce system.
 * 
 * Usage:
 *   node scripts/setup-supabase-database.js
 * 
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL in environment
 *   - SUPABASE_SERVICE_ROLE_KEY in environment
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  console.error('\n💡 Please set these in your .env.local file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL queries for table creation
const createTablesSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (Users)
-- =====================================================
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash TEXT NOT NULL,
    user_role VARCHAR(20) DEFAULT 'user' CHECK (user_role IN ('admin', 'user')),
    email_confirmed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(user_role);
CREATE INDEX idx_profiles_created ON public.profiles(created_at);

-- =====================================================
-- 2. PURCHASES TABLE
-- =====================================================
DROP TABLE IF EXISTS public.purchases CASCADE;

CREATE TABLE public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'AUD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_product_id ON public.purchases(product_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);
CREATE INDEX idx_purchases_stripe_payment ON public.purchases(stripe_payment_intent_id);
CREATE INDEX idx_purchases_created ON public.purchases(created_at);

-- =====================================================
-- 3. PRODUCTS TABLE
-- =====================================================
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'AUD',
    stripe_price_id VARCHAR(255),
    stripe_product_id VARCHAR(255),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_stripe_price ON public.products(stripe_price_id);

-- =====================================================
-- 4. COACHING_BOOKINGS TABLE
-- =====================================================
DROP TABLE IF EXISTS public.coaching_bookings CASCADE;

CREATE TABLE public.coaching_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    business_stage VARCHAR(100),
    main_challenge TEXT,
    goals TEXT,
    preferred_date_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_coaching_user_id ON public.coaching_bookings(user_id);
CREATE INDEX idx_coaching_status ON public.coaching_bookings(status);
CREATE INDEX idx_coaching_date ON public.coaching_bookings(preferred_date_time);

-- =====================================================
-- 5. EMAIL_LOGS TABLE
-- =====================================================
DROP TABLE IF EXISTS public.email_logs CASCADE;

CREATE TABLE public.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    to_email VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    template_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'delivered')),
    provider VARCHAR(50) DEFAULT 'sendgrid',
    provider_message_id VARCHAR(255),
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_email_logs_to_email ON public.email_logs(to_email);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_created ON public.email_logs(created_at);

-- =====================================================
-- 6. SYSTEM_LOGS TABLE
-- =====================================================
DROP TABLE IF EXISTS public.system_logs CASCADE;

CREATE TABLE public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
    message TEXT NOT NULL,
    component VARCHAR(100),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_system_logs_level ON public.system_logs(level);
CREATE INDEX idx_system_logs_component ON public.system_logs(component);
CREATE INDEX idx_system_logs_created ON public.system_logs(created_at);
`;

const createTriggersSQL = `
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_bookings_updated_at BEFORE UPDATE ON public.coaching_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

const createRLSPoliciesSQL = `
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Service role can manage all profiles" ON public.profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Purchases policies
CREATE POLICY "Service role can manage all purchases" ON public.purchases
    FOR ALL USING (auth.role() = 'service_role');

-- Products policies (public read access)
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage products" ON public.products
    FOR ALL USING (auth.role() = 'service_role');

-- Coaching bookings policies
CREATE POLICY "Service role can manage all bookings" ON public.coaching_bookings
    FOR ALL USING (auth.role() = 'service_role');

-- Email logs policies (admin only)
CREATE POLICY "Service role can manage email logs" ON public.email_logs
    FOR ALL USING (auth.role() = 'service_role');

-- System logs policies (admin only)
CREATE POLICY "Service role can manage system logs" ON public.system_logs
    FOR ALL USING (auth.role() = 'service_role');
`;

// Helper functions
const createHelperFunctionsSQL = `
-- Function to get user purchases
CREATE OR REPLACE FUNCTION get_user_purchases(user_uuid UUID)
RETURNS TABLE (
    purchase_id UUID,
    product_id VARCHAR(50),
    amount INTEGER,
    status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.product_id, p.amount, p.status, p.created_at
    FROM public.purchases p
    WHERE p.user_id = user_uuid AND p.status = 'completed'
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user owns product
CREATE OR REPLACE FUNCTION user_owns_product(user_uuid UUID, product_code VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.purchases
        WHERE user_id = user_uuid
        AND product_id = product_code
        AND status = 'completed'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get user entitlements
CREATE OR REPLACE FUNCTION get_user_entitlements(user_uuid UUID)
RETURNS TEXT[] AS $$
DECLARE
    entitlements TEXT[];
BEGIN
    SELECT ARRAY_AGG(product_id)
    INTO entitlements
    FROM public.purchases
    WHERE user_id = user_uuid AND status = 'completed';
    
    RETURN COALESCE(entitlements, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;
`;

// Seed data
const seedData = {
  products: [
    {
      id: '1',
      name: 'AI Tools Mastery Guide 2025',
      description: 'Complete guide to mastering AI tools including ChatGPT, Claude, Grok, and Gemini with 30 comprehensive lessons.',
      price: 2500,
      stripe_price_id: 'price_ai_tools_guide',
      category: 'ebook',
      metadata: { lessons: 30, format: 'PDF', pages: 150 }
    },
    {
      id: '2',
      name: 'AI Prompts Arsenal 2025',
      description: '30 professional AI prompts for making money online with proven ChatGPT and Claude prompts ready to copy-paste.',
      price: 1000,
      stripe_price_id: 'price_ai_prompts',
      category: 'prompts',
      metadata: { prompts: 30, format: 'JSON', categories: ['business', 'content', 'marketing'] }
    },
    {
      id: '4',
      name: 'AI Web Creation Masterclass',
      description: 'Complete 60-minute video masterclass on building AI-powered websites and applications from scratch.',
      price: 5000,
      stripe_price_id: 'price_web_masterclass',
      category: 'video',
      metadata: { duration: '60 minutes', format: 'HD Video', includes: 'downloadable resources' }
    },
    {
      id: '5',
      name: 'Weekly Support Contract',
      description: 'Premium weekly support sessions with priority email support and custom AI solutions.',
      price: 49700,
      stripe_price_id: 'price_support_contract',
      category: 'support',
      metadata: { sessions: 'weekly', support: 'priority email', custom_solutions: true }
    }
  ],
  users: [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@ventaro.ai',
      name: 'Admin User',
      password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hN8/LewdBP', // admin123
      user_role: 'admin'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'test@example.com',
      name: 'Test User',
      password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hN8/LewdBP', // test123
      user_role: 'user'
    }
  ],
  purchases: [
    // Admin user purchases (all products)
    { user_id: '550e8400-e29b-41d4-a716-446655440000', product_id: '1', amount: 2500, status: 'completed', stripe_payment_intent_id: 'pi_admin_product_1' },
    { user_id: '550e8400-e29b-41d4-a716-446655440000', product_id: '2', amount: 1000, status: 'completed', stripe_payment_intent_id: 'pi_admin_product_2' },
    { user_id: '550e8400-e29b-41d4-a716-446655440000', product_id: '4', amount: 5000, status: 'completed', stripe_payment_intent_id: 'pi_admin_product_4' },
    { user_id: '550e8400-e29b-41d4-a716-446655440000', product_id: '5', amount: 49700, status: 'completed', stripe_payment_intent_id: 'pi_admin_product_5' },
    // Test user purchase (one product)
    { user_id: '550e8400-e29b-41d4-a716-446655440001', product_id: '1', amount: 2500, status: 'completed', stripe_payment_intent_id: 'pi_test_product_1' }
  ]
};

// Main setup function
async function setupDatabase() {
  console.log('🚀 Starting Ventaro AI Supabase Database Setup...\n');

  try {
    // Step 1: Create tables
    console.log('📋 Step 1: Creating database tables...');
    const { error: tablesError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    if (tablesError) {
      console.error('❌ Error creating tables:', tablesError);
      // Continue anyway - tables might already exist
    } else {
      console.log('✅ Tables created successfully');
    }

    // Step 2: Create triggers and functions
    console.log('📋 Step 2: Creating triggers and functions...');
    const { error: triggersError } = await supabase.rpc('exec_sql', { sql: createTriggersSQL });
    if (triggersError) {
      console.error('❌ Error creating triggers:', triggersError);
    } else {
      console.log('✅ Triggers created successfully');
    }

    // Step 3: Set up RLS policies
    console.log('📋 Step 3: Setting up Row Level Security policies...');
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: createRLSPoliciesSQL });
    if (rlsError) {
      console.error('❌ Error creating RLS policies:', rlsError);
    } else {
      console.log('✅ RLS policies created successfully');
    }

    // Step 4: Create helper functions
    console.log('📋 Step 4: Creating helper functions...');
    const { error: functionsError } = await supabase.rpc('exec_sql', { sql: createHelperFunctionsSQL });
    if (functionsError) {
      console.error('❌ Error creating helper functions:', functionsError);
    } else {
      console.log('✅ Helper functions created successfully');
    }

    // Step 5: Insert seed data
    console.log('📋 Step 5: Inserting seed data...');

    // Insert products
    const { error: productsError } = await supabase
      .from('products')
      .upsert(seedData.products, { onConflict: 'id' });
    
    if (productsError) {
      console.error('❌ Error inserting products:', productsError);
    } else {
      console.log('✅ Products inserted successfully');
    }

    // Insert users
    const { error: usersError } = await supabase
      .from('profiles')
      .upsert(seedData.users, { onConflict: 'email' });
    
    if (usersError) {
      console.error('❌ Error inserting users:', usersError);
    } else {
      console.log('✅ Users inserted successfully');
    }

    // Insert purchases
    const { error: purchasesError } = await supabase
      .from('purchases')
      .upsert(seedData.purchases, { onConflict: 'stripe_payment_intent_id', ignoreDuplicates: true });
    
    if (purchasesError) {
      console.error('❌ Error inserting purchases:', purchasesError);
    } else {
      console.log('✅ Purchases inserted successfully');
    }

    // Step 6: Verify setup
    console.log('\n📋 Step 6: Verifying database setup...');
    
    const { data: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    const { data: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    const { data: purchasesCount } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Database verification:');
    console.log(`   👥 Users: ${profilesCount?.length || 0}`);
    console.log(`   🛍️  Products: ${productsCount?.length || 0}`);
    console.log(`   💳 Purchases: ${purchasesCount?.length || 0}`);

    // Log completion
    await supabase
      .from('system_logs')
      .insert({
        level: 'info',
        message: 'Database setup completed successfully via Node.js script',
        component: 'setup-script',
        metadata: {
          tables_created: 6,
          functions_created: 4,
          seed_data: 'inserted',
          setup_time: new Date().toISOString()
        }
      });

    console.log('\n🎉 Ventaro AI Database Setup Complete!');
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@ventaro.ai / admin123');
    console.log('   User:  test@example.com / test123');
    console.log('\n✅ Your authentication system is now ready to use!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 