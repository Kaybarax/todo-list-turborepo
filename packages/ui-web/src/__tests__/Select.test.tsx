import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { Select, SelectItem } from '../components/Select/Select';

describe('Select', () => {
  it('renders correctly', () => {
    render(
      <Select aria-label="Test select">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Select className="test-class" aria-label="Test select">
        <option value="option1">Option 1</option>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('test-class');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(
      <Select onChange={handleChange} aria-label="Test select">
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>,
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'option1' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('displays helper text when provided', () => {
    render(
      <Select helperText="Choose an option" aria-label="Test select">
        <option value="option1">Option 1</option>
      </Select>,
    );
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('displays error helper text with correct styles', () => {
    render(
      <Select error helperText="This field is required" aria-label="Test select">
        <option value="option1">Option 1</option>
      </Select>,
    );
    const helperText = screen.getByText('This field is required');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-red-600');
  });

  it('displays normal helper text with correct styles', () => {
    render(
      <Select helperText="Choose wisely" aria-label="Test select">
        <option value="option1">Option 1</option>
      </Select>,
    );
    const helperText = screen.getByText('Choose wisely');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-600');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Select disabled aria-label="Test select">
        <option value="option1">Option 1</option>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('passes through HTML attributes', () => {
    render(
      <Select id="test-id" name="test-name" required aria-label="Test select" data-testid="test-select">
        <option value="option1">Option 1</option>
      </Select>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'test-id');
    expect(select).toHaveAttribute('name', 'test-name');
    expect(select).toHaveAttribute('required');
    expect(select).toHaveAttribute('data-testid', 'test-select');
  });

  it('handles multiple options', () => {
    render(
      <Select aria-label="Test select">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>,
    );

    const select = screen.getByRole('combobox');
    expect(select.children).toHaveLength(3);
  });

  it('supports controlled component pattern', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('option1');
      return (
        <Select value={value} onChange={e => setValue(e.target.value)} aria-label="Test select">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </Select>
      );
    };

    render(<TestComponent />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('option1');

    fireEvent.change(select, { target: { value: 'option2' } });
    expect(select.value).toBe('option2');
  });

  it('provides accessibility with aria-label', () => {
    render(
      <Select aria-label="Choose your country">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Choose your country');
  });

  it('provides accessibility with aria-labelledby', () => {
    render(
      <div>
        <label id="select-label">Country</label>
        <Select aria-labelledby="select-label">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </Select>
      </div>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-labelledby', 'select-label');
  });

  it('provides fallback aria-label when none is provided', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Select option');
  });

  it('works in form context', () => {
    const handleSubmit = vi.fn(e => e.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <Select name="country" aria-label="Country">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </Select>
        <button type="submit">Submit</button>
      </form>,
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ca' } });
    fireEvent.click(screen.getByRole('button'));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <Select onFocus={handleFocus} onBlur={handleBlur} aria-label="Test select">
        <option value="option1">Option 1</option>
      </Select>,
    );

    const select = screen.getByRole('combobox');
    fireEvent.focus(select);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(select);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});

describe('SelectItem', () => {
  it('renders as an option element', () => {
    render(
      <select>
        <SelectItem value="test">Test Option</SelectItem>
      </select>,
    );
    expect(screen.getByRole('option')).toBeInTheDocument();
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('has correct value attribute', () => {
    render(
      <select>
        <SelectItem value="test-value">Test Option</SelectItem>
      </select>,
    );
    expect(screen.getByRole('option')).toHaveAttribute('value', 'test-value');
  });
});
