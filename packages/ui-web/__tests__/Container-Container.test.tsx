import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Container } from '../lib/Container';

describe('Container', () => {
  it('renders children and applies width and padding variants', () => {
    render(
      <Container maxWidth="md" pad="lg" data-testid="container">
        <div>Content</div>
      </Container>,
    );
    const el = screen.getByTestId('container');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('max-w-screen-md');
    expect(el).toHaveClass('px-6');
  });
});
