'use client';

import React, { useState, useRef, useEffect } from 'react';

type TextareaProps = {
  /**
   * Value of the textarea
   */
  value?: string;
  
  /**
   * Default value for uncontrolled component
   */
  defaultValue?: string;
  
  /**
   * Callback when the value changes
   */
  onChange?: (value: string) => void;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Label for the textarea
   */
  label?: string;
  
  /**
   * Whether the textarea is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the textarea is required
   */
  required?: boolean;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Number of rows
   */
  rows?: number;
  
  /**
   * Maximum number of characters
   */
  maxLength?: number;
  
  /**
   * Whether to show character count
   */
  showCharCount?: boolean;
  
  /**
   * Whether the textarea should resize automatically
   */
  autoResize?: boolean;
  
  /**
   * Maximum height for auto-resize (in pixels)
   */
  maxHeight?: number;
  
  /**
   * Whether the textarea should take up the full width
   */
  fullWidth?: boolean;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the textarea element
   */
  id?: string;
  
  /**
   * Name for the textarea element
   */
  name?: string;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
  
  /**
   * Callback when the textarea is focused
   */
  onFocus?: () => void;
  
  /**
   * Callback when the textarea is blurred
   */
  onBlur?: () => void;
};

export default function Textarea({
  value,
  defaultValue = '',
  onChange,
  placeholder,
  label,
  disabled = false,
  required = false,
  helperText,
  error,
  rows = 4,
  maxLength,
  showCharCount = false,
  autoResize = false,
  maxHeight,
  fullWidth = false,
  size = 'md',
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
  onFocus,
  onBlur,
}: TextareaProps) {
  // State for uncontrolled component
  const [inputValue, setInputValue] = useState(defaultValue);
  
  // Use value prop if provided (controlled component)
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : inputValue;
  
  // Ref for auto-resize functionality
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Generate unique ID if not provided
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  
  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInputValue(newValue);
    }
    
    onChange?.(newValue);
  };
  
  // Auto-resize functionality
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Set the height to scrollHeight
      const newHeight = textarea.scrollHeight;
      
      // Apply max height if specified
      if (maxHeight && newHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [currentValue, autoResize, maxHeight]);
  
  // Determine size classes
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-2',
    md: 'text-base py-2 px-3',
    lg: 'text-lg py-2.5 px-4',
  }[size];
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={autoResize ? 1 : rows}
          maxLength={maxLength}
          aria-label={ariaLabel || label}
          aria-describedby={
            helperText || error || showCharCount
              ? `${textareaId}-${error ? 'error' : helperText ? 'helper' : 'counter'}`
              : undefined
          }
          aria-invalid={!!error}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`
            block ${fullWidth ? 'w-full' : ''} rounded-md
            ${sizeClasses}
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            transition duration-150 ease-in-out
          `}
          style={{
            resize: autoResize ? 'none' : 'vertical',
            minHeight: autoResize ? 'auto' : undefined,
            maxHeight: maxHeight ? `${maxHeight}px` : undefined,
          }}
        />
        
        {showCharCount && maxLength && (
          <div
            id={`${textareaId}-counter`}
            className={`text-xs mt-1 text-right ${currentValue.length >= maxLength ? 'text-red-500' : 'text-gray-500'}`}
          >
            {currentValue.length}/{maxLength}
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
      
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}