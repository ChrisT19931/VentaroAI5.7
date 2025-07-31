import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type BadgeSize = 'sm' | 'md' | 'lg';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
};

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
  icon,
  iconPosition = 'left',
  onClick,
}: BadgeProps) {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-gray-50 text-gray-600',
    dark: 'bg-gray-700 text-white',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  const classes = `
    inline-flex items-center font-medium
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${roundedClass}
    ${cursorClass}
    ${className}
  `;

  return (
    <span
      className={classes.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-1 -ml-0.5">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-1 -mr-0.5">{icon}</span>
      )}
    </span>
  );
}