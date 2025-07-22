import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a server-side client creator function
export const createClient = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured');
    // Return a mock client for build time
    return null as any;
  }
  
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Runtime validation (only when actually using the client)
function validateSupabaseConfig() {
  if (!supabaseUrl) {
    throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

// Create a single supabase client for the browser
export const supabase = (() => {
  if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn('Supabase not configured - some features may not work');
    return null as any;
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Build time - return mock
    return null as any;
  }
  
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
})();

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = (supabaseUrl: string, supabaseKey: string) =>
  createSupabaseClient<Database>(supabaseUrl, supabaseKey);