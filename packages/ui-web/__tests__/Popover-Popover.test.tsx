import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Popover } from '../lib/Popover';

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} />;
}

describe('Popover', () => {
  it('toggles open state on trigger click', () => {
    render(
      <Popover content={<div>Popover Content</div>}>
        <Button>Trigger</Button>
      </Popover>,
    );

    // Initially open is false (hidden)
    let panel = screen.getByRole('dialog', { hidden: true });
    expect(panel).toHaveAttribute('hidden');

    // Click to open
    fireEvent.click(screen.getByRole('button', { name: 'Trigger' }));
    panel = screen.getByRole('dialog');
    expect(panel).not.toHaveAttribute('hidden');
    expect(screen.getByText('Popover Content')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(
      <Popover defaultOpen content={<div>Content</div>}>
        <Button>Trigger</Button>
      </Popover>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    // Now hidden
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('hidden');
  });
});
