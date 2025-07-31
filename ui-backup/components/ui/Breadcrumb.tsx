import React from 'react';
import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  maxItems?: number;
  showEllipsis?: boolean;
};

export default function Breadcrumb({
  items,
  className = '',
  separator = '/',
  maxItems = 0,
  showEllipsis = true,
}: BreadcrumbProps) {
  // If maxItems is set and there are more items than maxItems, truncate the list
  const visibleItems = maxItems > 0 && items.length > maxItems
    ? [
        ...items.slice(0, 1), // Always show the first item
        ...items.slice(items.length - (maxItems - 1)) // Show the last (maxItems - 1) items
      ]
    : items;

  // Determine if we need to show ellipsis
  const showEllipsisItem = maxItems > 0 && items.length > maxItems && showEllipsis;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2 text-sm">
        {visibleItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === visibleItems.length - 1;
          
          // Show ellipsis after the first item if needed
          const shouldShowEllipsis = showEllipsisItem && isFirst && items.length > maxItems;
          
          return (
            <React.Fragment key={item.label}>
              <li className="flex items-center">
                {item.href && !item.isCurrent ? (
                  <Link 
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span 
                    className={`${item.isCurrent ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                    aria-current={item.isCurrent ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              
              {/* Show separator if not the last item */}
              {!isLast && (
                <li className="text-gray-400 flex items-center">
                  {typeof separator === 'string' ? separator : separator}
                </li>
              )}
              
              {/* Show ellipsis if needed */}
              {shouldShowEllipsis && (
                <>
                  <li className="text-gray-400 flex items-center">
                    {typeof separator === 'string' ? separator : separator}
                  </li>
                  <li className="text-gray-600">...</li>
                </>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}