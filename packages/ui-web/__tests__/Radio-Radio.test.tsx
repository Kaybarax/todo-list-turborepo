import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Radio } from '../lib/Radio';

describe('Radio', () => {
  it('renders with label and helper text', () => {
    render(<Radio id="r1" name="g" label="Option A" helperText="Help" aria-label="Option A" />);
    expect(screen.getByLabelText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('applies size and state variants', () => {
    const { rerender } = render(<Radio id="r2" name="g" size="sm" label="A" aria-label="A" />);
    const input = screen.getByLabelText('A') as HTMLInputElement;
    expect(input).toHaveClass('radio-sm');

    rerender(<Radio id="r3" name="g" state="error" label="B" aria-label="B" />);
    const input2 = screen.getByLabelText('B') as HTMLInputElement;
    expect(input2).toHaveClass('radio-error');
  });
});
