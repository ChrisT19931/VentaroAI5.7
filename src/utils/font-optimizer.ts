/**
 * Font optimization utilities for improving web performance
 */

/**
 * Preloads critical fonts to improve perceived performance
 * @param fontPaths Array of font paths to preload
 * @param fontDisplay Optional font-display strategy (swap, block, fallback, optional)
 */
export function preloadCriticalFonts(fontPaths: string[], fontDisplay: string = 'swap') {
  if (typeof window === 'undefined') return;
  
  fontPaths.forEach(path => {
    // Skip if already preloaded
    if (document.querySelector(`link[rel="preload"][href="${path}"]`)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = path;
    link.crossOrigin = 'anonymous';
    link.setAttribute('data-font-display', fontDisplay);
    document.head.appendChild(link);
  });
}

/**
 * Optimizes font loading by applying font-display strategy and preloading critical fonts
 */
export function optimizeFontLoading() {
  if (typeof window === 'undefined') return;
  
  // Apply font-display: swap to all font faces
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap !important;
    }
  `;
  document.head.appendChild(style);
  
  // Detect if the user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Apply font optimization based on user preferences
  if (prefersReducedMotion) {
    // For users who prefer reduced motion, use system fonts initially
    const reducedMotionStyle = document.createElement('style');
    reducedMotionStyle.textContent = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
      }
    `;
    document.head.appendChild(reducedMotionStyle);
    
    // After a delay, remove the system font override
    setTimeout(() => {
      document.head.removeChild(reducedMotionStyle);
    }, 1000);
  }
  
  return () => {
    // Cleanup function
    if (style.parentNode) {
      document.head.removeChild(style);
    }
  };
}

/**
 * Loads fonts progressively based on network conditions
 * @param fontConfig Configuration for progressive font loading
 */
export function loadFontsProgressively(fontConfig: {
  critical: string[];
  secondary: string[];
  optional: string[];
}) {
  if (typeof window === 'undefined') return;
  
  // Check network conditions
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && 
    (connection.effectiveType === 'slow-2g' || 
     connection.effectiveType === '2g' || 
     connection.saveData);
  
  // Always load critical fonts
  preloadCriticalFonts(fontConfig.critical, 'swap');
  
  // Load secondary fonts based on network conditions
  if (!isSlowConnection) {
    setTimeout(() => {
      preloadCriticalFonts(fontConfig.secondary, 'optional');
    }, 1000); // 1 second delay for secondary fonts
  }
  
  // Load optional fonts only on fast connections and after initial page load
  if (!isSlowConnection) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloadCriticalFonts(fontConfig.optional, 'optional');
      }, 2000); // 2 second delay after page load for optional fonts
    });
  }
}

/**
 * Generates a font subset for critical text
 * This is a client-side utility that helps identify which characters are used
 * for potential server-side font subsetting
 * @param selector CSS selector for critical text elements
 */
export function analyzeCriticalFontUsage(selector: string = 'h1, h2, .hero-text') {
  if (typeof window === 'undefined') return { chars: '', count: 0 };
  
  const elements = document.querySelectorAll(selector);
  const charSet = new Set<string>();
  
  elements.forEach(el => {
    const text = el.textContent || '';
    for (const char of text) {
      charSet.add(char);
    }
  });
  
  const uniqueChars = Array.from(charSet).join('');
  console.log('Critical font usage analysis:', {
    uniqueCharacters: uniqueChars,
    characterCount: charSet.size
  });
  
  return {
    chars: uniqueChars,
    count: charSet.size
  };
}