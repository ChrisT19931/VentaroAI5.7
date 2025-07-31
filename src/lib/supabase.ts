import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Enhanced connection configuration for optimal performance
const supabaseConfig = {
  auth: {
    storageKey: 'ventaro-store-auth-token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
  },
  db: {
    schema: 'public' as const,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-my-custom-header': 'ventaro-digital-store',
    },
  },
};

// Connection health monitoring
let connectionHealth = {
  lastCheck: 0,
  isHealthy: true,
  consecutiveFailures: 0,
};

// Validation function for runtime checks
function validateSupabaseConfig() {
  // During build time, skip validation to prevent build failures
  if (process.env.VERCEL_BUILD === 'true' || (process.env.NODE_ENV === 'production' && typeof window === 'undefined')) {
    return;
  }
  
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

// Enhanced connection health check
export async function checkSupabaseHealth(client: any) {
  const now = Date.now();
  
  // Only check health every 30 seconds to avoid excessive requests
  if (now - connectionHealth.lastCheck < 30000 && connectionHealth.isHealthy) {
    return connectionHealth.isHealthy;
  }
  
  try {
    // Simple health check query
    const { error } = await client.from('products').select('id').limit(1);
    
    if (error && error.code !== '42P01') { // Ignore table not found errors
      throw error;
    }
    
    connectionHealth.isHealthy = true;
    connectionHealth.consecutiveFailures = 0;
    connectionHealth.lastCheck = now;
    
    return true;
  } catch (error) {
    connectionHealth.consecutiveFailures++;
    connectionHealth.isHealthy = connectionHealth.consecutiveFailures < 3;
    connectionHealth.lastCheck = now;
    
    console.warn(`Supabase health check failed (${connectionHealth.consecutiveFailures}/3):`, error);
    return connectionHealth.isHealthy;
  }
}

// Create a server-side client creator function with enhanced configuration
export const createClient = async () => {
  validateSupabaseConfig();
  const client = createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!, supabaseConfig);
  
  // Perform health check for server-side clients
  if (typeof window === 'undefined') {
    await checkSupabaseHealth(client);
  }
  
  return client;
};

// Create an optimized client with retry logic
export const createClientWithRetry = async (maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await createClient();
      return client;
    } catch (error) {
      lastError = error;
      console.warn(`Supabase client creation attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
      }
    }
  }
  
  throw lastError;
};

// Create a single optimized supabase client for the browser (lazy-loaded)
let _supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (_supabaseClient) {
    return _supabaseClient;
  }
  
  // Only validate in browser environment
  if (typeof window !== 'undefined') {
    try {
      validateSupabaseConfig();
      _supabaseClient = createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!, supabaseConfig);
      setInterval(async () => {
        await checkSupabaseHealth(_supabaseClient!);
      }, 60000);
      return _supabaseClient;
    } catch (error) {
      throw new Error('Supabase configuration error in browser: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
  
  // Server-side: only create client if env vars are available
  if (supabaseUrl && supabaseAnonKey) {
    _supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, supabaseConfig);
    return _supabaseClient;
  }
  
  // During build time, return a mock client to prevent build failures
  if (process.env.VERCEL_BUILD === 'true' || process.env.NODE_ENV === 'production') {
    console.warn('Supabase client not configured during build - using mock client');
    return createSupabaseClient<Database>('https://placeholder.supabase.co', 'placeholder-key', supabaseConfig);
  }
  
  throw new Error('Supabase configuration error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
};

// Export the getter function as supabase for backward compatibility
export const supabase = getSupabaseClient();

// Enhanced query wrapper with automatic retry
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 2
): Promise<{ data: T | null; error: any }> {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await queryFn();
      
      // If query succeeds, return result
      if (!result.error || result.error.code === '42P01') {
        return result;
      }
      
      // If it's a connection error, retry
      if (result.error.code === 'PGRST301' || result.error.message?.includes('connection')) {
        lastError = result.error;
        if (attempt <= maxRetries) {
          console.warn(`Query attempt ${attempt} failed, retrying...`, result.error);
          await new Promise(resolve => setTimeout(resolve, attempt * 500));
          continue;
        }
      }
      
      return result;
    } catch (error) {
      lastError = error;
      if (attempt <= maxRetries) {
        console.warn(`Query attempt ${attempt} failed, retrying...`, error);
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
      }
    }
  }
  
  return { data: null, error: lastError };
}

// Create a Supabase client with the service role key for admin operations
export const createAdminClient = (url: string, key: string) =>
  createSupabaseClient<Database>(url, key);

// Create admin client instance (lazy-loaded)
let _supabaseAdmin: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export const getSupabaseAdmin = () => {
  if (_supabaseAdmin) {
    return _supabaseAdmin;
  }
  
  // During build time, return a mock admin client to prevent build failures
  if (process.env.VERCEL_BUILD === 'true' || (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && (!supabaseUrl || !supabaseServiceKey))) {
    console.warn('Supabase admin client not configured during build - using mock client');
    return createSupabaseClient<Database>('https://placeholder.supabase.co', 'placeholder-service-key');
  }
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase admin not configured - please set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in your environment variables.');
  }
  if (supabaseServiceKey.includes('EXAMPLE') || supabaseServiceKey.includes('placeholder')) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY contains placeholder value. Please set your actual service role key.');
  }
  
  _supabaseAdmin = createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey);
  return _supabaseAdmin;
};

// For backward compatibility, export the getter function as supabaseAdmin
export { getSupabaseAdmin as supabaseAdmin };