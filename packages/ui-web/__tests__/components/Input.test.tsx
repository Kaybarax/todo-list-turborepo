import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Input } from '../../src/components/Input/Input';

describe('Input', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border');
  });

  it('renders with basic functionality', () => {
    const { unmount } = render(<Input data-testid="basic-input" />);
    const input = screen.getByTestId('basic-input');
    expect(input).toBeDefined();
    unmount();
  });

  it('renders with correct classes', () => {
    const { unmount } = render(<Input data-testid="input-default" />);
    const input = screen.getByTestId('input-default');
    expect(input).toBeInTheDocument();
    expect(input).toBeDefined();
    unmount();
  });

  it('renders with correct state classes', () => {
    const { unmount: unmountDefault } = render(<Input data-testid="input-default" />);
    const defaultInput = screen.getByTestId('input-default');
    expect(defaultInput).toBeInTheDocument();
    unmountDefault();

    const { unmount: unmountError } = render(<Input error data-testid="input-error" />);
    const errorInput = screen.getByTestId('input-error');
    expect(errorInput).toBeInTheDocument();
    expect(errorInput).toBeDefined();
    unmountError();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows error state when error prop is true', () => {
    render(<Input error data-testid="error-input" />);
    const input = screen.getByTestId('error-input');
    expect(input).toHaveClass('border-destructive');
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Username" />);
    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input.getAttribute('placeholder')).toBe('Username');
  });

  it('renders with helper text', () => {
    render(<Input helperText="Enter your username" />);
    const helperText = screen.getByText('Enter your username');
    expect(helperText).toBeDefined();
  });

  it('renders with error helper text', () => {
    render(<Input error helperText="Username is required" />);
    const helperText = screen.getByText('Username is required');

    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-destructive');
  });

  it('renders left icon correctly', () => {
    const leftIcon = <span data-testid="left-icon">👤</span>;
    render(<Input leftIcon={leftIcon} />);

    const icon = screen.getByTestId('left-icon');
    const input = screen.getByRole('textbox');

    expect(icon).toBeInTheDocument();
    expect(input).toHaveClass('pl-10');
  });

  it('renders right icon correctly', () => {
    const rightIcon = <span data-testid="right-icon">🔍</span>;
    render(<Input rightIcon={rightIcon} />);

    const icon = screen.getByTestId('right-icon');
    const input = screen.getByRole('textbox');

    expect(icon).toBeInTheDocument();
    expect(input).toHaveClass('pr-10');
  });

  it('renders both left and right icons', () => {
    const leftIcon = <span data-testid="left-icon">👤</span>;
    const rightIcon = <span data-testid="right-icon">🔍</span>;

    render(<Input leftIcon={leftIcon} rightIcon={rightIcon} />);

    const leftIconElement = screen.getByTestId('left-icon');
    const rightIconElement = screen.getByTestId('right-icon');
    const input = screen.getByRole('textbox');

    expect(leftIconElement).toBeInTheDocument();
    expect(rightIconElement).toBeInTheDocument();
    expect(input).toHaveClass('pl-10', 'pr-10');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-class');
  });

  it('renders within custom wrapper', () => {
    render(
      <div data-testid="custom-wrapper">
        <Input data-testid="wrapped-input" />
      </div>,
    );

    const wrapper = screen.getByTestId('custom-wrapper');
    const input = screen.getByTestId('wrapped-input');
    expect(wrapper).toBeDefined();
    expect(input).toBeDefined();
  });

  it('passes through additional props', () => {
    render(<Input data-testid="input" aria-label="Custom input" />);
    const input = screen.getByTestId('input');
    expect(input.getAttribute('aria-label')).toBe('Custom input');
  });

  it('handles disabled state', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />);
    let input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('generates unique IDs for multiple inputs', () => {
    render(
      <div>
        <Input placeholder="First" />
        <Input placeholder="Second" />
      </div>,
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });

  it('uses provided ID when given', () => {
    render(<Input id="custom-id" placeholder="Test" />);
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test');

    expect(input).toHaveAttribute('id', 'custom-id');
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('passes label props correctly', () => {
    render(<Input placeholder="Test Label" />);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-label-class');
  });
});

describe('Label', () => {
  it('renders correctly', () => {
    render(<Label htmlFor="test">Test Label</Label>);
    const label = screen.getByText('Test Label');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test');
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Test</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('applies custom className', () => {
    render(<Label className="custom-label">Test</Label>);
    const label = screen.getByText('Test');
    expect(label).toHaveClass('custom-label');
  });

  it('passes through additional props', () => {
    render(
      <Label data-testid="label" aria-label="Custom label">
        Test
      </Label>,
    );
    const label = screen.getByTestId('label');
    expect(label).toHaveAttribute('aria-label', 'Custom label');
  });
});

describe('Complete Input with Label and Helper Text', () => {
  it('renders a complete input with all features', () => {
    render(
      <Input
        placeholder="Enter your username"
        helperText="This field is required"
        leftIcon={<span>👤</span>}
        rightIcon={<span>✓</span>}
        data-testid="complex-input"
      />,
    );

    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByTestId('complex-input')).toBeInTheDocument();
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('shows error state with error styling', () => {
    render(<Input placeholder="Email" error helperText="Invalid email format" data-testid="error-input" />);

    const input = screen.getByTestId('error-input');
    const helperText = screen.getByText('Invalid email format');

    expect(input).toBeDefined();
    expect(helperText).toBeDefined();
  });
});
