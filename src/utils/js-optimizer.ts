/**
 * JavaScript optimization utilities for improving web performance
 */

import { detectDeviceCapabilities } from './performance-optimizer';

/**
 * Configuration options for JavaScript optimization
 */
export interface JsOptimizerConfig {
  /** Whether to use requestIdleCallback for non-critical tasks */
  useIdleCallback?: boolean;
  /** Whether to use web workers for CPU-intensive tasks */
  useWebWorkers?: boolean;
  /** Whether to debounce event handlers */
  debounceEvents?: boolean;
  /** Default debounce delay in milliseconds */
  debounceDelay?: number;
  /** Whether to throttle scroll and resize events */
  throttleViewportEvents?: boolean;
  /** Default throttle delay in milliseconds */
  throttleDelay?: number;
}

/**
 * Default configuration for JavaScript optimizer
 */
const DEFAULT_CONFIG: JsOptimizerConfig = {
  useIdleCallback: true,
  useWebWorkers: true,
  debounceEvents: true,
  debounceDelay: 150,
  throttleViewportEvents: true,
  throttleDelay: 100
};

/**
 * Schedules a task to run during browser idle periods
 * Falls back to setTimeout for browsers that don't support requestIdleCallback
 * @param callback Function to execute during idle period
 * @param options Options for requestIdleCallback
 */
export function scheduleIdleTask(
  callback: () => void,
  options: { timeout?: number } = {}
): number {
  if (typeof window === 'undefined') return 0;
  
  // Use requestIdleCallback if available
  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, options);
  }
  
  // Fall back to setTimeout
  return (window as any).setTimeout(callback, options.timeout || 1);
}

/**
 * Cancels a previously scheduled idle task
 * @param id The ID returned by scheduleIdleTask
 */
export function cancelIdleTask(id: number): void {
  if (typeof window === 'undefined') return;
  
  if ('cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    (window as any).clearTimeout(id);
  }
}

/**
 * Creates a debounced version of a function
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param immediate Whether to call the function on the leading edge instead of trailing
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = DEFAULT_CONFIG.debounceDelay || 150,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout !== null) {
      window.clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Creates a throttled version of a function
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @param options Additional options
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number = DEFAULT_CONFIG.throttleDelay || 100,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  let previous = 0;
  const { leading = true, trailing = true } = options;
  
  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    if (!previous && !leading) previous = now;
    
    const remaining = wait - (now - previous);
    const context = this;
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      
      previous = now;
      func.apply(context, args);
    } else if (!timeout && trailing) {
      timeout = window.setTimeout(() => {
        previous = !leading ? 0 : Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

/**
 * Optimizes event listeners by applying debouncing and throttling
 * @param config Configuration options
 */
export function optimizeEventListeners(config: JsOptimizerConfig = DEFAULT_CONFIG): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  
  // Store original listeners to be able to remove them later
  const listenerMap = new WeakMap<EventTarget, Map<string, Set<{
    original: EventListenerOrEventListenerObject;
    wrapped: EventListenerOrEventListenerObject;
  }>>>();
  
  // Override addEventListener
  EventTarget.prototype.addEventListener = function(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (!listener) return originalAddEventListener.call(this, type, listener, options);
    
    // Get or create listener map for this target
    if (!listenerMap.has(this)) {
      listenerMap.set(this, new Map());
    }
    
    const targetListeners = listenerMap.get(this)!;
    
    // Get or create set for this event type
    if (!targetListeners.has(type)) {
      targetListeners.set(type, new Set());
    }
    
    const typeListeners = targetListeners.get(type)!;
    
    // Check if this listener is already wrapped
    let isAlreadyWrapped = false;
    typeListeners.forEach(entry => {
      if (entry.original === listener) {
        // Already wrapped
        isAlreadyWrapped = true;
      }
    });
    
    if (isAlreadyWrapped) {
      return;
    }
    
    // Create wrapped listener based on event type
    let wrappedListener: EventListenerOrEventListenerObject;
    
    const listenerFn = typeof listener === 'function' ? listener : listener.handleEvent.bind(listener);
    
    if (mergedConfig.throttleViewportEvents && (type === 'scroll' || type === 'resize')) {
      // Throttle scroll and resize events
      wrappedListener = throttle(listenerFn, mergedConfig.throttleDelay);
    } else if (mergedConfig.debounceEvents && 
              (type === 'input' || type === 'change' || type === 'keyup')) {
      // Debounce input events
      wrappedListener = debounce(listenerFn, mergedConfig.debounceDelay);
    } else {
      // No optimization needed
      wrappedListener = listenerFn;
    }
    
    // Store the mapping
    typeListeners.add({
      original: listener,
      wrapped: wrappedListener
    });
    
    // Call original with wrapped listener
    return originalAddEventListener.call(this, type, wrappedListener, options);
  };
  
  // Override removeEventListener to handle wrapped listeners
  EventTarget.prototype.removeEventListener = function(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions
  ): void {
    if (!listener) return originalRemoveEventListener.call(this, type, listener, options);
    
    // Find the wrapped listener
    const targetListeners = listenerMap.get(this);
    if (targetListeners) {
      const typeListeners = targetListeners.get(type);
      if (typeListeners) {
        let entryToRemove: { original: EventListenerOrEventListenerObject; wrapped: EventListenerOrEventListenerObject } | null = null;
        typeListeners.forEach(entry => {
          if (entry.original === listener) {
            // Found the entry to remove
            entryToRemove = entry;
          }
        });
        
        if (entryToRemove) {
          // Remove the wrapped listener
          originalRemoveEventListener.call(this, type, (entryToRemove as any).wrapped, options);
          typeListeners.delete(entryToRemove);
        }
      }
    }
    
    // Also remove the original in case it was added directly
    return originalRemoveEventListener.call(this, type, listener, options);
  };
  
  // Return cleanup function
  return () => {
    // Restore original methods
    EventTarget.prototype.addEventListener = originalAddEventListener;
    EventTarget.prototype.removeEventListener = originalRemoveEventListener;
  };
}

/**
 * Optimizes JavaScript execution by applying various performance techniques
 * @param isLowPerformance Whether the device is a low-performance device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 * @param config Configuration options
 */
export function optimizeJavaScript(isLowPerformance: boolean = false, config: JsOptimizerConfig = DEFAULT_CONFIG): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const cleanupFunctions: Array<() => void> = [];
  
  // Optimize event listeners
  if (mergedConfig.debounceEvents || mergedConfig.throttleViewportEvents) {
    const cleanupEventListeners = optimizeEventListeners(mergedConfig);
    cleanupFunctions.push(cleanupEventListeners);
  }
  
  // Defer non-critical initialization
  const deferInitialization = (selector: string, initFn: (el: Element) => void) => {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;
    
    if (mergedConfig.useIdleCallback) {
      scheduleIdleTask(() => {
        elements.forEach(initFn);
      });
    } else {
      // Fallback to setTimeout
      setTimeout(() => {
        elements.forEach(initFn);
      }, 0);
    }
  };
  
  // Defer initialization of non-critical components
  deferInitialization('[data-defer-init]', (el) => {
    const initFn = el.getAttribute('data-init-function');
    if (initFn && typeof (window as any)[initFn] === 'function') {
      (window as any)[initFn](el);
    }
  });
  
  // Return cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}

/**
 * Creates a web worker from a function
 * @param workerFunction Function to run in the worker
 */
export function createWorker(workerFunction: Function): Worker {
  if (typeof window === 'undefined') {
    throw new Error('createWorker can only be used in browser environment');
  }
  
  // Create a blob URL for the worker
  const blob = new Blob(
    [`(${workerFunction.toString()})()`],
    { type: 'application/javascript' }
  );
  
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  
  // Clean up the URL when the worker is terminated
  worker.addEventListener('terminate', () => {
    URL.revokeObjectURL(url);
  });
  
  return worker;
}

/**
 * Runs a CPU-intensive task in a web worker if supported
 * @param task Function containing the CPU-intensive task
 * @param fallback Function to run if web workers are not supported
 * @param transferables Objects to transfer to the worker
 */
export function runInWorker<T>(
  task: () => T,
  fallback?: () => T,
  transferables: Transferable[] = []
): Promise<T> {
  if (typeof window === 'undefined') {
    return Promise.resolve((fallback || task)());
  }
  
  // Check if web workers are supported
  if (!('Worker' in window)) {
    return Promise.resolve((fallback || task)());
  }
  
  return new Promise((resolve, reject) => {
    try {
      // Create a worker function that will run the task
      const workerFunction = () => {
        self.onmessage = (e) => {
          try {
            // Execute the task with the provided data
            const result = (self as any).userTask(e.data);
            self.postMessage({ success: true, result });
          } catch (error) {
            self.postMessage({ 
              success: false, 
              error: error instanceof Error ? error.message : String(error) 
            });
          }
        };
      };
      
      const worker = createWorker(workerFunction);
      
      // Handle messages from the worker
      worker.onmessage = (e) => {
        if (e.data.success) {
          resolve(e.data.result);
        } else {
          reject(new Error(e.data.error));
        }
        worker.terminate();
      };
      
      // Handle worker errors
      worker.onerror = (e) => {
        reject(new Error(`Worker error: ${e.message}`));
        worker.terminate();
      };
      
      // Inject the task function and send initial data
      worker.postMessage({
        userTask: task.toString(),
        data: null
      }, transferables);
      
    } catch (error) {
      // Fall back to running the task in the main thread
      console.warn('Failed to run task in worker, falling back to main thread:', error);
      resolve((fallback || task)());
    }
  });
}