'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. Please configure this in your Vercel environment variables.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Please configure this in your Vercel environment variables.');
}

// Check for placeholder values (only warn, don't throw errors)
if (supabaseUrl === 'https://supabase.co' || supabaseUrl.includes('placeholder')) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL contains placeholder value. Please set your actual Supabase project URL in Vercel environment variables.');
}

if (supabaseAnonKey.includes('EXAMPLE') || supabaseAnonKey.includes('placeholder')) {
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value. Please set your actual Supabase anonymous key in Vercel environment variables.');
}

export const createClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'ventaro-store-auth-token',
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
};