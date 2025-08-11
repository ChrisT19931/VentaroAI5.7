/**
 * Modal Optimizer - Utility functions for optimizing modal performance
 */

import { detectDeviceCapabilities } from './performance-optimizer';

/**
 * Configuration options for modal optimization
 */
export interface ModalOptimizerConfig {
  /** Whether to optimize animations based on device capabilities */
  optimizeAnimations?: boolean;
  /** Whether to optimize rendering based on device capabilities */
  optimizeRendering?: boolean;
  /** Whether to optimize focus management */
  optimizeFocus?: boolean;
  /** Whether to optimize scroll locking */
  optimizeScroll?: boolean;
  /** Whether to optimize keyboard interactions */
  optimizeKeyboard?: boolean;
  /** Whether to optimize portal usage */
  optimizePortal?: boolean;
  /** Whether to optimize backdrop rendering */
  optimizeBackdrop?: boolean;
}

/**
 * Default configuration for modal optimization
 */
export const DEFAULT_MODAL_CONFIG: ModalOptimizerConfig = {
  optimizeAnimations: true,
  optimizeRendering: true,
  optimizeFocus: true,
  optimizeScroll: true,
  optimizeKeyboard: true,
  optimizePortal: true,
  optimizeBackdrop: true,
};

/**
 * Locks the scroll of the body element
 * @returns A function to unlock the scroll
 */
export const lockBodyScroll = (): () => void => {
  // Store the original values
  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;
  
  // Calculate the scrollbar width to prevent layout shift
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
  // Apply the lock
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  
  // Return a function to unlock
  return () => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  };
};

/**
 * Creates or gets a portal container for modals
 * @param id The ID of the portal container
 * @returns A tuple containing the portal container and a cleanup function
 */
export const createModalPortal = (id: string = 'modal-portal'): [HTMLElement, () => void] => {
  let portalContainer = document.getElementById(id);
  let shouldCleanup = false;
  
  if (!portalContainer) {
    portalContainer = document.createElement('div');
    portalContainer.id = id;
    document.body.appendChild(portalContainer);
    shouldCleanup = true;
  }
  
  const cleanup = () => {
    if (shouldCleanup && portalContainer && portalContainer.childNodes.length === 0) {
      document.body.removeChild(portalContainer);
    }
  };
  
  return [portalContainer, cleanup];
};

/**
 * Manages focus within a modal
 * @param modalElement The modal element
 * @param restoreFocus Whether to restore focus when the modal is closed
 * @returns A cleanup function
 */
export const manageFocus = (modalElement: HTMLElement, restoreFocus: boolean = true): () => void => {
  // Store the previously focused element
  const previousActiveElement = document.activeElement;
  
  // Find all focusable elements within the modal
  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  // Focus the first focusable element or the modal itself
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  } else {
    modalElement.focus();
  }
  
  // Create a function to handle tab key for focus trapping
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };
  
  // Add event listener for tab key
  document.addEventListener('keydown', handleTabKey);
  
  // Return a cleanup function
  return () => {
    document.removeEventListener('keydown', handleTabKey);
    
    // Restore focus if enabled
    if (restoreFocus && previousActiveElement && 'focus' in previousActiveElement) {
      (previousActiveElement as HTMLElement).focus();
    }
  };
};

/**
 * Optimizes the backdrop element based on device capabilities
 * @param backdropElement The backdrop element
 * @param isLowEndDevice Whether the device is low-end
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 */
export const optimizeBackdrop = (backdropElement: HTMLElement, isLowEndDevice: boolean): void => {
  if (isLowEndDevice) {
    // Simplify backdrop effects for low-end devices
    backdropElement.style.backdropFilter = 'none';
    backdropElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  } else {
    // Use more advanced effects for high-end devices
    backdropElement.style.backdropFilter = 'blur(4px)';
    backdropElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  }
};

/**
 * Optimizes modal animations based on device capabilities and user preferences
 * @param modalElement The modal element
 * @param backdropElement The backdrop element
 * @param isLowEndDevice Whether the device is low-end
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 * @param prefersReducedMotion Whether the user prefers reduced motion
 * @param animationDuration The animation duration in milliseconds
 */
export const optimizeModalAnimations = (
  modalElement: HTMLElement,
  backdropElement: HTMLElement | null,
  isLowEndDevice: boolean,
  prefersReducedMotion: boolean,
  animationDuration: number = 300
): void => {
  // Determine if animations should be disabled
  const disableAnimations = isLowEndDevice || prefersReducedMotion;
  
  if (disableAnimations) {
    // Disable animations
    modalElement.style.transition = 'none';
    if (backdropElement) {
      backdropElement.style.transition = 'none';
    }
  } else {
    // Enable animations with appropriate duration
    const duration = isLowEndDevice ? animationDuration / 2 : animationDuration;
    modalElement.style.transition = `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`;
    if (backdropElement) {
      backdropElement.style.transition = `opacity ${duration}ms ease-in-out`;
    }
  }
  
  // Apply will-change for better performance during animations
  if (!disableAnimations) {
    modalElement.style.willChange = 'opacity, transform';
    if (backdropElement) {
      backdropElement.style.willChange = 'opacity';
    }
    
    // Remove will-change after animation completes to free up resources
    setTimeout(() => {
      modalElement.style.willChange = 'auto';
      if (backdropElement) {
        backdropElement.style.willChange = 'auto';
      }
    }, animationDuration + 50);
  }
};

/**
 * Initializes modal optimizations based on configuration and device capabilities
 * @param modalElement The modal element
 * @param backdropElement The backdrop element
 * @param config The optimization configuration
 * @param isLowEndDevice Whether the device is low-end
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 * @param prefersReducedMotion Whether the user prefers reduced motion
 * @returns A cleanup function
 */
export const initializeModalOptimizations = (
  modalElement: HTMLElement,
  backdropElement: HTMLElement | null,
  config: ModalOptimizerConfig = DEFAULT_MODAL_CONFIG,
  isLowEndDevice: boolean = false,
  prefersReducedMotion: boolean = false
): () => void => {
  const cleanupFunctions: Array<() => void> = [];
  
  // Optimize animations if enabled
  if (config.optimizeAnimations) {
    optimizeModalAnimations(
      modalElement,
      backdropElement,
      isLowEndDevice,
      prefersReducedMotion
    );
  }
  
  // Optimize backdrop if enabled and backdrop exists
  if (config.optimizeBackdrop && backdropElement) {
    optimizeBackdrop(backdropElement, isLowEndDevice);
  }
  
  // Optimize focus management if enabled
  if (config.optimizeFocus) {
    const focusCleanup = manageFocus(modalElement, true);
    cleanupFunctions.push(focusCleanup);
  }
  
  // Optimize scroll locking if enabled
  if (config.optimizeScroll) {
    const scrollCleanup = lockBodyScroll();
    cleanupFunctions.push(scrollCleanup);
  }
  
  // Return a combined cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};