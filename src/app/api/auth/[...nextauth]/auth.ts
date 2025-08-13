import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from '@/lib/env';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

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
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
        if (!supabaseUrl || !supabaseAnonKey) {
          console.error('Supabase environment variables are missing');
          return null;
        }

        // Create a fresh server-side client per request to avoid any global overrides
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

        try {
          // Authenticate with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            console.error('Authentication error:', error?.message || 'No user');
            return null;
          }

          // Try to fetch user's purchases/entitlements (non-blocking)
          let entitlements: string[] = [];
          try {
            const { data: purchases } = await supabase
              .from('purchases')
              .select('product_id')
              .eq('user_id', data.user.id);
            entitlements = purchases?.map((p: { product_id: string }) => p.product_id) || [];
          } catch (purchasesError: any) {
            console.warn('Non-blocking: error fetching purchases:', purchasesError?.message);
          }

          // Try to fetch user role (non-blocking)
          let roles: string[] = [];
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('user_role')
              .eq('id', data.user.id)
              .single();
            roles = profile?.user_role ? [profile.user_role] : [];
          } catch (profileError: any) {
            console.warn('Non-blocking: error fetching user role:', profileError?.message);
          }

          // Get created_at from user
          let created_at = (data.user as any).created_at;
          if ((data.user as any).user_metadata?.createdAt && !created_at) {
            created_at = (data.user as any).user_metadata.createdAt;
          }

          return {
            id: data.user.id,
            email: data.user.email || '',
            name: (data.user as any).user_metadata?.name || '',
            entitlements,
            roles,
            created_at,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
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