import { render, screen } from '@testing-library/react';

import { Badge } from '../lib/components/Badge/Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="test-class">Test Badge</Badge>);
    expect(screen.getByText('Test Badge').parentElement).toHaveClass('test-class');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default').parentElement).toHaveClass('badge-neutral');

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary').parentElement).toHaveClass('badge-secondary');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive').parentElement).toHaveClass('badge-error');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline').parentElement).toHaveClass('badge-outline');

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success').parentElement).toHaveClass('badge-success');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning').parentElement).toHaveClass('badge-warning');

    rerender(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info').parentElement).toHaveClass('badge-info');
  });

  it('renders with icon', () => {
    render(<Badge icon={<span data-testid="test-icon" />}>With Icon</Badge>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('positions icon correctly', () => {
    render(<Badge icon={<span data-testid="test-icon" />}>With Icon</Badge>);
    const iconContainer = screen.getByTestId('test-icon').parentElement;
    expect(iconContainer).toHaveClass('mr-1');
  });
});
