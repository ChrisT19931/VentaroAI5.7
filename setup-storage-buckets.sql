-- ============================================================
-- STORAGE BUCKETS SETUP FOR DIGITAL STORE
-- ============================================================
-- Run this script in Supabase Dashboard → SQL Editor
-- This will create and configure storage buckets for product files

-- ============================================================
-- CREATE STORAGE BUCKETS
-- ============================================================

-- 1. Create bucket for product downloads (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-downloads',
    'product-downloads',
    false,
    52428800, -- 50MB limit
    ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Create bucket for product images (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Create bucket for user avatars (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    2097152, -- 2MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================
-- STORAGE POLICIES FOR PRODUCT DOWNLOADS (PRIVATE)
-- ============================================================

-- Policy: Only authenticated users who purchased the product can download
CREATE POLICY "Users can download purchased products" ON storage.objects
    FOR SELECT 
    USING (
        bucket_id = 'product-downloads' 
        AND (
            -- Check if user purchased this product
            EXISTS (
                SELECT 1 FROM public.purchases p
                WHERE p.download_url = '/downloads/' || name
                AND (
                    p.user_id = auth.uid()
                    OR p.customer_email = auth.jwt() ->> 'email'
                )
            )
            -- OR service role for admin access
            OR auth.jwt() ->> 'role' = 'service_role'
        )
    );

-- Policy: Service role can upload product files
CREATE POLICY "Service role can upload product downloads" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'product-downloads'
        AND auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Service role can update product files
CREATE POLICY "Service role can update product downloads" ON storage.objects
    FOR UPDATE 
    USING (
        bucket_id = 'product-downloads'
        AND auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Service role can delete product files
CREATE POLICY "Service role can delete product downloads" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'product-downloads'
        AND auth.jwt() ->> 'role' = 'service_role'
    );

-- ============================================================
-- STORAGE POLICIES FOR PRODUCT IMAGES (PUBLIC)
-- ============================================================

-- Policy: Anyone can view product images
CREATE POLICY "Anyone can view product images" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'product-images');

-- Policy: Service role can upload product images
CREATE POLICY "Service role can upload product images" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'product-images'
        AND auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Service role can update product images
CREATE POLICY "Service role can update product images" ON storage.objects
    FOR UPDATE 
    USING (
        bucket_id = 'product-images'
        AND auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Service role can delete product images
CREATE POLICY "Service role can delete product images" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'product-images'
        AND auth.jwt() ->> 'role' = 'service_role'
    );

-- ============================================================
-- STORAGE POLICIES FOR USER AVATARS (PUBLIC)
-- ============================================================

-- Policy: Anyone can view avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'avatars');

-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE 
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================================
-- HELPER FUNCTIONS FOR FILE MANAGEMENT
-- ============================================================

-- Function to generate secure download URL for purchased products
CREATE OR REPLACE FUNCTION get_secure_download_url(
    user_email TEXT,
    product_file_path TEXT
)
RETURNS TEXT AS $$
DECLARE
    has_access BOOLEAN := FALSE;
    download_url TEXT;
BEGIN
    -- Check if user has purchased this product
    SELECT EXISTS (
        SELECT 1 FROM public.purchases p
        WHERE p.download_url = product_file_path
        AND (
            p.user_id = auth.uid()
            OR p.customer_email = user_email
        )
    ) INTO has_access;
    
    IF has_access THEN
        -- Generate signed URL valid for 1 hour
        SELECT storage.create_signed_url(
            'product-downloads',
            LTRIM(product_file_path, '/downloads/'),
            3600 -- 1 hour expiry
        ) INTO download_url;
        
        RETURN download_url;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old temporary files
CREATE OR REPLACE FUNCTION cleanup_old_temp_files()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete files older than 7 days from temp folders
    DELETE FROM storage.objects
    WHERE bucket_id IN ('product-downloads', 'product-images')
    AND name LIKE '%/temp/%'
    AND created_at < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check created buckets
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets
WHERE id IN ('product-downloads', 'product-images', 'avatars')
ORDER BY created_at;

-- Check storage policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- Check storage usage (if any files exist)
SELECT 
    bucket_id,
    COUNT(*) as file_count,
    SUM(metadata->>'size')::bigint as total_size_bytes,
    ROUND(SUM(metadata->>'size')::bigint / 1024.0 / 1024.0, 2) as total_size_mb
FROM storage.objects
WHERE bucket_id IN ('product-downloads', 'product-images', 'avatars')
GROUP BY bucket_id
ORDER BY bucket_id;

-- ============================================================
-- SAMPLE FILE UPLOAD EXAMPLES
-- ============================================================

-- Example: How to reference files in your products table
/*
UPDATE public.products 
SET 
    image_url = 'https://your-project.supabase.co/storage/v1/object/public/product-images/ai-tools-guide.jpg',
    download_url = '/downloads/ai-tools-mastery-guide-2025.pdf'
WHERE name = 'AI Tools Mastery Guide 2025';
*/

-- ============================================================
-- USAGE INSTRUCTIONS
-- ============================================================
/*
1. UPLOADING PRODUCT FILES:
   - Use Supabase Dashboard → Storage → product-downloads
   - Upload your digital products (PDFs, ZIPs, etc.)
   - Note the file path for use in products table

2. UPLOADING PRODUCT IMAGES:
   - Use Supabase Dashboard → Storage → product-images
   - Upload product preview images
   - Use public URL in products table

3. SECURE DOWNLOADS:
   - Use get_secure_download_url() function in your API
   - Only users who purchased can access download links
   - Links expire after 1 hour for security

4. FILE ORGANIZATION:
   product-downloads/
   ├── pdfs/
   │   ├── ai-tools-guide.pdf
   │   └── marketing-course.pdf
   ├── templates/
   │   └── productivity-planner.xlsx
   └── software/
       └── web-dev-kit.zip

   product-images/
   ├── covers/
   │   ├── ai-tools-guide.jpg
   │   └── marketing-course.jpg
   └── thumbnails/
       ├── ai-tools-thumb.jpg
       └── marketing-thumb.jpg
*/

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see the buckets listed above, storage is ready!
--
-- Your digital store now has:
-- ✅ Secure product download storage
-- ✅ Public product image storage
-- ✅ User avatar storage
-- ✅ Proper access control policies
-- ✅ Helper functions for secure downloads
-- ============================================================