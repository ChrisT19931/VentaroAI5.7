'use client';

import React, { useState, useRef, useEffect } from 'react';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
  maxWidth?: number;
  disabled?: boolean;
};

export default function Tooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  className = '',
  contentClassName = '',
  arrow = true,
  maxWidth = 200,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updateTooltipPosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const updateTooltipPosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 8 + scrollTop;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2) + scrollLeft;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2) + scrollTop;
        left = targetRect.right + 8 + scrollLeft;
        break;
      case 'bottom':
        top = targetRect.bottom + 8 + scrollTop;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2) + scrollLeft;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2) + scrollTop;
        left = targetRect.left - tooltipRect.width - 8 + scrollLeft;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if needed
    if (left < 0) {
      left = 0;
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width;
    }

    // Adjust vertical position if needed
    if (top < 0) {
      top = 0;
    } else if (top + tooltipRect.height > viewportHeight + scrollTop) {
      top = viewportHeight + scrollTop - tooltipRect.height;
    }

    setTooltipPosition({ top, left });
  };

  // Update position on window resize
  useEffect(() => {
    if (isVisible) {
      const handleResize = () => {
        updateTooltipPosition();
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isVisible]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArrowStyles = () => {
    const arrowSize = 6;
    const arrowStyles: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };

    switch (position) {
      case 'top':
        arrowStyles.bottom = -arrowSize;
        arrowStyles.left = '50%';
        arrowStyles.marginLeft = -arrowSize;
        arrowStyles.borderWidth = `${arrowSize}px ${arrowSize}px 0`;
        arrowStyles.borderColor = 'rgba(55, 65, 81, 0.9) transparent transparent';
        break;
      case 'right':
        arrowStyles.left = -arrowSize;
        arrowStyles.top = '50%';
        arrowStyles.marginTop = -arrowSize;
        arrowStyles.borderWidth = `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`;
        arrowStyles.borderColor = 'transparent rgba(55, 65, 81, 0.9) transparent transparent';
        break;
      case 'bottom':
        arrowStyles.top = -arrowSize;
        arrowStyles.left = '50%';
        arrowStyles.marginLeft = -arrowSize;
        arrowStyles.borderWidth = `0 ${arrowSize}px ${arrowSize}px`;
        arrowStyles.borderColor = 'transparent transparent rgba(55, 65, 81, 0.9)';
        break;
      case 'left':
        arrowStyles.right = -arrowSize;
        arrowStyles.top = '50%';
        arrowStyles.marginTop = -arrowSize;
        arrowStyles.borderWidth = `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`;
        arrowStyles.borderColor = 'transparent transparent transparent rgba(55, 65, 81, 0.9)';
        break;
    }

    return arrowStyles;
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        ref={targetRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth: maxWidth ? `${maxWidth}px` : undefined,
          }}
        >
          <div
            className={`py-2 px-3 text-sm text-white bg-gray-800 bg-opacity-90 rounded shadow-lg ${contentClassName}`}
          >
            {content}
            {arrow && <div style={getArrowStyles()} />}
          </div>
        </div>
      )}
    </div>
  );
}