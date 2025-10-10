import React from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | 'none';
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  caption?: string;
  className?: string;
}

export function DataTable({ 
  columns, 
  data, 
  onSort, 
  onFilter, 
  caption,
  className = '' 
}: DataTableProps) {
  return (
    <div role="region" aria-label="Data table" className={`overflow-x-auto ${className}`}>
      <table role="table" aria-label="Data table" className="min-w-full divide-y divide-gray-200">
        <caption className="sr-only">
          {caption || `Table with ${data.length} rows and ${columns.length} columns`}
        </caption>
        <thead className="bg-gray-50">
          <tr role="row">
            {columns.map((column) => (
              <th
                key={column.key}
                role="columnheader"
                aria-sort={column.sortDirection || 'none'}
                tabIndex={0}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSort?.(column.key);
                  }
                }}
                onClick={() => onSort?.(column.key)}
              >
                {column.label}
                {column.sortable && (
                  <span aria-hidden="true" className="ml-1">
                    {column.sortDirection === 'asc' ? '↑' :
                     column.sortDirection === 'desc' ? '↓' : '↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row.id || index} role="row" className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} role="gridcell" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;