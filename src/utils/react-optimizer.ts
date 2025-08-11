/**
 * React optimization utilities for improving component performance
 */

import { memo, useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { detectDeviceCapabilities } from './performance-optimizer';

/**
 * Creates a memoized component with custom comparison function
 * @param Component The component to memoize
 * @param propsAreEqual Custom comparison function
 */
export function createMemoizedComponent<P>(Component: React.ComponentType<P>, propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean) {
  return memo(Component, propsAreEqual);
}

/**
 * Creates a deep comparison function for props
 * @param propsToCompare Array of prop names to compare deeply
 * @param otherProps Array of prop names to compare with shallow equality
 */
export function createDeepPropsComparator<P>(propsToCompare: (keyof P)[], otherProps: (keyof P)[] = []) {
  return (prevProps: Readonly<P>, nextProps: Readonly<P>): boolean => {
    // Check props that need deep comparison
    for (const prop of propsToCompare) {
      const prevValue = prevProps[prop];
      const nextValue = nextProps[prop];
      
      if (!deepEqual(prevValue, nextValue)) {
        return false;
      }
    }
    
    // Check other props with shallow equality
    for (const prop of otherProps) {
      if (prevProps[prop] !== nextProps[prop]) {
        return false;
      }
    }
    
    return true;
  };
}

/**
 * Deep equality comparison
 * @param a First value
 * @param b Second value
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    
    return true;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

/**
 * Creates a stable callback that doesn't change on re-renders
 * @param callback The callback function
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
}

/**
 * Hook for memoizing expensive calculations with deep dependency comparison
 * @param factory Function that returns the memoized value
 * @param deps Dependencies array
 */
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const depsRef = useRef<React.DependencyList>(deps);
  const valueRef = useRef<T>(factory());
  
  if (!depsEqual(depsRef.current, deps)) {
    depsRef.current = deps;
    valueRef.current = factory();
  }
  
  return valueRef.current;
}

/**
 * Compares two dependency arrays deeply
 * @param prevDeps Previous dependencies
 * @param nextDeps Next dependencies
 */
function depsEqual(prevDeps: React.DependencyList, nextDeps: React.DependencyList): boolean {
  if (prevDeps.length !== nextDeps.length) return false;
  
  for (let i = 0; i < prevDeps.length; i++) {
    if (!deepEqual(prevDeps[i], nextDeps[i])) return false;
  }
  
  return true;
}

/**
 * Hook for preventing unnecessary re-renders
 * @param value The value to track
 * @param isEqual Optional equality function
 */
export function useWhyDidYouUpdate<T>(name: string, value: T, isEqual: (a: T, b: T) => boolean = (a, b) => a === b) {
  const previousValue = useRef<T>(value);
  
  useEffect(() => {
    if (!isEqual(previousValue.current, value)) {
      console.log(`[why-update] ${name} changed:`, {
        from: previousValue.current,
        to: value
      });
      previousValue.current = value;
    }
  }, [name, value, isEqual]);
}

/**
 * Hook for tracking component render count
 * @param componentName Name of the component
 * @param logThreshold Threshold for logging render count
 */
export function useRenderCount(componentName: string, logThreshold: number = 5) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (renderCount.current % logThreshold === 0) {
      console.log(`[render-count] ${componentName} has rendered ${renderCount.current} times`);
    }
  });
  
  return renderCount.current;
}

/**
 * Hook for deferring expensive operations until after render
 * @param callback Function to call after render
 * @param deps Dependencies array
 */
export function useAfterRender(callback: () => void, deps: React.DependencyList = []) {
  useEffect(() => {
    const timeoutId = setTimeout(callback, 0);
    return () => clearTimeout(timeoutId);
  }, deps);
}

/**
 * Hook for conditionally rendering components based on device performance
 * @param isLowPerformance Whether the device is a low-performance device
 * @deprecated Consider using detectDeviceCapabilities().isLowEnd for consistency with the DeviceCapabilities interface
 * @param threshold Render threshold (0-1)
 */
export function useConditionalRender(isLowPerformance: boolean, threshold: number = 0.5) {
  // Generate a random number between 0 and 1
  const randomValue = useRef(Math.random()).current;
  
  // On low-performance devices, only render some percentage of non-critical components
  const shouldRender = !isLowPerformance || randomValue <= threshold;
  
  return shouldRender;
}

/**
 * Hook for lazy initializing expensive state
 * @param factory Function that returns the initial state
 */
export function useLazyInitialState<T>(factory: () => T): T {
  const [state] = useState(factory);
  return state;
}

/**
 * Hook for measuring component render time
 * @param componentName Name of the component (optional)
 * @param warnThreshold Threshold in milliseconds for warning about slow renders (optional)
 * @returns Object with renderTime, startMeasurement, and endMeasurement
 */
export function useRenderTime(componentName?: string, warnThreshold: number = 16) {
  const startTimeRef = useRef(performance.now());
  const [renderTime, setRenderTime] = useState<number | null>(null);
  
  // Function to start measurement manually
  const startMeasurement = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);
  
  // Function to end measurement manually and get the result
  const endMeasurement = useCallback(() => {
    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;
    setRenderTime(duration);
    
    if (componentName && duration > warnThreshold) {
      console.warn(`[slow-render] ${componentName} took ${duration.toFixed(2)}ms to render (threshold: ${warnThreshold}ms)`);
    }
    
    return duration;
  }, [componentName, warnThreshold]);
  
  // Automatic measurement on each render if componentName is provided
  useEffect(() => {
    if (componentName) {
      const renderTime = performance.now() - startTimeRef.current;
      
      if (renderTime > warnThreshold) {
        console.warn(`[slow-render] ${componentName} took ${renderTime.toFixed(2)}ms to render (threshold: ${warnThreshold}ms)`);
      }
      
      // Reset for next render
      startTimeRef.current = performance.now();
    }
  });
  
  return { renderTime, startMeasurement, endMeasurement };
}