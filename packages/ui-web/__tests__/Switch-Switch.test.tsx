import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Switch } from '../lib/Switch';

describe('Switch', () => {
  it('renders with label and helper text', () => {
    render(<Switch id="sw" label="Enable" helperText="Help" aria-label="Enable" />);
    expect(screen.getByLabelText('Enable')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('toggles checked state (uncontrolled)', () => {
    render(<Switch id="sw2" label="On" aria-label="On" />);
    const sw = screen.getByLabelText('On') as HTMLInputElement;
    expect(sw.checked).toBe(false);
    fireEvent.click(sw);
    expect(sw.checked).toBe(true);
  });
});
