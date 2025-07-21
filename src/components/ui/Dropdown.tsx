'use client';

import React, { useState, useRef, useEffect } from 'react';

type DropdownItem = {
  id: string;
  label: React.ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
};

type DropdownProps = {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  width?: 'auto' | 'sm' | 'md' | 'lg';
  divider?: boolean;
};

export default function Dropdown({
  trigger,
  items,
  className = '',
  menuClassName = '',
  itemClassName = '',
  placement = 'bottom-left',
  width = 'auto',
  divider = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown when pressing escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const placementClasses = {
    'bottom-left': 'top-full left-0',
    'bottom-right': 'top-full right-0',
    'top-left': 'bottom-full left-0',
    'top-right': 'bottom-full right-0',
  };

  const widthClasses = {
    auto: 'min-w-[10rem]',
    sm: 'w-48',
    md: 'w-56',
    lg: 'w-64',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown}>
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute z-10 mt-2 ${placementClasses[placement]} ${widthClasses[width]} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${menuClassName}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-menu"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => {
              const isLastItem = index === items.length - 1;
              const itemClasses = `
                block px-4 py-2 text-sm ${item.disabled ? 'text-gray-400 cursor-not-allowed' : item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                ${divider && !isLastItem ? 'border-b border-gray-100' : ''}
                ${itemClassName}
              `;

              if (item.href && !item.disabled) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={itemClasses.trim()}
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    <div className="flex items-center">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </div>
                  </a>
                );
              }

              return (
                <button
                  key={item.id}
                  className={itemClasses.trim()}
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled && item.onClick) {
                      item.onClick();
                      closeDropdown();
                    }
                  }}
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}