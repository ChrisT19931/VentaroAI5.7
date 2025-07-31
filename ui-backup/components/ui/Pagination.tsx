import React from 'react';
import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
  className?: string;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxDisplayed?: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  className = '',
  showFirstLast = true,
  showPrevNext = true,
  maxDisplayed = 5,
}: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Ensure current page is within valid range
  const page = Math.max(1, Math.min(currentPage, totalPages));

  // Calculate the range of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const halfMax = Math.floor(maxDisplayed / 2);
    
    let startPage = Math.max(1, page - halfMax);
    let endPage = Math.min(totalPages, startPage + maxDisplayed - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxDisplayed) {
      startPage = Math.max(1, endPage - maxDisplayed + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Generate URL for a page
  const getPageUrl = (pageNum: number) => {
    if (!baseUrl) return '#';
    return baseUrl.includes('?')
      ? `${baseUrl}&page=${pageNum}`
      : `${baseUrl}?page=${pageNum}`;
  };

  // Render a page button
  const renderPageButton = (pageNum: number, label?: string, disabled = false) => {
    const isCurrentPage = pageNum === page;
    const buttonLabel = label || pageNum.toString();
    
    const baseClasses = 'flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md';
    const activeClasses = 'bg-primary-600 text-white';
    const inactiveClasses = 'bg-white text-gray-700 hover:bg-gray-50';
    const disabledClasses = 'bg-gray-100 text-gray-400 cursor-not-allowed';
    
    const classes = `${baseClasses} ${
      disabled
        ? disabledClasses
        : isCurrentPage
        ? activeClasses
        : inactiveClasses
    }`;
    
    if (baseUrl) {
      return (
        <Link
          href={disabled ? '#' : getPageUrl(pageNum)}
          className={classes}
          aria-current={isCurrentPage ? 'page' : undefined}
          aria-disabled={disabled}
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
        >
          {buttonLabel}
        </Link>
      );
    }
    
    return (
      <button
        onClick={() => !disabled && handlePageChange(pageNum)}
        className={classes}
        disabled={disabled || isCurrentPage}
        aria-current={isCurrentPage ? 'page' : undefined}
      >
        {buttonLabel}
      </button>
    );
  };

  return (
    <nav className={`flex justify-center mt-8 ${className}`} aria-label="Pagination">
      <ul className="inline-flex space-x-1">
        {/* First page button */}
        {showFirstLast && (
          <li>
            {renderPageButton(1, '«', page === 1)}
          </li>
        )}
        
        {/* Previous page button */}
        {showPrevNext && (
          <li>
            {renderPageButton(page - 1, '‹', page === 1)}
          </li>
        )}
        
        {/* Show ellipsis if not starting from page 1 */}
        {pageNumbers[0] > 1 && (
          <li className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700">
            ...
          </li>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map((pageNum) => (
          <li key={pageNum}>
            {renderPageButton(pageNum)}
          </li>
        ))}
        
        {/* Show ellipsis if not ending at last page */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <li className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700">
            ...
          </li>
        )}
        
        {/* Next page button */}
        {showPrevNext && (
          <li>
            {renderPageButton(page + 1, '›', page === totalPages)}
          </li>
        )}
        
        {/* Last page button */}
        {showFirstLast && (
          <li>
            {renderPageButton(totalPages, '»', page === totalPages)}
          </li>
        )}
      </ul>
    </nav>
  );
}