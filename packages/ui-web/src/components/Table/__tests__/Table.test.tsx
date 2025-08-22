import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Table, type Column } from '../Table';

type Row = { name: string; age: number };

describe('Table', () => {
  const columns: Column<Row>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'age', header: 'Age', sortable: true },
  ];
  const data: Row[] = [
    { name: 'Alice', age: 31 },
    { name: 'Bob', age: 27 },
  ];

  it('renders headers and rows', () => {
    render(<Table<Row> columns={columns} data={data} caption="People" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('invokes onSortChange when sortable header clicked', () => {
    const onSortChange = vi.fn();
    render(<Table<Row> columns={columns} data={data} onSortChange={onSortChange} sortKey="name" sortDir="asc" />);
    fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'desc');
  });
});
