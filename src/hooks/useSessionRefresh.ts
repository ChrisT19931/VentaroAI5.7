'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useSessionRefresh() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshSession = useCallback(async (showToast = true) => {
    if (!session?.user?.id) {
      console.warn('⚠️ useSessionRefresh: No session to refresh');
      return false;
    }

    try {
      setIsRefreshing(true);
      console.log('🔄 useSessionRefresh: Starting session refresh...');

      // Call our refresh API
      const response = await fetch('/api/refresh-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh session');
      }

      const data = await response.json();
      console.log('✅ useSessionRefresh: Session refreshed successfully:', data);

      // Update the NextAuth session
      await update();
      
      // Refresh the router to update all components
      router.refresh();

      if (showToast) {
        toast.success('🎉 Access updated! You now have access to your purchased products.');
      }

      return true;

    } catch (error: any) {
      console.error('❌ useSessionRefresh: Error refreshing session:', error);
      
      if (showToast) {
        toast.error('Failed to refresh access. Please try refreshing the page.');
      }
      
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [session, update, router]);

  const forceRefresh = useCallback(async () => {
    console.log('🔄 useSessionRefresh: Force refreshing page...');
    
    // Try session refresh first
    const refreshSuccess = await refreshSession(false);
    
    if (refreshSuccess) {
      // Give a moment for the session to update, then redirect
      setTimeout(() => {
        window.location.href = '/my-account';
      }, 1500);
    } else {
      // Fallback to hard refresh
      window.location.reload();
    }
  }, [refreshSession]);

  return {
    refreshSession,
    forceRefresh,
    isRefreshing,
    hasSession: !!session?.user?.id
  };
}

export default useSessionRefresh; 