-- ============================================================
-- DATABASE UTILITIES FOR DIGITAL STORE
-- ============================================================
-- Collection of useful SQL queries for managing your digital store
-- Run individual sections as needed in Supabase Dashboard → SQL Editor

-- ============================================================
-- USER MANAGEMENT UTILITIES
-- ============================================================

-- 1. List all registered users with details
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Verified'
        ELSE 'Unverified'
    END as email_status,
    CASE 
        WHEN last_sign_in_at > NOW() - INTERVAL '30 days' THEN 'Active'
        WHEN last_sign_in_at > NOW() - INTERVAL '90 days' THEN 'Inactive'
        ELSE 'Dormant'
    END as activity_status
FROM auth.users
ORDER BY created_at DESC;

-- 2. User activity summary
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as verified_users,
    COUNT(CASE WHEN last_sign_in_at > NOW() - INTERVAL '30 days' THEN 1 END) as active_users,
    COUNT(CASE WHEN last_sign_in_at > NOW() - INTERVAL '7 days' THEN 1 END) as weekly_active_users
FROM auth.users;

-- ============================================================
-- PURCHASE MANAGEMENT UTILITIES
-- ============================================================

-- 3. List all purchases with user details
SELECT 
    p.id,
    p.customer_email,
    u.email as user_email,
    p.product_name,
    p.price,
    p.created_at as purchase_date,
    p.session_id
FROM public.purchases p
LEFT JOIN auth.users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- 4. Purchase statistics
SELECT 
    COUNT(*) as total_purchases,
    COUNT(DISTINCT customer_email) as unique_customers,
    COUNT(DISTINCT product_id) as products_sold,
    SUM(price) as total_revenue,
    AVG(price) as average_order_value,
    MIN(created_at) as first_purchase,
    MAX(created_at) as latest_purchase
FROM public.purchases;

-- 5. Top selling products
SELECT 
    product_name,
    COUNT(*) as sales_count,
    SUM(price) as total_revenue,
    AVG(price) as avg_price
FROM public.purchases
GROUP BY product_name, product_id
ORDER BY sales_count DESC;

-- 6. Customer purchase history
SELECT 
    customer_email,
    COUNT(*) as purchase_count,
    SUM(price) as total_spent,
    MIN(created_at) as first_purchase,
    MAX(created_at) as latest_purchase,
    STRING_AGG(product_name, ', ') as products_purchased
FROM public.purchases
GROUP BY customer_email
ORDER BY total_spent DESC;

-- ============================================================
-- PRODUCT MANAGEMENT UTILITIES
-- ============================================================

-- 7. Product performance analysis
SELECT 
    pr.name,
    pr.price as listed_price,
    pr.category,
    pr.featured,
    pr.active,
    COALESCE(pu.sales_count, 0) as sales_count,
    COALESCE(pu.total_revenue, 0) as total_revenue
FROM public.products pr
LEFT JOIN (
    SELECT 
        product_name,
        COUNT(*) as sales_count,
        SUM(price) as total_revenue
    FROM public.purchases
    GROUP BY product_name
) pu ON pr.name = pu.product_name
ORDER BY pu.sales_count DESC NULLS LAST;

-- 8. Category performance
SELECT 
    pr.category,
    COUNT(pr.id) as product_count,
    AVG(pr.price) as avg_price,
    COALESCE(SUM(pu.sales_count), 0) as total_sales,
    COALESCE(SUM(pu.total_revenue), 0) as total_revenue
FROM public.products pr
LEFT JOIN (
    SELECT 
        product_name,
        COUNT(*) as sales_count,
        SUM(price) as total_revenue
    FROM public.purchases
    GROUP BY product_name
) pu ON pr.name = pu.product_name
WHERE pr.active = true
GROUP BY pr.category
ORDER BY total_revenue DESC;

-- ============================================================
-- DATA CLEANUP UTILITIES
-- ============================================================

-- 9. Find duplicate purchases (same user, product, within 1 hour)
SELECT 
    customer_email,
    product_name,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as purchase_ids,
    MIN(created_at) as first_purchase,
    MAX(created_at) as last_purchase
FROM public.purchases
GROUP BY customer_email, product_name, DATE_TRUNC('hour', created_at)
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 10. Find orphaned purchases (user_id doesn't exist in auth.users)
SELECT 
    p.id,
    p.customer_email,
    p.user_id,
    p.product_name,
    p.created_at
FROM public.purchases p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE p.user_id IS NOT NULL AND u.id IS NULL;

-- ============================================================
-- REVENUE ANALYTICS
-- ============================================================

-- 11. Daily revenue for last 30 days
SELECT 
    DATE(created_at) as purchase_date,
    COUNT(*) as daily_sales,
    SUM(price) as daily_revenue
FROM public.purchases
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY purchase_date DESC;

-- 12. Monthly revenue summary
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as monthly_sales,
    SUM(price) as monthly_revenue,
    COUNT(DISTINCT customer_email) as unique_customers
FROM public.purchases
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ============================================================
-- SECURITY AND MAINTENANCE
-- ============================================================

-- 13. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 14. Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- 15. Database health check
SELECT 
    'products' as table_name,
    COUNT(*) as row_count,
    COUNT(CASE WHEN active = true THEN 1 END) as active_count
FROM public.products
UNION ALL
SELECT 
    'purchases' as table_name,
    COUNT(*) as row_count,
    COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as recent_count
FROM public.purchases
UNION ALL
SELECT 
    'users' as table_name,
    COUNT(*) as row_count,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as verified_count
FROM auth.users;

-- ============================================================
-- USEFUL FUNCTIONS
-- ============================================================

-- 16. Function to get user's purchase history
CREATE OR REPLACE FUNCTION get_user_purchases(user_email TEXT)
RETURNS TABLE (
    purchase_id UUID,
    product_name TEXT,
    price DECIMAL,
    purchase_date TIMESTAMP WITH TIME ZONE,
    download_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.product_name,
        p.price,
        p.created_at,
        p.download_url
    FROM public.purchases p
    WHERE p.customer_email = user_email
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage: SELECT * FROM get_user_purchases('user@example.com');

-- ============================================================
-- BACKUP QUERIES
-- ============================================================

-- 17. Export all purchases (for backup)
-- COPY (SELECT * FROM public.purchases ORDER BY created_at) TO '/tmp/purchases_backup.csv' WITH CSV HEADER;

-- 18. Export all products (for backup)
-- COPY (SELECT * FROM public.products ORDER BY created_at) TO '/tmp/products_backup.csv' WITH CSV HEADER;

-- ============================================================
-- NOTES
-- ============================================================
-- 
-- To use these utilities:
-- 1. Copy individual sections to Supabase SQL Editor
-- 2. Run them as needed for monitoring and maintenance
-- 3. Modify date ranges and filters as required
-- 4. Use the functions for application integration
--
-- For regular monitoring, consider running:
-- - User activity summary (query #2)
-- - Purchase statistics (query #4)
-- - Database health check (query #15)
-- ============================================================