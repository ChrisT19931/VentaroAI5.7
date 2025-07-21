import React from 'react';

type SkeletonProps = {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'image';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
};

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
  count = 1,
}: SkeletonProps) {
  const getBaseClasses = () => {
    const animationClass = {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer',
      none: '',
    }[animation];

    return `bg-gray-200 ${animationClass}`;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded h-4';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-md';
      case 'card':
        return 'rounded-lg';
      case 'image':
        return 'rounded-md';
      default:
        return 'rounded';
    }
  };

  const getStyles = () => {
    const styles: React.CSSProperties = {};

    if (width) {
      styles.width = typeof width === 'number' ? `${width}px` : width;
    } else if (variant === 'circular') {
      styles.width = '40px';
    } else if (variant === 'text') {
      styles.width = '100%';
    }

    if (height) {
      styles.height = typeof height === 'number' ? `${height}px` : height;
    } else {
      switch (variant) {
        case 'text':
          styles.height = '1rem';
          break;
        case 'circular':
          styles.height = '40px';
          break;
        case 'rectangular':
        case 'card':
          styles.height = '100px';
          break;
        case 'image':
          styles.height = '200px';
          break;
      }
    }

    return styles;
  };

  const classes = `${getBaseClasses()} ${getVariantClasses()} ${className}`;
  const styles = getStyles();

  // Create an array of skeletons based on count
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={classes}
      style={styles}
      aria-hidden="true"
      data-testid="skeleton-loader"
    />
  ));

  // If count > 1, add spacing between items
  if (count > 1) {
    return (
      <div className="space-y-2">
        {skeletons}
      </div>
    );
  }

  return skeletons[0];
}

// Predefined skeleton layouts
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          width={i === lines - 1 && lines > 1 ? '80%' : '100%'} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <Skeleton 
      variant="circular" 
      width={size} 
      height={size} 
      className={className} 
    />
  );
}

export function SkeletonButton({ width = 100, height = 40, className = '' }: { width?: number; height?: number; className?: string }) {
  return (
    <Skeleton 
      variant="rectangular" 
      width={width} 
      height={height} 
      className={`rounded-md ${className}`} 
    />
  );
}