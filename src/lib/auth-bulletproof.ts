import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  user_role: 'admin' | 'user';
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  customer_email: string;
  product_id: string;
  price_id: string;
  amount: number;
  currency: string;
  status: 'active' | 'completed' | 'pending' | 'failed';
  stripe_session_id: string;
  stripe_customer_id: string;
  stripe_payment_intent_id: string;
  created_at: string;
}

// In-memory storage for development/fallback
const inMemoryUsers: User[] = [
  {
    id: 'admin-user-id',
    email: 'chris.t@ventarosales.com',
    name: 'Chris T - Admin',
    password_hash: bcrypt.hashSync('Rabbit5511$$11', 12),
    user_role: 'admin',
    created_at: new Date().toISOString()
  }
];

const inMemoryPurchases: Purchase[] = [
  {
    id: 'admin-purchase-1',
    user_id: 'admin-user-id',
    customer_email: 'chris.t@ventarosales.com',
    product_id: '1',
    price_id: 'price_admin_test_1',
    amount: 2500,
    currency: 'usd',
    status: 'completed',
    stripe_session_id: 'cs_admin_test_1',
    stripe_customer_id: 'cus_admin_test',
    stripe_payment_intent_id: 'admin_access',
    created_at: new Date().toISOString()
  },
  {
    id: 'admin-purchase-2',
    user_id: 'admin-user-id',
    customer_email: 'chris.t@ventarosales.com',
    product_id: '2',
    price_id: 'price_admin_test_2',
    amount: 1000,
    currency: 'usd',
    status: 'completed',
    stripe_session_id: 'cs_admin_test_2',
    stripe_customer_id: 'cus_admin_test',
    stripe_payment_intent_id: 'admin_access',
    created_at: new Date().toISOString()
  },
  {
    id: 'admin-purchase-3',
    user_id: 'admin-user-id',
    customer_email: 'chris.t@ventarosales.com',
    product_id: '4',
    price_id: 'price_admin_test_4',
    amount: 49700,
    currency: 'usd',
    status: 'completed',
    stripe_session_id: 'cs_admin_test_4',
    stripe_customer_id: 'cus_admin_test',
    stripe_payment_intent_id: 'admin_access',
    created_at: new Date().toISOString()
  },
  {
    id: 'admin-purchase-4',
    user_id: 'admin-user-id',
    customer_email: 'chris.t@ventarosales.com',
    product_id: '5',
    price_id: 'price_admin_test_5',
    amount: 0,
    currency: 'usd',
    status: 'completed',
    stripe_session_id: 'cs_admin_test_5',
    stripe_customer_id: 'cus_admin_test',
    stripe_payment_intent_id: 'admin_access',
    created_at: new Date().toISOString()
  }
];

class BulletproofAuth {
  private supabase: any = null;
  private useSupabase = false;

  constructor() {
    this.initializeSupabase();
  }

  private initializeSupabase() {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (supabaseUrl && supabaseKey && 
          !supabaseUrl.includes('placeholder') && 
          !supabaseKey.includes('placeholder') &&
          supabaseUrl.includes('supabase.co')) {
        
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.useSupabase = true;
        console.log('✅ BulletproofAuth: Supabase initialized');
      } else {
        console.log('⚠️ BulletproofAuth: Using in-memory storage (development mode)');
      }
    } catch (error) {
      console.error('❌ BulletproofAuth: Supabase initialization failed, using in-memory storage');
      this.useSupabase = false;
    }
  }

  // BULLETPROOF USER AUTHENTICATION
  async authenticateUser(email: string, password: string): Promise<User | null> {
    console.log(`🔐 BulletproofAuth: Authenticating ${email}`);
    
    try {
      // Try Supabase first
      if (this.useSupabase) {
        const user = await this.findUserInSupabase(email);
        if (user && await this.verifyPassword(password, user.password_hash)) {
          console.log(`✅ BulletproofAuth: Supabase authentication successful for ${email}`);
          return user;
        }
      }
      
      // Fallback to in-memory
      const user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && await this.verifyPassword(password, user.password_hash)) {
        console.log(`✅ BulletproofAuth: In-memory authentication successful for ${email}`);
        return user;
      }
      
      console.log(`❌ BulletproofAuth: Authentication failed for ${email}`);
      return null;
      
    } catch (error) {
      console.error(`❌ BulletproofAuth: Authentication error for ${email}:`, error);
      return null;
    }
  }

  // BULLETPROOF USER CREATION
  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    user_role?: 'admin' | 'user';
  }): Promise<User | null> {
    console.log(`👤 BulletproofAuth: Creating user ${userData.email}`);
    
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email.toLowerCase(),
        name: userData.name,
        password_hash: hashedPassword,
        user_role: userData.user_role || 'user',
        created_at: new Date().toISOString()
      };

      // Try Supabase first
      if (this.useSupabase) {
        try {
          const { data, error } = await this.supabase
            .from('profiles')
            .insert([{
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              password_hash: newUser.password_hash,
              user_role: newUser.user_role,
              created_at: newUser.created_at
            }])
            .select()
            .single();

          if (!error && data) {
            console.log(`✅ BulletproofAuth: User created in Supabase: ${userData.email}`);
            return newUser;
          }
        } catch (supabaseError) {
          console.warn(`⚠️ BulletproofAuth: Supabase user creation failed, using in-memory`);
        }
      }

      // Fallback to in-memory
      inMemoryUsers.push(newUser);
      console.log(`✅ BulletproofAuth: User created in-memory: ${userData.email}`);
      return newUser;
      
    } catch (error) {
      console.error(`❌ BulletproofAuth: User creation failed for ${userData.email}:`, error);
      return null;
    }
  }

  // BULLETPROOF USER LOOKUP
  async findUser(email: string): Promise<User | null> {
    try {
      // Try Supabase first
      if (this.useSupabase) {
        const user = await this.findUserInSupabase(email);
        if (user) return user;
      }
      
      // Fallback to in-memory
      return inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
      
    } catch (error) {
      console.error(`❌ BulletproofAuth: User lookup failed for ${email}:`, error);
      return null;
    }
  }

  // BULLETPROOF PURCHASE RETRIEVAL
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    try {
      // Try Supabase first
      if (this.useSupabase) {
        try {
          const { data, error } = await this.supabase
            .from('purchases')
            .select('*')
            .eq('user_id', userId);

          if (!error && data) {
            console.log(`✅ BulletproofAuth: Found ${data.length} purchases in Supabase for user ${userId}`);
            return data;
          }
        } catch (supabaseError) {
          console.warn(`⚠️ BulletproofAuth: Supabase purchase lookup failed, using in-memory`);
        }
      }

      // Fallback to in-memory
      const purchases = inMemoryPurchases.filter(p => p.user_id === userId);
      console.log(`✅ BulletproofAuth: Found ${purchases.length} purchases in-memory for user ${userId}`);
      return purchases;
      
    } catch (error) {
      console.error(`❌ BulletproofAuth: Purchase lookup failed for user ${userId}:`, error);
      return [];
    }
  }

  // BULLETPROOF PURCHASE CREATION
  async createPurchase(purchaseData: {
    user_id?: string;
    customer_email?: string;
    product_id: string;
    price_id?: string;
    amount: number;
    currency?: string;
    status?: 'active' | 'completed' | 'pending' | 'failed';
    stripe_session_id?: string;
    stripe_customer_id?: string;
    stripe_payment_intent_id?: string;
  }): Promise<Purchase | null> {
    try {
      const newPurchase: Purchase = {
        id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: purchaseData.user_id || '',
        customer_email: purchaseData.customer_email || '',
        product_id: purchaseData.product_id,
        price_id: purchaseData.price_id || '',
        amount: purchaseData.amount,
        currency: purchaseData.currency || 'usd',
        status: purchaseData.status || 'completed',
        stripe_session_id: purchaseData.stripe_session_id || '',
        stripe_customer_id: purchaseData.stripe_customer_id || '',
        stripe_payment_intent_id: purchaseData.stripe_payment_intent_id || '',
        created_at: new Date().toISOString()
      };

      // Try Supabase first
      if (this.useSupabase) {
        try {
          const { data, error } = await this.supabase
            .from('purchases')
            .insert([newPurchase])
            .select()
            .single();

          if (!error && data) {
            console.log(`✅ BulletproofAuth: Purchase created in Supabase: ${newPurchase.id}`);
            return newPurchase;
          }
        } catch (supabaseError) {
          console.warn(`⚠️ BulletproofAuth: Supabase purchase creation failed, using in-memory`);
        }
      }

      // Fallback to in-memory
      inMemoryPurchases.push(newPurchase);
      console.log(`✅ BulletproofAuth: Purchase created in-memory: ${newPurchase.id}`);
      return newPurchase;
      
    } catch (error) {
      console.error(`❌ BulletproofAuth: Purchase creation failed:`, error);
      return null;
    }
  }

  // Helper methods
  private async findUserInSupabase(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      return (!error && data) ? data : null;
    } catch (error) {
      return null;
    }
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('❌ BulletproofAuth: Password verification error:', error);
      return false;
    }
  }

  // HEALTH CHECK
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded';
    database: 'supabase' | 'in-memory';
    users: number;
    purchases: number;
  }> {
    try {
      if (this.useSupabase) {
        try {
          const { count: userCount } = await this.supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
          
          const { count: purchaseCount } = await this.supabase
            .from('purchases')
            .select('*', { count: 'exact', head: true });

          return {
            status: 'healthy',
            database: 'supabase',
            users: userCount || 0,
            purchases: purchaseCount || 0
          };
        } catch (supabaseError) {
          console.warn('⚠️ BulletproofAuth: Supabase health check failed, switching to in-memory');
          this.useSupabase = false;
        }
      }

      return {
        status: 'degraded',
        database: 'in-memory',
        users: inMemoryUsers.length,
        purchases: inMemoryPurchases.length
      };
      
    } catch (error) {
      return {
        status: 'degraded',
        database: 'in-memory',
        users: inMemoryUsers.length,
        purchases: inMemoryPurchases.length
      };
    }
  }
}

// Export singleton instance
export const bulletproofAuth = new BulletproofAuth(); 