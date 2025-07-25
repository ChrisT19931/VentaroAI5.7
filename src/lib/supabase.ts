import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validation function for runtime checks
function validateSupabaseConfig() {
  if (!supabaseUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. Please configure this in your Vercel environment variables.');
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Please configure this in your Vercel environment variables.');
  }
  
  // Check for placeholder values (only warn, don't throw errors)
  if (supabaseUrl === 'https://supabase.co' || supabaseUrl.includes('placeholder')) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL contains placeholder value. Please set your actual Supabase project URL.');
  }
  if (supabaseAnonKey.includes('EXAMPLE') || supabaseAnonKey.includes('placeholder')) {
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value. Please set your actual Supabase anonymous key.');
  }
}

// Create a server-side client creator function
export const createClient = async () => {
  validateSupabaseConfig();
  return createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      storageKey: 'ventaro-store-auth-token',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
};

// Create a single supabase client for the browser
export const supabase = (() => {
  // Only validate in browser environment
  if (typeof window !== 'undefined') {
    try {
      validateSupabaseConfig();
      return createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!, {
        auth: {
          storageKey: 'ventaro-store-auth-token',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
    } catch (error) {
      console.error('Supabase configuration error:', error);
      // Return null to prevent app crash, but log the error
      return null as any;
    }
  }
  
  // Server-side: only create client if env vars are available
  if (supabaseUrl && supabaseAnonKey) {
    return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: 'ventaro-store-auth-token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  
  return null as any;
})();

// Create a Supabase client with the service role key for admin operations
export const createAdminClient = (url: string, key: string) =>
  createSupabaseClient<Database>(url, key);

// Create admin client instance
export const supabaseAdmin = (() => {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase admin not configured - admin features may not work. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
    return null as any;
  }
  
  if (supabaseServiceKey.includes('EXAMPLE') || supabaseServiceKey.includes('placeholder')) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY contains placeholder value. Please set your actual service role key.');
    return null as any;
  }
  
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey);
})();