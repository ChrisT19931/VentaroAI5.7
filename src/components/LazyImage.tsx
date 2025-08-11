'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Image, { ImageProps } from 'next/image';
import usePerformance from '../hooks/usePerformance';

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /** Fallback image to show if the main image fails to load */
  fallbackSrc?: string;
  /** Whether to blur the image while loading */
  blurWhileLoading?: boolean;
  /** Whether to fade in the image when it loads */
  fadeIn?: boolean;
  /** Duration of the fade-in animation in milliseconds */
  fadeInDuration?: number;
  /** Whether to disable lazy loading */
  disableLazy?: boolean;
  /** Whether this is a critical image that should be preloaded */
  critical?: boolean;
  /** Callback when the image loads successfully */
  onImageLoad?: () => void;
  /** Callback when the image fails to load */
  onImageError?: () => void;
}

/**
 * LazyImage - An optimized image component with lazy loading, fade-in effects, and error handling
 */
const LazyImage = memo(function LazyImage({
  src,
  alt,
  width,
  height,
  fallbackSrc,
  blurWhileLoading = true,
  fadeIn = true,
  fadeInDuration = 300,
  disableLazy = false,
  critical = false,
  onImageLoad,
  onImageError,
  className = '',
  style = {},
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(disableLazy || critical);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Get performance information
  const { shouldReduceAnimations, shouldMinimizeDataUsage } = usePerformance();
  
  // Disable fade-in effect if reduced animations are preferred
  const shouldFadeIn = fadeIn && !shouldReduceAnimations;
  
  // Adjust image quality based on data saver mode
  const quality = shouldMinimizeDataUsage ? 60 : props.quality || 75;
  
  // Set up intersection observer for lazy loading
  useEffect(() => {
    // Skip if lazy loading is disabled or this is a critical image
    if (disableLazy || critical) {
      setIsVisible(true);
      return;
    }
    
    const currentRef = imageRef.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px 0px' }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [disableLazy, critical]);
  
  // Preload critical images
  useEffect(() => {
    if (critical && typeof src === 'string') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [critical, src]);
  
  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (onImageLoad) onImageLoad();
  };
  
  // Handle image error event
  const handleError = () => {
    setHasError(true);
    if (onImageError) onImageError();
  };
  
  // Determine the image source to use
  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;
  
  // Combine styles
  const combinedStyle: React.CSSProperties = {
    ...style,
    opacity: isLoaded || !shouldFadeIn ? 1 : 0,
    transition: shouldFadeIn ? `opacity ${fadeInDuration}ms ease-in-out` : 'none',
  };
  
  // Determine loading attribute
  const loading = disableLazy || critical ? 'eager' : 'lazy';
  
  // Determine priority attribute for Next.js Image
  const priority = critical;
  
  return (
    <div 
      ref={imageRef}
      className={`lazy-image-container ${className}`}
      data-loaded={isLoaded ? 'true' : 'false'}
      data-error={hasError ? 'true' : 'false'}
      data-visible={isVisible ? 'true' : 'false'}
      data-critical={critical ? 'true' : 'false'}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: 'auto',
      }}
    >
      {isVisible && (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          priority={priority}
          quality={quality}
          style={combinedStyle}
          placeholder={blurWhileLoading ? 'blur' : 'empty'}
          blurDataURL={blurWhileLoading ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=' : undefined}
          {...props}
        />
      )}
      
      {!isVisible && (
        <div 
          style={{
            width: '100%',
            height: typeof height === 'number' ? `${height}px` : height,
            backgroundColor: '#f0f0f0',
          }}
        />
      )}
    </div>
  );
});

export default LazyImage;