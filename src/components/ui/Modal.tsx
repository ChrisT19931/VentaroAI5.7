'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  initialFocus?: React.RefObject<HTMLElement>;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  initialFocus,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle mounting on client side only
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);

  // Handle focus trap and initial focus
  useEffect(() => {
    if (!isOpen) return;
    
    const modalElement = modalRef.current;
    if (!modalElement) return;
    
    // Set initial focus
    if (initialFocus && initialFocus.current) {
      initialFocus.current.focus();
    } else {
      // Find the first focusable element
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
    
    // Save the previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;
    
    // Handle focus trap
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // If shift+tab and on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // If tab and on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    document.addEventListener('keydown', handleFocusTrap);
    
    // Restore focus when unmounting
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, initialFocus]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  // Don't render on server
  if (!isMounted) return null;
  
  // Don't render if not open
  if (!isOpen) return null;

  // Create portal for the modal
  return isMounted ? createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl overflow-hidden transform transition-all ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h3 id="modal-title" className="text-lg font-medium text-gray-900">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={onClose}
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Modal content */}
        <div className={`p-4 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  ) : null;
}