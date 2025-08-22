import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Toggle } from '../Toggle';

describe('Toggle', () => {
  it('renders and toggles aria-pressed on click (uncontrolled)', () => {
    render(<Toggle>Toggle</Toggle>);
    const btn = screen.getByRole('button', { name: 'Toggle' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('respects controlled pressed prop', () => {
    const { rerender } = render(<Toggle pressed>On</Toggle>);
    const btn = screen.getByRole('button', { name: 'On' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(btn);
    // Still true because controlled
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    rerender(<Toggle pressed={false}>On</Toggle>);
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });
});
