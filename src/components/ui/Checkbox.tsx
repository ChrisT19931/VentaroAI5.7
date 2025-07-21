'use client';

import React, { useState, useEffect } from 'react';

type CheckboxProps = {
  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;
  
  /**
   * Default checked state (for uncontrolled component)
   */
  defaultChecked?: boolean;
  
  /**
   * Callback when the checkbox is toggled
   */
  onChange?: (checked: boolean) => void;
  
  /**
   * Label for the checkbox
   */
  label?: React.ReactNode;
  
  /**
   * Position of the label
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the checkbox is required
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
   * Size of the checkbox
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color variant of the checkbox
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  
  /**
   * Indeterminate state (partially checked)
   */
  indeterminate?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the checkbox element
   */
  id?: string;
  
  /**
   * Name for the checkbox element
   */
  name?: string;
  
  /**
   * Value for the checkbox element
   */
  value?: string;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
};

export default function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  labelPosition = 'right',
  disabled = false,
  required = false,
  helperText,
  error,
  size = 'md',
  variant = 'primary',
  indeterminate = false,
  className = '',
  id,
  name,
  value,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  // State for uncontrolled component
  const [isChecked, setIsChecked] = useState(defaultChecked);
  
  // Use checked prop if provided (controlled component)
  const isControlled = checked !== undefined;
  const checkboxChecked = isControlled ? checked : isChecked;
  
  // Reference to the checkbox input
  const checkboxRef = React.useRef<HTMLInputElement>(null);
  
  // Update indeterminate state when prop changes
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  
  // Handle checkbox change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    
    if (!isControlled) {
      setIsChecked(newChecked);
    }
    
    onChange?.(newChecked);
  };
  
  // Generate unique ID if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine size classes
  const sizeClasses = {
    sm: {
      checkbox: 'w-3.5 h-3.5',
      text: 'text-sm',
    },
    md: {
      checkbox: 'w-4 h-4',
      text: 'text-base',
    },
    lg: {
      checkbox: 'w-5 h-5',
      text: 'text-lg',
    },
  }[size];
  
  // Determine color classes
  const colorClass = {
    primary: 'text-blue-600 focus:ring-blue-500',
    secondary: 'text-gray-600 focus:ring-gray-500',
    success: 'text-green-600 focus:ring-green-500',
    danger: 'text-red-600 focus:ring-red-500',
    warning: 'text-yellow-500 focus:ring-yellow-400',
    info: 'text-cyan-500 focus:ring-cyan-400',
  }[variant];
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center">
        {label && labelPosition === 'left' && (
          <label
            htmlFor={checkboxId}
            className={`mr-2 ${sizeClasses.text} ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center">
          <input
            ref={checkboxRef}
            type="checkbox"
            id={checkboxId}
            name={name}
            value={value}
            checked={checkboxChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
            aria-describedby={helperText ? `${checkboxId}-helper` : undefined}
            aria-invalid={!!error}
            className={`
              ${sizeClasses.checkbox} ${colorClass}
              rounded border-gray-300 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${error ? 'border-red-500' : ''}
            `}
          />
        </div>
        
        {label && labelPosition === 'right' && (
          <label
            htmlFor={checkboxId}
            className={`ml-2 ${sizeClasses.text} ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      
      {helperText && !error && (
        <p id={`${checkboxId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
      
      {error && (
        <p id={`${checkboxId}-error`} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// CheckboxGroup component for managing multiple related checkboxes
export function CheckboxGroup({
  children,
  label,
  orientation = 'vertical',
  spacing = 'md',
  className = '',
  required = false,
  helperText,
  error,
}: {
  children: React.ReactNode;
  label?: string;
  orientation?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
}) {
  // Determine spacing classes
  const spacingClasses = {
    sm: orientation === 'vertical' ? 'space-y-1' : 'space-x-3',
    md: orientation === 'vertical' ? 'space-y-2' : 'space-x-4',
    lg: orientation === 'vertical' ? 'space-y-3' : 'space-x-6',
  }[spacing];
  
  return (
    <fieldset className={`${className}`}>
      {label && (
        <legend className="text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
      )}
      
      <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'} ${spacingClasses}`}>
        {children}
      </div>
      
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
    </fieldset>
  );
}