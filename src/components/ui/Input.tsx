import React, { forwardRef } from 'react';

type InputProps = {
  id?: string;
  name?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
  autoFocus?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    id,
    name,
    label,
    type = 'text',
    placeholder,
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    readOnly = false,
    required = false,
    error,
    helperText,
    className = '',
    inputClassName = '',
    labelClassName = '',
    fullWidth = true,
    startIcon,
    endIcon,
    min,
    max,
    step,
    autoComplete,
    autoFocus = false,
  },
  ref
) => {
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseInputClasses = 'block px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
  const errorInputClasses = 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500';
  const disabledInputClasses = 'bg-gray-100 text-gray-500 cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const inputClasses = `
    ${baseInputClasses}
    ${error ? errorInputClasses : 'border-gray-300'}
    ${disabled || readOnly ? disabledInputClasses : ''}
    ${widthClass}
    ${startIcon ? 'pl-10' : ''}
    ${endIcon ? 'pr-10' : ''}
    ${inputClassName}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputClasses.trim()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
        />
        
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;