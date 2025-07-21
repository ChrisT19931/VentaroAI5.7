import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Re-export createClient for components that need it
export { createClient };

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single supabase client for the browser
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = (supabaseUrl: string, supabaseKey: string) =>
  createClient<Database>(supabaseUrl, supabaseKey);