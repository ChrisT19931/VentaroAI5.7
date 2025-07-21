'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/useToast';

type ToastContextType = ReturnType<typeof useToast>['toast'];

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toast, ToastProvider: ToastComponentProvider } = useToast();

  return (
    <ToastContext.Provider value={toast}>
      <ToastComponentProvider>
        {children}
      </ToastComponentProvider>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  
  return context;
}