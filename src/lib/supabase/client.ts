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

// Check for placeholder values (warn during build, throw during runtime)
if (supabaseUrl === 'https://supabase.co' || supabaseUrl.includes('placeholder')) {
  const message = 'NEXT_PUBLIC_SUPABASE_URL contains placeholder value. Please set your actual Supabase project URL in Vercel environment variables.';
  if (typeof window !== 'undefined') {
    throw new Error(message);
  } else {
    console.warn(message);
  }
}

if (supabaseAnonKey.includes('EXAMPLE') || supabaseAnonKey.includes('placeholder')) {
  const message = 'NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value. Please set your actual Supabase anonymous key in Vercel environment variables.';
  if (typeof window !== 'undefined') {
    throw new Error(message);
  } else {
    console.warn(message);
  }
}

export const createClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
};