import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Spacer } from '../Spacer';

describe('Spacer', () => {
  it('renders with vertical default', () => {
    render(<Spacer data-testid="sp" />);
    const el = screen.getByTestId('sp');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-hidden');
  });

  it('applies size and direction classes', () => {
    render(<Spacer data-testid="sp2" size="px" direction="horizontal" />);
    const el = screen.getByTestId('sp2');
    expect(el).toHaveClass('w-px');
  });
});
