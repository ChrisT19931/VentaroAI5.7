/**
 * Animation optimization utilities for improving web performance
 */

import { detectDeviceCapabilities } from './performance-optimizer';

/**
 * Configuration options for animation optimization
 */
export interface AnimationOptimizerConfig {
  /** Whether to respect user's reduced motion preference */
  respectReducedMotion?: boolean;
  /** Whether to disable animations on low-end devices */
  disableOnLowEnd?: boolean;
  /** Whether to reduce animation complexity on battery-saving mode */
  reduceBatterySaving?: boolean;
  /** Maximum FPS to target (null for no limit) */
  maxFps?: number | null;
  /** CSS variable name to control animation speed multiplier */
  cssSpeedVariable?: string;
  /** CSS variable name to control animation complexity */
  cssComplexityVariable?: string;
}

/**
 * Default configuration for animation optimizer
 */
const DEFAULT_CONFIG: AnimationOptimizerConfig = {
  respectReducedMotion: true,
  disableOnLowEnd: true,
  reduceBatterySaving: true,
  maxFps: null,
  cssSpeedVariable: '--animation-speed-multiplier',
  cssComplexityVariable: '--animation-complexity'
};

/**
 * Detects if the device is likely a low-end device
 * @deprecated Use detectDeviceCapabilities().isLowEnd from performance-optimizer.ts instead
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for memory constraints
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;
  
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) return true;
  
  // Check for connection type
  const connection = (navigator as any).connection;
  if (connection && 
      (connection.effectiveType === 'slow-2g' || 
       connection.effectiveType === '2g')) {
    return true;
  }
  
  return false;
}

/**
 * Detects if the device is in battery saving mode
 */
export async function isBatterySaving(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if Battery API is available
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      
      // Consider battery saving if discharging and below 30%
      if (!battery.charging && battery.level < 0.3) {
        return true;
      }
    }
    
    // Check for Data Saver mode
    const connection = (navigator as any).connection;
    if (connection && connection.saveData) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('Failed to detect battery saving mode:', error);
    return false;
  }
}

/**
 * Optimizes animations based on device capabilities and user preferences
 * @param isLowPerformance Whether the device is a low-performance device
 * @deprecated Use detectDeviceCapabilities().isLowEnd instead for consistency across the application
 * @param config Configuration options
 */
export async function optimizeAnimations(isLowPerformance: boolean = false, config: AnimationOptimizerConfig = DEFAULT_CONFIG): Promise<() => void> {
  if (typeof window === 'undefined') return () => {};
  
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const root = document.documentElement;
  
  // Default values
  let speedMultiplier = 1;
  let complexity = 1;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (mergedConfig.respectReducedMotion && prefersReducedMotion) {
    speedMultiplier = 0.5; // Slower animations
    complexity = 0.3; // Simpler animations
    
    // Add class to body for CSS targeting
    document.body.classList.add('reduced-motion');
  }
  
  // Check for low-end device
  // Note: We now accept isLowEnd as a parameter instead of calling isLowEndDevice() directly
  if (mergedConfig.disableOnLowEnd && (isLowPerformance || await detectDeviceCapabilities().then(caps => caps.isLowEnd))) {
    speedMultiplier = 0.7; // Even slower animations
    complexity = 0.5; // Even simpler animations
    
    // Add class to body for CSS targeting
    document.body.classList.add('low-end-device');
  }
  
  // Check for battery saving mode
  if (mergedConfig.reduceBatterySaving && await isBatterySaving()) {
    speedMultiplier = Math.min(speedMultiplier, 0.8); // Reduce speed if not already lower
    complexity = Math.min(complexity, 0.6); // Reduce complexity if not already lower
    
    // Add class to body for CSS targeting
    document.body.classList.add('battery-saving');
  }
  
  // Apply CSS variables
  if (mergedConfig.cssSpeedVariable) {
    root.style.setProperty(mergedConfig.cssSpeedVariable, speedMultiplier.toString());
  }
  
  if (mergedConfig.cssComplexityVariable) {
    root.style.setProperty(mergedConfig.cssComplexityVariable, complexity.toString());
  }
  
  // Apply FPS limiting if specified
  let rafId: number | null = null;
  let lastFrameTime = 0;
  
  if (mergedConfig.maxFps && mergedConfig.maxFps > 0) {
    const frameInterval = 1000 / mergedConfig.maxFps;
    
    // Override requestAnimationFrame to limit FPS
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      const currentTime = performance.now();
      const timeUntilNextFrame = Math.max(0, frameInterval - (currentTime - lastFrameTime));
      
      if (timeUntilNextFrame <= 0) {
        lastFrameTime = currentTime;
        return originalRAF(callback);
      } else {
        return window.setTimeout(() => {
          lastFrameTime = performance.now();
          callback(lastFrameTime);
        }, timeUntilNextFrame);
      }
    };
  }
  
  // Return cleanup function
  return () => {
    // Remove classes
    document.body.classList.remove('reduced-motion', 'low-end-device', 'battery-saving');
    
    // Reset CSS variables
    if (mergedConfig.cssSpeedVariable) {
      root.style.removeProperty(mergedConfig.cssSpeedVariable);
    }
    
    if (mergedConfig.cssComplexityVariable) {
      root.style.removeProperty(mergedConfig.cssComplexityVariable);
    }
    
    // Restore original requestAnimationFrame if it was modified
    if (mergedConfig.maxFps && mergedConfig.maxFps > 0) {
      window.requestAnimationFrame = window.requestAnimationFrame;
    }
  };
}

/**
 * Optimizes CSS animations by adding will-change property to elements
 * that are likely to be animated
 * @param selectorsOrLowEnd CSS selectors for elements that will be animated or a boolean indicating if device is low-end
 * @deprecated When using boolean parameter, use detectDeviceCapabilities().isLowEnd instead for consistency across the application
 */
export function optimizeCssAnimations(selectorsOrLowEnd: string[] | boolean = [
  '.animated', 
  '.transition', 
  '[data-animate]'
]): () => void {
  if (typeof window === 'undefined') return () => {};
  
  // Don't apply will-change to too many elements as it can cause performance issues
  const MAX_ELEMENTS = 20;
  const optimizedElements = new Set<Element>();
  
  // Default selectors
  const defaultSelectors = [
    '.animated', 
    '.transition', 
    '[data-animate]'
  ];
  
  // Handle boolean parameter (for backward compatibility)
  // If it's a boolean, use default selectors. If it's false, return early
  if (typeof selectorsOrLowEnd === 'boolean') {
    if (!selectorsOrLowEnd) return () => {}; // If false, don't optimize
    // If true, use default selectors
    selectorsOrLowEnd = defaultSelectors;
  }
  
  // At this point, selectorsOrLowEnd is guaranteed to be an array
  const selectors = selectorsOrLowEnd as string[];
  
  // Find elements matching selectors
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (optimizedElements.size < MAX_ELEMENTS && !optimizedElements.has(el)) {
        // Get computed style to determine what properties are being animated
        const style = window.getComputedStyle(el);
        const animationName = style.animationName;
        const transition = style.transition;
        
        // Only apply will-change if element has animations or transitions
        if (animationName !== 'none' || transition !== 'none') {
          // Determine which properties to optimize
          const properties: string[] = [];
          
          if (transition !== 'none' && transition !== '') {
            // Extract properties from transition
            const transitionProps = transition.split(',').map(t => t.trim().split(' ')[0]);
            properties.push(...transitionProps);
          }
          
          // Add transform and opacity as common animation properties
          if (!properties.includes('transform')) properties.push('transform');
          if (!properties.includes('opacity')) properties.push('opacity');
          
          // Apply will-change
          (el as HTMLElement).style.willChange = properties.join(', ');
          optimizedElements.add(el);
        }
      }
    });
  });
  
  // Set up observer to detect when animations complete
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'class' && 
          mutation.target instanceof Element) {
        
        const target = mutation.target;
        
        // Check if element still has animation classes
        const hasAnimationClass = selectors.some(selector => {
          if (selector.startsWith('.')) {
            return target.classList.contains(selector.substring(1));
          }
          return target.matches(selector);
        });
        
        // If animation is complete, remove will-change
        if (!hasAnimationClass && optimizedElements.has(target)) {
          (target as HTMLElement).style.willChange = 'auto';
          optimizedElements.delete(target);
        }
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true
  });
  
  // Return cleanup function
  return () => {
    observer.disconnect();
    
    // Reset will-change on all optimized elements
    optimizedElements.forEach(el => {
      (el as HTMLElement).style.willChange = 'auto';
    });
    
    optimizedElements.clear();
  };
}