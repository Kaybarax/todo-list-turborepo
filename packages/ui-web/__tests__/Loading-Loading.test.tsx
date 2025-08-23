import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Loading } from '../lib/Loading';

describe('Loading', () => {
  it('renders with role status and sr-only label', () => {
    render(<Loading label="Please wait" />);
    const el = screen.getByRole('status');
    expect(el).toBeInTheDocument();
    expect(screen.getByText('Please wait')).toHaveClass('sr-only');
  });
});
