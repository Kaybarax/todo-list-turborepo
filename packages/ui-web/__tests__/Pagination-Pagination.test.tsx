import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Pagination } from '../lib/Pagination';

describe('Pagination', () => {
  it('renders navigation with buttons and current page', () => {
    render(<Pagination currentPage={3} totalPages={10} />);
    const nav = screen.getByRole('navigation', { name: /pagination/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /page 3/i })).toHaveAttribute('aria-current', 'page');
  });

  it('invokes onPageChange when next/prev clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
