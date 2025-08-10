'use client';

import { useEffect } from 'react';
import { optimizeImages } from '@/lib/performance-monitor';
import { systemOptimizer } from '@/lib/system-optimizer';
import { optimizePageImages, preloadCriticalImages } from '@/utils/image-optimizer';
import { optimizeScriptLoading, preloadCriticalScripts } from '@/utils/script-optimizer';
import { preloadCriticalStyles, deferNonCriticalCSS, inlineCriticalCSS, CRITICAL_CSS } from '@/utils/style-optimizer';

/**
 * This component initializes performance optimizations when mounted.
 * It should be included in the app layout to ensure optimizations are applied globally.
 */
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Inline critical CSS for faster initial render
    inlineCriticalCSS(CRITICAL_CSS);
    
    // Apply image optimizations using both methods for comprehensive coverage
    optimizeImages();
    const imageCleanup = optimizePageImages();
    
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
    
    // CSS is already imported in layout.tsx, no need to preload
    
    // Defer non-critical CSS
    deferNonCriticalCSS([
      // Non-critical stylesheet selectors
      'link[href*="cinematic.css"]',
      'link[href*="advanced-web-builder.css"]'
    ]);
    
    // The system optimizer is already initialized as a singleton when imported
    // This component ensures it's loaded in the client-side bundle
    
    console.log('Performance optimizations initialized');
    
    // Return cleanup function
    return () => {
      if (typeof imageCleanup === 'function') imageCleanup();
      if (typeof scriptCleanup === 'function') scriptCleanup();
    };
  }, []);

  // This component doesn't render anything
  return null;
}