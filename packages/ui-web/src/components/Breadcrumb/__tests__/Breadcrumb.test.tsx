import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Breadcrumb } from '../Breadcrumb';

describe('Breadcrumb', () => {
  it('renders items and sets current page', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Library', href: '#' },
          { label: 'Data', current: true },
        ]}
      />,
    );
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Data')).toHaveAttribute('aria-current', 'page');
  });
});
