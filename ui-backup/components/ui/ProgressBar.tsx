import React from 'react';

type ProgressBarProps = {
  /**
   * The current value of the progress bar (0-100)
   */
  value: number;
  
  /**
   * The maximum value of the progress bar
   */
  max?: number;
  
  /**
   * The color variant of the progress bar
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  
  /**
   * The size of the progress bar
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  
  /**
   * Whether to show the progress value as text
   */
  showValue?: boolean;
  
  /**
   * Whether to animate the progress bar
   */
  animated?: boolean;
  
  /**
   * Whether to show a striped pattern
   */
  striped?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Label to display above the progress bar
   */
  label?: string;
};

export default function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showValue = false,
  animated = false,
  striped = false,
  className = '',
  label,
}: ProgressBarProps) {
  // Ensure value is between 0 and max
  const normalizedValue = Math.max(0, Math.min(value, max));
  
  // Calculate percentage
  const percentage = (normalizedValue / max) * 100;
  
  // Determine height based on size
  const heightClass = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  }[size];
  
  // Determine color based on variant
  const colorClass = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500',
  }[variant];
  
  // Determine animation class
  const animationClass = animated ? 'animate-pulse' : '';
  
  // Determine striped class
  const stripedClass = striped ? 'bg-stripes' : '';
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showValue && (
            <span className="text-sm font-medium text-gray-700">
              {normalizedValue}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full ${heightClass} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${colorClass} ${heightClass} ${animationClass} ${stripedClass} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={normalizedValue}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {showValue && size === 'lg' && (
            <span className="flex h-full items-center justify-center text-xs font-medium text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Custom styles for striped effect
// Note: In a real application, you would add this to your global CSS
// .bg-stripes {
//   background-image: linear-gradient(
//     45deg,
//     rgba(255, 255, 255, 0.15) 25%,
//     transparent 25%,
//     transparent 50%,
//     rgba(255, 255, 255, 0.15) 50%,
//     rgba(255, 255, 255, 0.15) 75%,
//     transparent 75%,
//     transparent
//   );
//   background-size: 1rem 1rem;
// }