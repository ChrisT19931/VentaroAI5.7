'use client';

import React, { useState } from 'react';

type RadioProps = {
  /**
   * Whether the radio is checked
   */
  checked?: boolean;
  
  /**
   * Default checked state (for uncontrolled component)
   */
  defaultChecked?: boolean;
  
  /**
   * Callback when the radio is toggled
   */
  onChange?: (checked: boolean) => void;
  
  /**
   * Label for the radio
   */
  label?: React.ReactNode;
  
  /**
   * Position of the label
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Whether the radio is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the radio is required
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
   * Size of the radio
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color variant of the radio
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the radio element
   */
  id?: string;
  
  /**
   * Name for the radio element
   */
  name?: string;
  
  /**
   * Value for the radio element
   */
  value?: string;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
};

export default function Radio({
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
  className = '',
  id,
  name,
  value,
  'aria-label': ariaLabel,
}: RadioProps) {
  // State for uncontrolled component
  const [isChecked, setIsChecked] = useState(defaultChecked);
  
  // Use checked prop if provided (controlled component)
  const isControlled = checked !== undefined;
  const radioChecked = isControlled ? checked : isChecked;
  
  // Handle radio change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    
    if (!isControlled) {
      setIsChecked(newChecked);
    }
    
    onChange?.(newChecked);
  };
  
  // Generate unique ID if not provided
  const radioId = id || `radio-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine size classes
  const sizeClasses = {
    sm: {
      radio: 'w-3.5 h-3.5',
      text: 'text-sm',
    },
    md: {
      radio: 'w-4 h-4',
      text: 'text-base',
    },
    lg: {
      radio: 'w-5 h-5',
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
            htmlFor={radioId}
            className={`mr-2 ${sizeClasses.text} ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center">
          <input
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={radioChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
            aria-describedby={helperText ? `${radioId}-helper` : undefined}
            aria-invalid={!!error}
            className={`
              ${sizeClasses.radio} ${colorClass}
              rounded-full border-gray-300 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${error ? 'border-red-500' : ''}
            `}
          />
        </div>
        
        {label && labelPosition === 'right' && (
          <label
            htmlFor={radioId}
            className={`ml-2 ${sizeClasses.text} ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      
      {helperText && !error && (
        <p id={`${radioId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
      
      {error && (
        <p id={`${radioId}-error`} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

type RadioGroupProps = {
  /**
   * Children must be Radio components
   */
  children: React.ReactNode;
  
  /**
   * Label for the radio group
   */
  label?: string;
  
  /**
   * Selected value
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
   * Name for the radio group
   */
  name: string;
  
  /**
   * Orientation of the radio group
   */
  orientation?: 'vertical' | 'horizontal';
  
  /**
   * Spacing between radio buttons
   */
  spacing?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the radio group is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the radio group is required
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
   * Additional CSS classes
   */
  className?: string;
};

export function RadioGroup({
  children,
  label,
  value,
  defaultValue,
  onChange,
  name,
  orientation = 'vertical',
  spacing = 'md',
  disabled = false,
  required = false,
  helperText,
  error,
  className = '',
}: RadioGroupProps) {
  // State for uncontrolled component
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  
  // Use value prop if provided (controlled component)
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;
  
  // Handle radio change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setSelectedValue(newValue);
    }
    
    onChange?.(newValue);
  };
  
  // Determine spacing classes
  const spacingClasses = {
    sm: orientation === 'vertical' ? 'space-y-1' : 'space-x-3',
    md: orientation === 'vertical' ? 'space-y-2' : 'space-x-4',
    lg: orientation === 'vertical' ? 'space-y-3' : 'space-x-6',
  }[spacing];
  
  // Clone children to add controlled props
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    
    return React.cloneElement(child, {
      name,
      checked: child.props.value === currentValue,
      onChange: (checked: boolean) => {
        if (checked) {
          // Call original onChange if it exists
          child.props.onChange?.(checked);
          
          // Update the radio group
          if (!isControlled) {
            setSelectedValue(child.props.value);
          }
          
          onChange?.(child.props.value);
        }
      },
      disabled: disabled || child.props.disabled,
      required: required || child.props.required,
    });
  });
  
  return (
    <fieldset className={`${className}`} role="radiogroup" aria-labelledby={label ? `${name}-label` : undefined}>
      {label && (
        <legend id={`${name}-label`} className="text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
      )}
      
      <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'} ${spacingClasses}`}>
        {enhancedChildren}
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