-- ============================================================
-- ANALYTICS & REPORTING SETUP FOR DIGITAL STORE
-- ============================================================
-- Run this script in Supabase Dashboard → SQL Editor
-- This sets up analytics tables, views, and reporting functions

-- ============================================================
-- CREATE ANALYTICS EVENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    properties JSONB DEFAULT '{}',
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON public.analytics_events(session_id);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role can manage analytics" ON public.analytics_events
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view their own analytics" ON public.analytics_events
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- CREATE PRODUCT VIEWS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    view_duration INTEGER, -- in seconds
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON public.product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON public.product_views(created_at);

-- Enable RLS
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role can manage product views" ON public.product_views
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view their own product views" ON public.product_views
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- CREATE REVENUE ANALYTICS VIEW
-- ============================================================

CREATE OR REPLACE VIEW public.revenue_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_sales,
    SUM(price) as total_revenue,
    AVG(price) as average_order_value,
    COUNT(DISTINCT customer_email) as unique_customers,
    COUNT(DISTINCT product_id) as products_sold
FROM public.purchases
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- ============================================================
-- CREATE PRODUCT PERFORMANCE VIEW
-- ============================================================

CREATE OR REPLACE VIEW public.product_performance AS
SELECT 
    p.product_id,
    p.product_name,
    COUNT(p.id) as total_sales,
    SUM(p.price) as total_revenue,
    AVG(p.price) as average_price,
    COUNT(DISTINCT p.customer_email) as unique_buyers,
    COALESCE(pv.total_views, 0) as total_views,
    CASE 
        WHEN COALESCE(pv.total_views, 0) > 0 
        THEN ROUND((COUNT(p.id)::DECIMAL / pv.total_views * 100), 2)
        ELSE 0
    END as conversion_rate,
    MIN(p.created_at) as first_sale,
    MAX(p.created_at) as last_sale
FROM public.purchases p
LEFT JOIN (
    SELECT 
        product_id,
        COUNT(*) as total_views
    FROM public.product_views
    GROUP BY product_id
) pv ON p.product_id = pv.product_id
GROUP BY p.product_id, p.product_name, pv.total_views
ORDER BY total_revenue DESC;

-- ============================================================
-- CREATE USER ANALYTICS VIEW
-- ============================================================

CREATE OR REPLACE VIEW public.user_analytics AS
SELECT 
    u.id as user_id,
    u.email,
    u.created_at as registration_date,
    u.last_sign_in_at,
    COALESCE(p.total_purchases, 0) as total_purchases,
    COALESCE(p.total_spent, 0) as total_spent,
    COALESCE(p.average_order_value, 0) as average_order_value,
    p.first_purchase,
    p.last_purchase,
    CASE 
        WHEN p.total_purchases > 0 THEN 'Customer'
        ELSE 'Prospect'
    END as user_type,
    CASE 
        WHEN u.last_sign_in_at > NOW() - INTERVAL '30 days' THEN 'Active'
        WHEN u.last_sign_in_at > NOW() - INTERVAL '90 days' THEN 'Inactive'
        ELSE 'Dormant'
    END as activity_status
FROM auth.users u
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_purchases,
        SUM(price) as total_spent,
        AVG(price) as average_order_value,
        MIN(created_at) as first_purchase,
        MAX(created_at) as last_purchase
    FROM public.purchases
    WHERE user_id IS NOT NULL
    GROUP BY user_id
) p ON u.id = p.user_id
ORDER BY total_spent DESC NULLS LAST;

-- ============================================================
-- CREATE ANALYTICS FUNCTIONS
-- ============================================================

-- Function to track events
CREATE OR REPLACE FUNCTION track_event(
    p_event_type VARCHAR(100),
    p_event_name VARCHAR(100),
    p_properties JSONB DEFAULT '{}',
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_page_url TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO public.analytics_events (
        user_id,
        session_id,
        event_type,
        event_name,
        properties,
        page_url,
        referrer
    ) VALUES (
        p_user_id,
        p_session_id,
        p_event_type,
        p_event_name,
        p_properties,
        p_page_url,
        p_referrer
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track product views
CREATE OR REPLACE FUNCTION track_product_view(
    p_product_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    view_id UUID;
BEGIN
    INSERT INTO public.product_views (
        product_id,
        user_id,
        session_id,
        view_duration,
        referrer
    ) VALUES (
        p_product_id,
        p_user_id,
        p_session_id,
        p_view_duration,
        p_referrer
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    metric_name TEXT,
    metric_value NUMERIC,
    metric_change NUMERIC,
    metric_type TEXT
) AS $$
DECLARE
    current_period_start DATE := p_start_date;
    current_period_end DATE := p_end_date;
    previous_period_start DATE := p_start_date - (p_end_date - p_start_date);
    previous_period_end DATE := p_start_date;
BEGIN
    -- Total Revenue
    RETURN QUERY
    WITH current_revenue AS (
        SELECT COALESCE(SUM(price), 0) as value
        FROM public.purchases
        WHERE created_at::date BETWEEN current_period_start AND current_period_end
    ),
    previous_revenue AS (
        SELECT COALESCE(SUM(price), 0) as value
        FROM public.purchases
        WHERE created_at::date BETWEEN previous_period_start AND previous_period_end
    )
    SELECT 
        'Total Revenue'::TEXT,
        cr.value,
        CASE 
            WHEN pr.value > 0 THEN ROUND(((cr.value - pr.value) / pr.value * 100), 2)
            ELSE 0
        END,
        'currency'::TEXT
    FROM current_revenue cr, previous_revenue pr;
    
    -- Total Sales
    RETURN QUERY
    WITH current_sales AS (
        SELECT COUNT(*) as value
        FROM public.purchases
        WHERE created_at::date BETWEEN current_period_start AND current_period_end
    ),
    previous_sales AS (
        SELECT COUNT(*) as value
        FROM public.purchases
        WHERE created_at::date BETWEEN previous_period_start AND previous_period_end
    )
    SELECT 
        'Total Sales'::TEXT,
        cs.value::NUMERIC,
        CASE 
            WHEN ps.value > 0 THEN ROUND(((cs.value - ps.value)::NUMERIC / ps.value * 100), 2)
            ELSE 0
        END,
        'number'::TEXT
    FROM current_sales cs, previous_sales ps;
    
    -- New Customers
    RETURN QUERY
    WITH current_customers AS (
        SELECT COUNT(DISTINCT customer_email) as value
        FROM public.purchases
        WHERE created_at::date BETWEEN current_period_start AND current_period_end
    ),
    previous_customers AS (
        SELECT COUNT(DISTINCT customer_email) as value
        FROM public.purchases
        WHERE created_at::date BETWEEN previous_period_start AND previous_period_end
    )
    SELECT 
        'New Customers'::TEXT,
        cc.value::NUMERIC,
        CASE 
            WHEN pc.value > 0 THEN ROUND(((cc.value - pc.value)::NUMERIC / pc.value * 100), 2)
            ELSE 0
        END,
        'number'::TEXT
    FROM current_customers cc, previous_customers pc;
    
    -- Average Order Value
    RETURN QUERY
    WITH current_aov AS (
        SELECT COALESCE(AVG(price), 0) as value
        FROM public.purchases
        WHERE created_at::date BETWEEN current_period_start AND current_period_end
    ),
    previous_aov AS (
        SELECT COALESCE(AVG(price), 0) as value
        FROM public.purchases
        WHERE created_at::date BETWEEN previous_period_start AND previous_period_end
    )
    SELECT 
        'Average Order Value'::TEXT,
        ROUND(ca.value, 2),
        CASE 
            WHEN pa.value > 0 THEN ROUND(((ca.value - pa.value) / pa.value * 100), 2)
            ELSE 0
        END,
        'currency'::TEXT
    FROM current_aov ca, previous_aov pa;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top products
CREATE OR REPLACE FUNCTION get_top_products(
    p_limit INTEGER DEFAULT 10,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    product_id UUID,
    product_name VARCHAR(255),
    total_sales BIGINT,
    total_revenue NUMERIC,
    unique_buyers BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.product_id,
        p.product_name,
        COUNT(*) as total_sales,
        SUM(p.price) as total_revenue,
        COUNT(DISTINCT p.customer_email) as unique_buyers
    FROM public.purchases p
    WHERE p.created_at::date BETWEEN p_start_date AND p_end_date
    GROUP BY p.product_id, p.product_name
    ORDER BY total_revenue DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get sales by date
CREATE OR REPLACE FUNCTION get_sales_by_date(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE,
    p_interval TEXT DEFAULT 'day'
)
RETURNS TABLE (
    period TEXT,
    total_sales BIGINT,
    total_revenue NUMERIC,
    unique_customers BIGINT
) AS $$
BEGIN
    IF p_interval = 'hour' THEN
        RETURN QUERY
        SELECT 
            TO_CHAR(DATE_TRUNC('hour', created_at), 'YYYY-MM-DD HH24:00') as period,
            COUNT(*) as total_sales,
            SUM(price) as total_revenue,
            COUNT(DISTINCT customer_email) as unique_customers
        FROM public.purchases
        WHERE created_at::date BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('hour', created_at)
        ORDER BY DATE_TRUNC('hour', created_at);
    ELSIF p_interval = 'week' THEN
        RETURN QUERY
        SELECT 
            TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD') as period,
            COUNT(*) as total_sales,
            SUM(price) as total_revenue,
            COUNT(DISTINCT customer_email) as unique_customers
        FROM public.purchases
        WHERE created_at::date BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('week', created_at)
        ORDER BY DATE_TRUNC('week', created_at);
    ELSIF p_interval = 'month' THEN
        RETURN QUERY
        SELECT 
            TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as period,
            COUNT(*) as total_sales,
            SUM(price) as total_revenue,
            COUNT(DISTINCT customer_email) as unique_customers
        FROM public.purchases
        WHERE created_at::date BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at);
    ELSE
        -- Default to day
        RETURN QUERY
        SELECT 
            TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as period,
            COUNT(*) as total_sales,
            SUM(price) as total_revenue,
            COUNT(DISTINCT customer_email) as unique_customers
        FROM public.purchases
        WHERE created_at::date BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY DATE_TRUNC('day', created_at);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE COHORT ANALYSIS FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION get_cohort_analysis(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '12 months',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    cohort_month TEXT,
    period_number INTEGER,
    customers BIGINT,
    percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH first_purchases AS (
        SELECT 
            customer_email,
            DATE_TRUNC('month', MIN(created_at)) as cohort_month
        FROM public.purchases
        WHERE created_at::date BETWEEN p_start_date AND p_end_date
        GROUP BY customer_email
    ),
    purchase_periods AS (
        SELECT 
            p.customer_email,
            fp.cohort_month,
            DATE_TRUNC('month', p.created_at) as purchase_month
        FROM public.purchases p
        JOIN first_purchases fp ON p.customer_email = fp.customer_email
        WHERE p.created_at::date BETWEEN p_start_date AND p_end_date
    ),
    cohort_data AS (
        SELECT 
            cohort_month,
            EXTRACT(YEAR FROM purchase_month) * 12 + EXTRACT(MONTH FROM purchase_month) - 
            (EXTRACT(YEAR FROM cohort_month) * 12 + EXTRACT(MONTH FROM cohort_month)) as period_number,
            COUNT(DISTINCT customer_email) as customers
        FROM purchase_periods
        GROUP BY cohort_month, period_number
    ),
    cohort_sizes AS (
        SELECT 
            cohort_month,
            COUNT(DISTINCT customer_email) as cohort_size
        FROM first_purchases
        GROUP BY cohort_month
    )
    SELECT 
        TO_CHAR(cd.cohort_month, 'YYYY-MM') as cohort_month,
        cd.period_number::INTEGER,
        cd.customers,
        ROUND((cd.customers::NUMERIC / cs.cohort_size * 100), 2) as percentage
    FROM cohort_data cd
    JOIN cohort_sizes cs ON cd.cohort_month = cs.cohort_month
    ORDER BY cd.cohort_month, cd.period_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE CLEANUP FUNCTIONS
-- ============================================================

-- Function to clean up old analytics events
CREATE OR REPLACE FUNCTION cleanup_old_analytics(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    DELETE FROM public.analytics_events
    WHERE created_at < NOW() - (days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old product views
CREATE OR REPLACE FUNCTION cleanup_old_product_views(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    DELETE FROM public.product_views
    WHERE created_at < NOW() - (days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================

-- Grant permissions to authenticated users
GRANT SELECT ON public.revenue_analytics TO authenticated;
GRANT SELECT ON public.product_performance TO authenticated;
GRANT SELECT ON public.user_analytics TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION track_event TO authenticated;
GRANT EXECUTE ON FUNCTION track_product_view TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_products TO authenticated;
GRANT EXECUTE ON FUNCTION get_sales_by_date TO authenticated;
GRANT EXECUTE ON FUNCTION get_cohort_analysis TO authenticated;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('analytics_events', 'product_views')
ORDER BY table_name;

-- Check if views were created
SELECT 
    table_name as view_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN ('revenue_analytics', 'product_performance', 'user_analytics')
ORDER BY table_name;

-- Check if functions were created
SELECT 
    routine_name as function_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%analytics%' OR routine_name LIKE '%track_%' OR routine_name LIKE '%get_%'
ORDER BY routine_name;

-- ============================================================
-- USAGE EXAMPLES
-- ============================================================

-- Example: Track a page view event
/*
SELECT track_event(
    'page_view',
    'product_page',
    jsonb_build_object(
        'product_id', 'some-uuid',
        'product_name', 'Sample Product'
    ),
    auth.uid(),
    'session-123',
    '/products/sample-product',
    'https://google.com'
);
*/

-- Example: Track a product view
/*
SELECT track_product_view(
    'product-uuid'::UUID,
    auth.uid(),
    'session-123',
    45, -- 45 seconds
    '/products'
);
*/

-- Example: Get dashboard metrics for last 30 days
/*
SELECT * FROM get_dashboard_metrics();
*/

-- Example: Get top 5 products
/*
SELECT * FROM get_top_products(5);
*/

-- Example: Get daily sales for last 7 days
/*
SELECT * FROM get_sales_by_date(
    CURRENT_DATE - INTERVAL '7 days',
    CURRENT_DATE,
    'day'
);
*/

-- Example: Get cohort analysis
/*
SELECT * FROM get_cohort_analysis();
*/

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see the tables and views listed above, analytics are ready!
--
-- Your digital store now has:
-- ✅ Event tracking system
-- ✅ Product view analytics
-- ✅ Revenue analytics dashboard
-- ✅ Product performance metrics
-- ✅ User behavior analytics
-- ✅ Cohort analysis
-- ✅ Dashboard metrics functions
-- ✅ Automated cleanup functions
--
-- Next steps:
-- 1. Integrate event tracking in your frontend
-- 2. Build analytics dashboard using the views and functions
-- 3. Set up automated reports
-- 4. Configure cleanup schedules
-- ============================================================