'use client';

import { useEffect, memo, useState, useCallback } from 'react';
import { optimizeImages } from '@/lib/performance-monitor';
import { systemOptimizer } from '@/lib/system-optimizer';
import { optimizePageImages, preloadCriticalImages, optimizeBackgroundImages } from '@/utils/image-optimizer';
import { optimizeScriptLoading, preloadCriticalScripts } from '@/utils/script-optimizer';
import { preloadCriticalStyles, deferNonCriticalCSS, inlineCriticalCSS, CRITICAL_CSS } from '@/utils/style-optimizer';
import { optimizeFontLoading } from '@/utils/font-optimizer';
import { optimizeAnimations, optimizeCssAnimations } from '@/utils/animation-optimizer';
import { optimizeJavaScript } from '@/utils/js-optimizer';
import { optimizeNetwork as optimizeNetworkUtil } from '@/utils/network-optimizer';
import { initializePerformanceOptimizations, detectDeviceCapabilities } from '@/utils/performance-optimizer';

/**
 * This component initializes performance optimizations when mounted.
 * It should be included in the app layout to ensure optimizations are applied globally.
 */
interface PerformanceOptimizerProps {
  children?: React.ReactNode;
  disableAnimations?: boolean;
  lowPerformanceMode?: boolean;
  enableIntersectionObserver?: boolean;
  /** Whether to optimize fonts */
  optimizeFonts?: boolean;
  /** Whether to optimize JavaScript execution */
  enableJavaScriptOptimization?: boolean;
  /** Whether to optimize network requests */
  optimizeNetwork?: boolean;
  /** Whether to respect user preferences (reduced motion, data saver, etc.) */
  respectUserPreferences?: boolean;
}

function PerformanceOptimizer({
  children,
  disableAnimations = false,
  lowPerformanceMode = false,
  enableIntersectionObserver = false,
  optimizeFonts = true,
  enableJavaScriptOptimization = true,
  optimizeNetwork = true,
  respectUserPreferences = true,
}: PerformanceOptimizerProps = {}) {
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(!enableIntersectionObserver);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Detect low performance devices
  useEffect(() => {
    // Use the new detectDeviceCapabilities utility
    detectDeviceCapabilities().then(capabilities => {
      const isLowEnd = capabilities.isLowEnd || 
                       capabilities.isBatterySaving || 
                       capabilities.prefersReducedData || 
                       lowPerformanceMode;
      
      setIsLowPerfDevice(isLowEnd);
      
      // Apply CSS variables for performance adaptations
      const root = document.documentElement;
      root.style.setProperty('--device-performance', isLowEnd ? 'low' : 'high');
      root.style.setProperty('--reduce-motion', isLowEnd || disableAnimations ? 'reduce' : 'no-preference');
      root.style.setProperty('--animation-speed', isLowEnd ? '0.5' : '1');
      root.style.setProperty('--animation-complexity', isLowEnd ? '0.5' : '1');
      root.style.setProperty('--effect-intensity', isLowEnd ? '0.6' : '1');
      root.style.setProperty('--disable-effects', isLowEnd || disableAnimations ? '1' : '0');
    });
  }, [lowPerformanceMode, disableAnimations]);

  // Setup intersection observer for lazy rendering
  useEffect(() => {
    if (!enableIntersectionObserver || !containerRef) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Load when within 200px of viewport
        threshold: 0.01,
      }
    );

    observer.observe(containerRef);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, enableIntersectionObserver]);

  // Apply global performance optimizations
  useEffect(() => {
    // Initialize comprehensive performance optimizations
    let cleanupFunctions: Array<() => void> = [];
    
    // Inline critical CSS for faster initial render
    inlineCriticalCSS(CRITICAL_CSS);
    
    // Apply image optimizations using both methods for comprehensive coverage
    optimizeImages();
    const imageCleanup = optimizePageImages();
    optimizeBackgroundImages(); // No cleanup function returned
    
    // Preload critical images
    preloadCriticalImages([
      '/images/ventaro-logo.svg',
      '/images/hero-background.webp',
      '/images/elite-benefits-bg.webp'
    ]);
    
    // Optimize script loading
    const scriptCleanup = optimizeScriptLoading([
      // Critical scripts that should not be deferred
      'gtag',
      'analytics'
    ]);
    
    // Preload critical scripts
    preloadCriticalScripts([
      // Add any critical scripts here
    ]);
    
    // Defer non-critical CSS
    deferNonCriticalCSS([
      // Non-critical stylesheet selectors
      'link[href*="cinematic.css"]',
      'link[href*="advanced-web-builder.css"]'
    ]);
    
    // Apply new optimizations
    if (optimizeFonts) {
      const fontCleanup = optimizeFontLoading();
      if (typeof fontCleanup === 'function') cleanupFunctions.push(fontCleanup);
    }
    
    if (!disableAnimations) {
      // Using detectDeviceCapabilities().isLowEnd directly is recommended, but we'll pass isLowPerfDevice for now
      // as it already includes the result of detectDeviceCapabilities().isLowEnd
      const animationCleanup = optimizeAnimations(isLowPerfDevice === true);
      const cssAnimationCleanup = optimizeCssAnimations(isLowPerfDevice === true);
      if (typeof animationCleanup === 'function') cleanupFunctions.push(animationCleanup);
      if (typeof cssAnimationCleanup === 'function') cleanupFunctions.push(cssAnimationCleanup);
    }
    
    if (enableJavaScriptOptimization) {
      // Use the imported optimizeJavaScript utility, not the prop with the same name
      // Using detectDeviceCapabilities().isLowEnd directly is recommended, but we'll pass isLowPerfDevice for now
      // as it already includes the result of detectDeviceCapabilities().isLowEnd
      try {
        const jsCleanup = optimizeJavaScript(isLowPerfDevice === true);
        if (typeof jsCleanup === 'function') cleanupFunctions.push(jsCleanup);
      } catch (error) {
        console.error('Error optimizing JavaScript:', error);
      }
    }
    
    if (optimizeNetwork) {
      // Using detectDeviceCapabilities().isLowEnd directly is recommended, but we'll pass isLowPerfDevice for now
      // as it already includes the result of detectDeviceCapabilities().isLowEnd
      const networkCleanup = optimizeNetworkUtil(isLowPerfDevice === true);
      if (typeof networkCleanup === 'function') cleanupFunctions.push(networkCleanup);
    }
    
    // Initialize comprehensive performance optimizations
    initializePerformanceOptimizations({
      optimizeImages: true,
      optimizeFonts,
      optimizeAnimations: !disableAnimations,
      optimizeJavaScript: enableJavaScriptOptimization,
      optimizeNetwork,
      respectUserPreferences,
      adaptToDevice: true,
      logPerformance: process.env.NODE_ENV === 'development'
    }).then(cleanupFn => {
      if (typeof cleanupFn === 'function') cleanupFunctions.push(cleanupFn as () => void);
    });
    
    console.log('Performance optimizations initialized');
    
    // Return cleanup function
    return () => {
      if (typeof imageCleanup === 'function') imageCleanup();
      if (typeof scriptCleanup === 'function') scriptCleanup();
      
      // Execute all cleanup functions
      cleanupFunctions.forEach(cleanup => cleanup());
      
      // Reset variables when component unmounts
      document.documentElement.style.removeProperty('--reduce-motion');
      document.documentElement.style.removeProperty('--animation-speed');
      document.documentElement.style.removeProperty('--disable-effects');
      document.documentElement.style.removeProperty('--device-performance');
      document.documentElement.style.removeProperty('--animation-complexity');
      document.documentElement.style.removeProperty('--effect-intensity');
    };
  }, [isLowPerfDevice, disableAnimations, optimizeFonts, optimizeJavaScript, optimizeNetwork, respectUserPreferences]);

  // If no children, this component doesn't render anything visible
  if (!children) return null;
  
  return (
    <div
      ref={setContainerRef}
      className={`performance-optimizer ${isLowPerfDevice ? 'low-perf-mode' : ''}`}
      data-perf-mode={isLowPerfDevice ? 'low' : 'normal'}
      data-animations-disabled={disableAnimations ? 'true' : 'false'}
      data-performance-optimized="true"
    >
      {(!enableIntersectionObserver || isVisible) && children}
    </div>
  );
}

export default memo(PerformanceOptimizer);