'use client';

import React, { useState, useEffect } from 'react';

type SortDirection = 'asc' | 'desc' | null;

type Column<T> = {
  /**
   * Unique identifier for the column
   */
  id: string;
  
  /**
   * Header text for the column
   */
  header: React.ReactNode;
  
  /**
   * Function to access the cell value
   */
  accessor: (row: T) => any;
  
  /**
   * Custom cell renderer
   */
  cell?: (value: any, row: T, index: number) => React.ReactNode;
  
  /**
   * Whether the column is sortable
   */
  sortable?: boolean;
  
  /**
   * Custom sort function
   */
  sortFn?: (a: T, b: T, direction: SortDirection) => number;
  
  /**
   * Width of the column
   */
  width?: string | number;
  
  /**
   * Whether the column is hidden
   */
  hidden?: boolean;
  
  /**
   * Additional CSS classes for the column
   */
  className?: string;
};

type TableProps<T> = {
  /**
   * Data to display in the table
   */
  data: T[];
  
  /**
   * Column definitions
   */
  columns: Column<T>[];
  
  /**
   * Whether to show a loading state
   */
  loading?: boolean;
  
  /**
   * Whether to enable row selection
   */
  selectable?: boolean;
  
  /**
   * Selected row keys
   */
  selectedRows?: string[];
  
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedRows: string[]) => void;
  
  /**
   * Function to get a unique key for each row
   */
  getRowKey?: (row: T) => string;
  
  /**
   * Whether to enable pagination
   */
  pagination?: boolean;
  
  /**
   * Number of rows per page
   */
  pageSize?: number;
  
  /**
   * Current page index
   */
  currentPage?: number;
  
  /**
   * Total number of rows (for server-side pagination)
   */
  totalRows?: number;
  
  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;
  
  /**
   * Whether to enable sorting
   */
  sortable?: boolean;
  
  /**
   * Default sort column
   */
  defaultSortColumn?: string;
  
  /**
   * Default sort direction
   */
  defaultSortDirection?: SortDirection;
  
  /**
   * Callback when sort changes
   */
  onSortChange?: (column: string, direction: SortDirection) => void;
  
  /**
   * Whether to use server-side sorting
   */
  serverSideSort?: boolean;
  
  /**
   * Whether to show a border
   */
  bordered?: boolean;
  
  /**
   * Whether to stripe rows
   */
  striped?: boolean;
  
  /**
   * Whether to highlight rows on hover
   */
  hoverable?: boolean;
  
  /**
   * Size of the table
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Text to display when there is no data
   */
  emptyText?: React.ReactNode;
  
  /**
   * Whether to make the table scrollable horizontally
   */
  scrollable?: boolean;
  
  /**
   * Maximum height of the table
   */
  maxHeight?: string | number;
  
  /**
   * Whether to show the table header
   */
  showHeader?: boolean;
  
  /**
   * Whether to show the table footer
   */
  showFooter?: boolean;
  
  /**
   * Custom footer renderer
   */
  renderFooter?: (data: T[]) => React.ReactNode;
  
  /**
   * Custom row renderer
   */
  renderRow?: (row: T, index: number) => React.ReactNode;
  
  /**
   * Callback when a row is clicked
   */
  onRowClick?: (row: T, index: number) => void;
};

export default function Table<T>({ 
  data = [],
  columns = [],
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowKey = (row: any) => row.id,
  pagination = false,
  pageSize = 10,
  currentPage = 1,
  totalRows,
  onPageChange,
  sortable = false,
  defaultSortColumn,
  defaultSortDirection = null,
  onSortChange,
  serverSideSort = false,
  bordered = false,
  striped = false,
  hoverable = true,
  size = 'md',
  className = '',
  emptyText = 'No data available',
  scrollable = false,
  maxHeight,
  showHeader = true,
  showFooter = false,
  renderFooter,
  renderRow,
  onRowClick,
}: TableProps<T>) {
  // State for sorting
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  
  // State for pagination
  const [page, setPage] = useState(currentPage);
  
  // State for selection
  const [selected, setSelected] = useState<string[]>(selectedRows);
  
  // Update selected rows when prop changes
  useEffect(() => {
    setSelected(selectedRows);
  }, [selectedRows]);
  
  // Update page when prop changes
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);
  
  // Handle sort change
  const handleSort = (columnId: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.id === columnId);
    if (!column || column.sortable === false) return;
    
    let newDirection: SortDirection = 'asc';
    
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      }
    }
    
    setSortColumn(newDirection === null ? null : columnId);
    setSortDirection(newDirection);
    
    if (onSortChange) {
      onSortChange(columnId, newDirection);
    }
  };
  
  // Handle row selection
  const handleSelectRow = (rowKey: string) => {
    if (!selectable) return;
    
    let newSelected: string[];
    
    if (selected.includes(rowKey)) {
      newSelected = selected.filter(key => key !== rowKey);
    } else {
      newSelected = [...selected, rowKey];
    }
    
    setSelected(newSelected);
    
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };
  
  // Handle select all rows
  const handleSelectAll = () => {
    if (!selectable) return;
    
    let newSelected: string[];
    
    if (selected.length === displayData.length) {
      newSelected = [];
    } else {
      newSelected = displayData.map(row => getRowKey(row));
    }
    
    setSelected(newSelected);
    
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    if (onPageChange) {
      onPageChange(newPage);
    }
  };
  
  // Sort data if client-side sorting is enabled
  const sortedData = React.useMemo(() => {
    if (!sortable || !sortColumn || !sortDirection || serverSideSort) {
      return data;
    }
    
    const column = columns.find(col => col.id === sortColumn);
    if (!column) return data;
    
    return [...data].sort((a, b) => {
      if (column.sortFn) {
        return column.sortFn(a, b, sortDirection);
      }
      
      const aValue = column.accessor(a);
      const bValue = column.accessor(b);
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, columns, sortable, sortColumn, sortDirection, serverSideSort]);
  
  // Paginate data if client-side pagination is enabled
  const paginatedData = React.useMemo(() => {
    if (!pagination || onPageChange) {
      return sortedData;
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return sortedData.slice(start, end);
  }, [sortedData, pagination, page, pageSize, onPageChange]);
  
  // Final data to display
  const displayData = paginatedData;
  
  // Calculate total pages for pagination
  const totalPages = React.useMemo(() => {
    if (totalRows !== undefined) {
      return Math.ceil(totalRows / pageSize);
    }
    
    return Math.ceil(data.length / pageSize);
  }, [data.length, pageSize, totalRows]);
  
  // Determine size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];
  
  const cellPadding = {
    sm: 'px-2 py-1',
    md: 'px-3 py-2',
    lg: 'px-4 py-3',
  }[size];
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Render empty state
  if (displayData.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        {emptyText}
      </div>
    );
  }
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`overflow-hidden ${scrollable ? 'overflow-x-auto' : ''}`}>
        <div style={{ maxHeight: maxHeight }}>
          <table className={`
            w-full border-collapse
            ${bordered ? 'border border-gray-200' : ''}
            ${sizeClasses}
          `}>
            {showHeader && (
              <thead className="bg-gray-50">
                <tr>
                  {selectable && (
                    <th className={`${cellPadding} text-left font-medium text-gray-500`}>
                      <input
                        type="checkbox"
                        checked={displayData.length > 0 && selected.length === displayData.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  
                  {columns.filter(col => !col.hidden).map(column => (
                    <th
                      key={column.id}
                      className={`
                        ${cellPadding} text-left font-medium text-gray-500
                        ${column.sortable !== false && sortable ? 'cursor-pointer select-none' : ''}
                        ${column.className || ''}
                      `}
                      style={{ width: column.width }}
                      onClick={() => column.sortable !== false && sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                        {column.sortable !== false && sortable && sortColumn === column.id && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="18 15 12 9 6 15"></polyline>
                              </svg>
                            ) : sortDirection === 'desc' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            ) : null}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            
            <tbody>
              {displayData.map((row, rowIndex) => {
                const rowKey = getRowKey(row);
                const isSelected = selected.includes(rowKey);
                
                if (renderRow) {
                  return renderRow(row, rowIndex);
                }
                
                return (
                  <tr
                    key={rowKey}
                    className={`
                      ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                      ${hoverable ? 'hover:bg-gray-100' : ''}
                      ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''}
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                    onClick={() => onRowClick && onRowClick(row, rowIndex)}
                  >
                    {selectable && (
                      <td className={cellPadding} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowKey)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    
                    {columns.filter(col => !col.hidden).map(column => {
                      const value = column.accessor(row);
                      
                      return (
                        <td
                          key={`${rowKey}-${column.id}`}
                          className={`${cellPadding} ${column.className || ''}`}
                        >
                          {column.cell ? column.cell(value, row, rowIndex) : value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            
            {showFooter && (
              <tfoot className="bg-gray-50">
                <tr>
                  {renderFooter ? (
                    <td colSpan={columns.length + (selectable ? 1 : 0)} className={cellPadding}>
                      {renderFooter(displayData)}
                    </td>
                  ) : (
                    <>
                      {selectable && <td className={cellPadding}></td>}
                      {columns.filter(col => !col.hidden).map(column => (
                        <td key={`footer-${column.id}`} className={`${cellPadding} font-medium ${column.className || ''}`}>
                          {/* Default footer can show sum, average, etc. */}
                        </td>
                      ))}
                    </>
                  )}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`
                relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
                ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
              `}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`
                relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
                ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
              `}
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalRows || data.length)}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * pageSize, totalRows || data.length)}
                </span>{' '}
                of <span className="font-medium">{totalRows || data.length}</span> results
              </p>
            </div>
            
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`
                    relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400
                    ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                  `}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                        relative inline-flex items-center px-4 py-2 text-sm font-semibold
                        ${page === pageNum
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'}
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`
                    relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400
                    ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                  `}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}