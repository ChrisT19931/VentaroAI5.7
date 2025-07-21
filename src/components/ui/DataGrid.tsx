'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

type SortDirection = 'asc' | 'desc' | null;

type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';

type FilterValue = string | number | boolean | Date | Array<string | number | Date> | null;

type Filter = {
  /**
   * Field to filter on
   */
  field: string;
  
  /**
   * Operator to use for filtering
   */
  operator: FilterOperator;
  
  /**
   * Value to filter by
   */
  value: FilterValue;
};

type SortModel = {
  /**
   * Field to sort by
   */
  field: string;
  
  /**
   * Sort direction
   */
  direction: SortDirection;
};

type ColumnDefinition<T> = {
  /**
   * Field name in the data object
   */
  field: keyof T | string;
  
  /**
   * Header text for the column
   */
  headerName: string;
  
  /**
   * Width of the column
   */
  width?: number | string;
  
  /**
   * Whether the column is sortable
   */
  sortable?: boolean;
  
  /**
   * Whether the column is filterable
   */
  filterable?: boolean;
  
  /**
   * Whether the column is resizable
   */
  resizable?: boolean;
  
  /**
   * Whether the column is hidden
   */
  hidden?: boolean;
  
  /**
   * Custom cell renderer
   */
  renderCell?: (params: { row: T; value: any }) => React.ReactNode;
  
  /**
   * Custom header renderer
   */
  renderHeader?: (params: { column: ColumnDefinition<T> }) => React.ReactNode;
  
  /**
   * Custom sort function
   */
  sortComparator?: (a: any, b: any, direction: SortDirection) => number;
  
  /**
   * Custom filter function
   */
  filterOperators?: FilterOperator[];
  
  /**
   * Type of the column for filtering
   */
  type?: 'string' | 'number' | 'boolean' | 'date';
  
  /**
   * Alignment of the column content
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Whether the column is pinned
   */
  pinned?: 'left' | 'right' | null;
  
  /**
   * Whether the column is editable
   */
  editable?: boolean;
};

type DataGridProps<T> = {
  /**
   * Array of data items
   */
  rows: T[];
  
  /**
   * Array of column definitions
   */
  columns: ColumnDefinition<T>[];
  
  /**
   * Whether to enable sorting
   */
  sortable?: boolean;
  
  /**
   * Whether to enable filtering
   */
  filterable?: boolean;
  
  /**
   * Whether to enable pagination
   */
  pagination?: boolean;
  
  /**
   * Number of rows per page
   */
  pageSize?: number;
  
  /**
   * Available page size options
   */
  pageSizeOptions?: number[];
  
  /**
   * Whether to enable row selection
   */
  rowSelection?: boolean;
  
  /**
   * Selection mode
   */
  selectionMode?: 'single' | 'multiple';
  
  /**
   * Whether to enable row hover effect
   */
  hoverEffect?: boolean;
  
  /**
   * Whether to enable zebra striping
   */
  striped?: boolean;
  
  /**
   * Whether to show borders
   */
  bordered?: boolean;
  
  /**
   * Whether to enable column resizing
   */
  resizableColumns?: boolean;
  
  /**
   * Whether to enable row reordering
   */
  reorderableRows?: boolean;
  
  /**
   * Whether to enable column reordering
   */
  reorderableColumns?: boolean;
  
  /**
   * Height of the grid
   */
  height?: number | string;
  
  /**
   * Width of the grid
   */
  width?: number | string;
  
  /**
   * Whether the grid is loading
   */
  loading?: boolean;
  
  /**
   * Text to display when there are no rows
   */
  noRowsText?: string;
  
  /**
   * Callback when a row is clicked
   */
  onRowClick?: (params: { row: T; index: number }) => void;
  
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedRows: T[]) => void;
  
  /**
   * Callback when sorting changes
   */
  onSortChange?: (model: SortModel) => void;
  
  /**
   * Callback when filtering changes
   */
  onFilterChange?: (filters: Filter[]) => void;
  
  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;
  
  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
  
  /**
   * Callback when a cell is edited
   */
  onCellEdit?: (params: { row: T; field: keyof T; value: any }) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
};

export default function DataGrid<T extends Record<string, any>>(
  {
    rows,
    columns,
    sortable = true,
    filterable = false,
    pagination = true,
    pageSize = 10,
    pageSizeOptions = [5, 10, 25, 50, 100],
    rowSelection = false,
    selectionMode = 'multiple',
    hoverEffect = true,
    striped = false,
    bordered = true,
    resizableColumns = false,
    reorderableRows = false,
    reorderableColumns = false,
    height = 400,
    width = '100%',
    loading = false,
    noRowsText = 'No rows',
    onRowClick,
    onSelectionChange,
    onSortChange,
    onFilterChange,
    onPageChange,
    onPageSizeChange,
    onCellEdit,
    className = '',
  }: DataGridProps<T>
) {
  // State for sorting
  const [sortModel, setSortModel] = useState<SortModel | null>(null);
  
  // State for filtering
  const [filters, setFilters] = useState<Filter[]>([]);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  
  // State for selection
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  
  // State for column widths (for resizable columns)
  const [columnWidths, setColumnWidths] = useState<Record<string, number | string>>({});
  
  // State for column order (for reorderable columns)
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map(column => String(column.field))
  );
  
  // Reset pagination when rows or page size changes
  useEffect(() => {
    setCurrentPage(0);
  }, [rows, currentPageSize]);
  
  // Update page size when prop changes
  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);
  
  // Apply sorting to rows
  const sortedRows = useMemo(() => {
    if (!sortModel || !sortable) return [...rows];
    
    const { field, direction } = sortModel;
    if (!direction) return [...rows];
    
    const column = columns.find(col => col.field === field);
    
    return [...rows].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      // Use custom comparator if provided
      if (column?.sortComparator) {
        return column.sortComparator(valueA, valueB, direction);
      }
      
      // Default sorting logic
      if (valueA === valueB) return 0;
      
      if (valueA === null || valueA === undefined) return direction === 'asc' ? -1 : 1;
      if (valueB === null || valueB === undefined) return direction === 'asc' ? 1 : -1;
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return direction === 'asc'
        ? valueA < valueB ? -1 : 1
        : valueA < valueB ? 1 : -1;
    });
  }, [rows, sortModel, sortable, columns]);
  
  // Apply filtering to rows
  const filteredRows = useMemo(() => {
    if (!filterable || filters.length === 0) return sortedRows;
    
    return sortedRows.filter(row => {
      return filters.every(filter => {
        const { field, operator, value } = filter;
        const cellValue = row[field];
        
        if (value === null || value === undefined) return true;
        if (cellValue === null || cellValue === undefined) return false;
        
        switch (operator) {
          case 'equals':
            return cellValue === value;
          case 'contains':
            return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
          case 'startsWith':
            return String(cellValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(cellValue).toLowerCase().endsWith(String(value).toLowerCase());
          case 'greaterThan':
            return cellValue > value;
          case 'lessThan':
            return cellValue < value;
          case 'between':
            if (Array.isArray(value) && value.length === 2) {
              return cellValue >= value[0] && cellValue <= value[1];
            }
            return true;
          default:
            return true;
        }
      });
    });
  }, [sortedRows, filters, filterable]);
  
  // Apply pagination to rows
  const paginatedRows = useMemo(() => {
    if (!pagination) return filteredRows;
    
    const startIndex = currentPage * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, pagination, currentPage, currentPageSize]);
  
  // Get visible columns based on hidden property and column order
  const visibleColumns = useMemo(() => {
    const visible = columns.filter(column => !column.hidden);
    
    if (reorderableColumns) {
      return columnOrder
        .map(field => visible.find(col => String(col.field) === field))
        .filter(Boolean) as ColumnDefinition<T>[];
    }
    
    return visible;
  }, [columns, reorderableColumns, columnOrder]);
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    const column = columns.find(col => col.field === field);
    if (!sortable || (column && column.sortable === false)) return;
    
    let direction: SortDirection = 'asc';
    
    if (sortModel && sortModel.field === field) {
      if (sortModel.direction === 'asc') {
        direction = 'desc';
      } else if (sortModel.direction === 'desc') {
        direction = null;
      }
    }
    
    const newSortModel = direction ? { field, direction } : null;
    setSortModel(newSortModel);
    
    if (onSortChange && newSortModel) {
      onSortChange(newSortModel);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (newFilter: Filter) => {
    const existingFilterIndex = filters.findIndex(f => f.field === newFilter.field);
    
    let updatedFilters: Filter[];
    
    if (existingFilterIndex >= 0) {
      if (newFilter.value === null || newFilter.value === '') {
        // Remove filter if value is empty
        updatedFilters = filters.filter((_, index) => index !== existingFilterIndex);
      } else {
        // Update existing filter
        updatedFilters = [
          ...filters.slice(0, existingFilterIndex),
          newFilter,
          ...filters.slice(existingFilterIndex + 1)
        ];
      }
    } else {
      // Add new filter
      updatedFilters = [...filters, newFilter];
    }
    
    setFilters(updatedFilters);
    setCurrentPage(0); // Reset to first page when filter changes
    
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(0); // Reset to first page when page size changes
    
    if (onPageSizeChange) {
      onPageSizeChange(size);
    }
  };
  
  // Handle row selection
  const handleRowSelect = (row: T) => {
    if (!rowSelection) return;
    
    let newSelectedRows: T[];
    
    if (selectionMode === 'single') {
      // Single selection mode
      newSelectedRows = isRowSelected(row) ? [] : [row];
    } else {
      // Multiple selection mode
      if (isRowSelected(row)) {
        newSelectedRows = selectedRows.filter(r => r !== row);
      } else {
        newSelectedRows = [...selectedRows, row];
      }
    }
    
    setSelectedRows(newSelectedRows);
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }
  };
  
  // Check if a row is selected
  const isRowSelected = (row: T) => {
    return selectedRows.includes(row);
  };
  
  // Handle row click
  const handleRowClick = (row: T, index: number) => {
    if (onRowClick) {
      onRowClick({ row, index });
    }
  };
  
  // Handle cell edit
  const handleCellEdit = (row: T, field: keyof T, value: any) => {
    if (onCellEdit) {
      onCellEdit({ row, field, value });
    }
  };
  
  // Handle column resize
  const handleColumnResize = (field: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [field]: width
    }));
  };
  
  // Handle column reorder
  const handleColumnReorder = (dragIndex: number, hoverIndex: number) => {
    const dragField = columnOrder[dragIndex];
    const newColumnOrder = [...columnOrder];
    newColumnOrder.splice(dragIndex, 1);
    newColumnOrder.splice(hoverIndex, 0, dragField);
    setColumnOrder(newColumnOrder);
  };
  
  // Render header cell
  const renderHeaderCell = (column: ColumnDefinition<T>) => {
    const isSorted = sortModel?.field === column.field;
    const sortDirection = isSorted ? sortModel.direction : null;
    
    return (
      <div
        className={`px-4 py-2 font-semibold flex items-center justify-${column.align || 'left'} ${column.sortable !== false && sortable ? 'cursor-pointer select-none' : ''}`}
        onClick={() => column.sortable !== false && sortable && handleSortChange(String(column.field))}
      >
        {column.renderHeader ? (
          column.renderHeader({ column })
        ) : (
          <span>{column.headerName}</span>
        )}
        
        {column.sortable !== false && sortable && (
          <span className="ml-1">
            {sortDirection === 'asc' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
            {sortDirection === 'desc' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {!sortDirection && (
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            )}
          </span>
        )}
        
        {resizableColumns && column.resizable !== false && (
          <div
            className="absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize hover:bg-blue-500"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = columnWidths[String(column.field)] || 150;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newWidth = Math.max(50, Number(startWidth) + (moveEvent.clientX - startX));
                handleColumnResize(String(column.field), newWidth);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        )}
      </div>
    );
  };
  
  // Render filter cell
  const renderFilterCell = (column: ColumnDefinition<T>) => {
    if (!filterable || column.filterable === false) return null;
    
    const currentFilter = filters.find(f => f.field === column.field);
    
    return (
      <div className="px-2 py-1">
        <input
          type="text"
          className="w-full px-2 py-1 text-sm border rounded"
          placeholder={`Filter ${column.headerName}`}
          value={currentFilter?.value as string || ''}
          onChange={(e) => {
            handleFilterChange({
              field: String(column.field),
              operator: 'contains',
              value: e.target.value
            });
          }}
        />
      </div>
    );
  };
  
  // Render cell content
  const renderCell = (row: T, column: ColumnDefinition<T>) => {
    const value = row[column.field as keyof T];
    
    if (column.renderCell) {
      return column.renderCell({ row, value });
    }
    
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    
    return String(value);
  };
  
  // Render editable cell
  const renderEditableCell = (row: T, column: ColumnDefinition<T>) => {
    if (!column.editable) {
      return (
        <div className={`px-4 py-2 text-${column.align || 'left'}`}>
          {renderCell(row, column)}
        </div>
      );
    }
    
    const value = row[column.field as keyof T];
    
    return (
      <div className={`px-4 py-2 text-${column.align || 'left'}`}>
        <input
          type="text"
          className="w-full px-2 py-1 border rounded"
          value={String(value || '')}
          onChange={(e) => handleCellEdit(row, column.field as keyof T, e.target.value)}
        />
      </div>
    );
  };
  
  // Render pagination controls
  const renderPagination = () => {
    if (!pagination) return null;
    
    const totalPages = Math.ceil(filteredRows.length / currentPageSize);
    
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Rows per page:
          </span>
          <select
            className="px-2 py-1 text-sm border rounded"
            value={currentPageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-700">
            {currentPage * currentPageSize + 1}-
            {Math.min((currentPage + 1) * currentPageSize, filteredRows.length)} of {filteredRows.length}
          </span>
          
          <button
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
            aria-label="First page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            aria-label="Last page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div
      className={`data-grid ${className}`}
      style={{
        width: width,
        height: typeof height === 'number' ? `${height}px` : height,
        overflow: 'auto'
      }}
    >
      <div className={`relative ${bordered ? 'border border-gray-200 rounded-md' : ''}`}>
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="mt-2 text-gray-700">Loading...</span>
            </div>
          </div>
        )}
        
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {/* Selection column */}
                {rowSelection && (
                  <th className="w-10 px-4 py-2 border-b">
                    {selectionMode === 'multiple' && (
                      <input
                        type="checkbox"
                        checked={selectedRows.length > 0 && selectedRows.length === paginatedRows.length}
                        onChange={() => {
                          if (selectedRows.length === paginatedRows.length) {
                            setSelectedRows([]);
                            if (onSelectionChange) onSelectionChange([]);
                          } else {
                            setSelectedRows([...paginatedRows]);
                            if (onSelectionChange) onSelectionChange([...paginatedRows]);
                          }
                        }}
                      />
                    )}
                  </th>
                )}
                
                {/* Column headers */}
                {visibleColumns.map((column, index) => (
                  <th
                    key={String(column.field)}
                    className={`relative ${bordered ? 'border-b border-r last:border-r-0' : 'border-b'}`}
                    style={{
                      width: columnWidths[String(column.field)] || column.width || 'auto',
                      minWidth: '100px'
                    }}
                  >
                    {renderHeaderCell(column)}
                    {filterable && renderFilterCell(column)}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`
                      ${hoverEffect ? 'hover:bg-gray-50' : ''}
                      ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                      ${isRowSelected(row) ? 'bg-blue-50' : ''}
                    `}
                    onClick={() => handleRowClick(row, rowIndex)}
                  >
                    {/* Selection cell */}
                    {rowSelection && (
                      <td className={`w-10 px-4 py-2 ${bordered ? 'border-b border-r' : 'border-b'}`}>
                        <input
                          type={selectionMode === 'multiple' ? 'checkbox' : 'radio'}
                          checked={isRowSelected(row)}
                          onChange={() => handleRowSelect(row)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    
                    {/* Data cells */}
                    {visibleColumns.map((column, colIndex) => (
                      <td
                        key={String(column.field)}
                        className={`${bordered ? 'border-b border-r last:border-r-0' : 'border-b'}`}
                      >
                        {renderEditableCell(row, column)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={rowSelection ? visibleColumns.length + 1 : visibleColumns.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {noRowsText}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}