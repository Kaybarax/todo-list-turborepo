import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Divider } from '../lib/Divider';

describe('Divider', () => {
  it('renders with role separator and horizontal orientation by default', () => {
    render(<Divider label="Section" />);
    const el = screen.getByRole('separator');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('supports vertical orientation', () => {
    render(
      <div>
        <span>A</span>
        <Divider orientation="vertical" />
        <span>B</span>
      </div>,
    );
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });
});
