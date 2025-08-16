import React from "react";

// Generic column configuration interface
export interface ColumnConfig<T> {
  key: string;
  label: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
}

// Table props interface
interface TableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  isScrollable?: boolean;
  height?: string;
}

// Generic reusable Table component
export function Table<T extends { id: number | string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data available",
  className = "",
  headerClassName = "",
  rowClassName = "",
  isScrollable = false,
  height = "auto"
}: TableProps<T>) {
  // Helper function to get cell value
  const getCellValue = (item: T, column: ColumnConfig<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor] as React.ReactNode;
  };

  // Helper function to get row class name
  const getRowClassName = (item: T, index: number) => {
    const baseClass = `transition-all duration-200 ${
      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
    } hover:bg-violet-50`;
    
    const clickableClass = onRowClick ? 'cursor-pointer hover:shadow-sm group' : '';
    
    if (typeof rowClassName === 'function') {
      return `${baseClass} ${clickableClass} ${rowClassName(item, index)}`;
    }
    
    return `${baseClass} ${clickableClass} ${rowClassName}`;
  };

  const tableContent = (
    <table className={`min-w-full bg-white ${className}`}>
      <thead className={`${isScrollable ? 'sticky top-0 z-10' : ''} bg-gray-100 ${headerClassName}`}>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`py-3 px-4 text-left font-semibold text-gray-700 text-sm ${column.headerClassName || ''}`}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="py-12 px-4 text-center text-gray-500 text-sm"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr
              key={item.id}
              className={getRowClassName(item, index)}
              onClick={() => onRowClick?.(item)}
              title={onRowClick ? "Click to view details" : undefined}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`py-3 px-4 text-sm ${column.className || 'text-gray-600'}`}
                >
                  {getCellValue(item, column)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  if (isScrollable) {
    return (
      <div 
        className="overflow-y-auto border border-gray-200 rounded-lg"
        style={{ height }}
      >
        {tableContent}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      {tableContent}
    </div>
  );
}
