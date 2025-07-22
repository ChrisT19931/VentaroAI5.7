'use client';

import React, { useState, useRef, useEffect } from 'react';

type AccordionItemProps = {
  /**
   * Title of the accordion item
   */
  title: React.ReactNode;
  
  /**
   * Content of the accordion item
   */
  children: React.ReactNode;
  
  /**
   * Whether the accordion item is expanded by default
   */
  defaultExpanded?: boolean;
  
  /**
   * Whether the accordion item is disabled
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes for the accordion item
   */
  className?: string;
  
  /**
   * Icon to display when the accordion is collapsed
   */
  expandIcon?: React.ReactNode;
  
  /**
   * Icon to display when the accordion is expanded
   */
  collapseIcon?: React.ReactNode;
  
  /**
   * ID for the accordion item
   */
  id?: string;
  
  /**
   * Callback when the accordion item is toggled
   */
  onToggle?: (expanded: boolean) => void;
};

type AccordionProps = {
  /**
   * Children must be AccordionItem components
   */
  children: React.ReactNode;
  
  /**
   * Whether multiple items can be expanded at once
   */
  allowMultiple?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Variant of the accordion
   */
  variant?: 'default' | 'bordered' | 'separated';
};

export function AccordionItem({
  title,
  children,
  defaultExpanded = false,
  disabled = false,
  className = '',
  expandIcon,
  collapseIcon,
  id,
  onToggle,
}: AccordionItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | 'auto'>(defaultExpanded ? 'auto' : 0);
  
  // Generate unique ID if not provided
  const accordionId = id || `accordion-${Math.random().toString(36).substring(2, 9)}`;
  const headerId = `${accordionId}-header`;
  const contentId = `${accordionId}-content`;
  
  // Update content height when expanded state changes
  useEffect(() => {
    if (expanded) {
      // Set to actual height first for animation
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
      
      // Then set to auto to handle dynamic content
      const timer = setTimeout(() => {
        setContentHeight('auto');
      }, 300); // Match transition duration
      
      return () => clearTimeout(timer);
    } else {
      // Set to actual height first for animation
      if (contentRef.current && contentHeight === 'auto') {
        setContentHeight(contentRef.current.scrollHeight);
        
        // Force a reflow
        contentRef.current.offsetHeight;
      }
      
      // Then set to 0
      requestAnimationFrame(() => {
        setContentHeight(0);
      });
    }
  }, [expanded]);
  
  const handleToggle = () => {
    if (disabled) return;
    
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.(newExpanded);
  };
  
  // Default icons
  const defaultExpandIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
  
  const defaultCollapseIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  );
  
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <h3>
        <button
          id={headerId}
          aria-expanded={expanded}
          aria-controls={contentId}
          className={`
            flex justify-between items-center w-full py-4 px-2 text-left text-base font-medium
            ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-50'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          onClick={handleToggle}
          disabled={disabled}
        >
          <span>{title}</span>
          <span className="ml-6 flex-shrink-0 text-gray-400 transition-transform duration-200 ease-in-out">
            {expanded
              ? (collapseIcon || defaultCollapseIcon)
              : (expandIcon || defaultExpandIcon)
            }
          </span>
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: typeof contentHeight === 'number' ? `${contentHeight}px` : contentHeight }}
      >
        <div ref={contentRef} className="py-4 px-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Accordion({
  children,
  allowMultiple = false,
  className = '',
  variant = 'default',
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Clone children to add controlled props
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    const childId = child.props.id || `accordion-item-${index}`;
    
    return React.cloneElement(child, {
      // @ts-ignore - We know these props are valid for AccordionItem
      id: childId,
      expanded: expandedItems.has(childId),
      onToggle: (expanded: boolean) => {
        // Call original onToggle if it exists
        child.props.onToggle?.(expanded);
        
        // Update expanded items
        setExpandedItems(prevItems => {
          const newItems = new Set(prevItems);
          
          if (expanded) {
            if (!allowMultiple) {
              newItems.clear();
            }
            newItems.add(childId);
          } else {
            newItems.delete(childId);
          }
          
          return newItems;
        });
      },
    });
  });
  
  // Determine variant classes
  const variantClasses = {
    default: 'border-t border-gray-200',
    bordered: 'border border-gray-200 rounded-md',
    separated: 'space-y-2',
  }[variant];
  
  return (
    <div className={`${variantClasses} ${className}`}>
      {enhancedChildren}
    </div>
  );
}