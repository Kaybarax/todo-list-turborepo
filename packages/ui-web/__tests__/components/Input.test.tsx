import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Input, Label, inputVariants } from '../../lib/components/Input/Input';

describe('Input', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border');
  });

  it('renders with correct variant classes', () => {
    const variants = ['default', 'filled', 'ghost'] as const;
    
    variants.forEach((variant) => {
      const { unmount } = render(<Input variant={variant} data-testid={`input-${variant}`} />);
      const input = screen.getByTestId(`input-${variant}`);
      expect(input).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with correct size classes', () => {
    const sizes = ['default', 'sm', 'lg'] as const;
    
    sizes.forEach((size) => {
      const { unmount } = render(<Input size={size} data-testid={`input-${size}`} />);
      const input = screen.getByTestId(`input-${size}`);
      expect(input).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with correct state classes', () => {
    const states = ['default', 'error', 'success', 'warning'] as const;
    
    states.forEach((state) => {
      const { unmount } = render(<Input state={state} data-testid={`input-${state}`} />);
      const input = screen.getByTestId(`input-${state}`);
      expect(input).toBeInTheDocument();
      unmount();
    });
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

  it('renders with label', () => {
    render(<Input label="Username" />);
    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', input.id);
  });

  it('renders with helper text', () => {
    render(<Input helperText="Enter your username" />);
    const helperText = screen.getByText('Enter your username');
    const input = screen.getByRole('textbox');
    
    expect(helperText).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', helperText.id);
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

  it('renders as child component when asChild is true', () => {
    render(
      <Input asChild>
        <textarea data-testid="textarea" />
      </Input>
    );
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('flex', 'rounded-md', 'border');
  });

  it('passes through additional props', () => {
    render(<Input data-testid="input" aria-label="Custom input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-label', 'Custom input');
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
        <Input label="First" />
        <Input label="Second" />
      </div>
    );
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });

  it('uses provided ID when given', () => {
    render(<Input id="custom-id" label="Test" />);
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test');
    
    expect(input).toHaveAttribute('id', 'custom-id');
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('passes label props correctly', () => {
    render(
      <Input 
        label="Test Label" 
        labelProps={{ className: 'custom-label-class' }}
      />
    );
    
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
    render(<Label data-testid="label" aria-label="Custom label">Test</Label>);
    const label = screen.getByTestId('label');
    expect(label).toHaveAttribute('aria-label', 'Custom label');
  });
});

describe('Complete Input with Label and Helper Text', () => {
  it('renders a complete input with all features', () => {
    const leftIcon = <span data-testid="left-icon">👤</span>;
    const rightIcon = <span data-testid="right-icon">✓</span>;
    
    render(
      <Input
        label="Username"
        placeholder="Enter your username"
        helperText="Must be at least 3 characters"
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        data-testid="complete-input"
      />
    );

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('shows error state with error styling', () => {
    render(
      <Input
        label="Email"
        error
        helperText="Invalid email format"
        data-testid="error-input"
      />
    );

    const label = screen.getByText('Email');
    const input = screen.getByTestId('error-input');
    const helperText = screen.getByText('Invalid email format');

    expect(label).toHaveClass('text-destructive');
    expect(input).toHaveClass('border-destructive');
    expect(helperText).toHaveClass('text-destructive');
  });
});

describe('inputVariants', () => {
  it('generates correct classes for default variant and size', () => {
    const classes = inputVariants();
    expect(classes).toContain('flex');
    expect(classes).toContain('h-10');
    expect(classes).toContain('w-full');
    expect(classes).toContain('rounded-md');
    expect(classes).toContain('border');
  });

  it('generates correct classes for different variants', () => {
    const filledClasses = inputVariants({ variant: 'filled' });
    expect(filledClasses).toContain('bg-muted');
    expect(filledClasses).toContain('border-0');
    
    const ghostClasses = inputVariants({ variant: 'ghost' });
    expect(ghostClasses).toContain('border-0');
    expect(ghostClasses).toContain('shadow-none');
    expect(ghostClasses).toContain('bg-transparent');
  });

  it('generates correct classes for different sizes', () => {
    const smallClasses = inputVariants({ size: 'sm' });
    expect(smallClasses).toContain('h-9');
    expect(smallClasses).toContain('text-xs');
    
    const largeClasses = inputVariants({ size: 'lg' });
    expect(largeClasses).toContain('h-11');
    expect(largeClasses).toContain('px-4');
  });

  it('generates correct classes for different states', () => {
    const errorClasses = inputVariants({ state: 'error' });
    expect(errorClasses).toContain('border-destructive');
    
    const successClasses = inputVariants({ state: 'success' });
    expect(successClasses).toContain('border-green-500');
    
    const warningClasses = inputVariants({ state: 'warning' });
    expect(warningClasses).toContain('border-yellow-500');
  });
});