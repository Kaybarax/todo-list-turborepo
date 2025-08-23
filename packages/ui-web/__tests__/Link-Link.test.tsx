import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Link } from '../lib/Link';

describe('Link', () => {
  it('renders anchor by default', () => {
    render(<Link href="#">Go</Link>);
    const a = screen.getByRole('link', { name: 'Go' });
    expect(a).toBeInTheDocument();
    expect(a).toHaveAttribute('href', '#');
  });

  it('applies external rel/target when external', () => {
    render(
      <Link href="https://example.com" external>
        Ext
      </Link>,
    );
    const a = screen.getByRole('link', { name: 'Ext' });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel');
  });

  it('renders span when disabled', () => {
    render(
      <Link href="#" disabled>
        Off
      </Link>,
    );
    const span = screen.getByText('Off');
    expect(span.tagName).toBe('SPAN');
    expect(span).toHaveAttribute('aria-disabled', 'true');
  });
});
