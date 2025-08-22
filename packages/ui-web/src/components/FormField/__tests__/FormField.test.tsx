import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { FormField } from '../FormField';
import { Input } from '../../Input/Input';

describe('FormField', () => {
  it('renders label and helper text and wires aria attributes', () => {
    render(
      <FormField id="email" label="Email" helperText="We won't share" error>
        <Input type="email" placeholder="you@example.com" aria-label="Email" />
      </FormField>,
    );

    const input = screen.getByLabelText('Email');
    expect(screen.getByText("We won't share")).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });
});
