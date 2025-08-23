import React from 'react';

import { cn } from '@/utils';

export interface Column<T> {
  key: keyof T | string;
  header: React.ReactNode;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSortChange?: (key: string, dir: 'asc' | 'desc') => void;
  caption?: string;
}

export function Table<T extends Record<string, any>>({
  className,
  columns,
  data,
  sortKey,
  sortDir = 'asc',
  onSortChange,
  caption,
  ...props
}: TableProps<T>) {
  const onSort = (key: string) => {
    if (!onSortChange) return;
    const next = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    onSortChange(key, next);
  };

  return (
    <table className={cn('table w-full', className)} {...props}>
      {caption ? <caption className="text-left mb-2">{caption}</caption> : null}
      <thead>
        <tr>
          {columns.map(col => {
            const key = String(col.key);
            const isSorted = sortKey === key;
            return (
              <th key={key} scope="col">
                {col.sortable && onSortChange ? (
                  <button
                    type="button"
                    className="underline underline-offset-4"
                    aria-sort={isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    onClick={() => onSort(key)}
                  >
                    {col.header}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td key={String(col.key)}>{col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
