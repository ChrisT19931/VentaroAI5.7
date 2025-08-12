'use client';

import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

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
      console.log('SimpleAuth: Initializing auth');
      
      // Set loading state
      this.isLoading = true;
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('SimpleAuth: Error getting session:', error);
      } else if (session?.user) {
        console.log('SimpleAuth: Found existing session for user:', session.user.email);
        this.setUser(session.user);
      } else {
        console.log('SimpleAuth: No active session found');
        // Clear any stale ventaro-auth cookie if no Supabase session exists
        this.clearUser();
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
        console.log('SimpleAuth: Auth state changed:', event, session ? `User: ${session.user?.email}` : 'No session');
        if (session?.user) {
          this.setUser(session.user);
        } else {
          this.clearUser();
        }
      });
    } catch (error) {
      console.error('SimpleAuth: Error initializing auth:', error);
    } finally {
      // Set loading to false after auth state is established
      this.isLoading = false;
      console.log('SimpleAuth: Initialization complete, isLoading set to false');
      this.notifyListeners();
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    console.log('SimpleAuth: Attempting sign in for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('SimpleAuth: Sign in error:', error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        console.log('SimpleAuth: Sign in successful for:', email);
        this.setUser(data.user);
        return { success: true };
      }
      
      console.error('SimpleAuth: Sign in failed - no user returned');
      return { success: false, error: 'Authentication failed' };
    } catch (error: any) {
      console.error('SimpleAuth: Sign in exception:', error);
      return { success: false, error: error.message || 'Authentication failed' };
    }
  }

  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirm: false // Disable email verification in user metadata
          }
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // User is fully authenticated without email confirmation
        this.setUser(data.user);
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.clearUser();
  }

  private setUser(user: User) {
    console.log('SimpleAuth: Setting user:', user.email);
    this.user = user;
    try {
      this.setCookie('ventaro-auth', 'true');
      console.log('SimpleAuth: Cookie set - ventaro-auth=true');
    } catch (e) {
      console.error('SimpleAuth: Error setting cookie:', e);
    }
    this.notifyListeners();
  }

  private clearUser() {
    console.log('SimpleAuth: Clearing user');
    this.user = null;
    try {
      this.setCookie('ventaro-auth', '', -1);
      console.log('SimpleAuth: Cookie cleared - ventaro-auth');
    } catch (e) {
      console.error('SimpleAuth: Error clearing cookie:', e);
    }
    this.notifyListeners();
  }

  private setCookie(name: string, value: string, days: number = 7) {
    if (typeof document !== 'undefined') {
      const expires = days === -1 ? 'Thu, 01 Jan 1970 00:00:00 UTC' : 
        new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    }
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', this.user.id)
        .single();
      
      return profile?.user_role === 'admin';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const simpleAuth = SimpleAuth.getInstance();