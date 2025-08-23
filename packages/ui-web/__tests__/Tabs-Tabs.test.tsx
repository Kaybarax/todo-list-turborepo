import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Tabs, type TabItem } from '../lib/Tabs';

describe('Tabs', () => {
  const items: TabItem[] = [
    { id: 't1', label: 'One', content: <div>One Content</div> },
    { id: 't2', label: 'Two', content: <div>Two Content</div> },
    { id: 't3', label: 'Three', content: <div>Three Content</div> },
  ];

  it('renders tablist and first tabpanel active by default', () => {
    render(<Tabs items={items} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    expect(screen.getByText('One Content')).toBeInTheDocument();
  });

  it('changes tab on click', () => {
    render(<Tabs items={items} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Two Content')).toBeInTheDocument();
  });
});
