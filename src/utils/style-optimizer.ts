/**
 * Utility functions for optimizing CSS loading and rendering
 */

/**
 * Identifies and preloads critical CSS files
 * @param criticalStylesheets Array of stylesheet URLs to preload
 */
export function preloadCriticalStyles(criticalStylesheets: string[]) {
  if (typeof window === 'undefined') return;
  
  criticalStylesheets.forEach(href => {
    // Skip if already preloaded
    if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Adds media="print" and onload handler to non-critical CSS
 * This defers non-critical CSS loading without blocking rendering
 * @param nonCriticalSelectors Array of CSS selectors for non-critical stylesheets
 */
export function deferNonCriticalCSS(nonCriticalSelectors: string[]) {
  if (typeof window === 'undefined') return;
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyStyleOptimizations(nonCriticalSelectors);
    });
  } else {
    applyStyleOptimizations(nonCriticalSelectors);
  }
}

/**
 * Apply optimizations to stylesheet links
 */
function applyStyleOptimizations(nonCriticalSelectors: string[]) {
  // Process each non-critical stylesheet
  nonCriticalSelectors.forEach(selector => {
    const links = document.querySelectorAll(selector);
    
    links.forEach(link => {
      if (!(link instanceof HTMLLinkElement) || link.hasAttribute('data-optimized')) {
        return;
      }
      
      // Save the original media value
      const originalMedia = link.media || 'all';
      
      // Set media to print to prevent rendering blocking
      link.media = 'print';
      
      // Add onload handler to apply the original media value when loaded
      link.onload = () => {
        link.media = originalMedia;
      };
      
      // Mark as optimized
      link.setAttribute('data-optimized', 'true');
    });
  });
}

/**
 * Inlines critical CSS to improve First Contentful Paint
 * @param criticalCSS String containing critical CSS rules
 */
export function inlineCriticalCSS(criticalCSS: string) {
  if (typeof window === 'undefined' || !criticalCSS) return;
  
  // Check if critical CSS is already inlined
  if (document.querySelector('style[data-critical="true"]')) {
    return;
  }
  
  // Create style element
  const style = document.createElement('style');
  style.setAttribute('data-critical', 'true');
  style.textContent = criticalCSS;
  
  // Insert at the beginning of head for highest priority
  if (document.head.firstChild) {
    document.head.insertBefore(style, document.head.firstChild);
  } else {
    document.head.appendChild(style);
  }
}

/**
 * Critical CSS for above-the-fold content
 * This should contain minimal CSS needed for initial render
 */
export const CRITICAL_CSS = `
  /* Base styles for initial render */
  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-inter), sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Navbar styles */
  nav {
    display: flex;
    align-items: center;
    padding: 1rem;
  }
  
  /* Hero section styles */
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem 1rem;
  }
  
  /* Basic typography */
  h1, h2, h3 {
    margin-top: 0;
  }
  
  /* Basic button styles */
  button, .button {
    cursor: pointer;
    display: inline-block;
  }
`;