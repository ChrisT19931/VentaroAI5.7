'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

// Supabase authentication helper with real authentication
export class SimpleAuth {
  private static instance: SimpleAuth;
  private user: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];
  private isLoading = true;

  private constructor() {
    // Initialize from Supabase session
    this.initializeAuth();
  }

  static getInstance(): SimpleAuth {
    if (!SimpleAuth.instance) {
      SimpleAuth.instance = new SimpleAuth();
    }
    return SimpleAuth.instance;
  }

  private async initializeAuth() {
    try {
      const supabase = createClient();
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else if (session?.user) {
        this.setUser(session.user);
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          this.setUser(session.user);
        } else {
          this.clearUser();
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        this.setUser(data.user);
        return { success: true };
      }
      
      return { success: false, error: 'Authentication failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Authentication failed' };
    }
  }

  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // Note: User might need to confirm email before being fully authenticated
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  }

  async signOut(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
    this.clearUser();
  }

  private setUser(user: User) {
    this.user = user;
    this.setCookie('ventaro-auth', 'true');
    this.notifyListeners();
  }

  private clearUser() {
    this.user = null;
    this.setCookie('ventaro-auth', '', -1);
    this.notifyListeners();
  }

  private setCookie(name: string, value: string, days: number = 7) {
    if (typeof document !== 'undefined') {
      const expires = days === -1 ? 'Thu, 01 Jan 1970 00:00:00 UTC' : 
        new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    }
  }

  getUser(): User | null {
    return this.user;
  }

  getIsAuthenticated(): boolean {
    return this.user !== null;
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }

  onAuthChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    if (!this.user) return false;
    
    try {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', this.user.id)
        .single();
      
      return profile?.is_admin === true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const simpleAuth = SimpleAuth.getInstance();