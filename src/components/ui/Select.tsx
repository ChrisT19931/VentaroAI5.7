'use client';

import React, { useState, useRef, useEffect } from 'react';

type SelectOption = {
  /**
   * The value of the option
   */
  value: string;
  
  /**
   * The label of the option
   */
  label: string;
  
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
  
  /**
   * Icon to display with the option
   */
  icon?: React.ReactNode;
  
  /**
   * Group the option belongs to
   */
  group?: string;
};

type SelectProps = {
  /**
   * The options for the select
   */
  options: SelectOption[];
  
  /**
   * The selected value
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
   * Whether the select is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the select is required
   */
  required?: boolean;
  
  /**
   * Label for the select
   */
  label?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * The size of the select
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the select is full width
   */
  fullWidth?: boolean;
  
  /**
   * Icon to display at the start of the select
   */
  startIcon?: React.ReactNode;
  
  /**
   * Custom icon to display at the end of the select
   */
  endIcon?: React.ReactNode;
  
  /**
   * Whether to show a clear button
   */
  clearable?: boolean;
  
  /**
   * Whether to show a search input
   */
  searchable?: boolean;
  
  /**
   * Whether to group options
   */
  grouped?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the select element
   */
  id?: string;
  
  /**
   * Name for the select element
   */
  name?: string;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
};

export default function Select({
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  label,
  helperText,
  error,
  size = 'md',
  fullWidth = false,
  startIcon,
  endIcon,
  clearable = false,
  searchable = false,
  grouped = false,
  className = '',
  id,
  name,
  'aria-label': ariaLabel,
}: SelectProps) {
  // State for uncontrolled component
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Use value prop if provided (controlled component)
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;
  
  // Generate unique ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  const labelId = `${selectId}-label`;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, searchable]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          navigateOptions(1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          navigateOptions(-1);
          break;
        case 'Enter':
          if (document.activeElement === searchInputRef.current) return;
          event.preventDefault();
          selectFocusedOption();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);
  
  // Navigate options with keyboard
  const navigateOptions = (direction: number) => {
    // Implementation would focus the next/previous option
    // This is a simplified version
  };
  
  // Select the currently focused option
  const selectFocusedOption = () => {
    // Implementation would select the currently focused option
    // This is a simplified version
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setSearchTerm('');
  };
  
  // Handle option selection
  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled) return;
    
    if (!isControlled) {
      setSelectedValue(option.value);
    }
    
    onChange?.(option.value);
    setIsOpen(false);
  };
  
  // Handle clear button click
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isControlled) {
      setSelectedValue(undefined);
    }
    
    onChange?.('');
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;
  
  // Group options if needed
  const groupedOptions = grouped
    ? filteredOptions.reduce<Record<string, SelectOption[]>>((groups, option) => {
        const group = option.group || 'Default';
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(option);
        return groups;
      }, {})
    : {};
  
  // Find selected option
  const selectedOption = options.find(option => option.value === currentValue);
  
  // Determine size classes
  const sizeClasses = {
    sm: 'text-xs h-8',
    md: 'text-sm h-10',
    lg: 'text-base h-12',
  }[size];
  
  const paddingClasses = {
    sm: startIcon ? 'pl-7 pr-8' : 'pl-3 pr-8',
    md: startIcon ? 'pl-9 pr-10' : 'pl-4 pr-10',
    lg: startIcon ? 'pl-11 pr-12' : 'pl-5 pr-12',
  }[size];
  
  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];
  
  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {label && (
        <label
          id={labelId}
          htmlFor={selectId}
          className={`block text-sm font-medium mb-1 ${error ? 'text-red-500' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div ref={selectRef} className="relative">
        <div
          id={selectId}
          role="combobox"
          aria-labelledby={label ? labelId : undefined}
          aria-label={ariaLabel || label}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${selectId}-listbox`}
          aria-required={required}
          aria-disabled={disabled}
          aria-invalid={!!error}
          className={`
            flex items-center justify-between
            ${sizeClasses} ${paddingClasses}
            border rounded-md shadow-sm
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-400'}
            ${fullWidth ? 'w-full' : 'w-auto'}
          `}
          onClick={toggleDropdown}
          tabIndex={disabled ? -1 : 0}
        >
          {startIcon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              {startIcon}
            </span>
          )}
          
          <span className={`block truncate ${!currentValue ? 'text-gray-400' : ''}`}>
            {selectedOption ? selectedOption.icon && (
              <span className="mr-2 inline-flex items-center">
                {selectedOption.icon}
              </span>
            ) : null}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {clearable && currentValue ? (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleClear}
                aria-label="Clear selection"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ) : endIcon || (
              <svg xmlns="http://www.w3.org/2000/svg" className={iconSizeClasses} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        </div>
        
        {isOpen && (
          <div
            id={`${selectId}-listbox`}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            className="
              absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base
              ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none
            "
          >
            {searchable && (
              <div className="sticky top-0 z-10 bg-white px-2 py-1.5">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="
                    w-full border-0 bg-gray-100 rounded-md py-1.5 pl-3 pr-8 text-sm
                    focus:ring-2 focus:ring-blue-500
                  "
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}
            
            {grouped ? (
              // Grouped options
              Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group}>
                  <div className="sticky top-0 z-10 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                    {group}
                  </div>
                  {groupOptions.map(option => (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={currentValue === option.value}
                      className={`
                        ${currentValue === option.value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
                        relative px-3 py-2
                      `}
                      onClick={() => handleOptionSelect(option)}
                    >
                      <div className="flex items-center">
                        {option.icon && (
                          <span className="mr-3 flex-shrink-0">
                            {option.icon}
                          </span>
                        )}
                        <span className={`block truncate ${currentValue === option.value ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {currentValue === option.value && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              // Flat options
              filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={currentValue === option.value}
                    className={`
                      ${currentValue === option.value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
                      relative px-3 py-2
                    `}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <span className="mr-3 flex-shrink-0">
                          {option.icon}
                        </span>
                      )}
                      <span className={`block truncate ${currentValue === option.value ? 'font-medium' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {currentValue === option.value && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options found
                </div>
              )
            )}
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      
      {/* Hidden native select for form submission */}
      <select
        name={name}
        value={currentValue}
        onChange={() => {}} // Handled by custom select
        required={required}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>
        {options.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}