-- =====================================================
-- PURCHASE UNLOCK SYSTEM - DATABASE SETUP
-- Run this script in Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Add missing columns to purchases table
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS payment_email TEXT;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create profiles table for user linking
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create email queue table for purchase notifications
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) DEFAULT 'noreply@ventaroai.com',
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_name VARCHAR(100),
  template_variables JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_customer_email ON purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_payment_intent ON purchases(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_email ON purchases(payment_email);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON email_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 6. Insert default purchase confirmation email template
INSERT INTO email_templates (name, subject, html_content, text_content, variables)
VALUES (
  'purchase_confirmation',
  'Your Purchase Confirmation - {{order_id}}',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Thank you for your purchase!</h1>
        
        <p>Hi {{customer_name}},</p>
        
        <p>Your order has been confirmed and is ready for download.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> {{order_id}}</p>
            <p><strong>Product:</strong> {{product_name}}</p>
            <p><strong>Amount:</strong> ${{amount}}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{download_url}}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Now</a>
        </div>
        
        <p>You can also access your purchases anytime by logging into your account at <a href="https://ventaroai.com/my-account">My Account</a>.</p>
        
        <p>If you have any questions, please don''t hesitate to contact us.</p>
        
        <p>Best regards,<br>The VentaroAI Team</p>
    </div>
</body>
</html>',
  'Thank you for your purchase!\n\nHi {{customer_name}},\n\nYour order {{order_id}} has been confirmed.\nProduct: {{product_name}}\nAmount: ${{amount}}\n\nDownload: {{download_url}}\n\nBest regards,\nThe VentaroAI Team',
  '{"customer_name": "Customer Name", "order_id": "Order ID", "product_name": "Product Name", "amount": "0.00", "download_url": "Download URL"}'
)
ON CONFLICT (name) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  text_content = EXCLUDED.text_content,
  variables = EXCLUDED.variables,
  updated_at = NOW();

-- 7. Create function to queue email notifications
CREATE OR REPLACE FUNCTION queue_email_notification(
  p_to_email VARCHAR(255),
  p_template_name VARCHAR(100),
  p_variables JSONB DEFAULT '{}',
  p_from_email VARCHAR(255) DEFAULT 'noreply@ventaroai.com'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_template_record RECORD;
  v_subject VARCHAR(255);
  v_html_content TEXT;
  v_text_content TEXT;
  v_email_id UUID;
BEGIN
  -- Get template
  SELECT subject, html_content, text_content
  INTO v_template_record
  FROM email_templates
  WHERE name = p_template_name;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Email template % not found', p_template_name;
  END IF;
  
  -- Replace variables in subject and content
  v_subject := v_template_record.subject;
  v_html_content := v_template_record.html_content;
  v_text_content := v_template_record.text_content;
  
  -- Simple variable replacement (for production, consider using a proper template engine)
  FOR key_value IN SELECT key, value FROM jsonb_each_text(p_variables)
  LOOP
    v_subject := REPLACE(v_subject, '{{' || key_value.key || '}}', key_value.value);
    v_html_content := REPLACE(v_html_content, '{{' || key_value.key || '}}', key_value.value);
    v_text_content := REPLACE(v_text_content, '{{' || key_value.key || '}}', key_value.value);
  END LOOP;
  
  -- Insert into email queue
  INSERT INTO email_queue (
    to_email,
    from_email,
    subject,
    html_content,
    text_content,
    template_name,
    template_variables
  )
  VALUES (
    p_to_email,
    p_from_email,
    v_subject,
    v_html_content,
    v_text_content,
    p_template_name,
    p_variables
  )
  RETURNING id INTO v_email_id;
  
  RETURN v_email_id;
END;
$$;

-- 8. Create function to send purchase confirmation
CREATE OR REPLACE FUNCTION send_purchase_confirmation(
  p_customer_email VARCHAR(255),
  p_customer_name VARCHAR(255),
  p_product_name VARCHAR(255),
  p_amount DECIMAL(10,2),
  p_order_id VARCHAR(255),
  p_download_url TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_variables JSONB;
  v_email_id UUID;
BEGIN
  -- Prepare template variables
  v_variables := jsonb_build_object(
    'customer_name', p_customer_name,
    'order_id', p_order_id,
    'product_name', p_product_name,
    'amount', p_amount::TEXT,
    'download_url', p_download_url
  );
  
  -- Queue the email
  SELECT queue_email_notification(
    p_customer_email,
    'purchase_confirmation',
    v_variables
  ) INTO v_email_id;
  
  RETURN v_email_id;
END;
$$;

-- 9. Create trigger function for automatic purchase confirmation emails
CREATE OR REPLACE FUNCTION trigger_purchase_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_customer_name VARCHAR(255);
  v_download_url TEXT;
BEGIN
  -- Get customer name (use email if no name available)
  v_customer_name := COALESCE(NEW.customer_email, 'Valued Customer');
  
  -- Generate download URL
  v_download_url := 'https://ventaroai.com/my-account?access=' || NEW.id;
  
  -- Send confirmation email
  PERFORM send_purchase_confirmation(
    NEW.customer_email,
    v_customer_name,
    NEW.product_name,
    NEW.price,
    NEW.id::TEXT,
    v_download_url
  );
  
  RETURN NEW;
END;
$$;

-- 10. Create trigger to automatically send purchase confirmation emails
DROP TRIGGER IF EXISTS trigger_purchase_confirmation ON purchases;
CREATE TRIGGER trigger_purchase_confirmation
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION trigger_purchase_confirmation();

-- 11. Create helper functions for email queue management
CREATE OR REPLACE FUNCTION get_pending_emails(p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  id UUID,
  to_email VARCHAR(255),
  from_email VARCHAR(255),
  subject VARCHAR(255),
  html_content TEXT,
  text_content TEXT,
  attempts INTEGER,
  scheduled_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
AS $$
  SELECT 
    id, to_email, from_email, subject, html_content, text_content, attempts, scheduled_at
  FROM email_queue
  WHERE status = 'pending'
    AND scheduled_at <= NOW()
    AND attempts < max_attempts
  ORDER BY scheduled_at ASC
  LIMIT p_limit;
$$;

CREATE OR REPLACE FUNCTION mark_email_sent(p_email_id UUID)
RETURNS VOID
LANGUAGE sql
AS $$
  UPDATE email_queue
  SET status = 'sent', sent_at = NOW(), updated_at = NOW()
  WHERE id = p_email_id;
$$;

CREATE OR REPLACE FUNCTION mark_email_failed(p_email_id UUID, p_error_message TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE email_queue
  SET 
    attempts = attempts + 1,
    error_message = p_error_message,
    status = CASE 
      WHEN attempts + 1 >= max_attempts THEN 'failed'
      ELSE 'pending'
    END,
    scheduled_at = CASE
      WHEN attempts + 1 < max_attempts THEN NOW() + INTERVAL '5 minutes'
      ELSE scheduled_at
    END,
    updated_at = NOW()
  WHERE id = p_email_id;
END;
$$;

-- 12. Enable Row Level Security (RLS) for security
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS policies
CREATE POLICY "Service role can manage email queue" ON email_queue
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage email templates" ON email_templates
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage profiles" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- SETUP COMPLETE!
-- 
-- This script has created:
-- ✅ Missing columns in purchases table
-- ✅ Profiles table for user linking
-- ✅ Email queue system for notifications
-- ✅ Email templates for purchase confirmations
-- ✅ Automatic triggers for purchase emails
-- ✅ Helper functions for email management
-- ✅ Security policies
-- 
-- Your purchase unlock system is now ready!
-- =====================================================