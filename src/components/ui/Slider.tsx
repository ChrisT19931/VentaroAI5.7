'use client';

import React, { useState, useRef, useEffect } from 'react';

type SliderProps = {
  /**
   * Current value of the slider
   */
  value?: number;
  
  /**
   * Default value for uncontrolled component
   */
  defaultValue?: number;
  
  /**
   * Callback when the value changes
   */
  onChange?: (value: number) => void;
  
  /**
   * Callback when the slider is being dragged
   */
  onDrag?: (value: number) => void;
  
  /**
   * Minimum value
   */
  min?: number;
  
  /**
   * Maximum value
   */
  max?: number;
  
  /**
   * Step value
   */
  step?: number;
  
  /**
   * Label for the slider
   */
  label?: string;
  
  /**
   * Whether to show the current value
   */
  showValue?: boolean;
  
  /**
   * Format function for the displayed value
   */
  formatValue?: (value: number) => string;
  
  /**
   * Whether the slider is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the slider should take up the full width
   */
  fullWidth?: boolean;
  
  /**
   * Size of the slider
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color variant of the slider
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  
  /**
   * Whether to show marks on the slider
   */
  marks?: boolean | { value: number; label?: string }[];
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the slider element
   */
  id?: string;
  
  /**
   * Name for the slider element
   */
  name?: string;
};

export default function Slider({
  value,
  defaultValue = 0,
  onChange,
  onDrag,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  formatValue = (val) => val.toString(),
  disabled = false,
  fullWidth = false,
  size = 'md',
  variant = 'primary',
  marks = false,
  helperText,
  error,
  className = '',
  id,
  name,
}: SliderProps) {
  // State for uncontrolled component
  const [sliderValue, setSliderValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use value prop if provided (controlled component)
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : sliderValue;
  
  // Refs for DOM elements
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  // Generate unique ID if not provided
  const sliderId = id || `slider-${Math.random().toString(36).substring(2, 9)}`;
  
  // Ensure value is within bounds
  const boundedValue = Math.min(Math.max(currentValue, min), max);
  
  // Calculate percentage for positioning
  const percentage = ((boundedValue - min) / (max - min)) * 100;
  
  // Determine size classes
  const sizeConfig = {
    sm: {
      track: 'h-1',
      thumb: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      track: 'h-2',
      thumb: 'w-4 h-4',
      text: 'text-sm',
    },
    lg: {
      track: 'h-3',
      thumb: 'w-5 h-5',
      text: 'text-base',
    },
  }[size];
  
  // Determine color classes
  const colorClass = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500',
  }[variant];
  
  // Handle slider value update
  const updateValue = (newValue: number) => {
    // Round to nearest step
    const steppedValue = Math.round((newValue - min) / step) * step + min;
    const boundedSteppedValue = Math.min(Math.max(steppedValue, min), max);
    
    if (!isControlled) {
      setSliderValue(boundedSteppedValue);
    }
    
    return boundedSteppedValue;
  };
  
  // Handle mouse/touch events
  const handleInteractionStart = (clientX: number) => {
    if (disabled) return;
    
    setIsDragging(true);
    handleInteractionMove(clientX);
  };
  
  const handleInteractionMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current || disabled) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    const newValue = min + position * (max - min);
    const steppedValue = updateValue(newValue);
    
    onDrag?.(steppedValue);
  };
  
  const handleInteractionEnd = () => {
    if (!isDragging || disabled) return;
    
    setIsDragging(false);
    onChange?.(currentValue);
  };
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleInteractionStart(e.clientX);
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleInteractionStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleInteractionMove(e.touches[0].clientX);
  };
  
  // Add global event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleInteractionMove(e.clientX);
    };
    
    const handleMouseUp = () => {
      handleInteractionEnd();
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove as unknown as EventListener);
      document.addEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as unknown as EventListener);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);
  
  // Generate marks if enabled
  const renderMarks = () => {
    if (!marks) return null;
    
    let markItems: { value: number; label?: string }[] = [];
    
    if (Array.isArray(marks)) {
      markItems = marks;
    } else {
      // Generate marks based on step
      const totalSteps = Math.floor((max - min) / step);
      const stepCount = Math.min(totalSteps, 10); // Limit to 10 marks
      const stepSize = (max - min) / stepCount;
      
      for (let i = 0; i <= stepCount; i++) {
        markItems.push({ value: min + i * stepSize });
      }
    }
    
    return (
      <div className="relative w-full h-6 mt-1">
        {markItems.map((mark) => {
          const markPercentage = ((mark.value - min) / (max - min)) * 100;
          return (
            <div
              key={mark.value}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${markPercentage}%` }}
            >
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              {mark.label && (
                <div className={`${sizeConfig.text} text-gray-500 mt-1 whitespace-nowrap`}>
                  {mark.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label
              htmlFor={sliderId}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
          )}
          {showValue && (
            <div className={`${sizeConfig.text} text-gray-700`}>
              {formatValue(boundedValue)}
            </div>
          )}
        </div>
      )}
      
      <div
        ref={sliderRef}
        className={`
          relative ${fullWidth ? 'w-full' : 'w-64'} ${sizeConfig.track} rounded-full
          bg-gray-200 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={boundedValue}
        aria-orientation="horizontal"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        id={sliderId}
      >
        {/* Track fill */}
        <div
          className={`absolute top-0 left-0 h-full rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
        
        {/* Thumb */}
        <div
          ref={thumbRef}
          className={`
            absolute top-1/2 ${sizeConfig.thumb} rounded-full
            transform -translate-y-1/2 -translate-x-1/2
            ${colorClass} shadow-md
            ${isDragging ? 'scale-110' : ''}
            transition-transform duration-150 ease-in-out
          `}
          style={{ left: `${percentage}%` }}
        ></div>
      </div>
      
      {/* Marks */}
      {marks && renderMarks()}
      
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={boundedValue}
      />
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}