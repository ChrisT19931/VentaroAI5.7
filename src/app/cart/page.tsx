'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to products page since we now use direct checkout
    toast.error('Cart functionality has been simplified. Please use direct checkout from product pages.');
    router.push('/products');
  }, [router]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
          <p className="text-gray-600">Please use direct checkout from product pages.</p>
        </div>
      </div>
    </div>
  );
}