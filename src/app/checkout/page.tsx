'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to cart page
    router.push('/cart');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="animate-spin h-12 w-12 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full"></div>
        <h2 className="text-2xl font-semibold mb-2">Redirecting to checkout...</h2>
        <p className="text-gray-600">Please wait while we prepare your checkout experience.</p>
      </div>
    </div>
  );
}