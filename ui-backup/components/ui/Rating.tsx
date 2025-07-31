'use client';

import React, { useState } from 'react';

type RatingProps = {
  /**
   * The current rating value
   */
  value?: number;
  
  /**
   * Default value for uncontrolled component
   */
  defaultValue?: number;
  
  /**
   * Maximum rating value
   */
  max?: number;
  
  /**
   * Whether the rating is read-only
   */
  readOnly?: boolean;
  
  /**
   * Whether the rating is disabled
   */
  disabled?: boolean;
  
  /**
   * Size of the rating stars
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color of the active stars
   */
  activeColor?: string;
  
  /**
   * Color of the inactive stars
   */
  inactiveColor?: string;
  
  /**
   * Whether to allow half stars
   */
  allowHalf?: boolean;
  
  /**
   * Callback when rating changes
   */
  onChange?: (value: number) => void;
  
  /**
   * Callback when rating is hovered
   */
  onHoverChange?: (value: number) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Label for the rating component
   */
  label?: string;
  
  /**
   * Whether to show the rating value
   */
  showValue?: boolean;
};

export default function Rating({
  value,
  defaultValue = 0,
  max = 5,
  readOnly = false,
  disabled = false,
  size = 'md',
  activeColor = '#FBBF24', // Amber-400
  inactiveColor = '#D1D5DB', // Gray-300
  allowHalf = false,
  onChange,
  onHoverChange,
  className = '',
  label,
  showValue = false,
}: RatingProps) {
  // State for uncontrolled component
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  // Use value prop if provided (controlled component)
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;
  
  // Determine size classes
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];
  
  // Handle click on a star
  const handleClick = (newValue: number) => {
    if (readOnly || disabled) return;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  };
  
  // Handle mouse enter on a star
  const handleMouseEnter = (newValue: number) => {
    if (readOnly || disabled) return;
    
    setHoverValue(newValue);
    onHoverChange?.(newValue);
  };
  
  // Handle mouse leave on the rating component
  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    
    setHoverValue(null);
    onHoverChange?.(0);
  };
  
  // Generate stars
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const starValue = i;
    const isActive = starValue <= displayValue;
    const isHalfActive = allowHalf && starValue === Math.ceil(displayValue) && displayValue % 1 !== 0;
    
    stars.push(
      <span
        key={i}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        className={`inline-block cursor-${readOnly || disabled ? 'default' : 'pointer'}`}
        role={readOnly ? 'presentation' : 'button'}
        aria-label={`${starValue} of ${max} stars`}
      >
        {isHalfActive ? (
          <HalfStar 
            size={sizeClass} 
            activeColor={activeColor} 
            inactiveColor={inactiveColor} 
          />
        ) : (
          <Star 
            size={sizeClass} 
            filled={isActive} 
            activeColor={activeColor} 
            inactiveColor={inactiveColor} 
          />
        )}
      </span>
    );
  }
  
  return (
    <div className={`inline-flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      
      <div 
        className={`inline-flex items-center ${disabled ? 'opacity-50' : ''}`}
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
      >
        {stars}
        
        {showValue && (
          <span className="ml-2 text-sm text-gray-600">
            {displayValue.toFixed(allowHalf ? 1 : 0)}/{max}
          </span>
        )}
      </div>
    </div>
  );
}

type StarProps = {
  filled: boolean;
  size: string;
  activeColor: string;
  inactiveColor: string;
};

function Star({ filled, size, activeColor, inactiveColor }: StarProps) {
  return (
    <svg
      className={size}
      fill={filled ? activeColor : 'none'}
      stroke={filled ? activeColor : inactiveColor}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

type HalfStarProps = {
  size: string;
  activeColor: string;
  inactiveColor: string;
};

function HalfStar({ size, activeColor, inactiveColor }: HalfStarProps) {
  return (
    <svg
      className={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="halfGradient">
          <stop offset="50%" stopColor={activeColor} />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        fill="url(#halfGradient)"
        stroke={inactiveColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}