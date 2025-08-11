'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { detectDeviceCapabilities, DeviceCapabilities } from '../utils/performance-optimizer';
import { optimizeAnimations } from '../utils/animation-optimizer';
import { optimizeJavaScript } from '../utils/js-optimizer';
import { debounce } from '../utils/js-optimizer';

interface PerformanceOptions {
  /** Whether to detect device capabilities */
  detectCapabilities?: boolean;
  /** Whether to optimize animations */
  optimizeAnimations?: boolean;
  /** Whether to optimize JavaScript */
  optimizeJavaScript?: boolean;
  /** Whether to respect user preferences */
  respectUserPreferences?: boolean;
  /** Whether to adapt to device capabilities */
  adaptToDevice?: boolean;
}

interface PerformanceState {
  /** Whether the device is a low-end device */
  isLowPerformance: boolean;
  /** Whether animations should be reduced or disabled */
  shouldReduceAnimations: boolean;
  /** Whether effects should be simplified */
  shouldSimplifyEffects: boolean;
  /** Whether data usage should be minimized */
  shouldMinimizeDataUsage: boolean;
  /** Full device capabilities information */
  capabilities: DeviceCapabilities | null;
  /** CSS variables for performance optimizations */
  cssVariables: Record<string, string>;
}

/**
 * Hook for accessing and applying performance optimizations in React components
 */
export function usePerformance(options: PerformanceOptions = {}) {
  const {
    detectCapabilities = true,
    optimizeAnimations: shouldOptimizeAnimations = true,
    optimizeJavaScript: shouldOptimizeJs = true,
    respectUserPreferences = true,
    adaptToDevice = true
  } = options;
  
  // Performance state
  const [state, setState] = useState<PerformanceState>({
    isLowPerformance: false,
    shouldReduceAnimations: false,
    shouldSimplifyEffects: false,
    shouldMinimizeDataUsage: false,
    capabilities: null,
    cssVariables: {}
  });
  
  // Detect device capabilities
  useEffect(() => {
    if (!detectCapabilities) return;
    
    let mounted = true;
    
    const detectPerformance = async () => {
      try {
        const capabilities = await detectDeviceCapabilities();
        
        if (!mounted) return;
        
        // Determine performance settings based on capabilities
        const isLowPerformance = capabilities.isLowEnd || capabilities.isBatterySaving;
        const shouldReduceAnimations = capabilities.prefersReducedMotion || isLowPerformance;
        const shouldSimplifyEffects = isLowPerformance;
        const shouldMinimizeDataUsage = capabilities.prefersReducedData || capabilities.connectionType === '2g' || capabilities.connectionType === 'slow-2g';
        
        // Create CSS variables
        const cssVariables: Record<string, string> = {
          '--device-performance': isLowPerformance ? 'low' : 'high',
          '--animation-speed': shouldReduceAnimations ? '0.7' : '1',
          '--animation-complexity': shouldSimplifyEffects ? '0.5' : '1',
          '--effect-intensity': shouldSimplifyEffects ? '0.6' : '1',
          '--data-saver': shouldMinimizeDataUsage ? 'true' : 'false'
        };
        
        setState({
          isLowPerformance,
          shouldReduceAnimations,
          shouldSimplifyEffects,
          shouldMinimizeDataUsage,
          capabilities,
          cssVariables
        });
        
        // Apply CSS variables to document root if adaptToDevice is enabled
        if (adaptToDevice) {
          const root = document.documentElement;
          Object.entries(cssVariables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
          });
        }
      } catch (error) {
        console.error('Failed to detect device capabilities:', error);
      }
    };
    
    detectPerformance();
    
    return () => {
      mounted = false;
      
      // Clean up CSS variables
      if (adaptToDevice) {
        const root = document.documentElement;
        Object.keys(state.cssVariables).forEach(key => {
          root.style.removeProperty(key);
        });
      }
    };
  }, [detectCapabilities, adaptToDevice]);
  
  // Apply optimizations
  useEffect(() => {
    if (!state.capabilities) return;
    
    const cleanupFunctions: Array<() => void> = [];
    
    // Optimize animations if enabled
    if (shouldOptimizeAnimations) {
      optimizeAnimations(state.isLowPerformance, {
        respectReducedMotion: respectUserPreferences,
        disableOnLowEnd: adaptToDevice && state.isLowPerformance,
        reduceBatterySaving: adaptToDevice && state.capabilities.isBatterySaving
      }).then(cleanup => {
        if (cleanup) cleanupFunctions.push(cleanup);
      });
    }
    
    // Optimize JavaScript if enabled
    if (shouldOptimizeJs) {
      const cleanup = optimizeJavaScript(state.isLowPerformance, {
        useIdleCallback: true,
        useWebWorkers: !state.isLowPerformance,
        debounceEvents: true,
        throttleViewportEvents: true
      });
      
      if (cleanup) cleanupFunctions.push(cleanup);
    }
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [state.capabilities, shouldOptimizeAnimations, shouldOptimizeJs, respectUserPreferences, adaptToDevice, state.isLowPerformance]);
  
  // Memoized performance class names
  const classNames = useMemo(() => {
    const classes = [];
    
    if (state.isLowPerformance) classes.push('low-performance');
    if (state.shouldReduceAnimations) classes.push('reduce-motion');
    if (state.shouldSimplifyEffects) classes.push('simplify-effects');
    if (state.shouldMinimizeDataUsage) classes.push('data-saver');
    
    return classes.join(' ');
  }, [state.isLowPerformance, state.shouldReduceAnimations, state.shouldSimplifyEffects, state.shouldMinimizeDataUsage]);
  
  // Debounced event handler creator
  const createDebouncedHandler = useCallback(<T extends (...args: any[]) => any>(
    handler: T,
    wait: number = 150
  ) => {
    return debounce(handler, wait);
  }, []);
  
  // Return performance utilities and state
  return {
    ...state,
    classNames,
    createDebouncedHandler,
    applyPerformanceProps: (additionalProps = {}) => ({
      className: classNames,
      'data-performance': state.isLowPerformance ? 'low' : 'high',
      'data-reduce-motion': state.shouldReduceAnimations ? 'true' : 'false',
      'data-simplify-effects': state.shouldSimplifyEffects ? 'true' : 'false',
      'data-data-saver': state.shouldMinimizeDataUsage ? 'true' : 'false',
      style: state.cssVariables,
      ...additionalProps
    })
  };
}

export default usePerformance;