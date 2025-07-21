import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

const defaultOptions: Required<ToastOptions> = {
  type: 'info',
  duration: 3000, // 3 seconds
};

// Toast component
const ToastComponent = ({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: string) => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getToastClasses = () => {
    const baseClasses = 'fixed px-4 py-2 rounded-md shadow-md flex items-center justify-between transition-all duration-300 ease-in-out transform translate-y-0 opacity-100';
    
    const typeClasses = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      warning: 'bg-yellow-500 text-white',
    };
    
    return `${baseClasses} ${typeClasses[toast.type]}`;
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={getToastClasses()}
      style={{
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    >
      <div className="flex items-center">
        {getToastIcon()}
        <span>{toast.message}</span>
      </div>
      <button 
        onClick={() => onClose(toast.id)} 
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Toast container component
const ToastContainer = ({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) return null;

  const toastPortal = document.getElementById('toast-portal');
  if (!toastPortal) {
    const portalDiv = document.createElement('div');
    portalDiv.id = 'toast-portal';
    document.body.appendChild(portalDiv);
  }

  return isBrowser ? createPortal(
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id}
          style={{
            position: 'fixed',
            bottom: `${20 + index * 60}px`,
            right: '20px',
            zIndex: 9999,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <ToastComponent toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>,
    document.getElementById('toast-portal') || document.body
  ) : null;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      message,
      type: options?.type || defaultOptions.type,
      duration: options?.duration || defaultOptions.duration,
    };

    setToasts((prevToasts) => [...prevToasts, toast]);
    return id;
  }, []);

  const toast = {
    success: (message: string, options?: Omit<ToastOptions, 'type'>) =>
      showToast(message, { ...options, type: 'success' }),
    error: (message: string, options?: Omit<ToastOptions, 'type'>) =>
      showToast(message, { ...options, type: 'error' }),
    info: (message: string, options?: Omit<ToastOptions, 'type'>) =>
      showToast(message, { ...options, type: 'info' }),
    warning: (message: string, options?: Omit<ToastOptions, 'type'>) =>
      showToast(message, { ...options, type: 'warning' }),
    dismiss: (id: string) => removeToast(id),
    dismissAll: () => setToasts([]),
  };

  const ToastProvider = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      return (
        <>
          {children}
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
      );
    },
    [toasts, removeToast]
  );

  return { toast, ToastProvider };
}