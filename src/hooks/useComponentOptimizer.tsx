'use client';

import { useEffect, useRef, useState } from 'react';
import { applyCssVariables } from '../utils/css-optimizer';
import { optimizeAnimations } from '../utils/animation-optimizer';
import { optimizeJavaScript } from '../utils/js-optimizer';
import { detectDeviceCapabilities } from '../utils/performance-optimizer';

interface ComponentOptimizerOptions {
  /** Whether to optimize animations */
  optimizeAnimations?: boolean;
  /** Whether to optimize JavaScript */
  optimizeJavaScript?: boolean;
  /** Whether to apply CSS variables */
  applyCssVariables?: boolean;
  /** Whether to measure render time */
  measureRenderTime?: boolean;
  /** Threshold in milliseconds for warning about slow renders */
  renderTimeThreshold?: number;
  /** Custom CSS variables to apply */
  cssVariables?: Record<string, string>;
}

/**
 * Hook for optimizing React components with performance monitoring
 * @param componentName Name of the component for logging
 * @param options Optimization options
 */
const useComponentOptimizer = (
  componentName: string,
  options: ComponentOptimizerOptions = {}
) => {
  const {
    optimizeAnimations: shouldOptimizeAnimations = true,
    optimizeJavaScript: shouldOptimizeJavaScript = true,
    applyCssVariables: shouldApplyCssVariables = true,
    measureRenderTime = process.env.NODE_ENV === 'development',
    renderTimeThreshold = 16, // 60fps threshold
    cssVariables = {},
  } = options;
  
  // Store device capabilities
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isLowEnd: false,
    isBatterySaving: false,
    prefersReducedMotion: false,
    prefersReducedData: false,
    connectionType: 'unknown',
    memory: 8,
    cpuCores: 4
  });
  
  // Refs for performance measurement
  const renderStartTimeRef = useRef(0);
  const renderCountRef = useRef(0);
  const totalRenderTimeRef = useRef(0);
  
  // Detect device capabilities on mount
  useEffect(() => {
    const detectCapabilities = async () => {
      const capabilities = await detectDeviceCapabilities();
      // Map the DeviceCapabilities properties to our state
      setDeviceCapabilities({
        isLowEnd: capabilities.isLowEnd,
        isBatterySaving: capabilities.isBatterySaving,
        prefersReducedMotion: capabilities.prefersReducedMotion,
        prefersReducedData: capabilities.prefersReducedData,
        connectionType: capabilities.connectionType,
        memory: capabilities.memory,
        cpuCores: capabilities.cpuCores
      });
      
      // Apply CSS variables if enabled
      if (shouldApplyCssVariables) {
        applyCssVariables(
          capabilities.isLowEnd,
          capabilities.isBatterySaving,
          capabilities.prefersReducedMotion,
          cssVariables
        );
      }
      
      // Optimize animations if enabled
      if (shouldOptimizeAnimations) {
        optimizeAnimations(capabilities.isLowEnd, {
          disableOnLowEnd: capabilities.isLowEnd,
          reduceBatterySaving: capabilities.isBatterySaving,
          respectReducedMotion: capabilities.prefersReducedMotion,
        });
      }
      
      // Optimize JavaScript if enabled
      if (shouldOptimizeJavaScript) {
        optimizeJavaScript(capabilities.isLowEnd, {
          useIdleCallback: !capabilities.isLowEnd,
          useWebWorkers: !capabilities.isLowEnd,
          debounceEvents: true,
          throttleViewportEvents: true,
        });
      }
    };
    
    detectCapabilities();
  }, [shouldApplyCssVariables, shouldOptimizeAnimations, shouldOptimizeJavaScript, cssVariables]);
  
  // Measure render time if enabled
  useEffect(() => {
    if (measureRenderTime) {
      renderStartTimeRef.current = performance.now();
      
      return () => {
        const renderTime = performance.now() - renderStartTimeRef.current;
        renderCountRef.current += 1;
        totalRenderTimeRef.current += renderTime;
        
        if (renderTime > renderTimeThreshold) {
          console.warn(
            `[slow-render] ${componentName} took ${renderTime.toFixed(2)}ms to render ` +
            `(threshold: ${renderTimeThreshold}ms, render #${renderCountRef.current})`
          );
        }
        
        // Log average render time every 10 renders
        if (renderCountRef.current % 10 === 0) {
          const avgRenderTime = totalRenderTimeRef.current / renderCountRef.current;
          console.log(
            `[perf-stats] ${componentName} average render time: ${avgRenderTime.toFixed(2)}ms ` +
            `over ${renderCountRef.current} renders`
          );
        }
      };
    }
  });
  
  return {
    ...deviceCapabilities,
    renderCount: renderCountRef.current,
  };
};

export default useComponentOptimizer;