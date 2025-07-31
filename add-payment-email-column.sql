-- ADD PAYMENT_EMAIL COLUMN TO PURCHASES TABLE
-- ============================================================
-- Run this script in Supabase Dashboard → SQL Editor
-- This will add the payment_email column to track original payment emails

-- 1. Add the payment_email column
ALTER TABLE public.purchases 
ADD COLUMN IF NOT EXISTS payment_email TEXT;

-- 2. Create index for the new column
CREATE INDEX IF NOT EXISTS idx_purchases_payment_email ON public.purchases(payment_email);

-- 3. Update existing records to populate payment_email with customer_email
-- (This ensures backward compatibility)
UPDATE public.purchases 
SET payment_email = customer_email 
WHERE payment_email IS NULL;

-- 4. Add comment to explain the column purpose
COMMENT ON COLUMN public.purchases.payment_email IS 'Original email used for payment (from Stripe)';
COMMENT ON COLUMN public.purchases.customer_email IS 'Email of registered user account (for linking purchases)';

-- 5. Optional: Add constraint to ensure payment_email is not null for new records
-- ALTER TABLE public.purchases 
-- ADD CONSTRAINT payment_email_not_null CHECK (payment_email IS NOT NULL);

SELECT 'Migration completed: payment_email column added to purchases table' AS status;