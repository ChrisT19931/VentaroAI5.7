import NextAuth, { NextAuthOptions, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db, User as DatabaseUser } from '@/lib/database';
import { PRODUCT_MAPPINGS, LEGACY_PRODUCT_MAPPINGS } from '@/config/products';

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
const FRONT_IDS_BY_CODE: Record<string, string> = {
  '1': 'ai-tools-mastery-guide-2025',
  '2': 'ai-prompts-arsenal-2025', 
  '4': 'ai-business-video-guide-2025',
  '5': 'weekly-support-contract-2025',
};

const FRIENDLY_TO_CODE: Record<string, string> = {
  ebook: PRODUCT_MAPPINGS.ebook,
  prompts: PRODUCT_MAPPINGS.prompts,
  video: PRODUCT_MAPPINGS.video,
  support: PRODUCT_MAPPINGS.support,
};

function mapPurchasesToEntitlements(purchases: any[]): string[] {
  const entitlements = new Set<string>();
  
  for (const purchase of purchases) {
    const productId = purchase.product_id;
    
    // Add the raw product ID
    entitlements.add(productId);
    
    // Map to front-end ID if available
    if (FRONT_IDS_BY_CODE[productId]) {
      entitlements.add(FRONT_IDS_BY_CODE[productId]);
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
        console.log('🔐 NextAuth: Starting authentication for:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ NextAuth: Missing email or password');
          throw new Error('Email and password are required');
        }

        try {
          // Find user in database
          const user = await db.findUserByEmail(credentials.email);
          if (!user) {
            console.error('❌ NextAuth: User not found:', credentials.email);
            throw new Error('Invalid email or password');
          }

          // Verify password
          if (!user.password_hash) {
            console.error('❌ NextAuth: No password hash found for user');
            throw new Error('Account configuration error');
          }

          const isValidPassword = await db.verifyPassword(credentials.password, user.password_hash);
          if (!isValidPassword) {
            console.error('❌ NextAuth: Invalid password for user:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('✅ NextAuth: Password verified for user:', credentials.email);

          // Get user purchases for entitlements
          let entitlements: string[] = [];
          let roles: string[] = [user.user_role || 'user'];
          
          try {
            const purchases = await db.getUserPurchases(user.id);
            entitlements = mapPurchasesToEntitlements(purchases);
            console.log('✅ NextAuth: User entitlements loaded:', entitlements);
          } catch (error) {
            console.error('⚠️ NextAuth: Error loading user purchases:', error);
            // Continue without purchases - user can still log in
          }

          const authUser: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            entitlements,
            roles,
            created_at: user.created_at,
          };

          console.log('✅ NextAuth: Authentication successful for:', user.email);
          return authUser;

        } catch (error) {
          console.error('❌ NextAuth: Authentication error:', error);
          // Re-throw with user-friendly message
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      }
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔐 NextAuth: JWT callback - user:', !!user, 'token:', !!token);
      
      // Persist user data in JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.entitlements = user.entitlements || [];
        token.roles = user.roles || ['user'];
        token.created_at = user.created_at;
        console.log('✅ NextAuth: JWT token populated for:', user.email);
      }
      return token;
    },
    
    async session({ session, token }) {
      console.log('🔐 NextAuth: Session callback - token:', !!token);
      
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.entitlements = token.entitlements || [];
        session.user.roles = token.roles || ['user'];
        session.user.created_at = token.created_at;
        console.log('✅ NextAuth: Session populated for:', token.email);
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
  
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  
  // Add error handling
  events: {
    async signIn(message) {
      console.log('✅ NextAuth: User signed in:', message.user.email);
    },
    async signOut(message) {
      console.log('👋 NextAuth: User signed out');
    },
    async createUser(message) {
      console.log('👤 NextAuth: User created:', message.user.email);
    },
    async session(message) {
      console.log('🔄 NextAuth: Session accessed for:', message.session.user?.email);
    },
  },
};