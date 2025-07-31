-- ============================================================
-- PURCHASES TABLE SETUP FOR SUPABASE
-- ============================================================
-- Run this script in Supabase Dashboard → SQL Editor
-- This will create the purchases table with proper security policies

-- 1. Create the purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    session_id TEXT,
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_customer_email ON public.purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON public.purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_session_id ON public.purchases(session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON public.purchases(created_at);

-- Create unique constraint to prevent duplicate purchases
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_unique_purchase 
    ON public.purchases(customer_email, product_id, session_id) 
    WHERE session_id IS NOT NULL;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies

-- Policy: Users can view their own purchases (by user_id or email)
CREATE POLICY "Users can view their own purchases" ON public.purchases
    FOR SELECT 
    USING (
        auth.uid() = user_id 
        OR 
        auth.jwt() ->> 'email' = customer_email
    );

-- Policy: Service role can do everything (for API operations)
CREATE POLICY "Service role full access" ON public.purchases
    FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Policy: Authenticated users can insert their own purchases
CREATE POLICY "Users can insert their own purchases" ON public.purchases
    FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id 
        OR 
        auth.jwt() ->> 'email' = customer_email
    );

-- 5. Grant necessary permissions
GRANT ALL ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- 6. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to automatically update updated_at
CREATE TRIGGER purchases_updated_at
    BEFORE UPDATE ON public.purchases
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 8. Insert some sample data for testing (optional)
-- Uncomment the lines below if you want to add test data

/*
INSERT INTO public.purchases (
    user_id,
    customer_email,
    product_id,
    product_name,
    price,
    session_id
) VALUES 
(
    '48addffc-6a70-451a-8944-0b86656716c9',
    'christroiano1993@hotmail.com',
    'ai-tools-guide',
    'AI Tools Mastery Guide',
    29.99,
    'test_session_001'
),
(
    '67eb6090-0146-4263-b0f1-a7f54b60e870',
    'chris.t@ventarosales.com',
    'digital-marketing-course',
    'Digital Marketing Masterclass',
    49.99,
    'test_session_002'
);
*/

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these after creating the table to verify everything works

-- Check if table was created successfully
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name = 'purchases' AND table_schema = 'public';

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'purchases' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'purchases' AND schemaname = 'public';

-- Check RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'purchases' AND schemaname = 'public';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see results from the verification queries above,
-- the purchases table has been successfully created!
--
-- Your digital store can now:
-- ✅ Record purchases automatically
-- ✅ Show purchased products on My Account page
-- ✅ Handle both logged-in and guest purchases
-- ✅ Maintain proper security with RLS policies
-- ============================================================