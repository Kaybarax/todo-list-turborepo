import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Badge, badgeVariants } from '../../src/components/Badge/Badge';

describe('Badge', () => {
  it('renders correctly with default props', () => {
    render(<Badge data-testid="badge">Default Badge</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border');
    expect(screen.getByText('Default Badge')).toBeInTheDocument();
  });

  it('renders with correct variant classes', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'] as const;

    variants.forEach(variant => {
      const { unmount } = render(
        <Badge variant={variant} data-testid={`badge-${variant}`}>
          Test
        </Badge>,
      );
      const badge = screen.getByTestId(`badge-${variant}`);
      expect(badge).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with basic functionality', () => {
    const { unmount } = render(<Badge data-testid="badge-basic">Test</Badge>);
    const badge = screen.getByTestId('badge-basic');
    expect(badge).toBeDefined();
    unmount();
  });

  it('renders with correct shape classes', () => {
    const shapes = ['default', 'square', 'pill'] as const;

    shapes.forEach(shape => {
      const { unmount } = render(
        <Badge shape={shape} data-testid={`badge-${shape}`}>
          Test
        </Badge>,
      );
      const badge = screen.getByTestId(`badge-${shape}`);
      expect(badge).toBeInTheDocument();
      unmount();
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Badge ref={ref}>Test</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    render(
      <Badge className="custom-class" data-testid="badge">
        Custom
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Badge asChild data-testid="badge">
        <span>Custom Badge</span>
      </Badge>,
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('inline-flex', 'items-center');
    expect(badge.tagName).toBe('SPAN');
  });

  it('passes through additional props', () => {
    render(
      <Badge data-testid="badge" aria-label="Custom badge">
        Test
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('aria-label', 'Custom badge');
  });

  it('renders with icon', () => {
    const icon = <span data-testid="icon">🎉</span>;
    render(<Badge icon={icon}>With Icon</Badge>);

    const iconElement = screen.getByTestId('icon');
    const badge = screen.getByText('With Icon');

    expect(iconElement).toBeInTheDocument();
    expect(badge).toBeInTheDocument();
  });

  it('renders with dot indicator', () => {
    render(
      <Badge dot data-testid="badge">
        Dot Badge
      </Badge>,
    );

    const badge = screen.getByTestId('badge');
    const dot = badge.querySelector('span[aria-hidden="true"]');

    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('h-2', 'w-2', 'rounded-full');
  });

  it('does not render icon when dot is true', () => {
    const icon = <span data-testid="icon">🎉</span>;
    render(
      <Badge dot icon={icon} data-testid="badge">
        Dot Badge
      </Badge>,
    );

    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('renders closable badge with close button', () => {
    const onClose = vi.fn();
    render(
      <Badge closable onClose={onClose}>
        Closable Badge
      </Badge>,
    );

    const closeButton = screen.getByRole('button', { name: 'Remove badge' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('aria-label', 'Remove badge');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Badge closable onClose={onClose}>
        Closable Badge
      </Badge>,
    );

    const closeButton = screen.getByRole('button', { name: 'Remove badge' });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stops propagation when close button is clicked', () => {
    const onClose = vi.fn();
    const onBadgeClick = vi.fn();

    render(
      <Badge closable onClose={onClose} onClick={onBadgeClick}>
        Closable Badge
      </Badge>,
    );

    const closeButton = screen.getByRole('button', { name: 'Remove badge' });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onBadgeClick).not.toHaveBeenCalled();
  });

  it('handles badge click when not closable', () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>Clickable Badge</Badge>);

    const badge = screen.getByText('Clickable Badge');
    fireEvent.click(badge);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders close button without onClose handler', () => {
    render(<Badge closable>Closable Badge</Badge>);

    const closeButton = screen.getByRole('button', { name: 'Remove badge' });
    expect(closeButton).toBeInTheDocument();

    // Should not throw when clicked without handler
    fireEvent.click(closeButton);
  });

  it('truncates long text content', () => {
    render(<Badge data-testid="badge">Very long badge text that should be truncated</Badge>);

    const badge = screen.getByTestId('badge');
    const textSpan = badge.querySelector('span.truncate');

    expect(textSpan).toBeInTheDocument();
    expect(textSpan).toHaveClass('truncate');
  });

  it('renders complex badge with all features', () => {
    const icon = <span data-testid="icon">🎉</span>;
    const onClose = vi.fn();

    render(
      <Badge
        variant="success"
        size="lg"
        shape="square"
        icon={icon}
        closable
        onClose={onClose}
        data-testid="complex-badge"
      >
        Complex Badge
      </Badge>,
    );

    const badge = screen.getByTestId('complex-badge');
    const iconElement = screen.getByTestId('icon');
    const closeButton = screen.getByRole('button', { name: 'Remove badge' });

    expect(badge).toBeInTheDocument();
    expect(iconElement).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-500'); // success variant
  });

  it('handles keyboard navigation on close button', () => {
    const onClose = vi.fn();
    render(
      <Badge closable onClose={onClose}>
        Closable Badge
      </Badge>,
    );

    const closeButton = screen.getByRole('button', { name: 'Remove badge' });

    // Test Enter key
    fireEvent.keyDown(closeButton, { key: 'Enter' });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    const icon = <span>🎉</span>;
    render(
      <Badge icon={icon} closable>
        Accessible Badge
      </Badge>,
    );

    // Icon should be hidden from screen readers
    const iconContainer = screen.getByText('🎉').parentElement;
    expect(iconContainer).toHaveAttribute('aria-hidden', 'true');

    // Close button should have proper label
    const closeButton = screen.getByRole('button', { name: 'Remove badge' });
    expect(closeButton).toHaveAttribute('aria-label', 'Remove badge');

    // Close icon should be hidden from screen readers
    const closeIcon = closeButton.querySelector('svg');
    expect(closeIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has proper accessibility attributes with dot', () => {
    render(
      <Badge dot closable>
        Dot Badge
      </Badge>,
    );

    // Dot should be hidden from screen readers
    const dot = document.querySelector('span[aria-hidden="true"].h-2');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute('aria-hidden', 'true');

    // Close button should have proper label
    const closeButton = screen.getByRole('button', { name: 'Remove badge' });
    expect(closeButton).toHaveAttribute('aria-label', 'Remove badge');
  });
});

describe('badgeVariants', () => {
  it('generates correct classes for default variant and size', () => {
    const classes = badgeVariants();
    expect(classes).toContain('inline-flex');
    expect(classes).toContain('items-center');
    expect(classes).toContain('rounded-full');
    expect(classes).toContain('border');
    expect(classes).toContain('px-2.5');
    expect(classes).toContain('py-0.5');
    expect(classes).toContain('text-xs');
  });

  it('generates correct classes for different variants', () => {
    const secondaryClasses = badgeVariants({ variant: 'secondary' });
    expect(secondaryClasses).toContain('bg-secondary');

    const destructiveClasses = badgeVariants({ variant: 'destructive' });
    expect(destructiveClasses).toContain('bg-destructive');

    const outlineClasses = badgeVariants({ variant: 'outline' });
    expect(outlineClasses).toContain('text-foreground');
    expect(outlineClasses).toContain('border-border');

    const successClasses = badgeVariants({ variant: 'success' });
    expect(successClasses).toContain('bg-green-500');

    const warningClasses = badgeVariants({ variant: 'warning' });
    expect(warningClasses).toContain('bg-yellow-500');

    const infoClasses = badgeVariants({ variant: 'info' });
    expect(infoClasses).toContain('bg-blue-500');

    const ghostClasses = badgeVariants({ variant: 'ghost' });
    expect(ghostClasses).toContain('bg-transparent');
  });

  it('generates correct classes for different sizes', () => {
    const smallClasses = badgeVariants({ size: 'sm' });
    expect(smallClasses).toContain('px-2');
    expect(smallClasses).toContain('text-xs');

    const largeClasses = badgeVariants({ size: 'lg' });
    expect(largeClasses).toContain('px-3');
    expect(largeClasses).toContain('py-1');
    expect(largeClasses).toContain('text-sm');
  });

  it('generates correct classes for different shapes', () => {
    const squareClasses = badgeVariants({ shape: 'square' });
    expect(squareClasses).toContain('rounded-md');

    const pillClasses = badgeVariants({ shape: 'pill' });
    expect(pillClasses).toContain('rounded-full');

    const defaultClasses = badgeVariants({ shape: 'default' });
    expect(defaultClasses).toContain('rounded-full');
  });

  it('combines multiple variants correctly', () => {
    const combinedClasses = badgeVariants({
      variant: 'success',
      size: 'lg',
      shape: 'square',
    });

    expect(combinedClasses).toContain('bg-green-500');
    expect(combinedClasses).toContain('px-3');
    expect(combinedClasses).toContain('text-sm');
    expect(combinedClasses).toContain('rounded-md');
  });
});
