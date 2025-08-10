/**
 * Utility functions for optimizing images across the site
 */

/**
 * Applies best practices for image loading to all images on the page
 * - Sets loading="lazy" for images below the fold
 * - Sets decoding="async" for all images
 * - Adds error handling with fallback
 * - Monitors for newly added images
 */
export function optimizePageImages() {
  if (typeof window === 'undefined') return;
  
  // Apply optimizations to existing images
  const applyImageOptimizations = (img: HTMLImageElement) => {
    // Skip images that already have optimizations
    if (img.hasAttribute('data-optimized')) return;
    
    // Add lazy loading for images
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
    
    // Add async decoding
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
    
    // Add error handling
    if (!img.hasAttribute('onerror')) {
      img.onerror = () => {
        console.warn(`Failed to load image: ${img.src}`);
        // Set fallback image if available
        if (img.dataset.fallback) {
          img.src = img.dataset.fallback;
        }
      };
    }
    
    // Mark as optimized
    img.setAttribute('data-optimized', 'true');
  };
  
  // Process all images on the page
  document.querySelectorAll('img').forEach(applyImageOptimizations);
  
  // Set up observer for dynamically added images
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is an image
          if (node.nodeName === 'IMG') {
            applyImageOptimizations(node as HTMLImageElement);
          }
          
          // Check for images within added nodes
          if (node.nodeType === Node.ELEMENT_NODE) {
            (node as Element).querySelectorAll('img').forEach(applyImageOptimizations);
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return () => {
    // Cleanup function to disconnect observer
    observer.disconnect();
  };
}

/**
 * Preloads critical images to improve perceived performance
 * @param imagePaths Array of image paths to preload
 */
export function preloadCriticalImages(imagePaths: string[]) {
  if (typeof window === 'undefined') return;
  
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
}