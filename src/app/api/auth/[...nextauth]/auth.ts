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
      entitlements: string[];
      roles: string[];
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
    roles: string[];
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
        console.log('🔐 Starting authentication for:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ Missing email or password');
          return null;
        }

        try {
          // Find user in database
          const user = await db.findUserByEmail(credentials.email);
          if (!user) {
            console.error('❌ User not found:', credentials.email);
            return null;
          }

          // Verify password
          if (!user.password_hash) {
            console.error('❌ No password hash found for user');
            return null;
          }

          const isValidPassword = await db.verifyPassword(credentials.password, user.password_hash);
          if (!isValidPassword) {
            console.error('❌ Invalid password for user:', credentials.email);
            return null;
          }

          console.log('✅ Password verified for user:', credentials.email);

          // Get user purchases for entitlements
          let entitlements: string[] = [];
          try {
            const purchases = await db.getUserPurchases(user.id);
            entitlements = mapPurchasesToEntitlements(purchases);
            console.log('✅ Found entitlements for user:', entitlements);
          } catch (error) {
            console.warn('⚠️ Error fetching purchases (non-blocking):', error);
          }

          // Set user roles
          const roles = [user.user_role || 'user'];
          
          const authUser = {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            entitlements,
            roles,
            created_at: user.created_at,
          };

          console.log('✅ Authentication successful for:', credentials.email, 'with roles:', roles);
          return authUser;

        } catch (error) {
          console.error('❌ Authentication error:', error);
          return null;
        }
      }
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data in JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.entitlements = user.entitlements || [];
        token.roles = user.roles || ['user'];
        token.created_at = user.created_at;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.entitlements = token.entitlements || [];
        session.user.roles = token.roles || ['user'];
        session.user.created_at = token.created_at;
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
};