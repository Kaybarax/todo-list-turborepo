import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Combobox } from '../lib/Combobox';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
];

describe('Combobox', () => {
  it('opens on focus and filters results', () => {
    render(<Combobox aria-label="fruits" options={options} />);
    const input = screen.getByRole('combobox');
    input.focus();
    expect(input).toHaveAttribute('aria-expanded', 'true');

    fireEvent.change(input, { target: { value: 'ban' } });
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('navigates with keyboard and selects with Enter', () => {
    render(<Combobox aria-label="fruits" options={options} />);
    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    // On single-select, list should close
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports multiple selection', () => {
    render(<Combobox aria-label="fruits" options={options} multiple />);
    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    // stays open for multiple
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });
});
