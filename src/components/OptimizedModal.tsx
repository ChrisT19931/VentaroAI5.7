'use client';

import { useState, useEffect, useRef, useCallback, memo, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useStableCallback } from '../utils/react-optimizer';
import useComponentOptimizer from '../hooks/useComponentOptimizer';

interface OptimizedModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal is closed */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Whether to close the modal when clicking outside */
  closeOnOutsideClick?: boolean;
  /** Whether to close the modal when pressing escape */
  closeOnEscape?: boolean;
  /** Whether to show a close button */
  showCloseButton?: boolean;
  /** Whether to show a backdrop */
  showBackdrop?: boolean;
  /** Whether to animate the modal */
  animate?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Custom class name for the modal */
  className?: string;
  /** Custom style for the modal */
  style?: React.CSSProperties;
  /** Custom class name for the backdrop */
  backdropClassName?: string;
  /** Custom style for the backdrop */
  backdropStyle?: React.CSSProperties;
  /** Z-index for the modal */
  zIndex?: number;
  /** Whether to render the modal in a portal */
  usePortal?: boolean;
  /** Portal container ID */
  portalId?: string;
  /** Whether to lock scroll when the modal is open */
  lockScroll?: boolean;
  /** Whether to focus the modal when it opens */
  autoFocus?: boolean;
  /** Whether to trap focus within the modal */
  trapFocus?: boolean;
  /** Callback when the modal is opened */
  onOpen?: () => void;
  /** Callback when the modal animation ends */
  onAnimationEnd?: () => void;
}

/**
 * OptimizedModal - A high-performance modal component with animations and accessibility
 */
const OptimizedModal = memo(function OptimizedModal({
  isOpen,
  onClose,
  title,
  children,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  showBackdrop = true,
  animate = true,
  animationDuration = 300,
  className = '',
  style = {},
  backdropClassName = '',
  backdropStyle = {},
  zIndex = 1000,
  usePortal = true,
  portalId = 'modal-portal',
  lockScroll = true,
  autoFocus = true,
  trapFocus = true,
  onOpen,
  onAnimationEnd,
}: OptimizedModalProps) {
  // State for animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Refs for DOM elements
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  
  // Use component optimizer for performance monitoring
  const { isLowEnd } = useComponentOptimizer('OptimizedModal', {
    optimizeAnimations: true,
  });
  
  // Disable animations on low-end devices
  const shouldAnimate = animate && !isLowEnd;
  
  // Create stable callbacks
  const stableOnClose = useStableCallback(onClose);
  const stableOnOpen = useStableCallback(onOpen || (() => {}));
  const stableOnAnimationEnd = useStableCallback(onAnimationEnd || (() => {}));
  
  // Handle outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (!closeOnOutsideClick) return;
    
    const modalElement = modalRef.current;
    if (modalElement && !modalElement.contains(e.target as Node)) {
      stableOnClose();
    }
  }, [closeOnOutsideClick, stableOnClose]);
  
  // Handle escape key
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (!closeOnEscape) return;
    
    if (e.key === 'Escape') {
      stableOnClose();
    }
  }, [closeOnEscape, stableOnClose]);
  
  // Handle tab key for focus trapping
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (!trapFocus || !modalRef.current) return;
    
    const modalElement = modalRef.current;
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [trapFocus]);
  
  // Set up event listeners and handle modal open/close
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Start opening animation
      setIsAnimating(true);
      setIsVisible(true);
      
      // Call onOpen callback
      stableOnOpen();
      
      // Auto-focus the modal if enabled
      if (autoFocus && modalRef.current) {
        setTimeout(() => {
          if (modalRef.current) {
            const focusableElement = modalRef.current.querySelector(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as HTMLElement;
            
            if (focusableElement) {
              focusableElement.focus();
            } else {
              modalRef.current.focus();
            }
          }
        }, 10);
      }
      
      // Lock scroll if enabled
      if (lockScroll) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      }
      
      // Add event listeners
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('keydown', handleTabKey);
      
      // End animation after duration
      if (shouldAnimate) {
        const animationTimer = setTimeout(() => {
          setIsAnimating(false);
          stableOnAnimationEnd();
        }, animationDuration);
        
        return () => clearTimeout(animationTimer);
      } else {
        setIsAnimating(false);
        stableOnAnimationEnd();
      }
    } else {
      // Start closing animation
      if (shouldAnimate && isVisible) {
        setIsAnimating(true);
        
        const animationTimer = setTimeout(() => {
          setIsVisible(false);
          setIsAnimating(false);
          stableOnAnimationEnd();
          
          // Restore focus to the previously active element
          if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
            (previousActiveElement.current as HTMLElement).focus();
          }
          
          // Unlock scroll
          if (lockScroll) {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
        }, animationDuration);
        
        return () => clearTimeout(animationTimer);
      } else {
        setIsVisible(false);
        setIsAnimating(false);
        
        // Restore focus to the previously active element
        if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
          (previousActiveElement.current as HTMLElement).focus();
        }
        
        // Unlock scroll
        if (lockScroll) {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }
      }
      
      // Remove event listeners
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleTabKey);
    }
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleTabKey);
      
      // Unlock scroll
      if (lockScroll) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [isOpen, shouldAnimate, animationDuration, autoFocus, lockScroll, handleOutsideClick, handleEscapeKey, handleTabKey, stableOnOpen, stableOnAnimationEnd]);
  
  // Create portal container if needed
  useEffect(() => {
    if (!usePortal) return;
    
    let portalContainer = document.getElementById(portalId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = portalId;
      document.body.appendChild(portalContainer);
    }
    
    return () => {
      if (portalContainer && portalContainer.childNodes.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [usePortal, portalId]);
  
  // Don't render anything if the modal is not visible and not animating
  if (!isVisible && !isOpen) {
    return null;
  }
  
  // Modal content
  const modalContent = (
    <div
      className={`optimized-modal-container ${isAnimating ? 'animating' : ''} ${isVisible ? 'visible' : ''}`}
      style={{ zIndex }}
      aria-hidden={!isVisible}
    >
      {showBackdrop && (
        <div
          className={`optimized-modal-backdrop ${backdropClassName} ${isAnimating ? 'animating' : ''} ${isVisible ? 'visible' : ''}`}
          style={{
            ...backdropStyle,
            opacity: isVisible ? 1 : 0,
            transition: shouldAnimate ? `opacity ${animationDuration}ms ease-in-out` : 'none',
          }}
          onClick={closeOnOutsideClick ? stableOnClose : undefined}
        />
      )}
      
      <div
        ref={modalRef}
        className={`optimized-modal ${className} ${isAnimating ? 'animating' : ''} ${isVisible ? 'visible' : ''}`}
        style={{
          ...style,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: shouldAnimate
            ? `opacity ${animationDuration}ms ease-in-out, transform ${animationDuration}ms ease-in-out`
            : 'none',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className="optimized-modal-header">
            {title && (
              <h2 id="modal-title" className="optimized-modal-title">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                className="optimized-modal-close"
                aria-label="Close"
                onClick={stableOnClose}
              >
                ×
              </button>
            )}
          </div>
        )}
        
        <div className="optimized-modal-content">
          {children}
        </div>
      </div>
    </div>
  );
  
  // Render in portal if enabled, otherwise render inline
  if (usePortal) {
    const portalContainer = document.getElementById(portalId);
    return portalContainer ? createPortal(modalContent, portalContainer) : null;
  }
  
  return modalContent;
});

export default OptimizedModal;