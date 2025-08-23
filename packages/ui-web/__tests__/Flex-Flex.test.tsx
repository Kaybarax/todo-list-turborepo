import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Flex } from '../lib/Flex';

describe('Flex', () => {
  it('applies direction and justify classes', () => {
    render(
      <Flex direction="row" justify="between" data-testid="flex">
        <div>A</div>
      </Flex>,
    );
    const el = screen.getByTestId('flex');
    expect(el).toHaveClass('flex-row');
    expect(el).toHaveClass('justify-between');
  });
});
