'use client';

import React, { useState, useRef, useEffect } from 'react';

type ColorPickerProps = {
  /**
   * Selected color value (hex format)
   */
  value?: string;
  
  /**
   * Default color value for uncontrolled component (hex format)
   */
  defaultValue?: string;
  
  /**
   * Callback when color changes
   */
  onChange?: (color: string) => void;
  
  /**
   * Label for the color picker
   */
  label?: string;
  
  /**
   * Whether the color picker is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the color picker is required
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
   * Whether to show the color input field
   */
  showInput?: boolean;
  
  /**
   * Whether to show the color palette
   */
  showPalette?: boolean;
  
  /**
   * Predefined color palette
   */
  palette?: string[];
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the color picker element
   */
  id?: string;
  
  /**
   * Name for the color picker element
   */
  name?: string;
};

// Default color palette
const DEFAULT_PALETTE = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00', '#9ACD32',
  '#008000', '#00FFFF', '#0000FF', '#4B0082', '#800080', '#FF00FF',
  '#000000', '#808080', '#FFFFFF', '#F5F5DC', '#A52A2A', '#FFC0CB',
];

export default function ColorPicker({
  value,
  defaultValue = '#000000',
  onChange,
  label,
  disabled = false,
  required = false,
  helperText,
  error,
  showInput = true,
  showPalette = true,
  palette = DEFAULT_PALETTE,
  size = 'md',
  className = '',
  id,
  name,
}: ColorPickerProps) {
  // State for uncontrolled component
  const [selectedColor, setSelectedColor] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  
  // Use value prop if provided (controlled component)
  const isControlled = value !== undefined;
  const currentColor = isControlled ? value : selectedColor;
  
  // Refs for DOM elements
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  // Generate unique ID if not provided
  const colorPickerId = id || `colorpicker-${Math.random().toString(36).substring(2, 9)}`;
  
  // Handle color change
  const handleColorChange = (color: string) => {
    if (!isControlled) {
      setSelectedColor(color);
    }
    
    onChange?.(color);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    handleColorChange(newColor);
  };
  
  // Handle palette color selection
  const handlePaletteSelect = (color: string) => {
    handleColorChange(color);
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Determine size classes
  const sizeConfig = {
    sm: {
      swatch: 'w-6 h-6',
      input: 'text-xs py-1 px-2',
      paletteItem: 'w-5 h-5',
    },
    md: {
      swatch: 'w-8 h-8',
      input: 'text-sm py-1.5 px-3',
      paletteItem: 'w-6 h-6',
    },
    lg: {
      swatch: 'w-10 h-10',
      input: 'text-base py-2 px-4',
      paletteItem: 'w-8 h-8',
    },
  }[size];
  
  return (
    <div
      ref={colorPickerRef}
      className={`relative ${className}`}
    >
      {label && (
        <label
          htmlFor={colorPickerId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex items-center space-x-2">
        {/* Color swatch */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            ${sizeConfig.swatch} rounded-md border border-gray-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          `}
          style={{ backgroundColor: currentColor }}
          aria-label={`Select color: ${currentColor}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        />
        
        {/* Color input */}
        {showInput && (
          <input
            type="text"
            id={colorPickerId}
            name={name}
            value={currentColor}
            onChange={handleInputChange}
            disabled={disabled}
            required={required}
            className={`
              rounded-md border border-gray-300 ${sizeConfig.input}
              ${error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              transition duration-150 ease-in-out
            `}
            aria-invalid={!!error}
          />
        )}
        
        {/* Native color input (hidden visually but accessible) */}
        <input
          type="color"
          value={currentColor}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          aria-hidden="true"
        />
      </div>
      
      {/* Color palette dropdown */}
      {isOpen && showPalette && (
        <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2 w-64">
          <div className="grid grid-cols-6 gap-2">
            {palette.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePaletteSelect(color)}
                className={`
                  ${sizeConfig.paletteItem} rounded-md border border-gray-300
                  ${color === currentColor ? 'ring-2 ring-blue-500' : ''}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                `}
                style={{ backgroundColor: color }}
                aria-label={`Select color: ${color}`}
                aria-selected={color === currentColor}
              />
            ))}
          </div>
          
          {/* Color slider */}
          <div className="mt-3">
            <input
              type="color"
              value={currentColor}
              onChange={handleInputChange}
              className="w-full h-8 rounded-md cursor-pointer"
            />
          </div>
        </div>
      )}
      
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