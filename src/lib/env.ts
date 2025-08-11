import { z } from 'zod';

// Schema for server-side environment variables
const serverEnvSchema = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  
  // SendGrid
  SENDGRID_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email(),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  
  // Database
  DATABASE_URL: z.string().optional(),
});

// Schema for client-side environment variables
const clientEnvSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  
  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  
  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

// Function to validate server-side environment variables
export function validateServerEnv() {
  try {
    const parsed = serverEnvSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error('❌ Invalid server environment variables:');
      console.error(parsed.error.format());
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Error validating server environment variables:', error);
    return false;
  }
}

// Function to validate client-side environment variables
export function validateClientEnv() {
  try {
    const parsed = clientEnvSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error('❌ Invalid client environment variables:');
      console.error(parsed.error.format());
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Error validating client environment variables:', error);
    return false;
  }
}

// Type-safe server environment variables
export const env = {
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
  
  // SendGrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY as string,
  EMAIL_FROM: process.env.EMAIL_FROM as string,
  
  // NextAuth
  NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL as string | undefined,
};

// Type-safe client environment variables
export const clientEnv = {
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  
  // Stripe
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  
  // Site
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL as string,
};

// Function to validate all environment variables at startup
export function validateEnv() {
  const isServerValid = validateServerEnv();
  const isClientValid = validateClientEnv();
  
  if (!isServerValid || !isClientValid) {
    throw new Error('Invalid environment variables. Check the console for details.');
  }
  
  return true;
}