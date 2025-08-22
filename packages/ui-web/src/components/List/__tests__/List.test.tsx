import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { List } from '../List';

describe('List', () => {
  it('renders list items', () => {
    render(<List items={['A', 'B']} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
