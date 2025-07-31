import React from 'react';

type TagProps = {
  /**
   * The content of the tag
   */
  children: React.ReactNode;
  
  /**
   * The color variant of the tag
   */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  
  /**
   * The size of the tag
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the tag is outlined
   */
  outlined?: boolean;
  
  /**
   * Whether the tag is rounded
   */
  rounded?: boolean;
  
  /**
   * Icon to display before the content
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the tag is dismissible
   */
  dismissible?: boolean;
  
  /**
   * Callback when the tag is dismissed
   */
  onDismiss?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Click handler for the tag
   */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Tag({
  children,
  variant = 'default',
  size = 'md',
  outlined = false,
  rounded = false,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
  onClick,
}: TagProps) {
  // Determine size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }[size];
  
  // Determine variant classes
  const variantClasses = {
    default: outlined 
      ? 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    primary: outlined 
      ? 'bg-transparent text-blue-700 border border-blue-300 hover:bg-blue-50' 
      : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    secondary: outlined 
      ? 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    success: outlined 
      ? 'bg-transparent text-green-700 border border-green-300 hover:bg-green-50' 
      : 'bg-green-100 text-green-700 hover:bg-green-200',
    danger: outlined 
      ? 'bg-transparent text-red-700 border border-red-300 hover:bg-red-50' 
      : 'bg-red-100 text-red-700 hover:bg-red-200',
    warning: outlined 
      ? 'bg-transparent text-yellow-700 border border-yellow-300 hover:bg-yellow-50' 
      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    info: outlined 
      ? 'bg-transparent text-cyan-700 border border-cyan-300 hover:bg-cyan-50' 
      : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
  }[variant];
  
  // Determine rounded classes
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  // Handle dismiss click
  const handleDismissClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDismiss?.();
  };
  
  return (
    <div
      className={`
        inline-flex items-center ${sizeClasses} ${variantClasses} ${roundedClasses}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {icon && (
        <span className="mr-1.5 -ml-0.5">
          {icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {dismissible && (
        <button
          type="button"
          className="ml-1.5 -mr-0.5 flex-shrink-0 rounded-full p-0.5 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleDismissClick}
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}

// TagGroup component for displaying multiple tags with consistent spacing
export function TagGroup({
  children,
  spacing = 'md',
  className = '',
}: {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const spacingClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  }[spacing];
  
  return (
    <div className={`flex flex-wrap ${spacingClasses} ${className}`}>
      {children}
    </div>
  );
}