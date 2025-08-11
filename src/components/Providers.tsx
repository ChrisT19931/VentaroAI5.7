'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <ToastProvider>
          <PerformanceOptimizer />
          {children}
        </ToastProvider>
      </CartProvider>
    </SessionProvider>
  );
}