import NextAuth, { NextAuthOptions, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { bulletproofAuth } from '@/lib/auth-bulletproof';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      entitlements?: string[];
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
    entitlements?: string[];
    roles?: string[];
    created_at?: string;
  }
}

// Product ID mapping for entitlements
const PRODUCT_ENTITLEMENT_MAP: Record<string, string[]> = {
  '1': ['ai-tools-mastery-guide-2025', 'ebook'],
  '2': ['ai-prompts-arsenal-2025', 'prompts'],
  '4': ['ai-business-video-guide-2025', 'video', 'masterclass'],
  '5': ['weekly-support-contract-2025', 'support'],
};

function mapPurchasesToEntitlements(purchases: any[]): string[] {
  const entitlements = new Set<string>();
  
  for (const purchase of purchases) {
    const productId = purchase.product_id;
    
    // Add the raw product ID
    entitlements.add(productId);
    
    // Add mapped entitlements
    if (PRODUCT_ENTITLEMENT_MAP[productId]) {
      PRODUCT_ENTITLEMENT_MAP[productId].forEach(entitlement => {
        entitlements.add(entitlement);
      });
    }
  }
  
  return Array.from(entitlements);
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
        console.log('🚀 BULLETPROOF AUTH: Starting authentication for:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ BULLETPROOF AUTH: Missing credentials');
          throw new Error('Email and password are required');
        }

        try {
          // Use bulletproof authentication
          const user = await bulletproofAuth.authenticateUser(
            credentials.email,
            credentials.password
          );

          if (!user) {
            console.error('❌ BULLETPROOF AUTH: User authentication failed');
            throw new Error('Invalid email or password');
          }

          console.log('✅ BULLETPROOF AUTH: User authenticated:', user.email);

          // Get user purchases for entitlements
          let entitlements: string[] = [];
          let roles: string[] = [user.user_role];
          
          try {
            const purchases = await bulletproofAuth.getUserPurchases(user.id);
            entitlements = mapPurchasesToEntitlements(purchases);
            console.log('✅ BULLETPROOF AUTH: User entitlements loaded:', entitlements);
          } catch (error) {
            console.warn('⚠️ BULLETPROOF AUTH: Error loading purchases (non-blocking):', error);
          }

          const authUser: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            entitlements,
            roles,
            created_at: user.created_at,
          };

          console.log('🎉 BULLETPROOF AUTH: Authentication complete for:', user.email);
          return authUser;

        } catch (error) {
          console.error('❌ BULLETPROOF AUTH: Authentication error:', error);
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      }
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔐 BULLETPROOF AUTH: JWT callback - user present:', !!user);
      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.entitlements = user.entitlements || [];
        token.roles = user.roles || ['user'];
        token.created_at = user.created_at;
        console.log('✅ BULLETPROOF AUTH: JWT token populated for:', user.email);
      }
      return token;
    },
    
    async session({ session, token }) {
      console.log('🔐 BULLETPROOF AUTH: Session callback - token present:', !!token);
      
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.entitlements = token.entitlements || [];
        session.user.roles = token.roles || ['user'];
        session.user.created_at = token.created_at;
        console.log('✅ BULLETPROOF AUTH: Session populated for:', token.email);
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  debug: process.env.NODE_ENV === 'development',
  
  secret: process.env.NEXTAUTH_SECRET || 'bulletproof-fallback-secret-for-development',
  
  events: {
    async signIn(message) {
      console.log('🎉 BULLETPROOF AUTH: User signed in successfully:', message.user.email);
    },
    async signOut(message) {
      console.log('👋 BULLETPROOF AUTH: User signed out');
    },
    async session(message) {
      console.log('🔄 BULLETPROOF AUTH: Session accessed for:', message.session.user?.email);
    },
  },
};