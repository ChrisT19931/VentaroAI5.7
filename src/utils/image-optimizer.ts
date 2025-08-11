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
    
    // Set size attributes if natural dimensions are available to prevent layout shifts
    if (img.naturalWidth && img.naturalHeight && 
        !img.hasAttribute('width') && !img.hasAttribute('height')) {
      img.width = img.naturalWidth;
      img.height = img.naturalHeight;
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
  
  // Optimize background images
  optimizeBackgroundImages();
  
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
  
  // Set up a periodic check for new background images
  const bgInterval = setInterval(optimizeBackgroundImages, 3000);
  
  return () => {
    // Cleanup function to disconnect observer and clear interval
    observer.disconnect();
    clearInterval(bgInterval);
  };
}

/**
 * Preloads critical images to improve perceived performance
 * @param imagePaths Array of image paths to preload
 */
export function preloadCriticalImages(imagePaths: string[]) {
  if (typeof window === 'undefined') return;
  
  imagePaths.forEach(path => {
    // Skip if already preloaded
    if (document.querySelector(`link[rel="preload"][href="${path}"]`)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    link.fetchPriority = 'high'; // Add high priority for critical images
    document.head.appendChild(link);
  });
}

/**
 * Optimizes background images by converting them to actual img elements when possible
 * This helps with lazy loading and better resource management
 */
export function optimizeBackgroundImages() {
  if (typeof window === 'undefined') return;
  
  // Find elements with background images
  const elements = document.querySelectorAll('[data-bg-image], [style*="background-image"]');
  
  elements.forEach(el => {
    // Skip already processed elements
    if (el.hasAttribute('data-bg-optimized')) return;
    
    let bgUrl = el.getAttribute('data-bg-image');
    
    // Extract URL from inline style if not using data attribute
    if (!bgUrl) {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        // Extract URL from url('...') format
        const match = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/);
        if (match && match[1]) {
          bgUrl = match[1];
        }
      }
    }
    
    if (bgUrl) {
      // Mark as processed
      el.setAttribute('data-bg-optimized', 'true');
      
      // For elements where we can't replace the background, at least preload the image
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = bgUrl;
      document.head.appendChild(preloadLink);
    }
  });
}