import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Session, User, AuthError } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

type UserProfile = {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  is_admin?: boolean;
  email?: string;
  created_at: string;
  updated_at: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = SignInCredentials & {
  full_name: string;
};

export function useAuth() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fetch the user profile from the profiles table
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      setUserProfile(data as UserProfile);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }, [supabase]);

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user } = session;
          const profile = await fetchUserProfile(user.id);
          
          setAuthState({
            user,
            session,
            isLoading: false,
            isAuthenticated: true,
            isAdmin: profile?.is_admin === true,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { user } = session;
          const profile = await fetchUserProfile(user.id);
          
          setAuthState({
            user,
            session,
            isLoading: false,
            isAuthenticated: true,
            isAdmin: profile?.is_admin === true,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
          });
          setUserProfile(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);

  // Sign in with email and password
  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error as AuthError };
    }
  };

  // Sign up with email and password
  const signUp = async ({ email, password, full_name }: SignUpCredentials) => {
    try {
      // Create the user in Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
          },
        },
      });

      if (error) {
        throw error;
      }

      // If user was created successfully, create a profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              first_name: full_name?.split(' ')[0] || null,
              last_name: full_name?.split(' ').slice(1).join(' ') || null,
              email,
              is_admin: false, // Default to non-admin
            },
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error as AuthError };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error as AuthError };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: error as AuthError };
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error as AuthError };
    }
  };

  // Update user profile
  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!authState.user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      // Update auth metadata if needed
      if (profile.full_name || profile.email) {
        const authUpdateData: { data?: { full_name?: string }; email?: string } = {};
        
        if (profile.full_name) {
          authUpdateData.data = { full_name: profile.full_name };
        }
        
        if (profile.email) {
          authUpdateData.email = profile.email;
        }
        
        const { error: authError } = await supabase.auth.updateUser(authUpdateData);

        if (authError) {
          throw authError;
        }
      }

      // Update profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', authState.user.id);

      if (profileError) {
        throw profileError;
      }

      // Refresh the profile
      await fetchUserProfile(authState.user.id);

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  };

  return {
    ...authState,
    userProfile,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    fetchUserProfile,
  };
}