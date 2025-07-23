import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Test placeholder" />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Input className="test-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('test-class');
  });

  it('renders with error styles when error prop is true', () => {
    render(<Input error />);
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive');
  });

  it('renders helper text when provided', () => {
    render(<Input helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders error helper text with correct styles', () => {
    render(<Input error helperText="Error message" />);
    const helperText = screen.getByText('Error message');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-destructive');
  });

  it('renders with left icon', () => {
    render(<Input leftIcon={<span data-testid="left-icon" />} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('pl-10');
  });

  it('renders with right icon', () => {
    render(<Input rightIcon={<span data-testid="right-icon" />} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('pr-10');
  });

  it('renders with both icons', () => {
    render(
      <Input 
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      />
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('pl-10');
    expect(screen.getByRole('textbox')).toHaveClass('pr-10');
  });

  it('passes through HTML attributes', () => {
    render(
      <Input 
        id="test-id"
        name="test-name"
        value="test-value"
        readOnly
        aria-label="test-label"
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-id');
    expect(input).toHaveAttribute('name', 'test-name');
    expect(input).toHaveAttribute('value', 'test-value');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('aria-label', 'test-label');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});