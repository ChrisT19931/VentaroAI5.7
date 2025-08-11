/**
 * Main performance optimization module that integrates all optimization utilities
 */

import { optimizePageImages, preloadCriticalImages } from './image-optimizer';
import { optimizeBackgroundImages } from './image-optimizer';
import { preloadCriticalFonts, optimizeFontLoading, loadFontsProgressively } from './font-optimizer';
import { optimizeAnimations, optimizeCssAnimations } from './animation-optimizer';
import { optimizeJavaScript, scheduleIdleTask } from './js-optimizer';
import { optimizeNetwork, prefetchResources } from './network-optimizer';

/**
 * Configuration options for the performance optimizer
 */
export interface PerformanceOptimizerConfig {
  /** Whether to optimize images */
  optimizeImages?: boolean;
  /** Whether to optimize fonts */
  optimizeFonts?: boolean;
  /** Whether to optimize animations */
  optimizeAnimations?: boolean;
  /** Whether to optimize JavaScript execution */
  optimizeJavaScript?: boolean;
  /** Whether to optimize network requests */
  optimizeNetwork?: boolean;
  /** Whether to optimize CSS */
  optimizeCSS?: boolean;
  /** Whether to respect user preferences (reduced motion, data saver, etc.) */
  respectUserPreferences?: boolean;
  /** Whether to adapt optimizations based on device capabilities */
  adaptToDevice?: boolean;
  /** Whether to log performance metrics */
  logPerformance?: boolean;
}

/**
 * Default configuration for the performance optimizer
 */
const DEFAULT_CONFIG: PerformanceOptimizerConfig = {
  optimizeImages: true,
  optimizeFonts: true,
  optimizeAnimations: true,
  optimizeJavaScript: true,
  optimizeNetwork: true,
  optimizeCSS: true,
  respectUserPreferences: true,
  adaptToDevice: true,
  logPerformance: false
};

/**
 * Device capability detection results
 */
export interface DeviceCapabilities {
  /** Whether the device is a low-end device */
  isLowEnd: boolean;
  /** Whether the device is in battery saving mode */
  isBatterySaving: boolean;
  /** Whether the user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Whether the user prefers reduced data usage */
  prefersReducedData: boolean;
  /** The effective connection type */
  connectionType: string;
  /** The device memory in GB */
  memory: number;
  /** The number of CPU cores */
  cpuCores: number;
}

/**
 * Detects device capabilities for adaptive optimizations
 */
export async function detectDeviceCapabilities(): Promise<DeviceCapabilities> {
  if (typeof window === 'undefined') {
    return {
      isLowEnd: false,
      isBatterySaving: false,
      prefersReducedMotion: false,
      prefersReducedData: false,
      connectionType: 'unknown',
      memory: 8, // Default to 8GB
      cpuCores: 4  // Default to 4 cores
    };
  }
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Check for memory constraints
  const memory = (navigator as any).deviceMemory || 8;
  
  // Check for hardware concurrency (CPU cores)
  const cpuCores = navigator.hardwareConcurrency || 4;
  
  // Check for connection type and data saver mode
  let connectionType = 'unknown';
  let prefersReducedData = false;
  
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    connectionType = connection?.effectiveType || 'unknown';
    prefersReducedData = connection?.saveData || false;
  }
  
  // Determine if it's a low-end device
  const isLowEnd = memory < 4 || cpuCores < 4 || 
                  connectionType === 'slow-2g' || 
                  connectionType === '2g';
  
  // Check for battery status
  let isBatterySaving = false;
  
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      isBatterySaving = !battery.charging && battery.level < 0.3;
    }
  } catch (error) {
    console.warn('Failed to detect battery status:', error);
  }
  
  return {
    isLowEnd,
    isBatterySaving,
    prefersReducedMotion,
    prefersReducedData,
    connectionType,
    memory,
    cpuCores
  };
}

/**
 * Logs performance metrics to help identify optimization opportunities
 */
export function logPerformanceMetrics(): void {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return;
  
  // Wait for the page to fully load
  window.addEventListener('load', () => {
    scheduleIdleTask(() => {
      // Get performance entries
      const entries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      const resourceEntries = performance.getEntriesByType('resource');
      
      // Calculate key metrics
      const metrics = {
        // Navigation timing
        domInteractive: entries.domInteractive,
        domContentLoaded: entries.domContentLoadedEventEnd,
        loadComplete: entries.loadEventEnd,
        timeToFirstByte: entries.responseStart - entries.requestStart,
        
        // Paint timing
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        
        // Resource timing
        resourceCount: resourceEntries.length,
        totalResourceSize: resourceEntries.reduce((total, entry) => total + ((entry as any).transferSize || 0), 0) / 1024, // KB
        slowestResources: resourceEntries
          .filter(entry => entry.duration > 500) // Resources taking more than 500ms
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 5)
          .map(entry => ({
            name: entry.name,
            duration: Math.round(entry.duration),
            size: Math.round(((entry as any).transferSize || 0) / 1024) // KB
          }))
      };
      
      console.log('Performance Metrics:', metrics);
      
      // Identify optimization opportunities
      const opportunities = [];
      
      if (metrics.firstContentfulPaint > 2000) {
        opportunities.push('Improve First Contentful Paint (currently > 2s)');
      }
      
      if (metrics.loadComplete > 5000) {
        opportunities.push('Reduce page load time (currently > 5s)');
      }
      
      if (metrics.totalResourceSize > 2000) {
        opportunities.push('Reduce total resource size (currently > 2MB)');
      }
      
      if (metrics.slowestResources.length > 0) {
        opportunities.push('Optimize slow resources: ' + 
          metrics.slowestResources.map(r => `${r.name.split('/').pop()} (${r.duration}ms, ${r.size}KB)`).join(', '));
      }
      
      if (opportunities.length > 0) {
        console.log('Optimization Opportunities:', opportunities);
      }
    });
  });
}

/**
 * Initializes all performance optimizations
 * @param config Configuration options
 */
export async function initializePerformanceOptimizations(
  config: PerformanceOptimizerConfig = DEFAULT_CONFIG
): Promise<() => void> {
  if (typeof window === 'undefined') return () => {};
  
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const cleanupFunctions: Array<() => void> = [];
  
  // Detect device capabilities for adaptive optimizations
  const capabilities = mergedConfig.adaptToDevice ? 
    await detectDeviceCapabilities() : 
    null;
  
  // Apply CSS variables for adaptive styling
  if (capabilities && mergedConfig.adaptToDevice) {
    const root = document.documentElement;
    
    // Set performance-related CSS variables
    root.style.setProperty('--device-performance', capabilities.isLowEnd ? 'low' : 'high');
    root.style.setProperty('--reduced-motion', capabilities.prefersReducedMotion ? 'true' : 'false');
    root.style.setProperty('--reduced-data', capabilities.prefersReducedData ? 'true' : 'false');
    
    // Add data attributes for CSS targeting
    document.body.setAttribute('data-device-performance', capabilities.isLowEnd ? 'low' : 'high');
    if (capabilities.prefersReducedMotion) document.body.setAttribute('data-reduced-motion', 'true');
    if (capabilities.prefersReducedData) document.body.setAttribute('data-reduced-data', 'true');
    
    // Add cleanup function
    cleanupFunctions.push(() => {
      root.style.removeProperty('--device-performance');
      root.style.removeProperty('--reduced-motion');
      root.style.removeProperty('--reduced-data');
      document.body.removeAttribute('data-device-performance');
      document.body.removeAttribute('data-reduced-motion');
      document.body.removeAttribute('data-reduced-data');
    });
  }
  
  // Optimize images
  if (mergedConfig.optimizeImages) {
    const cleanupImages = optimizePageImages();
    if (typeof cleanupImages === 'function') {
      cleanupFunctions.push(cleanupImages);
    }
    
    // Preload critical images
    const criticalImages = Array.from(document.querySelectorAll('img[data-critical="true"]'))
      .map(img => (img as HTMLImageElement).src);
    
    if (criticalImages.length > 0) {
      preloadCriticalImages(criticalImages);
    }
  }
  
  // Optimize fonts
  if (mergedConfig.optimizeFonts) {
    const cleanupFonts = optimizeFontLoading();
    if (typeof cleanupFonts === 'function') {
      cleanupFunctions.push(cleanupFonts);
    }
    
    // Load fonts progressively based on importance
    const fontConfig = {
      critical: Array.from(document.querySelectorAll('link[rel="preload"][as="font"][data-importance="critical"]'))
        .map(link => (link as HTMLLinkElement).href),
      secondary: Array.from(document.querySelectorAll('link[rel="preload"][as="font"][data-importance="secondary"]'))
        .map(link => (link as HTMLLinkElement).href),
      optional: Array.from(document.querySelectorAll('link[rel="preload"][as="font"][data-importance="optional"]'))
        .map(link => (link as HTMLLinkElement).href)
    };
    
    loadFontsProgressively(fontConfig);
  }
  
  // Optimize animations
  if (mergedConfig.optimizeAnimations) {
    const cleanupAnimations = await optimizeAnimations(
      capabilities?.isLowEnd || false,
      {
        respectReducedMotion: mergedConfig.respectUserPreferences,
        disableOnLowEnd: mergedConfig.adaptToDevice && capabilities?.isLowEnd,
        reduceBatterySaving: mergedConfig.adaptToDevice && capabilities?.isBatterySaving
      }
    );
    
    if (typeof cleanupAnimations === 'function') {
      cleanupFunctions.push(cleanupAnimations);
    }
    
    // Optimize CSS animations
    const cleanupCssAnimations = optimizeCssAnimations();
    if (typeof cleanupCssAnimations === 'function') {
      cleanupFunctions.push(cleanupCssAnimations);
    }
  }
  
  // Optimize JavaScript
  if (mergedConfig.optimizeJavaScript) {
    const cleanupJs = optimizeJavaScript(
      capabilities?.isLowEnd || false,
      {
        useIdleCallback: true,
        useWebWorkers: !capabilities?.isLowEnd, // Disable web workers on low-end devices
        debounceEvents: true,
        throttleViewportEvents: true
      }
    );
    
    cleanupFunctions.push(cleanupJs);
  }
  
  // Optimize network
  if (mergedConfig.optimizeNetwork) {
    const cleanupNetwork = optimizeNetwork(
      capabilities?.isLowEnd || false,
      {
        useCache: true,
        connectionAware: mergedConfig.adaptToDevice,
        prefetchCritical: true,
        useCompression: true
      }
    );
    
    cleanupFunctions.push(cleanupNetwork);
  }
  
  // Log performance metrics
  if (mergedConfig.logPerformance) {
    logPerformanceMetrics();
  }
  
  // Return cleanup function that calls all individual cleanup functions
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}

/**
 * Hook to initialize performance optimizations in React components
 * @param config Configuration options
 */
export function usePerformanceOptimizations(
  config: PerformanceOptimizerConfig = DEFAULT_CONFIG
): void {
  if (typeof window === 'undefined') return;
  
  // Use React's useEffect hook if available, otherwise use a simple implementation
  const useEffect = (window as any).React?.useEffect || ((effect: () => (() => void) | void) => {
    // Simple implementation for non-React environments
    let cleanup: (() => void) | void;
    
    // Run effect
    cleanup = effect();
    
    // Return cleanup function
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  });
  
  useEffect(() => {
    // Initialize optimizations
    let cleanup: (() => void) | null = null;
    
    initializePerformanceOptimizations(config).then(cleanupFn => {
      cleanup = cleanupFn;
    });
    
    // Return cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, []); // Empty dependency array means this runs once on mount
}

/**
 * Exports a default function to initialize all performance optimizations
 * This can be used in non-React environments
 */
export default function initializeOptimizations(
  config: PerformanceOptimizerConfig = DEFAULT_CONFIG
): Promise<() => void> {
  return initializePerformanceOptimizations(config);
}