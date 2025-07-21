import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  bordered?: boolean;
  hoverable?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  footer,
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  bordered = true,
  hoverable = false,
  shadow = 'sm',
  onClick,
}: CardProps) {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  const borderClass = bordered ? 'border border-gray-200' : '';
  const hoverableClass = hoverable ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-md' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  const cardClasses = `
    bg-white rounded-lg overflow-hidden
    ${shadowClasses[shadow]}
    ${borderClass}
    ${hoverableClass}
    ${cursorClass}
    ${className}
  `;

  const hasHeader = title || subtitle;

  return (
    <div className={cardClasses.trim()} onClick={onClick}>
      {hasHeader && (
        <div className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          {title && (
            typeof title === 'string' 
              ? <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              : title
          )}
          {subtitle && (
            typeof subtitle === 'string'
              ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              : subtitle
          )}
        </div>
      )}

      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div className={`px-4 py-3 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}