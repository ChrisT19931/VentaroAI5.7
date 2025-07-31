-- ============================================================
-- SAMPLE PRODUCTS SETUP FOR DIGITAL STORE
-- ============================================================
-- Run this script in Supabase Dashboard → SQL Editor
-- This will populate the products table with sample digital products

-- First, let's check if products table exists and its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Clear existing products (optional - uncomment if needed)
-- DELETE FROM public.products;

-- Insert sample digital products
INSERT INTO public.products (
    id,
    name,
    description,
    price,
    image_url,
    download_url,
    category,
    featured,
    active
) VALUES 
(
    gen_random_uuid(),
    'AI Tools Mastery Guide 2025',
    'Complete guide to mastering AI tools for productivity and business growth. Learn 30+ essential AI tools with practical examples and real-world applications.',
    29.99,
    '/images/ai-tools-guide.jpg',
    '/downloads/ai-tools-mastery-guide-2025.pdf',
    'Education',
    true,
    true
),
(
    gen_random_uuid(),
    'Digital Marketing Masterclass',
    'Comprehensive digital marketing course covering SEO, social media, email marketing, and conversion optimization strategies.',
    49.99,
    '/images/digital-marketing-course.jpg',
    '/downloads/digital-marketing-masterclass.pdf',
    'Business',
    true,
    true
),
(
    gen_random_uuid(),
    'Web Development Starter Kit',
    'Complete starter kit for modern web development including React, Next.js, and TypeScript templates with best practices.',
    19.99,
    '/images/web-dev-kit.jpg',
    '/downloads/web-development-starter-kit.zip',
    'Development',
    false,
    true
),
(
    gen_random_uuid(),
    'E-commerce Business Blueprint',
    'Step-by-step blueprint for starting and scaling an e-commerce business from zero to six figures.',
    39.99,
    '/images/ecommerce-blueprint.jpg',
    '/downloads/ecommerce-business-blueprint.pdf',
    'Business',
    true,
    true
),
(
    gen_random_uuid(),
    'Productivity Planner Template',
    'Professional productivity planner template with goal tracking, habit formation, and time management systems.',
    9.99,
    '/images/productivity-planner.jpg',
    '/downloads/productivity-planner-template.pdf',
    'Productivity',
    false,
    true
),
(
    gen_random_uuid(),
    'Social Media Content Calendar',
    'Ready-to-use social media content calendar with 365 post ideas, templates, and scheduling strategies.',
    14.99,
    '/images/social-media-calendar.jpg',
    '/downloads/social-media-content-calendar.xlsx',
    'Marketing',
    false,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Verify products were inserted
SELECT 
    id,
    name,
    price,
    category,
    featured,
    active,
    created_at
FROM public.products
ORDER BY created_at DESC;

-- Count products by category
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price
FROM public.products
WHERE active = true
GROUP BY category
ORDER BY product_count DESC;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see products listed above, the sample data has been
-- successfully inserted into your products table!
--
-- Your digital store now has:
-- ✅ 6 sample digital products
-- ✅ Various categories (Education, Business, Development, etc.)
-- ✅ Featured and regular products
-- ✅ Realistic pricing structure
-- ============================================================