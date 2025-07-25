# Creating Profiles Table in Supabase

The following SQL commands need to be executed in the Supabase SQL Editor to create the necessary tables and set up the admin user.

## Step 1: Create Profiles Table

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## Step 2: Set Admin User

Replace `'67eb6090-0146-4263-b0f1-a7f54b60e870'` with the actual user ID if different.

```sql
-- Insert or update the admin user profile
INSERT INTO public.profiles (id, email, is_admin)
VALUES ('67eb6090-0146-4263-b0f1-a7f54b60e870', 'chris.t@ventarosales.com', true)
ON CONFLICT (id) 
DO UPDATE SET is_admin = true, updated_at = NOW();
```

## Step 3: Verify Admin User

```sql
-- Check if the admin user exists and has admin privileges
SELECT * FROM public.profiles WHERE email = 'chris.t@ventarosales.com';
```

## How to Run These Commands

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Create a new query
4. Copy and paste each section of SQL commands
5. Run the commands

## After Running SQL Commands

Once you've executed these SQL commands, you should be able to:

1. Start your dev server: `npm run dev`
2. Visit http://localhost:3003
3. Login with chris.t@ventarosales.com
4. Access admin panel at /admin