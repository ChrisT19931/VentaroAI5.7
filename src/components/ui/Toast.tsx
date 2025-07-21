'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Toast Types
type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastProps = {
  /**
   * Unique ID for the toast
   */
  id: string;
  
  /**
   * Toast message content
   */
  message: React.ReactNode;
  
  /**
   * Optional toast title
   */
  title?: string;
  
  /**
   * Toast type
   */
  type?: ToastType;
  
  /**
   * Duration in milliseconds before auto-dismissing
   * Set to 0 to disable auto-dismiss
   */
  duration?: number;
  
  /**
   * Whether the toast is dismissible
   */
  dismissible?: boolean;
  
  /**
   * Optional action button text
   */
  actionText?: string;
  
  /**
   * Optional action button callback
   */
  onAction?: () => void;
  
  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void;
};

type ToastContextType = {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  updateToast: (id: string, toast: Partial<ToastProps>) => void;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
};

// Create context with default values
const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => '',
  updateToast: () => {},
  dismissToast: () => {},
  dismissAllToasts: () => {},
});

// Toast Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Mount check for SSR
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Add a new toast
  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastProps = {
      id,
      type: 'info',
      duration: 5000,
      dismissible: true,
      ...toast,
    };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  }, []);
  
  // Update an existing toast
  const updateToast = useCallback((id: string, toast: Partial<ToastProps>) => {
    setToasts((prevToasts) =>
      prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  }, []);
  
  // Dismiss a toast
  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);
  
  // Dismiss all toasts
  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  // Context value
  const contextValue = {
    toasts,
    addToast,
    updateToast,
    dismissToast,
    dismissAllToasts,
  };
  
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {isMounted && typeof document !== 'undefined' && createPortal(<ToastContainer />, document.body)}
    </ToastContext.Provider>
  );
}

// Hook to use toast functionality
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

// Toast Container Component
function ToastContainer() {
  const { toasts } = useToast();
  
  return (
    <div className="fixed z-50 flex flex-col gap-2 p-4 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// Individual Toast Component
function Toast({
  id,
  message,
  title,
  type = 'info',
  duration = 5000,
  dismissible = true,
  actionText,
  onAction,
  onDismiss,
}: ToastProps) {
  const { dismissToast } = useToast();
  
  // Auto-dismiss timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);
  
  // Handle dismiss
  const handleDismiss = () => {
    dismissToast(id);
    onDismiss?.();
  };
  
  // Handle action
  const handleAction = () => {
    onAction?.();
    handleDismiss();
  };
  
  // Determine toast styles based on type
  const toastStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      title: 'text-blue-800',
      message: 'text-blue-700',
      action: 'text-blue-600 hover:text-blue-800',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'text-green-800',
      message: 'text-green-700',
      action: 'text-green-600 hover:text-green-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      action: 'text-yellow-600 hover:text-yellow-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      title: 'text-red-800',
      message: 'text-red-700',
      action: 'text-red-600 hover:text-red-800',
    },
  }[type];
  
  return (
    <div
      className={`
        flex items-start p-4 mb-2 w-full rounded-lg shadow-md border
        ${toastStyles.bg} ${toastStyles.border}
        transform transition-all duration-300 ease-in-out
        animate-slide-in
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0 mr-3">
        {toastStyles.icon}
      </div>
      
      <div className="flex-1">
        {title && (
          <h3 className={`text-sm font-medium ${toastStyles.title}`}>
            {title}
          </h3>
        )}
        
        <div className={`text-sm ${toastStyles.message}`}>
          {message}
        </div>
        
        {actionText && onAction && (
          <button
            className={`mt-2 text-sm font-medium ${toastStyles.action}`}
            onClick={handleAction}
          >
            {actionText}
          </button>
        )}
      </div>
      
      {dismissible && (
        <button
          type="button"
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={handleDismiss}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Add animation to global CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}

// Export default Toast component
export default Toast;