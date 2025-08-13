-- =====================================================
-- VENTARO AI SUPABASE DATABASE SETUP
-- =====================================================
-- This script creates all necessary tables for the Ventaro AI platform
-- Run this in your Supabase SQL Editor

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
    amount INTEGER NOT NULL, -- Amount in cents
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
    price INTEGER NOT NULL, -- Price in cents
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

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Service role can manage all profiles" ON public.profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Purchases policies
CREATE POLICY "Users can view own purchases" ON public.purchases
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role can manage all purchases" ON public.purchases
    FOR ALL USING (auth.role() = 'service_role');

-- Products policies (public read access)
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage products" ON public.products
    FOR ALL USING (auth.role() = 'service_role');

-- Coaching bookings policies
CREATE POLICY "Users can view own bookings" ON public.coaching_bookings
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own bookings" ON public.coaching_bookings
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Service role can manage all bookings" ON public.coaching_bookings
    FOR ALL USING (auth.role() = 'service_role');

-- Email logs policies (admin only)
CREATE POLICY "Service role can manage email logs" ON public.email_logs
    FOR ALL USING (auth.role() = 'service_role');

-- System logs policies (admin only)
CREATE POLICY "Service role can manage system logs" ON public.system_logs
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 8. FUNCTIONS AND TRIGGERS
-- =====================================================

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

-- =====================================================
-- 9. SEED DATA
-- =====================================================

-- Insert default products
INSERT INTO public.products (id, name, description, price, stripe_price_id, category, metadata) VALUES
('1', 'AI Tools Mastery Guide 2025', 'Complete guide to mastering AI tools including ChatGPT, Claude, Grok, and Gemini with 30 comprehensive lessons.', 2500, 'price_ai_tools_guide', 'ebook', '{"lessons": 30, "format": "PDF", "pages": 150}'),
('2', 'AI Prompts Arsenal 2025', '30 professional AI prompts for making money online with proven ChatGPT and Claude prompts ready to copy-paste.', 1000, 'price_ai_prompts', 'prompts', '{"prompts": 30, "format": "JSON", "categories": ["business", "content", "marketing"]}'),
('4', 'AI Web Creation Masterclass', 'Complete 60-minute video masterclass on building AI-powered websites and applications from scratch.', 5000, 'price_web_masterclass', 'video', '{"duration": "60 minutes", "format": "HD Video", "includes": "downloadable resources"}'),
('5', 'Weekly Support Contract', 'Premium weekly support sessions with priority email support and custom AI solutions.', 49700, 'price_support_contract', 'support', '{"sessions": "weekly", "support": "priority email", "custom_solutions": true}}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    updated_at = NOW();

-- Insert admin user (password is hashed for 'admin123')
INSERT INTO public.profiles (id, email, name, password_hash, user_role, email_confirmed) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@ventaro.ai', 'Admin User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hN8/LewdBP', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    user_role = EXCLUDED.user_role,
    updated_at = NOW();

-- Insert test user (password is hashed for 'test123')
INSERT INTO public.profiles (id, email, name, password_hash, user_role, email_confirmed) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'test@example.com', 'Test User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hN8/LewdBP', 'user', true)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    user_role = EXCLUDED.user_role,
    updated_at = NOW();

-- Insert sample purchases for admin user (all products)
INSERT INTO public.purchases (user_id, product_id, amount, status, stripe_payment_intent_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', '1', 2500, 'completed', 'pi_admin_product_1'),
('550e8400-e29b-41d4-a716-446655440000', '2', 1000, 'completed', 'pi_admin_product_2'),
('550e8400-e29b-41d4-a716-446655440000', '4', 5000, 'completed', 'pi_admin_product_4'),
('550e8400-e29b-41d4-a716-446655440000', '5', 49700, 'completed', 'pi_admin_product_5')
ON CONFLICT DO NOTHING;

-- Insert sample purchase for test user (one product)
INSERT INTO public.purchases (user_id, product_id, amount, status, stripe_payment_intent_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '1', 2500, 'completed', 'pi_test_product_1')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. HELPER FUNCTIONS FOR APPLICATION
-- =====================================================

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

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Log completion
INSERT INTO public.system_logs (level, message, component, metadata) VALUES
('info', 'Database setup completed successfully', 'setup-script', '{"tables_created": 6, "functions_created": 4, "seed_data": "inserted"}');

-- Display summary
SELECT 'Ventaro AI Database Setup Complete!' as status,
       'Tables created: profiles, purchases, products, coaching_bookings, email_logs, system_logs' as tables,
       'Default users: admin@ventaro.ai (admin123), test@example.com (test123)' as test_accounts,
       'Sample data inserted for immediate testing' as data_status; 