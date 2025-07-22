# Supabase Setup Guide for Ventaro Digital Store

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a project name: "Ventaro Digital Store"
4. Set a strong database password
5. Choose a region close to your users

## 2. Get Your Credentials

After project creation:
1. Go to **Settings** → **API**
2. Copy the following values to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run these commands:

### Create Tables

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  file_url TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  payment_intent_id TEXT,
  payment_status TEXT
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  download_url TEXT,
  download_count INTEGER DEFAULT 0,
  download_expiry TIMESTAMP WITH TIME ZONE
);

-- Create coaching_intakes table
CREATE TABLE coaching_intakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  user_email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  current_hosting TEXT,
  tech_stack TEXT,
  timeline TEXT NOT NULL,
  specific_challenges TEXT NOT NULL,
  preferred_times TEXT NOT NULL,
  timezone TEXT NOT NULL,
  additional_info TEXT,
  status TEXT DEFAULT 'submitted',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  session_notes TEXT,
  admin_notes TEXT
);
```

### Create Storage Buckets

```sql
-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true),
('product-files', 'product-files', false);
```

### Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_intakes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Products policies
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Coaching intakes policies
CREATE POLICY "Users can view own coaching intakes" ON coaching_intakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own coaching intakes" ON coaching_intakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coaching intakes" ON coaching_intakes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all coaching intakes" ON coaching_intakes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### Create Storage Policies

```sql
-- Product images bucket policies
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Product files bucket policies (private)
CREATE POLICY "Users can download purchased files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'product-files' AND
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = auth.uid() 
      AND o.payment_status = 'succeeded'
      AND storage.objects.name = p.file_url
    )
  );

CREATE POLICY "Admins can manage product files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'product-files' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

## 4. Create Admin User

After setting up the database:

1. **Sign up** for an account using your admin email on your website
2. Go to **Authentication** → **Users** in Supabase dashboard
3. Find the user with your admin email
4. Go to **SQL Editor** and run:

```sql
-- Make your admin email an admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-admin-email@domain.com';
```

## 5. Insert Sample Products

```sql
-- Insert the three main products
INSERT INTO products (name, description, price, category, featured, is_active) VALUES
(
  'AI Tools Mastery Guide 2025',
  '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
  25.00,
  'E-book',
  true,
  true
),
(
  'AI Prompts Arsenal 2025',
  '30 premium AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
  10.00,
  'AI Prompts',
  true,
  true
),
(
  'AI Business Strategy Session 2025',
  '60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies to build profitable AI-powered businesses in 2025.',
  497.00,
  'Coaching',
  true,
  true
);
```

## 6. Test the Setup

1. Restart your development server: `npm run dev`
2. Visit `http://localhost:3001`
3. Sign up with your admin email
4. After making the account admin (step 4), you should be able to access `/admin`

## 7. Configure Email Authentication (Optional)

In Supabase dashboard:
1. Go to **Authentication** → **Settings**
2. Configure email templates
3. Set up SMTP settings if needed

## Troubleshooting

- **Products not loading**: Check that your Supabase URL and keys are correct
- **Admin access denied**: Ensure the user has `is_admin = true` in the profiles table
- **Database errors**: Check that all tables and policies are created correctly
- **File uploads failing**: Verify storage buckets and policies are set up

## Security Notes

- Never commit real API keys to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor your Supabase usage and logs