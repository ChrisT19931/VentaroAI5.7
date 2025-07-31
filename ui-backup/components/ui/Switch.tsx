'use client';

import React, { useState, useEffect } from 'react';

type SwitchProps = {
  /**
   * Whether the switch is checked
   */
  checked?: boolean;
  
  /**
   * Default checked state (for uncontrolled component)
   */
  defaultChecked?: boolean;
  
  /**
   * Callback when the switch is toggled
   */
  onChange?: (checked: boolean) => void;
  
  /**
   * Size of the switch
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color variant of the switch
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  
  /**
   * Label for the switch
   */
  label?: string;
  
  /**
   * Position of the label
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the input element
   */
  id?: string;
  
  /**
   * Name for the input element
   */
  name?: string;
  
  /**
   * Required attribute for the input element
   */
  required?: boolean;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
};

export default function Switch({
  checked,
  defaultChecked,
  onChange,
  size = 'md',
  variant = 'primary',
  disabled = false,
  label,
  labelPosition = 'right',
  className = '',
  id,
  name,
  required,
  'aria-label': ariaLabel,
}: SwitchProps) {
  // State for uncontrolled component
  const [isChecked, setIsChecked] = useState(defaultChecked ?? false);
  
  // Use checked prop if provided (controlled component)
  const isControlled = checked !== undefined;
  const switchChecked = isControlled ? checked : isChecked;
  
  // Update internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setIsChecked(checked);
    }
  }, [checked, isControlled]);
  
  // Handle toggle
  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !switchChecked;
    
    if (!isControlled) {
      setIsChecked(newChecked);
    }
    
    onChange?.(newChecked);
  };
  
  // Determine size classes
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      text: 'text-sm',
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      text: 'text-base',
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
      text: 'text-lg',
    },
  }[size];
  
  // Determine color classes
  const colorClass = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500',
  }[variant];
  
  // Generate unique ID if not provided
  const switchId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      {label && labelPosition === 'left' && (
        <label 
          htmlFor={switchId} 
          className={`mr-3 ${sizeClasses.text} ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
        >
          {label}
        </label>
      )}
      
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={switchChecked}
        aria-label={ariaLabel || label}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex flex-shrink-0 ${sizeClasses.switch} border-2 border-transparent rounded-full 
          cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${switchChecked ? colorClass : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="sr-only">{label || 'Toggle'}</span>
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block ${sizeClasses.thumb} rounded-full bg-white shadow transform ring-0 
            transition ease-in-out duration-200
            ${switchChecked ? sizeClasses.translate : 'translate-x-0'}
          `}
        />
      </button>
      
      {label && labelPosition === 'right' && (
        <label 
          htmlFor={switchId} 
          className={`ml-3 ${sizeClasses.text} ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}
        >
          {label}
        </label>
      )}
      
      {/* Hidden input for form submission */}
      <input
        type="checkbox"
        id={`${switchId}-hidden`}
        name={name}
        checked={switchChecked}
        onChange={() => {}}
        disabled={disabled}
        required={required}
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  );
}