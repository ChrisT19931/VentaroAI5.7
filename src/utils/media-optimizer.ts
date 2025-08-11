/**
 * Media optimization utilities for improving loading performance
 */

/**
 * Configuration options for media optimization
 */
export interface MediaOptimizerConfig {
  /** Whether to lazy load images */
  lazyLoadImages?: boolean;
  /** Whether to lazy load videos */
  lazyLoadVideos?: boolean;
  /** Whether to preload critical media */
  preloadCriticalMedia?: boolean;
  /** Whether to optimize image quality based on network */
  adaptiveQuality?: boolean;
  /** Whether to use responsive images */
  useResponsiveImages?: boolean;
  /** Whether to convert videos to WebM format */
  useWebmVideos?: boolean;
  /** Whether to use video thumbnails */
  useVideoThumbnails?: boolean;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number;
}

/**
 * Default configuration for media optimization
 */
export const DEFAULT_MEDIA_CONFIG: MediaOptimizerConfig = {
  lazyLoadImages: true,
  lazyLoadVideos: true,
  preloadCriticalMedia: true,
  adaptiveQuality: true,
  useResponsiveImages: true,
  useWebmVideos: true,
  useVideoThumbnails: true,
  rootMargin: '200px 0px',
  threshold: 0.1,
};

/**
 * Lazy loads images using Intersection Observer
 * @param selector CSS selector for images to lazy load
 * @param rootMargin Root margin for intersection observer
 * @param threshold Threshold for intersection observer
 */
export function lazyLoadImages(
  selector: string = 'img[loading="lazy"], img[data-src], img[data-srcset]',
  rootMargin: string = '200px 0px',
  threshold: number = 0.1
): () => void {
  const images = document.querySelectorAll<HTMLImageElement>(selector);
  if (images.length === 0) return () => {};
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          // Set loading attribute
          img.loading = 'eager';
          
          // Set decode attribute if supported
          if ('decode' in img) {
            img.decoding = 'async';
          }
          
          // Remove data attributes
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          
          // Stop observing the image
          observer.unobserve(img);
        }
      });
    },
    { rootMargin, threshold }
  );
  
  // Start observing all images
  images.forEach((img) => {
    observer.observe(img);
  });
  
  // Return a cleanup function
  return () => {
    observer.disconnect();
  };
}

/**
 * Lazy loads videos using Intersection Observer
 * @param selector CSS selector for videos to lazy load
 * @param rootMargin Root margin for intersection observer
 * @param threshold Threshold for intersection observer
 */
export function lazyLoadVideos(
  selector: string = 'video[data-src], video[data-poster]',
  rootMargin: string = '200px 0px',
  threshold: number = 0.1
): () => void {
  const videos = document.querySelectorAll<HTMLVideoElement>(selector);
  if (videos.length === 0) return () => {};
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement;
          
          // Load the video source
          if (video.dataset.src) {
            video.src = video.dataset.src;
          }
          
          // Load the poster image
          if (video.dataset.poster) {
            video.poster = video.dataset.poster;
          }
          
          // Load source elements
          const sources = video.querySelectorAll('source[data-src]');
          sources.forEach((source) => {
            const htmlSource = source as HTMLSourceElement;
            if (htmlSource.dataset.src) {
              htmlSource.src = htmlSource.dataset.src;
              htmlSource.removeAttribute('data-src');
            }
          });
          
          // Reload the video if needed
          if (sources.length > 0) {
            video.load();
          }
          
          // Remove data attributes
          video.removeAttribute('data-src');
          video.removeAttribute('data-poster');
          
          // Stop observing the video
          observer.unobserve(video);
        }
      });
    },
    { rootMargin, threshold }
  );
  
  // Start observing all videos
  videos.forEach((video) => {
    observer.observe(video);
  });
  
  // Return a cleanup function
  return () => {
    observer.disconnect();
  };
}

/**
 * Preloads critical media files
 * @param urls Array of URLs to preload
 * @param type Media type ('image' or 'video')
 * @param priority Fetch priority ('high', 'low', or 'auto')
 */
export function preloadCriticalMedia(
  urls: string[],
  type: 'image' | 'video' = 'image',
  priority: 'high' | 'low' | 'auto' = 'high'
): void {
  // Create a Set to track URLs that have already been preloaded
  const preloadedUrls = new Set<string>();
  
  // Check for existing preload links
  document.querySelectorAll('link[rel="preload"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      preloadedUrls.add(href);
    }
  });
  
  // Preload each URL if not already preloaded
  urls.forEach((url) => {
    if (preloadedUrls.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    link.fetchPriority = priority;
    
    document.head.appendChild(link);
    preloadedUrls.add(url);
  });
}

/**
 * Creates a responsive image with multiple sources
 * @param container Container element for the responsive image
 * @param src Default image source
 * @param alt Image alt text
 * @param sizes Image sizes attribute
 * @param srcset Image srcset attribute
 * @param lazyLoad Whether to lazy load the image
 */
export function createResponsiveImage(
  container: HTMLElement,
  src: string,
  alt: string,
  sizes: string = '100vw',
  srcset: string = '',
  lazyLoad: boolean = true
): HTMLImageElement {
  // Create the image element
  const img = document.createElement('img');
  img.alt = alt;
  img.sizes = sizes;
  
  // Set up lazy loading
  if (lazyLoad) {
    img.loading = 'lazy';
    img.decoding = 'async';
    img.dataset.src = src;
    if (srcset) {
      img.dataset.srcset = srcset;
    }
  } else {
    img.src = src;
    if (srcset) {
      img.srcset = srcset;
    }
  }
  
  // Append the image to the container
  container.appendChild(img);
  
  return img;
}

/**
 * Creates a video thumbnail for lazy loading
 * @param videoElement Video element to create thumbnail for
 * @param thumbnailUrl URL of the thumbnail image
 * @param playButtonUrl URL of the play button image (optional)
 */
export function createVideoThumbnail(
  videoElement: HTMLVideoElement,
  thumbnailUrl: string,
  playButtonUrl?: string
): void {
  // Hide the video initially
  videoElement.style.display = 'none';
  
  // Create a container for the thumbnail
  const container = document.createElement('div');
  container.className = 'video-thumbnail-container';
  container.style.position = 'relative';
  container.style.cursor = 'pointer';
  container.style.width = '100%';
  container.style.height = 'auto';
  
  // Create the thumbnail image
  const thumbnail = document.createElement('img');
  thumbnail.src = thumbnailUrl;
  thumbnail.alt = 'Video thumbnail';
  thumbnail.style.width = '100%';
  thumbnail.style.height = 'auto';
  thumbnail.loading = 'lazy';
  thumbnail.decoding = 'async';
  
  // Add the thumbnail to the container
  container.appendChild(thumbnail);
  
  // Add a play button if provided
  if (playButtonUrl) {
    const playButton = document.createElement('img');
    playButton.src = playButtonUrl;
    playButton.alt = 'Play video';
    playButton.style.position = 'absolute';
    playButton.style.top = '50%';
    playButton.style.left = '50%';
    playButton.style.transform = 'translate(-50%, -50%)';
    playButton.style.width = '64px';
    playButton.style.height = '64px';
    
    container.appendChild(playButton);
  }
  
  // Insert the container before the video
  videoElement.parentNode?.insertBefore(container, videoElement);
  
  // Add click event to play the video
  container.addEventListener('click', () => {
    // Show the video
    videoElement.style.display = 'block';
    
    // Hide the thumbnail
    container.style.display = 'none';
    
    // Play the video
    videoElement.play();
  });
}

/**
 * Optimizes image quality based on network conditions
 * @param imageElements Array of image elements to optimize
 * @param lowQualityUrls Object mapping original URLs to low-quality URLs
 */
export function optimizeImageQuality(
  imageElements: HTMLImageElement[],
  lowQualityUrls: Record<string, string>
): void {
  // Check if the Save-Data header is set
  const saveData = (navigator as any).connection?.saveData || false;
  
  // Check if the connection is slow
  const isSlowConnection = (
    (navigator as any).connection?.effectiveType === 'slow-2g' ||
    (navigator as any).connection?.effectiveType === '2g' ||
    (navigator as any).connection?.effectiveType === '3g'
  );
  
  // Use low-quality images if save-data is enabled or connection is slow
  if (saveData || isSlowConnection) {
    imageElements.forEach((img) => {
      const originalSrc = img.src;
      if (originalSrc && lowQualityUrls[originalSrc]) {
        img.src = lowQualityUrls[originalSrc];
      }
    });
  }
}

/**
 * Initializes media optimization
 * @param config Configuration options
 */
export function initializeMediaOptimization(config: MediaOptimizerConfig = DEFAULT_MEDIA_CONFIG): () => void {
  const {
    lazyLoadImages: shouldLazyLoadImages,
    lazyLoadVideos: shouldLazyLoadVideos,
    preloadCriticalMedia: shouldPreloadCriticalMedia,
    useVideoThumbnails: shouldUseVideoThumbnails,
    rootMargin,
    threshold,
  } = { ...DEFAULT_MEDIA_CONFIG, ...config };
  
  const cleanupFunctions: (() => void)[] = [];
  
  // Lazy load images if enabled
  if (shouldLazyLoadImages) {
    const cleanup = lazyLoadImages('img[loading="lazy"], img[data-src], img[data-srcset]', rootMargin, threshold);
    cleanupFunctions.push(cleanup);
  }
  
  // Lazy load videos if enabled
  if (shouldLazyLoadVideos) {
    const cleanup = lazyLoadVideos('video[data-src], video[data-poster]', rootMargin, threshold);
    cleanupFunctions.push(cleanup);
  }
  
  // Preload critical media if enabled
  if (shouldPreloadCriticalMedia) {
    // Find critical images (above the fold)
    const criticalImages = Array.from(document.querySelectorAll('img[data-critical="true"]'));
    const criticalImageUrls = criticalImages.map((img) => (img as HTMLImageElement).src || (img as HTMLImageElement).dataset.src || '');
    
    // Preload critical images
    if (criticalImageUrls.length > 0) {
      preloadCriticalMedia(criticalImageUrls.filter(Boolean), 'image', 'high');
    }
  }
  
  // Create video thumbnails if enabled
  if (shouldUseVideoThumbnails) {
    const videos = document.querySelectorAll<HTMLVideoElement>('video[data-thumbnail]');
    
    videos.forEach((video) => {
      const thumbnailUrl = video.dataset.thumbnail;
      const playButtonUrl = video.dataset.playButton;
      
      if (thumbnailUrl) {
        createVideoThumbnail(video, thumbnailUrl, playButtonUrl);
      }
    });
  }
  
  // Return a cleanup function that calls all cleanup functions
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}