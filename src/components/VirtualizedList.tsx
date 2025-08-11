'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import useComponentOptimizer from '../hooks/useComponentOptimizer';

interface VirtualizedListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Function to render an item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Number of items to render outside the visible area */
  overscanCount?: number;
  /** Maximum height of the list container */
  maxHeight?: string | number;
  /** Custom class name for the container */
  className?: string;
  /** Custom style for the container */
  style?: React.CSSProperties;
  /** Whether to disable virtualization */
  disableVirtualization?: boolean;
  /** Callback when visible items change */
  onVisibleItemsChange?: (startIndex: number, endIndex: number) => void;
}

/**
 * VirtualizedList - A high-performance list component with virtualization
 */
function VirtualizedList<T>(
  {
    items,
    renderItem,
    itemHeight,
    overscanCount = 5,
    maxHeight = '100%',
    className = '',
    style = {},
    disableVirtualization = false,
    onVisibleItemsChange,
  }: VirtualizedListProps<T>
) {
  // Get device capabilities for performance optimization
  const { isLowEnd } = useComponentOptimizer('VirtualizedList', {
    optimizeAnimations: true,
    optimizeJavaScript: true,
  });
  
  // Force virtualization on low-end devices
  const shouldVirtualize = !disableVirtualization || isLowEnd;
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for virtualization
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  // Calculate visible items range
  const visibleStartIndex = shouldVirtualize
    ? Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount)
    : 0;
    
  const visibleEndIndex = shouldVirtualize
    ? Math.min(
        items.length - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscanCount
      )
    : items.length - 1;
  
  // Get visible items
  const visibleItems = shouldVirtualize
    ? items.slice(visibleStartIndex, visibleEndIndex + 1)
    : items;
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !shouldVirtualize) return;
    
    const { scrollTop: newScrollTop } = containerRef.current;
    setScrollTop(newScrollTop);
    
    // Calculate new visible range
    const newStartIndex = Math.max(0, Math.floor(newScrollTop / itemHeight) - overscanCount);
    const newEndIndex = Math.min(
      items.length - 1,
      Math.ceil((newScrollTop + containerHeight) / itemHeight) + overscanCount
    );
    
    // Call the callback if provided
    if (onVisibleItemsChange) {
      onVisibleItemsChange(newStartIndex, newEndIndex);
    }
  }, [containerHeight, itemHeight, items.length, onVisibleItemsChange, overscanCount, shouldVirtualize]);
  
  // Set up resize observer to update container height
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    setContainerHeight(container.clientHeight);
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === container) {
          setContainerHeight(entry.contentRect.height);
        }
      }
    });
    
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // Add scroll event listener
  useEffect(() => {
    if (!containerRef.current || !shouldVirtualize) return;
    
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, shouldVirtualize]);
  
  // Calculate total content height
  const totalHeight = items.length * itemHeight;
  
  // Calculate offset for visible items
  const offsetY = shouldVirtualize ? visibleStartIndex * itemHeight : 0;
  
  return (
    <div
      ref={containerRef}
      className={`virtualized-list-container ${className}`}
      style={{
        overflowY: 'auto',
        maxHeight,
        position: 'relative',
        ...style,
      }}
      data-virtualized={shouldVirtualize ? 'true' : 'false'}
    >
      <div
        className="virtualized-list-content"
        style={{
          height: `${totalHeight}px`,
          position: 'relative',
        }}
      >
        <div
          className="virtualized-list-items"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = shouldVirtualize ? visibleStartIndex + index : index;
            return (
              <div
                key={actualIndex}
                className="virtualized-list-item"
                style={{
                  height: `${itemHeight}px`,
                  position: 'relative',
                }}
                data-index={actualIndex}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(VirtualizedList) as typeof VirtualizedList;