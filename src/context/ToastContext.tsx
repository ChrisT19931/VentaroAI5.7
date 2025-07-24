'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useToast as useToastHook } from '@/hooks/useToast';

type ToastContextType = ReturnType<typeof useToastHook>['toast'];

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toast, ToastProvider: ToastComponentProvider } = useToastHook();

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

// Export useToast for backward compatibility
export const useToast = useToastContext;