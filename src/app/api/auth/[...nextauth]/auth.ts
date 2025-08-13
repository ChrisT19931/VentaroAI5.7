import NextAuth, { NextAuthOptions, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from '@/lib/env';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Define types for NextAuth session and user
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      entitlements: string[];
      roles?: string[];
      created_at?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    entitlements?: string[];
    roles?: string[];
    created_at?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    entitlements: string[];
    roles?: string[];
    created_at?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
          // Development mode - allow test users
          console.warn('⚠️ Supabase not configured - using development authentication');
          
          // Allow test credentials in development
          if (credentials.email === 'admin@ventaro.ai' && credentials.password === 'admin123') {
            return {
              id: 'dev_admin',
              email: 'admin@ventaro.ai',
              name: 'Admin User',
              entitlements: ['1', '2', '4', '5'], // All products
              roles: ['admin'],
              created_at: new Date().toISOString(),
            };
          }
          
          if (credentials.email === 'test@example.com' && credentials.password === 'test123') {
            return {
              id: 'dev_user',
              email: 'test@example.com',
              name: 'Test User',
              entitlements: ['1'], // Only first product
              roles: ['user'],
              created_at: new Date().toISOString(),
            };
          }
          
          return null;
        }

        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

        try {
          // Authenticate against profiles table
          const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (error || !user) {
            console.error('User not found:', error?.message || 'No user');
            return null;
          }

          // Verify password
          if (user.password_hash) {
            const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
            if (!isValidPassword) {
              console.error('Invalid password');
              return null;
            }
          } else {
            // Fallback: if no password hash, reject
            console.error('No password hash found for user');
            return null;
          }

          // Try to fetch user's purchases/entitlements (non-blocking)
          let entitlements: string[] = [];
          try {
            const { data: purchases } = await supabase
              .from('purchases')
              .select('product_id')
              .eq('user_id', user.id);
            entitlements = purchases?.map((p: { product_id: string }) => p.product_id) || [];
          } catch (purchasesError: any) {
            console.warn('Non-blocking: error fetching purchases:', purchasesError?.message);
          }

          // Set roles based on user_role field
          const roles = user.user_role ? [user.user_role] : ['user'];

          return {
            id: user.id,
            email: user.email || '',
            name: user.name || '',
            entitlements,
            roles,
            created_at: user.created_at,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Include user entitlements and roles in the JWT token
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.entitlements = (user as any).entitlements || [];
        token.roles = (user as any).roles || [];
        token.created_at = (user as any).created_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Include user entitlements and roles in the session
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).email = token.email as string;
        (session.user as any).entitlements = (token.entitlements as string[]) || [];
        (session.user as any).roles = (token.roles as string[]) || [];
        (session.user as any).created_at = token.created_at as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  secret: env.NEXTAUTH_SECRET,
};