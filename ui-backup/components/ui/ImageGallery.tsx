'use client';

import React, { useState, useEffect, useCallback } from 'react';

type ImageItem = {
  /**
   * Source URL of the image
   */
  src: string;
  
  /**
   * Alt text for the image
   */
  alt: string;
  
  /**
   * Optional thumbnail URL (if different from src)
   */
  thumbnail?: string;
  
  /**
   * Optional caption for the image
   */
  caption?: string;
  
  /**
   * Optional width of the image
   */
  width?: number;
  
  /**
   * Optional height of the image
   */
  height?: number;
};

type ImageGalleryProps = {
  /**
   * Array of image items to display
   */
  images: ImageItem[];
  
  /**
   * Layout type for the gallery
   */
  layout?: 'grid' | 'masonry' | 'carousel';
  
  /**
   * Number of columns in grid or masonry layout
   */
  columns?: number;
  
  /**
   * Gap between images
   */
  gap?: number;
  
  /**
   * Whether to show image captions
   */
  showCaptions?: boolean;
  
  /**
   * Whether to enable lightbox on image click
   */
  enableLightbox?: boolean;
  
  /**
   * Whether to show thumbnails in lightbox
   */
  showThumbnails?: boolean;
  
  /**
   * Whether to enable infinite loop in carousel
   */
  infiniteLoop?: boolean;
  
  /**
   * Whether to show navigation arrows
   */
  showArrows?: boolean;
  
  /**
   * Whether to show navigation dots
   */
  showDots?: boolean;
  
  /**
   * Whether to enable autoplay in carousel
   */
  autoplay?: boolean;
  
  /**
   * Autoplay interval in milliseconds
   */
  autoplayInterval?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
};

export default function ImageGallery({
  images,
  layout = 'grid',
  columns = 3,
  gap = 8,
  showCaptions = false,
  enableLightbox = true,
  showThumbnails = true,
  infiniteLoop = true,
  showArrows = true,
  showDots = true,
  autoplay = false,
  autoplayInterval = 3000,
  className = '',
}: ImageGalleryProps) {
  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Handle image click to open lightbox
  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setActiveIndex(index);
      setLightboxOpen(true);
    }
  };
  
  // Handle lightbox close
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  // Handle navigation in lightbox
  const goToPrevious = useCallback(() => {
    setActiveIndex((prevIndex) => {
      if (prevIndex === 0) {
        return infiniteLoop ? images.length - 1 : 0;
      }
      return prevIndex - 1;
    });
  }, [images.length, infiniteLoop]);
  
  const goToNext = useCallback(() => {
    setActiveIndex((prevIndex) => {
      if (prevIndex === images.length - 1) {
        return infiniteLoop ? 0 : images.length - 1;
      }
      return prevIndex + 1;
    });
  }, [images.length, infiniteLoop]);
  
  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, goToPrevious, goToNext]);
  
  // Autoplay for carousel
  useEffect(() => {
    if (layout === 'carousel' && autoplay && !lightboxOpen) {
      const interval = setInterval(goToNext, autoplayInterval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [layout, autoplay, autoplayInterval, lightboxOpen, goToNext]);
  
  // Render grid layout
  const renderGrid = () => {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 6)}`}
        style={{ gap: `${gap}px` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-md group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              width={image.width}
              height={image.height}
            />
            {showCaptions && image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Render masonry layout
  const renderMasonry = () => {
    // Create column arrays
    const columnArrays: ImageItem[][] = Array.from({ length: columns }, () => []);
    
    // Distribute images across columns
    images.forEach((image, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(image);
    });
    
    return (
      <div
        className="flex"
        style={{ gap: `${gap}px` }}
      >
        {columnArrays.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col"
            style={{ gap: `${gap}px` }}
          >
            {column.map((image, imageIndex) => {
              const index = columnIndex + imageIndex * columns;
              return (
                <div
                  key={imageIndex}
                  className="relative overflow-hidden rounded-md group"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    width={image.width}
                    height={image.height}
                  />
                  {showCaptions && image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {image.caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  // Render carousel layout
  const renderCarousel = () => {
    return (
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            width: `${images.length * 100}%`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative"
              style={{ width: `${100 / images.length}%` }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover"
                width={image.width}
                height={image.height}
              />
              {showCaptions && image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {showArrows && (
          <>
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
              onClick={goToNext}
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {showDots && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full focus:outline-none ${index === activeIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render lightbox
  const renderLightbox = () => {
    if (!lightboxOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col justify-center items-center">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
          onClick={closeLightbox}
          aria-label="Close lightbox"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Main image */}
        <div className="relative max-w-4xl max-h-[70vh] w-full h-full flex items-center justify-center">
          <img
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Caption */}
          {showCaptions && images[activeIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
              {images[activeIndex].caption}
            </div>
          )}
        </div>
        
        {/* Navigation arrows */}
        {showArrows && (
          <>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
              onClick={goToNext}
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Thumbnails */}
        {showThumbnails && (
          <div className="mt-4 flex justify-center items-center space-x-2 overflow-x-auto max-w-full p-2">
            {images.map((image, index) => (
              <button
                key={index}
                className={`
                  w-16 h-16 flex-shrink-0 overflow-hidden rounded-md focus:outline-none
                  ${index === activeIndex ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              >
                <img
                  src={image.thumbnail || image.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={className}>
      {/* Render appropriate layout */}
      {layout === 'grid' && renderGrid()}
      {layout === 'masonry' && renderMasonry()}
      {layout === 'carousel' && renderCarousel()}
      
      {/* Lightbox */}
      {renderLightbox()}
    </div>
  );
}