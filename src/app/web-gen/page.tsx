'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

const WebGenPage = () => {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to projects page if authenticated, otherwise to login
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/web-gen/projects');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while redirecting
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default WebGenPage;