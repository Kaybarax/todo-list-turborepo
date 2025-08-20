import { render, screen } from '@testing-library/react';
import { Badge } from '../../src/components/Badge/Badge';

describe('Badge', () => {
  it('renders correctly with default props', () => {
    render(<Badge data-testid="badge">Default Badge</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toBeDefined();
    expect(badge.className).toContain('badge');
  });

  it('renders with different variants', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'] as const;

    variants.forEach(variant => {
      const { unmount } = render(
        <Badge variant={variant} data-testid={`badge-${variant}`}>
          Test
        </Badge>,
      );
      const badge = screen.getByTestId(`badge-${variant}`);
      expect(badge).toBeDefined();
      unmount();
    });
  });

  it('applies custom className', () => {
    render(
      <Badge className="custom-badge" data-testid="badge">
        Test
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge.className).toContain('custom-badge');
  });

  it('renders with correct DOM structure', () => {
    render(<Badge data-testid="badge">Test</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge.tagName).toBe('DIV');
  });

  it('renders children correctly', () => {
    render(<Badge data-testid="badge">Badge Content</Badge>);
    expect(screen.getByText('Badge Content')).toBeDefined();
  });

  it('handles empty content', () => {
    render(<Badge data-testid="badge"></Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toBeDefined();
  });

  it('passes through additional props', () => {
    render(
      <Badge data-testid="badge" aria-label="Custom badge">
        Test
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge.getAttribute('aria-label')).toBe('Custom badge');
  });
});
