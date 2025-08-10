/**
 * Utility functions for optimizing script loading
 */

/**
 * Adds defer attribute to non-critical scripts to improve page load performance
 * @param criticalScriptUrls Array of script URLs that should NOT be deferred
 */
export function optimizeScriptLoading(criticalScriptUrls: string[] = []) {
  if (typeof window === 'undefined') return () => {};
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyScriptOptimizations(criticalScriptUrls);
    });
    return () => {}; // Return empty cleanup function for DOMContentLoaded case
  } else {
    return applyScriptOptimizations(criticalScriptUrls);
  }
}

/**
 * Apply optimizations to script tags
 */
function applyScriptOptimizations(criticalScriptUrls: string[]) {
  // Get all script tags
  const scripts = document.querySelectorAll('script[src]');
  
  scripts.forEach(script => {
    const src = script.getAttribute('src') || '';
    
    // Skip if this is a critical script
    if (criticalScriptUrls.some(url => src.includes(url))) {
      return;
    }
    
    // Skip if already has defer or async
    if (script.hasAttribute('defer') || script.hasAttribute('async')) {
      return;
    }
    
    // Add defer attribute to non-critical scripts
    script.setAttribute('defer', '');
    
    // Mark as optimized
    script.setAttribute('data-optimized', 'true');
  });
  
  // Set up observer for dynamically added scripts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is a script
          if (node.nodeName === 'SCRIPT') {
            const script = node as HTMLScriptElement;
            const src = script.getAttribute('src') || '';
            
            // Skip if this is a critical script
            if (!src || criticalScriptUrls.some(url => src.includes(url))) {
              return;
            }
            
            // Skip if already has defer or async
            if (script.hasAttribute('defer') || script.hasAttribute('async')) {
              return;
            }
            
            // Add defer attribute
            script.setAttribute('defer', '');
            
            // Mark as optimized
            script.setAttribute('data-optimized', 'true');
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.head, {
    childList: true,
    subtree: true
  });
  
  return () => {
    // Cleanup function to disconnect observer
    observer.disconnect();
  };
}

/**
 * Preloads critical JavaScript files
 * @param scriptUrls Array of script URLs to preload
 */
export function preloadCriticalScripts(scriptUrls: string[]) {
  if (typeof window === 'undefined') return;
  
  scriptUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = url;
    document.head.appendChild(link);
  });
}