import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { createClient } from '@/lib/supabase/client';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';

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
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
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

        try {
          // Authenticate with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            console.error('Authentication error:', error);
            return null;
          }

          // Fetch user's purchases/entitlements
          const { data: purchases, error: purchasesError } = await supabase
            .from('purchases')
            .select('product_id')
            .eq('user_id', data.user.id);

          if (purchasesError) {
            console.error('Error fetching purchases:', purchasesError);
          }

          // Fetch user roles from Supabase
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user role:', profileError);
          }

          // Extract product IDs as entitlements and user role
          const entitlements = purchases?.map((purchase: { product_id: string }) => purchase.product_id) || [];
          const roles = profile?.user_role ? [profile.user_role] : [];
          
          // Get created_at from user metadata or from Supabase created_at
          let created_at = data.user.created_at;
          // If backend uses createdAt (camelCase), map it to created_at
          if (data.user.user_metadata?.createdAt && !created_at) {
            created_at = data.user.user_metadata.createdAt;
          }

          return {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || '',
            entitlements,
            roles,
            created_at: created_at,
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
        token.id = user.id;
        token.email = user.email;
        token.entitlements = user.entitlements || [];
        token.roles = user.roles || [];
        token.created_at = user.created_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Include user entitlements and roles in the session
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.entitlements = token.entitlements as string[] || [];
        session.user.roles = token.roles as string[] || [];
        session.user.created_at = token.created_at as string;
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