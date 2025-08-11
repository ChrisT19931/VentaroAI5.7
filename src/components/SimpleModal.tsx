'use client';

import { memo, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useModalOptimizer from '../hooks/useModalOptimizer';
import '../components/OptimizedModal.css';

interface SimpleModalProps {
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
  /** Callback when the modal is opened */
  onOpen?: () => void;
  /** Callback when the animation ends */
  onAnimationEnd?: () => void;
}

/**
 * SimpleModal - A simplified modal component using the useModalOptimizer hook
 */
const SimpleModal = memo(function SimpleModal({
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
  onOpen,
  onAnimationEnd,
}: SimpleModalProps) {
  // Use the modal optimizer hook
  const {
    isVisible,
    isAnimating,
    shouldAnimate,
    modalRef,
    setupModal,
    setupPortal,
    getTransitionStyle,
  } = useModalOptimizer('SimpleModal', {
    closeOnOutsideClick,
    closeOnEscape,
    animate,
    animationDuration,
    optimizeAnimations: true,
    usePortal: true,
  });
  
  // Set up event listeners and handle modal open/close
  useEffect(() => {
    return setupModal(isOpen, onClose, onOpen, onAnimationEnd);
  }, [isOpen, onClose, onOpen, onAnimationEnd, setupModal]);
  
  // Create portal container if needed
  useEffect(() => {
    return setupPortal();
  }, [setupPortal]);
  
  // Don't render anything if the modal is not visible and not open
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
        />
      )}
      
      <div
        ref={modalRef}
        className={`optimized-modal ${className} ${isAnimating ? 'animating' : ''} ${isVisible ? 'visible' : ''}`}
        style={{
          ...style,
          ...getTransitionStyle(isVisible),
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
                onClick={onClose}
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
  
  // Render in portal if available, otherwise render inline
  const portalContainer = document.getElementById('modal-portal');
  return portalContainer ? createPortal(modalContent, portalContainer) : modalContent;
});

export default SimpleModal;