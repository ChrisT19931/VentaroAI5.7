'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AIBusinessVideoGuideRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to products page since we're bypassing individual product pages
    router.replace('/products');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to products...</p>
      </div>
    </div>
  );
}