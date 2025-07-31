-- ============================================================
-- EMAIL NOTIFICATIONS SETUP FOR DIGITAL STORE
-- ============================================================
-- Run this script in Supabase Dashboard → SQL Editor
-- This sets up email templates and notification triggers

-- ============================================================
-- CREATE EMAIL TEMPLATES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON public.email_templates(template_name);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON public.email_templates(active);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email templates
CREATE POLICY "Service role can manage email templates" ON public.email_templates
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Authenticated users can read active templates" ON public.email_templates
    FOR SELECT USING (active = true AND auth.role() = 'authenticated');

-- ============================================================
-- CREATE EMAIL QUEUE TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_email VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) DEFAULT 'noreply@yourstore.com',
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

-- Create indexes for email queue
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON public.email_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_to_email ON public.email_queue(to_email);

-- Enable RLS
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email queue
CREATE POLICY "Service role can manage email queue" ON public.email_queue
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================
-- INSERT DEFAULT EMAIL TEMPLATES
-- ============================================================

-- 1. Purchase Confirmation Email
INSERT INTO public.email_templates (
    template_name,
    subject,
    html_content,
    text_content,
    variables
) VALUES (
    'purchase_confirmation',
    'Thank you for your purchase - {{product_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .download-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Purchase Confirmed!</h1>
        </div>
        <div class="content">
            <h2>Hi {{customer_name}},</h2>
            <p>Thank you for purchasing <strong>{{product_name}}</strong>!</p>
            <p>Your order details:</p>
            <ul>
                <li><strong>Product:</strong> {{product_name}}</li>
                <li><strong>Price:</strong> ${{price}}</li>
                <li><strong>Order ID:</strong> {{order_id}}</li>
                <li><strong>Purchase Date:</strong> {{purchase_date}}</li>
            </ul>
            <p>You can download your product using the button below:</p>
            <a href="{{download_url}}" class="download-button">Download Now</a>
            <p>You can also access your purchases anytime from your <a href="{{account_url}}">My Account</a> page.</p>
            <p>If you have any questions, please don''t hesitate to contact our support team.</p>
        </div>
        <div class="footer">
            <p>© 2024 Your Digital Store. All rights reserved.</p>
            <p>This email was sent to {{customer_email}}</p>
        </div>
    </div>
</body>
</html>',
    'Hi {{customer_name}},\n\nThank you for purchasing {{product_name}}!\n\nYour order details:\n- Product: {{product_name}}\n- Price: ${{price}}\n- Order ID: {{order_id}}\n- Purchase Date: {{purchase_date}}\n\nDownload your product: {{download_url}}\n\nYou can also access your purchases from your account page: {{account_url}}\n\nIf you have any questions, please contact our support team.\n\n© 2024 Your Digital Store',
    '{
        "customer_name": "Customer name",
        "customer_email": "Customer email address",
        "product_name": "Name of purchased product",
        "price": "Product price",
        "order_id": "Unique order identifier",
        "purchase_date": "Date of purchase",
        "download_url": "Secure download link",
        "account_url": "Link to user account page"
    }'
) ON CONFLICT (template_name) DO UPDATE SET
    subject = EXCLUDED.subject,
    html_content = EXCLUDED.html_content,
    text_content = EXCLUDED.text_content,
    variables = EXCLUDED.variables,
    updated_at = NOW();

-- 2. Welcome Email
INSERT INTO public.email_templates (
    template_name,
    subject,
    html_content,
    text_content,
    variables
) VALUES (
    'welcome_email',
    'Welcome to Your Digital Store!',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Your Digital Store!</h1>
        </div>
        <div class="content">
            <h2>Hi {{user_name}},</h2>
            <p>Welcome to our digital marketplace! We''re excited to have you join our community.</p>
            <p>Here''s what you can do with your new account:</p>
            <ul>
                <li>Browse our collection of digital products</li>
                <li>Make secure purchases with instant access</li>
                <li>Manage your downloads from your account page</li>
                <li>Get exclusive offers and early access to new products</li>
            </ul>
            <a href="{{store_url}}" class="cta-button">Start Shopping</a>
            <p>If you have any questions, our support team is here to help!</p>
        </div>
        <div class="footer">
            <p>© 2024 Your Digital Store. All rights reserved.</p>
            <p>This email was sent to {{user_email}}</p>
        </div>
    </div>
</body>
</html>',
    'Hi {{user_name}},\n\nWelcome to Your Digital Store!\n\nWe''re excited to have you join our community.\n\nWith your new account, you can:\n- Browse our digital products\n- Make secure purchases with instant access\n- Manage downloads from your account\n- Get exclusive offers\n\nStart shopping: {{store_url}}\n\nIf you have questions, our support team is here to help!\n\n© 2024 Your Digital Store',
    '{
        "user_name": "User name",
        "user_email": "User email address",
        "store_url": "Link to store homepage"
    }'
) ON CONFLICT (template_name) DO UPDATE SET
    subject = EXCLUDED.subject,
    html_content = EXCLUDED.html_content,
    text_content = EXCLUDED.text_content,
    variables = EXCLUDED.variables,
    updated_at = NOW();

-- 3. Password Reset Email
INSERT INTO public.email_templates (
    template_name,
    subject,
    html_content,
    text_content,
    variables
) VALUES (
    'password_reset',
    'Reset your password - Your Digital Store',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .reset-button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hi {{user_name}},</h2>
            <p>We received a request to reset your password for Your Digital Store.</p>
            <p>Click the button below to reset your password:</p>
            <a href="{{reset_url}}" class="reset-button">Reset Password</a>
            <div class="warning">
                <strong>Important:</strong> This link will expire in {{expiry_hours}} hours for security reasons.
            </div>
            <p>If you didn''t request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>For security reasons, please don''t share this email with anyone.</p>
        </div>
        <div class="footer">
            <p>© 2024 Your Digital Store. All rights reserved.</p>
            <p>This email was sent to {{user_email}}</p>
        </div>
    </div>
</body>
</html>',
    'Hi {{user_name}},\n\nWe received a request to reset your password for Your Digital Store.\n\nReset your password: {{reset_url}}\n\nThis link will expire in {{expiry_hours}} hours.\n\nIf you didn''t request this, please ignore this email.\n\n© 2024 Your Digital Store',
    '{
        "user_name": "User name",
        "user_email": "User email address",
        "reset_url": "Password reset link",
        "expiry_hours": "Link expiry time in hours"
    }'
) ON CONFLICT (template_name) DO UPDATE SET
    subject = EXCLUDED.subject,
    html_content = EXCLUDED.html_content,
    text_content = EXCLUDED.text_content,
    variables = EXCLUDED.variables,
    updated_at = NOW();

-- ============================================================
-- CREATE NOTIFICATION FUNCTIONS
-- ============================================================

-- Function to queue email notifications
CREATE OR REPLACE FUNCTION queue_email_notification(
    p_template_name VARCHAR(100),
    p_to_email VARCHAR(255),
    p_variables JSONB DEFAULT '{}',
    p_scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
    template_record RECORD;
    email_id UUID;
    final_subject VARCHAR(255);
    final_html_content TEXT;
    final_text_content TEXT;
BEGIN
    -- Get template
    SELECT * INTO template_record
    FROM public.email_templates
    WHERE template_name = p_template_name AND active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Email template % not found or inactive', p_template_name;
    END IF;
    
    -- Replace variables in subject and content
    final_subject := template_record.subject;
    final_html_content := template_record.html_content;
    final_text_content := template_record.text_content;
    
    -- Simple variable replacement (for production, use a proper templating engine)
    FOR key, value IN SELECT * FROM jsonb_each_text(p_variables)
    LOOP
        final_subject := REPLACE(final_subject, '{{' || key || '}}', value);
        final_html_content := REPLACE(final_html_content, '{{' || key || '}}', value);
        final_text_content := REPLACE(final_text_content, '{{' || key || '}}', value);
    END LOOP;
    
    -- Insert into email queue
    INSERT INTO public.email_queue (
        to_email,
        subject,
        html_content,
        text_content,
        template_name,
        template_variables,
        scheduled_at
    ) VALUES (
        p_to_email,
        final_subject,
        final_html_content,
        final_text_content,
        p_template_name,
        p_variables,
        p_scheduled_at
    ) RETURNING id INTO email_id;
    
    RETURN email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE TRIGGERS FOR AUTOMATIC NOTIFICATIONS
-- ============================================================

-- Function to send purchase confirmation email
CREATE OR REPLACE FUNCTION send_purchase_confirmation()
RETURNS TRIGGER AS $$
DECLARE
    customer_name VARCHAR(255);
    variables JSONB;
BEGIN
    -- Get customer name (try to extract from email or use email)
    customer_name := SPLIT_PART(NEW.customer_email, '@', 1);
    
    -- Prepare email variables
    variables := jsonb_build_object(
        'customer_name', customer_name,
        'customer_email', NEW.customer_email,
        'product_name', NEW.product_name,
        'price', NEW.price::text,
        'order_id', NEW.id::text,
        'purchase_date', TO_CHAR(NEW.created_at, 'YYYY-MM-DD HH24:MI'),
        'download_url', 'https://yourstore.com/my-account',
        'account_url', 'https://yourstore.com/my-account'
    );
    
    -- Queue the email
    PERFORM queue_email_notification(
        'purchase_confirmation',
        NEW.customer_email,
        variables
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for purchase confirmations
DROP TRIGGER IF EXISTS trigger_purchase_confirmation ON public.purchases;
CREATE TRIGGER trigger_purchase_confirmation
    AFTER INSERT ON public.purchases
    FOR EACH ROW
    EXECUTE FUNCTION send_purchase_confirmation();

-- ============================================================
-- UTILITY FUNCTIONS
-- ============================================================

-- Function to get pending emails
CREATE OR REPLACE FUNCTION get_pending_emails(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    to_email VARCHAR(255),
    subject VARCHAR(255),
    html_content TEXT,
    text_content TEXT,
    attempts INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        eq.id,
        eq.to_email,
        eq.subject,
        eq.html_content,
        eq.text_content,
        eq.attempts
    FROM public.email_queue eq
    WHERE eq.status = 'pending'
    AND eq.scheduled_at <= NOW()
    AND eq.attempts < eq.max_attempts
    ORDER BY eq.scheduled_at ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark email as sent
CREATE OR REPLACE FUNCTION mark_email_sent(email_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.email_queue
    SET 
        status = 'sent',
        sent_at = NOW(),
        updated_at = NOW()
    WHERE id = email_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark email as failed
CREATE OR REPLACE FUNCTION mark_email_failed(email_id UUID, error_msg TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.email_queue
    SET 
        status = CASE 
            WHEN attempts + 1 >= max_attempts THEN 'failed'
            ELSE 'pending'
        END,
        attempts = attempts + 1,
        error_message = error_msg,
        scheduled_at = CASE 
            WHEN attempts + 1 < max_attempts THEN NOW() + INTERVAL '5 minutes'
            ELSE scheduled_at
        END,
        updated_at = NOW()
    WHERE id = email_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check email templates
SELECT 
    template_name,
    subject,
    active,
    created_at
FROM public.email_templates
ORDER BY template_name;

-- Check email queue (should be empty initially)
SELECT 
    COUNT(*) as total_emails,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
FROM public.email_queue;

-- ============================================================
-- USAGE EXAMPLES
-- ============================================================

-- Example: Manually queue a welcome email
/*
SELECT queue_email_notification(
    'welcome_email',
    'user@example.com',
    jsonb_build_object(
        'user_name', 'John Doe',
        'user_email', 'user@example.com',
        'store_url', 'https://yourstore.com'
    )
);
*/

-- Example: Get pending emails for processing
/*
SELECT * FROM get_pending_emails(5);
*/

-- ============================================================
-- CLEANUP FUNCTION
-- ============================================================

-- Function to clean up old sent emails
CREATE OR REPLACE FUNCTION cleanup_old_emails(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    DELETE FROM public.email_queue
    WHERE status = 'sent'
    AND sent_at < NOW() - (days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
-- If you see the email templates listed above, notifications are ready!
--
-- Your digital store now has:
-- ✅ Email template system
-- ✅ Email queue for reliable delivery
-- ✅ Automatic purchase confirmation emails
-- ✅ Welcome and password reset templates
-- ✅ Utility functions for email management
-- ✅ Automatic cleanup functions
--
-- Next steps:
-- 1. Update email templates with your branding
-- 2. Configure your email service (SendGrid, etc.)
-- 3. Set up a cron job to process the email queue
-- ============================================================