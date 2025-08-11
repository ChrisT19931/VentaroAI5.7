/**
 * DOM optimization utilities for improving rendering performance
 */

/**
 * Configuration options for DOM optimization
 */
export interface DomOptimizerConfig {
  /** Whether to batch DOM operations */
  batchOperations?: boolean;
  /** Whether to use document fragments */
  useDocumentFragments?: boolean;
  /** Whether to use requestAnimationFrame for DOM updates */
  useRaf?: boolean;
  /** Whether to virtualize long lists */
  virtualizeLists?: boolean;
  /** Threshold for list virtualization */
  virtualizationThreshold?: number;
  /** Whether to optimize event listeners */
  optimizeEventListeners?: boolean;
  /** Whether to optimize scroll performance */
  optimizeScrolling?: boolean;
}

/**
 * Default configuration for DOM optimization
 */
export const DEFAULT_DOM_CONFIG: DomOptimizerConfig = {
  batchOperations: true,
  useDocumentFragments: true,
  useRaf: true,
  virtualizeLists: true,
  virtualizationThreshold: 50,
  optimizeEventListeners: true,
  optimizeScrolling: true,
};

/**
 * Batches DOM operations to reduce reflows and repaints
 * @param operations Array of DOM operations to batch
 */
export function batchDomOperations(operations: (() => void)[]): void {
  // Force a reflow before operations
  document.body.getBoundingClientRect();
  
  // Execute all operations
  operations.forEach(operation => operation());
  
  // Force a single reflow after all operations
  document.body.getBoundingClientRect();
}

/**
 * Creates a document fragment for efficient DOM manipulation
 * @param elements Array of elements to add to the fragment
 */
export function createDocumentFragment(elements: HTMLElement[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  
  elements.forEach(element => {
    fragment.appendChild(element);
  });
  
  return fragment;
}

/**
 * Schedules a DOM update using requestAnimationFrame
 * @param updateFn Function to update the DOM
 */
export function scheduleDomUpdate(updateFn: () => void): number {
  return window.requestAnimationFrame(() => {
    updateFn();
  });
}

/**
 * Cancels a scheduled DOM update
 * @param requestId Request ID from scheduleDomUpdate
 */
export function cancelDomUpdate(requestId: number): void {
  window.cancelAnimationFrame(requestId);
}

/**
 * Virtualizes a long list to improve rendering performance
 * @param containerElement Container element for the list
 * @param items Array of items to render
 * @param renderItem Function to render an item
 * @param itemHeight Height of each item in pixels
 * @param bufferSize Number of items to render outside the visible area
 */
export function virtualizeList<T>(
  containerElement: HTMLElement,
  items: T[],
  renderItem: (item: T, index: number) => HTMLElement,
  itemHeight: number,
  bufferSize: number = 5
): {
  update: () => void;
  cleanup: () => void;
} {
  let visibleStartIndex = 0;
  let visibleEndIndex = 0;
  let scrollHandler: (() => void) | null = null;
  let resizeObserver: ResizeObserver | null = null;
  
  // Create a content element to hold the items
  const contentElement = document.createElement('div');
  contentElement.style.position = 'relative';
  contentElement.style.width = '100%';
  contentElement.style.height = `${items.length * itemHeight}px`;
  
  // Append the content element to the container
  containerElement.appendChild(contentElement);
  
  // Function to update the visible items
  const updateVisibleItems = () => {
    // Calculate the visible range based on scroll position
    const scrollTop = containerElement.scrollTop;
    const containerHeight = containerElement.clientHeight;
    
    // Calculate the visible range with buffer
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize
    );
    
    // Skip if the visible range hasn't changed
    if (startIndex === visibleStartIndex && endIndex === visibleEndIndex) {
      return;
    }
    
    // Update the visible range
    visibleStartIndex = startIndex;
    visibleEndIndex = endIndex;
    
    // Clear the content element
    contentElement.innerHTML = '';
    
    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Render the visible items
    for (let i = startIndex; i <= endIndex; i++) {
      const item = items[i];
      const itemElement = renderItem(item, i);
      
      // Position the item absolutely
      itemElement.style.position = 'absolute';
      itemElement.style.top = `${i * itemHeight}px`;
      itemElement.style.width = '100%';
      itemElement.style.height = `${itemHeight}px`;
      
      // Add the item to the fragment
      fragment.appendChild(itemElement);
    }
    
    // Append the fragment to the content element
    contentElement.appendChild(fragment);
  };
  
  // Set up the scroll handler
  scrollHandler = () => {
    scheduleDomUpdate(updateVisibleItems);
  };
  
  // Add the scroll event listener
  containerElement.addEventListener('scroll', scrollHandler);
  
  // Set up the resize observer
  resizeObserver = new ResizeObserver(() => {
    scheduleDomUpdate(updateVisibleItems);
  });
  
  // Observe the container element
  resizeObserver.observe(containerElement);
  
  // Initial update
  updateVisibleItems();
  
  // Return functions to update and clean up
  return {
    update: updateVisibleItems,
    cleanup: () => {
      if (scrollHandler) {
        containerElement.removeEventListener('scroll', scrollHandler);
      }
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      contentElement.remove();
    },
  };
}

/**
 * Optimizes event listeners by using event delegation
 * @param containerElement Container element for event delegation
 * @param eventType Event type to listen for
 * @param selector CSS selector for target elements
 * @param handler Event handler function
 */
export function delegateEvent(
  containerElement: HTMLElement | Document,
  eventType: string,
  selector: string,
  handler: (event: Event, delegateTarget: HTMLElement) => void
): () => void {
  const eventHandler = (event: Event) => {
    let target = event.target as HTMLElement;
    
    while (target && target !== containerElement) {
      if (target.matches(selector)) {
        handler(event, target);
        return;
      }
      
      target = target.parentElement as HTMLElement;
    }
  };
  
  containerElement.addEventListener(eventType, eventHandler);
  
  // Return a cleanup function
  return () => {
    containerElement.removeEventListener(eventType, eventHandler);
  };
}

/**
 * Optimizes scrolling performance by throttling scroll events
 * @param element Element to optimize scrolling for
 * @param handler Scroll handler function
 * @param throttleMs Throttle interval in milliseconds
 */
export function optimizeScrolling(
  element: HTMLElement | Window,
  handler: (event: Event) => void,
  throttleMs: number = 16
): () => void {
  let lastTime = 0;
  let requestId: number | null = null;
  
  const throttledHandler = (event: Event) => {
    const now = performance.now();
    
    if (now - lastTime >= throttleMs) {
      lastTime = now;
      handler(event);
    } else if (!requestId) {
      requestId = window.requestAnimationFrame(() => {
        requestId = null;
        lastTime = performance.now();
        handler(event);
      });
    }
  };
  
  element.addEventListener('scroll', throttledHandler, { passive: true });
  
  // Return a cleanup function
  return () => {
    element.removeEventListener('scroll', throttledHandler);
    
    if (requestId !== null) {
      window.cancelAnimationFrame(requestId);
    }
  };
}

/**
 * Initializes DOM optimization
 * @param config Configuration options
 */
export function initializeDomOptimization(config: DomOptimizerConfig = DEFAULT_DOM_CONFIG): () => void {
  const {
    optimizeEventListeners,
    optimizeScrolling: shouldOptimizeScrolling,
  } = { ...DEFAULT_DOM_CONFIG, ...config };
  
  const cleanupFunctions: (() => void)[] = [];
  
  // Optimize event listeners if enabled
  if (optimizeEventListeners) {
    // Delegate common events to the document
    const clickCleanup = delegateEvent(
      document,
      'click',
      'a, button, [role="button"], input[type="submit"], input[type="button"]',
      (event, target) => {
        // Event handling is done by the original handlers
      }
    );
    
    cleanupFunctions.push(clickCleanup);
  }
  
  // Optimize scrolling if enabled
  if (shouldOptimizeScrolling) {
    const scrollCleanup = optimizeScrolling(window, () => {
      // Scroll handling is done by the original handlers
    });
    
    cleanupFunctions.push(scrollCleanup);
  }
  
  // Return a cleanup function that calls all cleanup functions
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}