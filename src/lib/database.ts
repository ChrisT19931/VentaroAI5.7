import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Database interfaces
export interface User {
  id: string;
  email: string;
  name?: string;
  password_hash?: string;
  user_role: 'admin' | 'user';
  email_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  stripe_payment_intent_id?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  user_role: 'admin' | 'user';
  created_at: string;
}

// In-memory storage for development mode
let inMemoryUsers: User[] = [
  {
    id: 'dev_admin',
    email: 'admin@ventaro.ai',
    name: 'Admin User',
    password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hN8/LewdBP', // admin123
    user_role: 'admin',
    email_confirmed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dev_user',
    email: 'test@example.com',
    name: 'Test User',
    password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hN8/LewdBP', // test123
    user_role: 'user',
    email_confirmed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let inMemoryPurchases: Purchase[] = [
  {
    id: 'dev_purchase_1',
    user_id: 'dev_admin',
    product_id: '1',
    amount: 2500,
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'dev_purchase_2',
    user_id: 'dev_admin',
    product_id: '2',
    amount: 1000,
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'dev_purchase_3',
    user_id: 'dev_admin',
    product_id: '4',
    amount: 5000,
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'dev_purchase_4',
    user_id: 'dev_admin',
    product_id: '5',
    amount: 49700,
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'dev_purchase_5',
    user_id: 'dev_user',
    product_id: '1',
    amount: 2500,
    status: 'completed',
    created_at: new Date().toISOString()
  }
];

// Database connection management
class DatabaseManager {
  private supabase: any = null;
  private isSupabaseConfigured = false;

  constructor() {
    this.initializeSupabase();
  }

  private initializeSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey && 
        !supabaseUrl.includes('placeholder') && 
        !supabaseUrl.includes('xyzcompany')) {
      try {
        this.supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);
        this.isSupabaseConfigured = true;
        console.log('✅ Supabase configured and connected');
      } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        this.isSupabaseConfigured = false;
      }
    } else {
      console.log('⚠️ Supabase not configured, using in-memory storage for development');
      this.isSupabaseConfigured = false;
    }
  }

  // User management
  async findUserByEmail(email: string): Promise<User | null> {
    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Database error finding user:', error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Error finding user by email:', error);
        return null;
      }
    } else {
      // Use in-memory storage
      return inMemoryUsers.find(user => user.email === email) || null;
    }
  }

  async findUserById(id: string): Promise<User | null> {
    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Database error finding user by ID:', error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Error finding user by ID:', error);
        return null;
      }
    } else {
      return inMemoryUsers.find(user => user.id === id) || null;
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    name?: string;
    user_role?: 'admin' | 'user';
  }): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newUser: User = {
      id: userId,
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      password_hash: hashedPassword,
      user_role: userData.user_role || 'user',
      email_confirmed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('profiles')
          .insert(newUser)
          .select()
          .single();
        
        if (error) {
          console.error('Database error creating user:', error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Error creating user:', error);
        return null;
      }
    } else {
      // Use in-memory storage
      inMemoryUsers.push(newUser);
      return newUser;
    }
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Purchase management
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('purchases')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed');
        
        if (error) {
          console.error('Database error fetching purchases:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error fetching user purchases:', error);
        return [];
      }
    } else {
      return inMemoryPurchases.filter(purchase => 
        purchase.user_id === userId && purchase.status === 'completed'
      );
    }
  }

  async createPurchase(purchaseData: {
    user_id: string;
    product_id: string;
    amount: number;
    stripe_payment_intent_id?: string;
    status?: 'pending' | 'completed' | 'failed';
  }): Promise<Purchase | null> {
    const newPurchase: Purchase = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: purchaseData.user_id,
      product_id: purchaseData.product_id,
      stripe_payment_intent_id: purchaseData.stripe_payment_intent_id,
      amount: purchaseData.amount,
      status: purchaseData.status || 'pending',
      created_at: new Date().toISOString()
    };

    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('purchases')
          .insert(newPurchase)
          .select()
          .single();
        
        if (error) {
          console.error('Database error creating purchase:', error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Error creating purchase:', error);
        return null;
      }
    } else {
      inMemoryPurchases.push(newPurchase);
      return newPurchase;
    }
  }

  // Database setup and health check
  async ensureTablesExist(): Promise<boolean> {
    if (!this.isSupabaseConfigured) {
      console.log('✅ In-memory storage ready');
      return true;
    }

    try {
      // Check if profiles table exists and create if needed
      const { error: profilesError } = await this.supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (profilesError && profilesError.code === '42P01') { // Table doesn't exist
        console.log('Creating profiles table...');
        const { error: createError } = await this.supabase.rpc('create_profiles_table');
        if (createError) {
          console.error('Error creating profiles table:', createError);
          return false;
        }
      }

      // Check if purchases table exists
      const { error: purchasesError } = await this.supabase
        .from('purchases')
        .select('id')
        .limit(1);

      if (purchasesError && purchasesError.code === '42P01') {
        console.log('Creating purchases table...');
        const { error: createError } = await this.supabase.rpc('create_purchases_table');
        if (createError) {
          console.error('Error creating purchases table:', createError);
          return false;
        }
      }

      console.log('✅ Database tables verified');
      return true;
    } catch (error) {
      console.error('Error ensuring tables exist:', error);
      return false;
    }
  }

  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    database: 'supabase' | 'in-memory';
    message: string;
  }> {
    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('profiles')
          .select('id')
          .limit(1);
        
        if (error) {
          return {
            status: 'degraded',
            database: 'supabase',
            message: `Supabase connection issues: ${error.message}`
          };
        }
        
        return {
          status: 'healthy',
          database: 'supabase',
          message: 'Supabase connection healthy'
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          database: 'supabase',
          message: `Supabase connection failed: ${error}`
        };
      }
    } else {
      return {
        status: 'healthy',
        database: 'in-memory',
        message: 'In-memory storage active (development mode)'
      };
    }
  }

  // Initialize default admin user if needed
  async initializeAdminUser(): Promise<void> {
    const adminEmail = 'admin@ventaro.ai';
    const existingAdmin = await this.findUserByEmail(adminEmail);
    
    if (!existingAdmin) {
      console.log('Creating default admin user...');
      await this.createUser({
        email: adminEmail,
        password: 'admin123',
        name: 'Admin User',
        user_role: 'admin'
      });
      console.log('✅ Default admin user created');
    }
  }
}

// Export singleton instance
export const db = new DatabaseManager();

// Initialize database on module load
db.ensureTablesExist().then(() => {
  db.initializeAdminUser();
}); 