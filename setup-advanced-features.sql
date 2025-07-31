-- ============================================================
-- ADVANCED FEATURES SETUP FOR DIGITAL STORE
-- ============================================================
-- Run this script in Supabase Dashboard → SQL Editor
-- This sets up coupons, affiliate tracking, subscriptions, and reviews

-- ============================================================
-- CREATE COUPONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    minimum_order_amount DECIMAL(10,2) DEFAULT 0,
    maximum_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    usage_limit_per_user INTEGER DEFAULT 1,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    applicable_products UUID[], -- Array of product IDs
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_dates ON public.coupons(valid_from, valid_until);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active coupons" ON public.coupons
    FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Service role can manage coupons" ON public.coupons
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE COUPON USAGE TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    order_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON public.coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON public.coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_email ON public.coupon_usage(customer_email);

-- Enable RLS
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own coupon usage" ON public.coupon_usage
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = customer_email);

CREATE POLICY "Service role can manage coupon usage" ON public.coupon_usage
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE AFFILIATE SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    affiliate_code VARCHAR(50) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,4) DEFAULT 0.10 CHECK (commission_rate >= 0 AND commission_rate <= 1),
    total_referrals INTEGER DEFAULT 0,
    total_sales DECIMAL(12,2) DEFAULT 0,
    total_commission DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    payment_email VARCHAR(255),
    payment_method VARCHAR(50) DEFAULT 'paypal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_active ON public.affiliates(is_active);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own affiliate data" ON public.affiliates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate data" ON public.affiliates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage affiliates" ON public.affiliates
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE AFFILIATE REFERRALS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referred_email VARCHAR(255) NOT NULL,
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
    sale_amount DECIMAL(10,2),
    commission_amount DECIMAL(10,2),
    commission_rate DECIMAL(5,4),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
    referral_source VARCHAR(100), -- 'direct', 'social', 'email', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON public.affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_user_id ON public.affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_status ON public.affiliate_referrals(status);

-- Enable RLS
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Affiliates can view their referrals" ON public.affiliate_referrals
    FOR SELECT USING (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage referrals" ON public.affiliate_referrals
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE PRODUCT REVIEWS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id) -- One review per user per product
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_approved ON public.product_reviews(is_approved);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage their own reviews" ON public.product_reviews
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all reviews" ON public.product_reviews
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE SUBSCRIPTIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    plan_name VARCHAR(100) NOT NULL,
    plan_price DECIMAL(10,2) NOT NULL,
    billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('month', 'year')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'incomplete')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON public.subscriptions(current_period_end);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- CREATE WISHLIST TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON public.wishlist(product_id);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own wishlist" ON public.wishlist
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- CREATE ADVANCED FUNCTIONS
-- ============================================================

-- Function to validate and apply coupon
CREATE OR REPLACE FUNCTION validate_coupon(
    p_coupon_code VARCHAR(50),
    p_user_id UUID,
    p_customer_email VARCHAR(255),
    p_order_amount DECIMAL(10,2),
    p_product_ids UUID[] DEFAULT NULL
)
RETURNS TABLE (
    is_valid BOOLEAN,
    discount_amount DECIMAL(10,2),
    error_message TEXT
) AS $$
DECLARE
    coupon_record RECORD;
    user_usage_count INTEGER := 0;
    calculated_discount DECIMAL(10,2) := 0;
BEGIN
    -- Get coupon details
    SELECT * INTO coupon_record
    FROM public.coupons
    WHERE code = p_coupon_code
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until > NOW());
    
    -- Check if coupon exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::DECIMAL(10,2), 'Invalid or expired coupon code';
        RETURN;
    END IF;
    
    -- Check usage limit
    IF coupon_record.usage_limit IS NOT NULL AND coupon_record.usage_count >= coupon_record.usage_limit THEN
        RETURN QUERY SELECT false, 0::DECIMAL(10,2), 'Coupon usage limit exceeded';
        RETURN;
    END IF;
    
    -- Check user usage limit
    SELECT COUNT(*) INTO user_usage_count
    FROM public.coupon_usage
    WHERE coupon_id = coupon_record.id
    AND (user_id = p_user_id OR customer_email = p_customer_email);
    
    IF coupon_record.usage_limit_per_user IS NOT NULL AND user_usage_count >= coupon_record.usage_limit_per_user THEN
        RETURN QUERY SELECT false, 0::DECIMAL(10,2), 'You have already used this coupon';
        RETURN;
    END IF;
    
    -- Check minimum order amount
    IF p_order_amount < coupon_record.minimum_order_amount THEN
        RETURN QUERY SELECT false, 0::DECIMAL(10,2), 
            'Minimum order amount of $' || coupon_record.minimum_order_amount || ' required';
        RETURN;
    END IF;
    
    -- Check applicable products
    IF coupon_record.applicable_products IS NOT NULL AND array_length(coupon_record.applicable_products, 1) > 0 THEN
        IF p_product_ids IS NULL OR NOT (coupon_record.applicable_products && p_product_ids) THEN
            RETURN QUERY SELECT false, 0::DECIMAL(10,2), 'Coupon not applicable to selected products';
            RETURN;
        END IF;
    END IF;
    
    -- Calculate discount
    IF coupon_record.discount_type = 'percentage' THEN
        calculated_discount := p_order_amount * (coupon_record.discount_value / 100);
    ELSE
        calculated_discount := coupon_record.discount_value;
    END IF;
    
    -- Apply maximum discount limit
    IF coupon_record.maximum_discount_amount IS NOT NULL AND calculated_discount > coupon_record.maximum_discount_amount THEN
        calculated_discount := coupon_record.maximum_discount_amount;
    END IF;
    
    -- Ensure discount doesn't exceed order amount
    IF calculated_discount > p_order_amount THEN
        calculated_discount := p_order_amount;
    END IF;
    
    RETURN QUERY SELECT true, calculated_discount, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to apply coupon (record usage)
CREATE OR REPLACE FUNCTION apply_coupon(
    p_coupon_code VARCHAR(50),
    p_user_id UUID,
    p_customer_email VARCHAR(255),
    p_purchase_id UUID,
    p_discount_amount DECIMAL(10,2),
    p_order_amount DECIMAL(10,2)
)
RETURNS UUID AS $$
DECLARE
    coupon_id UUID;
    usage_id UUID;
BEGIN
    -- Get coupon ID
    SELECT id INTO coupon_id
    FROM public.coupons
    WHERE code = p_coupon_code;
    
    -- Record usage
    INSERT INTO public.coupon_usage (
        coupon_id,
        user_id,
        customer_email,
        purchase_id,
        discount_amount,
        order_amount
    ) VALUES (
        coupon_id,
        p_user_id,
        p_customer_email,
        p_purchase_id,
        p_discount_amount,
        p_order_amount
    ) RETURNING id INTO usage_id;
    
    -- Update coupon usage count
    UPDATE public.coupons
    SET usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = coupon_id;
    
    RETURN usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create affiliate
CREATE OR REPLACE FUNCTION create_affiliate(
    p_user_id UUID,
    p_affiliate_code VARCHAR(50) DEFAULT NULL,
    p_commission_rate DECIMAL(5,4) DEFAULT 0.10
)
RETURNS UUID AS $$
DECLARE
    affiliate_id UUID;
    generated_code VARCHAR(50);
BEGIN
    -- Generate affiliate code if not provided
    IF p_affiliate_code IS NULL THEN
        generated_code := 'AFF' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8));
    ELSE
        generated_code := p_affiliate_code;
    END IF;
    
    -- Create affiliate
    INSERT INTO public.affiliates (
        user_id,
        affiliate_code,
        commission_rate
    ) VALUES (
        p_user_id,
        generated_code,
        p_commission_rate
    ) RETURNING id INTO affiliate_id;
    
    RETURN affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track affiliate referral
CREATE OR REPLACE FUNCTION track_affiliate_referral(
    p_affiliate_code VARCHAR(50),
    p_referred_email VARCHAR(255),
    p_referred_user_id UUID DEFAULT NULL,
    p_referral_source VARCHAR(100) DEFAULT 'direct'
)
RETURNS UUID AS $$
DECLARE
    affiliate_id UUID;
    referral_id UUID;
BEGIN
    -- Get affiliate ID
    SELECT id INTO affiliate_id
    FROM public.affiliates
    WHERE affiliate_code = p_affiliate_code
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid affiliate code';
    END IF;
    
    -- Create referral record
    INSERT INTO public.affiliate_referrals (
        affiliate_id,
        referred_user_id,
        referred_email,
        referral_source
    ) VALUES (
        affiliate_id,
        p_referred_user_id,
        p_referred_email,
        p_referral_source
    ) RETURNING id INTO referral_id;
    
    -- Update affiliate stats
    UPDATE public.affiliates
    SET total_referrals = total_referrals + 1,
        updated_at = NOW()
    WHERE id = affiliate_id;
    
    RETURN referral_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get product rating summary
CREATE OR REPLACE FUNCTION get_product_rating_summary(p_product_id UUID)
RETURNS TABLE (
    average_rating DECIMAL(3,2),
    total_reviews BIGINT,
    rating_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH rating_stats AS (
        SELECT 
            ROUND(AVG(rating), 2) as avg_rating,
            COUNT(*) as total_count
        FROM public.product_reviews
        WHERE product_id = p_product_id
        AND is_approved = true
    ),
    rating_dist AS (
        SELECT 
            jsonb_object_agg(
                rating::TEXT,
                count
            ) as distribution
        FROM (
            SELECT 
                rating,
                COUNT(*) as count
            FROM public.product_reviews
            WHERE product_id = p_product_id
            AND is_approved = true
            GROUP BY rating
        ) r
    )
    SELECT 
        COALESCE(rs.avg_rating, 0),
        COALESCE(rs.total_count, 0),
        COALESCE(rd.distribution, '{}'::jsonb)
    FROM rating_stats rs
    CROSS JOIN rating_dist rd;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE TRIGGERS
-- ============================================================

-- Trigger to update affiliate stats when purchase is made
CREATE OR REPLACE FUNCTION update_affiliate_on_purchase()
RETURNS TRIGGER AS $$
DECLARE
    referral_record RECORD;
    affiliate_record RECORD;
BEGIN
    -- Find referral record
    SELECT * INTO referral_record
    FROM public.affiliate_referrals
    WHERE (referred_user_id = NEW.user_id OR referred_email = NEW.customer_email)
    AND status = 'pending'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        -- Get affiliate details
        SELECT * INTO affiliate_record
        FROM public.affiliates
        WHERE id = referral_record.affiliate_id;
        
        -- Update referral with purchase info
        UPDATE public.affiliate_referrals
        SET 
            purchase_id = NEW.id,
            sale_amount = NEW.price,
            commission_amount = NEW.price * affiliate_record.commission_rate,
            commission_rate = affiliate_record.commission_rate,
            status = 'confirmed',
            confirmed_at = NOW()
        WHERE id = referral_record.id;
        
        -- Update affiliate totals
        UPDATE public.affiliates
        SET 
            total_sales = total_sales + NEW.price,
            total_commission = total_commission + (NEW.price * affiliate_record.commission_rate),
            updated_at = NOW()
        WHERE id = affiliate_record.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_affiliate_on_purchase
    AFTER INSERT ON public.purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_on_purchase();

-- Trigger to mark reviews as verified purchase
CREATE OR REPLACE FUNCTION mark_verified_purchase_review()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user has purchased this product
    IF EXISTS (
        SELECT 1 FROM public.purchases
        WHERE (user_id = NEW.user_id OR customer_email = NEW.customer_email)
        AND product_id = NEW.product_id
    ) THEN
        NEW.is_verified_purchase := true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mark_verified_purchase_review
    BEFORE INSERT OR UPDATE ON public.product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION mark_verified_purchase_review();

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================

-- Grant permissions to authenticated users
GRANT SELECT ON public.coupons TO authenticated;
GRANT SELECT ON public.coupon_usage TO authenticated;
GRANT SELECT ON public.affiliates TO authenticated;
GRANT SELECT ON public.affiliate_referrals TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.product_reviews TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.wishlist TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION validate_coupon TO authenticated;
GRANT EXECUTE ON FUNCTION apply_coupon TO authenticated;
GRANT EXECUTE ON FUNCTION create_affiliate TO authenticated;
GRANT EXECUTE ON FUNCTION track_affiliate_referral TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_rating_summary TO authenticated;

-- ============================================================
-- CREATE SAMPLE DATA
-- ============================================================

-- Insert sample coupons
INSERT INTO public.coupons (code, name, description, discount_type, discount_value, minimum_order_amount, usage_limit, valid_until)
VALUES 
    ('WELCOME10', 'Welcome Discount', '10% off for new customers', 'percentage', 10.00, 0, 100, NOW() + INTERVAL '30 days'),
    ('SAVE20', 'Save $20', '$20 off orders over $100', 'fixed_amount', 20.00, 100, 50, NOW() + INTERVAL '60 days'),
    ('BLACKFRIDAY', 'Black Friday Special', '25% off everything', 'percentage', 25.00, 0, 1000, NOW() + INTERVAL '7 days')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'coupons', 'coupon_usage', 'affiliates', 'affiliate_referrals',
    'product_reviews', 'subscriptions', 'wishlist'
)
ORDER BY table_name;

-- Check if functions were created
SELECT 
    routine_name as function_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'validate_coupon', 'apply_coupon', 'create_affiliate',
    'track_affiliate_referral', 'get_product_rating_summary'
)
ORDER BY routine_name;

-- Check sample coupons
SELECT code, name, discount_type, discount_value, is_active
FROM public.coupons
ORDER BY created_at;

-- ============================================================
-- USAGE EXAMPLES
-- ============================================================

-- Example: Validate a coupon
/*
SELECT * FROM validate_coupon(
    'WELCOME10',
    auth.uid(),
    'user@example.com',
    50.00,
    ARRAY['product-uuid']::UUID[]
);
*/

-- Example: Create an affiliate
/*
SELECT create_affiliate(
    auth.uid(),
    'MYCODE123',
    0.15 -- 15% commission
);
*/

-- Example: Track affiliate referral
/*
SELECT track_affiliate_referral(
    'MYCODE123',
    'newuser@example.com',
    NULL,
    'social'
);
*/

-- Example: Get product rating summary
/*
SELECT * FROM get_product_rating_summary('product-uuid'::UUID);
*/

-- Example: Add product to wishlist
/*
INSERT INTO public.wishlist (user_id, product_id)
VALUES (auth.uid(), 'product-uuid'::UUID);
*/

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see the tables and functions listed above, advanced features are ready!
--
-- Your digital store now has:
-- ✅ Coupon system with validation and usage tracking
-- ✅ Affiliate program with commission tracking
-- ✅ Product review system with verified purchases
-- ✅ Subscription management
-- ✅ User wishlist functionality
-- ✅ Automated affiliate commission calculation
-- ✅ Sample coupons for testing
--
-- Next steps:
-- 1. Integrate coupon validation in checkout flow
-- 2. Build affiliate dashboard
-- 3. Add review components to product pages
-- 4. Implement subscription billing webhooks
-- 5. Create wishlist UI components
-- ============================================================