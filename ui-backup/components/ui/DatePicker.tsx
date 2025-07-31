'use client';

import React, { useState, useRef, useEffect } from 'react';

type DatePickerProps = {
  /**
   * Selected date
   */
  value?: Date;
  
  /**
   * Default date for uncontrolled component
   */
  defaultValue?: Date;
  
  /**
   * Callback when date changes
   */
  onChange?: (date: Date) => void;
  
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  
  /**
   * Label for the date picker
   */
  label?: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Whether the date picker is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the date picker is required
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
   * Date format for display
   */
  dateFormat?: string;
  
  /**
   * Whether to show today button
   */
  showTodayButton?: boolean;
  
  /**
   * Whether to show clear button
   */
  clearable?: boolean;
  
  /**
   * Whether the date picker should take up the full width
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
   * ID for the input element
   */
  id?: string;
  
  /**
   * Name for the input element
   */
  name?: string;
};

// Days of the week
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Months of the year
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DatePicker({
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  label,
  placeholder = 'Select date',
  disabled = false,
  required = false,
  helperText,
  error,
  dateFormat = 'MM/DD/YYYY',
  showTodayButton = true,
  clearable = true,
  fullWidth = false,
  size = 'md',
  className = '',
  id,
  name,
}: DatePickerProps) {
  // State for uncontrolled component
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(value || defaultValue || new Date());
  
  // Use value prop if provided (controlled component)
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedDate;
  
  // Refs for DOM elements
  const datePickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Generate unique ID if not provided
  const datePickerId = id || `datepicker-${Math.random().toString(36).substring(2, 9)}`;
  
  // Format date for display
  const formatDate = (date?: Date): string => {
    if (!date) return '';
    
    let formattedDate = dateFormat;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    formattedDate = formattedDate.replace('DD', day.toString().padStart(2, '0'));
    formattedDate = formattedDate.replace('MM', month.toString().padStart(2, '0'));
    formattedDate = formattedDate.replace('YYYY', year.toString());
    
    return formattedDate;
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isControlled) {
      setSelectedDate(date);
    }
    
    onChange?.(date);
    setIsOpen(false);
  };
  
  // Handle clear button click
  const handleClear = () => {
    if (!isControlled) {
      setSelectedDate(undefined);
    }
    
    onChange?.(undefined as any);
  };
  
  // Handle today button click
  const handleToday = () => {
    const today = new Date();
    handleDateSelect(today);
    setCurrentMonth(today);
  };
  
  // Handle previous month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Handle next month navigation
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Check if date is selectable
  const isDateSelectable = (date: Date): boolean => {
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) {
      return false;
    }
    
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) {
      return false;
    }
    
    return true;
  };
  
  // Check if date is the same as selected date
  const isSameDate = (date1?: Date, date2?: Date): boolean => {
    if (!date1 || !date2) return false;
    
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Previous month's days to show
    const prevMonthDays = firstDayOfWeek;
    
    // Next month's days to show
    const nextMonthDays = (7 - ((prevMonthDays + daysInMonth) % 7)) % 7;
    
    // Calendar days array
    const calendarDays: Array<{ date: Date; isCurrentMonth: boolean }> = [];
    
    // Add previous month's days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDaysCount = prevMonth.getDate();
    
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const day = prevMonthDaysCount - i;
      calendarDays.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Add next month's days
    for (let i = 1; i <= nextMonthDays; i++) {
      calendarDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return calendarDays;
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
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
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-3',
    lg: 'text-lg py-2.5 px-4',
  }[size];
  
  return (
    <div
      ref={datePickerRef}
      className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {label && (
        <label
          htmlFor={datePickerId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={datePickerId}
          name={name}
          value={formatDate(currentValue)}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          required={required}
          onClick={() => !disabled && setIsOpen(true)}
          className={`
            block ${fullWidth ? 'w-full' : ''} rounded-md
            ${sizeClasses}
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'cursor-pointer'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            transition duration-150 ease-in-out
          `}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-invalid={!!error}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-4 w-64">
          {/* Calendar header */}
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous month"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            
            <div className="text-sm font-medium text-gray-700">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next month"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="text-xs font-medium text-gray-500 text-center"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map(({ date, isCurrentMonth }, index) => {
              const isSelected = isSameDate(date, currentValue);
              const isToday = isSameDate(date, new Date());
              const isSelectable = isDateSelectable(date);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => isSelectable && handleDateSelect(date)}
                  disabled={!isSelectable}
                  className={`
                    w-8 h-8 text-xs rounded-full flex items-center justify-center
                    ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
                    ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                    ${!isSelected && isToday ? 'border border-blue-500' : ''}
                    ${!isSelected && isSelectable && !isToday ? 'hover:bg-gray-100' : ''}
                    ${!isSelectable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  `}
                  aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
                  aria-selected={isSelected}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          
          {/* Calendar footer */}
          <div className="flex justify-between mt-4 pt-2 border-t border-gray-200">
            {clearable && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear
              </button>
            )}
            
            {showTodayButton && (
              <button
                type="button"
                onClick={handleToday}
                className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Today
              </button>
            )}
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