'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

type CarouselItem = {
  /**
   * Source URL of the image
   */
  src: string;
  
  /**
   * Alt text for the image
   */
  alt: string;
  
  /**
   * Optional caption for the image
   */
  caption?: string;
  
  /**
   * Optional action button text
   */
  buttonText?: string;
  
  /**
   * Optional action button URL
   */
  buttonUrl?: string;
};

type CarouselProps = {
  /**
   * Array of items to display in the carousel
   */
  items: CarouselItem[];
  
  /**
   * Whether to show navigation arrows
   */
  showArrows?: boolean;
  
  /**
   * Whether to show navigation dots
   */
  showDots?: boolean;
  
  /**
   * Whether to show captions
   */
  showCaptions?: boolean;
  
  /**
   * Whether to enable autoplay
   */
  autoplay?: boolean;
  
  /**
   * Autoplay interval in milliseconds
   */
  autoplayInterval?: number;
  
  /**
   * Whether to pause autoplay on hover
   */
  pauseOnHover?: boolean;
  
  /**
   * Whether to enable infinite loop
   */
  infiniteLoop?: boolean;
  
  /**
   * Whether to enable swipe on touch devices
   */
  swipe?: boolean;
  
  /**
   * Animation type for slide transitions
   */
  animation?: 'slide' | 'fade';
  
  /**
   * Duration of the transition animation in milliseconds
   */
  animationDuration?: number;
  
  /**
   * Height of the carousel
   */
  height?: number | string;
  
  /**
   * Width of the carousel
   */
  width?: number | string;
  
  /**
   * Whether to show thumbnails
   */
  showThumbnails?: boolean;
  
  /**
   * Callback when slide changes
   */
  onSlideChange?: (index: number) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
};

export default function Carousel({
  items,
  showArrows = true,
  showDots = true,
  showCaptions = true,
  autoplay = false,
  autoplayInterval = 5000,
  pauseOnHover = true,
  infiniteLoop = true,
  swipe = true,
  animation = 'slide',
  animationDuration = 500,
  height = 400,
  width = '100%',
  showThumbnails = false,
  onSlideChange,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Clear autoplay timer on unmount
  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, []);
  
  // Set up autoplay
  useEffect(() => {
    if (autoplay && !isHovering && items.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        goToNext();
      }, autoplayInterval);
    } else if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, isHovering, autoplayInterval, items.length, currentIndex]);
  
  // Handle mouse enter/leave for pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovering(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovering(false);
    }
  };
  
  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipe) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipe) return;
    setTouchEndX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!swipe || isAnimating) return;
    
    const diff = touchStartX - touchEndX;
    const threshold = 50; // Minimum swipe distance
    
    if (diff > threshold) {
      // Swipe left, go to next
      goToNext();
    } else if (diff < -threshold) {
      // Swipe right, go to previous
      goToPrevious();
    }
  };
  
  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setCurrentIndex(prevIndex => {
      let newIndex;
      if (prevIndex === 0) {
        newIndex = infiniteLoop ? items.length - 1 : 0;
      } else {
        newIndex = prevIndex - 1;
      }
      
      if (onSlideChange) {
        onSlideChange(newIndex);
      }
      
      return newIndex;
    });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
  }, [items.length, infiniteLoop, onSlideChange, animationDuration, isAnimating]);
  
  const goToNext = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setCurrentIndex(prevIndex => {
      let newIndex;
      if (prevIndex === items.length - 1) {
        newIndex = infiniteLoop ? 0 : items.length - 1;
      } else {
        newIndex = prevIndex + 1;
      }
      
      if (onSlideChange) {
        onSlideChange(newIndex);
      }
      
      return newIndex;
    });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
  }, [items.length, infiniteLoop, onSlideChange, animationDuration, isAnimating]);
  
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    if (onSlideChange) {
      onSlideChange(index);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === carouselRef.current || carouselRef.current?.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPrevious, goToNext]);
  
  // Render slide
  const renderSlide = (item: CarouselItem, index: number) => {
    const isActive = index === currentIndex;
    
    return (
      <div
        key={index}
        className={`carousel-slide absolute top-0 w-full h-full transition-opacity duration-${animationDuration} ${animation === 'fade' ? (isActive ? 'opacity-100 z-10' : 'opacity-0 z-0') : ''}`}
        style={{
          transform: animation === 'slide' ? `translateX(${(index - currentIndex) * 100}%)` : 'none',
          transition: animation === 'slide' ? `transform ${animationDuration}ms ease-in-out` : 'none',
        }}
        aria-hidden={!isActive}
      >
        <img
          src={item.src}
          alt={item.alt}
          className="w-full h-full object-cover"
        />
        
        {showCaptions && (item.caption || item.buttonText) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            {item.caption && (
              <p className="text-lg mb-2">{item.caption}</p>
            )}
            {item.buttonText && item.buttonUrl && (
              <a
                href={item.buttonUrl}
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.buttonText}
              </a>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Render thumbnails
  const renderThumbnails = () => {
    if (!showThumbnails) return null;
    
    return (
      <div className="mt-4 flex justify-center space-x-2 overflow-x-auto">
        {items.map((item, index) => (
          <button
            key={index}
            className={`w-16 h-16 flex-shrink-0 overflow-hidden rounded focus:outline-none ${index === currentIndex ? 'ring-2 ring-blue-500' : 'opacity-70'}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <img
              src={item.src}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className={`carousel-container ${className}`}>
      <div
        ref={carouselRef}
        className="carousel relative overflow-hidden focus:outline-none"
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Image carousel"
      >
        {/* Slides */}
        {items.map((item, index) => renderSlide(item, index))}
        
        {/* Navigation arrows */}
        {showArrows && items.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none z-20"
              onClick={goToPrevious}
              aria-label="Previous slide"
              disabled={!infiniteLoop && currentIndex === 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none z-20"
              onClick={goToNext}
              aria-label="Next slide"
              disabled={!infiniteLoop && currentIndex === items.length - 1}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Navigation dots */}
        {showDots && items.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
            {items.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full focus:outline-none ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {renderThumbnails()}
    </div>
  );
}