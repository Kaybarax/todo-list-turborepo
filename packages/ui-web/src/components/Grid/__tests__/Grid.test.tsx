import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Grid } from '../Grid';

describe('Grid', () => {
  it('applies cols and gap classes', () => {
    render(
      <Grid cols={4} gap="lg" data-testid="grid">
        <div>A</div>
      </Grid>,
    );
    const el = screen.getByTestId('grid');
    expect(el).toHaveClass('grid-cols-4');
    expect(el).toHaveClass('gap-4');
  });
});
