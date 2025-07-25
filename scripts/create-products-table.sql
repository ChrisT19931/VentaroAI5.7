-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  file_url TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  product_type TEXT DEFAULT 'digital'
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, featured, is_active, product_type) VALUES
(
  'AI Tools Mastery Guide 2025',
  '30-page guide with AI tools and AI prompts to make money online in 2025. Learn ChatGPT, Claude, Grok, Gemini, and proven strategies to make money with AI.',
  25.00,
  '/images/products/ai-tools-mastery-guide.svg',
  'E-book',
  true,
  true,
  'digital'
),
(
  'AI Prompts Arsenal 2025',
  '30 professional AI prompts to make money online in 2025. Proven ChatGPT and Claude prompts for content creation, marketing automation, and AI-powered business growth.',
  10.00,
  '/images/products/ai-prompts-arsenal.svg',
  'AI Prompts',
  true,
  true,
  'digital'
),
(
  'AI Business Strategy Session 2025',
  '60-minute coaching session to learn how to make money online with AI tools and AI prompts. Get personalized strategies to build profitable AI-powered businesses in 2025.',
  497.00,
  '/images/products/ai-business-strategy-session.svg',
  'Coaching',
  true,
  true,
  'digital'
);