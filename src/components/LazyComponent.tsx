'use client';

import { useState, useEffect, useRef, ReactNode, memo } from 'react';

interface LazyComponentProps {
  /** The component to render lazily */
  children: ReactNode;
  /** Placeholder to show while the component is not yet visible */
  placeholder?: ReactNode;
  /** Threshold for intersection observer (0-1) */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Whether to keep the component mounted after it becomes invisible */
  keepMounted?: boolean;
  /** Minimum height for the placeholder */
  minHeight?: string | number;
  /** Whether to disable lazy loading */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Callback when component becomes visible */
  onVisible?: () => void;
}

/**
 * LazyComponent - A component that renders its children only when they become visible in the viewport
 * This helps improve initial page load performance by deferring the rendering of off-screen components
 */
const LazyComponent = memo(function LazyComponent({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '200px 0px',
  keepMounted = true,
  minHeight = '100px',
  disabled = false,
  className = '',
  style = {},
  onVisible
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(disabled);
  const [hasBeenVisible, setHasBeenVisible] = useState(disabled);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // If lazy loading is disabled, consider the component visible
    if (disabled) {
      setIsVisible(true);
      setHasBeenVisible(true);
      if (onVisible) onVisible();
      return;
    }
    
    const currentRef = containerRef.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isNowVisible = entry.isIntersecting;
        
        if (isNowVisible && !hasBeenVisible) {
          setHasBeenVisible(true);
          if (onVisible) onVisible();
        }
        
        setIsVisible(isNowVisible);
      },
      { threshold, rootMargin }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [disabled, threshold, rootMargin, hasBeenVisible, onVisible]);
  
  // Determine whether to render the children
  const shouldRenderChildren = disabled || hasBeenVisible && (isVisible || keepMounted);
  
  // Combine styles
  const combinedStyle = {
    minHeight: !shouldRenderChildren ? minHeight : undefined,
    ...style
  };
  
  return (
    <div 
      ref={containerRef} 
      className={`lazy-component ${className}`}
      style={combinedStyle}
      data-visible={isVisible ? 'true' : 'false'}
      data-loaded={hasBeenVisible ? 'true' : 'false'}
    >
      {shouldRenderChildren ? children : placeholder}
    </div>
  );
});

export default LazyComponent;