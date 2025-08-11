'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStableCallback } from '../utils/react-optimizer';
import useComponentOptimizer from './useComponentOptimizer';

interface UseModalOptimizerOptions {
  /** Whether to lock scroll when modal is open */
  lockScroll?: boolean;
  /** Whether to focus the modal when it opens */
  autoFocus?: boolean;
  /** Whether to trap focus within the modal */
  trapFocus?: boolean;
  /** Whether to close the modal when clicking outside */
  closeOnOutsideClick?: boolean;
  /** Whether to close the modal when pressing escape */
  closeOnEscape?: boolean;
  /** Whether to animate the modal */
  animate?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Whether to optimize animations based on device capabilities */
  optimizeAnimations?: boolean;
  /** Whether to restore focus when modal closes */
  restoreFocus?: boolean;
  /** Whether to use a portal for rendering */
  usePortal?: boolean;
  /** Portal container ID */
  portalId?: string;
}

interface UseModalOptimizerReturn {
  /** Whether the modal is visible */
  isVisible: boolean;
  /** Whether the modal is animating */
  isAnimating: boolean;
  /** Whether animations should be enabled */
  shouldAnimate: boolean;
  /** Reference to the modal element */
  modalRef: React.RefObject<HTMLDivElement>;
  /** Handle outside click */
  handleOutsideClick: (e: MouseEvent) => void;
  /** Handle escape key */
  handleEscapeKey: (e: KeyboardEvent) => void;
  /** Handle tab key for focus trapping */
  handleTabKey: (e: KeyboardEvent) => void;
  /** Set up event listeners and handle modal open/close */
  setupModal: (isOpen: boolean, onClose: () => void, onOpen?: () => void, onAnimationEnd?: () => void) => () => void;
  /** Create portal container if needed */
  setupPortal: () => () => void;
  /** Get transition style based on visibility */
  getTransitionStyle: (visible: boolean, customTransform?: string) => {
    opacity: number;
    transform: string;
    transition: string;
  };
}

/**
 * A hook for optimizing modal performance and accessibility
 */
const useModalOptimizer = (
  componentName = 'Modal',
  {
    lockScroll = true,
    autoFocus = true,
    trapFocus = true,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    animate = true,
    animationDuration = 300,
    optimizeAnimations = true,
    restoreFocus = true,
    usePortal = true,
    portalId = 'modal-portal',
  }: UseModalOptimizerOptions = {}
): UseModalOptimizerReturn => {
  // State for animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Refs for DOM elements
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  
  // Use component optimizer for performance monitoring
  const { isLowEnd } = useComponentOptimizer(componentName, {
    optimizeAnimations,
  });
  
  // Disable animations on low-end devices if optimizeAnimations is enabled
  const shouldAnimate = animate && !(optimizeAnimations && isLowEnd);
  
  // Handle outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (!closeOnOutsideClick) return;
    
    const modalElement = modalRef.current;
    if (modalElement && !modalElement.contains(e.target as Node)) {
      // This will be set by setupModal
      const onCloseRef = (modalRef.current as any)._onClose;
      if (typeof onCloseRef === 'function') {
        onCloseRef();
      }
    }
  }, [closeOnOutsideClick]);
  
  // Handle escape key
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (!closeOnEscape) return;
    
    if (e.key === 'Escape') {
      // This will be set by setupModal
      const onCloseRef = (modalRef.current as any)?._onClose;
      if (typeof onCloseRef === 'function') {
        onCloseRef();
      }
    }
  }, [closeOnEscape]);
  
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
  const setupModal = useCallback((isOpen: boolean, onClose: () => void, onOpen?: () => void, onAnimationEnd?: () => void) => {
    const stableOnClose = useStableCallback(onClose);
    const stableOnOpen = useStableCallback(onOpen || (() => {}));
    const stableOnAnimationEnd = useStableCallback(onAnimationEnd || (() => {}));
    
    // Store the onClose callback on the ref for event handlers to access
    if (modalRef.current) {
      (modalRef.current as any)._onClose = stableOnClose;
    }
    
    if (isOpen) {
      // Store the currently focused element
      if (restoreFocus) {
        previousActiveElement.current = document.activeElement;
      }
      
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
          if (restoreFocus && previousActiveElement.current && 'focus' in previousActiveElement.current) {
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
        if (restoreFocus && previousActiveElement.current && 'focus' in previousActiveElement.current) {
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
  }, [shouldAnimate, animationDuration, autoFocus, lockScroll, restoreFocus, handleOutsideClick, handleEscapeKey, handleTabKey]);
  
  // Create portal container if needed
  const setupPortal = useCallback(() => {
    if (!usePortal) return () => {};
    
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
  
  // Get transition style based on visibility
  const getTransitionStyle = useCallback((visible: boolean, customTransform = 'translateY(-20px)') => {
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : customTransform,
      transition: shouldAnimate
        ? `opacity ${animationDuration}ms ease-in-out, transform ${animationDuration}ms ease-in-out`
        : 'none',
    };
  }, [shouldAnimate, animationDuration]);
  
  return {
    isVisible,
    isAnimating,
    shouldAnimate,
    modalRef,
    handleOutsideClick,
    handleEscapeKey,
    handleTabKey,
    setupModal,
    setupPortal,
    getTransitionStyle,
  };
};

export default useModalOptimizer;