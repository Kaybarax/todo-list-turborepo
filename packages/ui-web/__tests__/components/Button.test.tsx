import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/Button/Button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button data-testid="button">Click me</Button>);
    const button = screen.getByTestId('button');
    expect(button).toBeDefined();
    expect(button.className).toContain('btn');
  });

  it('renders with different variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;

    variants.forEach(variant => {
      const { unmount } = render(
        <Button variant={variant} data-testid={`button-${variant}`}>
          Test
        </Button>,
      );
      const button = screen.getByTestId(`button-${variant}`);
      expect(button).toBeDefined();
      unmount();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach(size => {
      const { unmount } = render(
        <Button size={size} data-testid={`button-${size}`}>
          Test
        </Button>,
      );
      const button = screen.getByTestId(`button-${size}`);
      expect(button).toBeDefined();
      unmount();
    });
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} data-testid="button">
        Click me
      </Button>,
    );
    const button = screen.getByTestId('button');
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Button disabled data-testid="button">
        Disabled
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button.getAttribute('disabled')).toBe('');
  });

  it('shows loading state correctly', () => {
    render(
      <Button loading data-testid="button">
        Loading
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button.getAttribute('disabled')).toBe('');
  });

  it('shows loading text when provided', () => {
    render(
      <Button loading loadingText="Please wait..." data-testid="button">
        Submit
      </Button>,
    );
    expect(screen.getByText('Please wait...')).toBeDefined();
  });

  it('renders left icon correctly', () => {
    const leftIcon = <span data-testid="left-icon">←</span>;
    render(
      <Button leftIcon={leftIcon} data-testid="button">
        With Icon
      </Button>,
    );

    expect(screen.getByTestId('left-icon')).toBeDefined();
    expect(screen.getByText('With Icon')).toBeDefined();
  });

  it('renders right icon correctly', () => {
    const rightIcon = <span data-testid="right-icon">→</span>;
    render(
      <Button rightIcon={rightIcon} data-testid="button">
        With Icon
      </Button>,
    );

    expect(screen.getByTestId('right-icon')).toBeDefined();
    expect(screen.getByText('With Icon')).toBeDefined();
  });

  it('applies custom className', () => {
    render(
      <Button className="custom-class" data-testid="button">
        Custom
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button.className).toContain('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes through additional props', () => {
    render(
      <Button data-testid="button" aria-label="Custom label">
        Test
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button.getAttribute('aria-label')).toBe('Custom label');
  });
});
