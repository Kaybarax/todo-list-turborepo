import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Tooltip } from '../lib/Tooltip';

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} />;
}

describe('Tooltip', () => {
  it('associates tooltip content with trigger via aria-describedby', () => {
    render(
      <Tooltip content="Tip text">
        <Button>Trigger</Button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    const tooltipId = trigger.getAttribute('aria-describedby');
    expect(tooltipId).toBeTruthy();
    expect(screen.getByRole('tooltip')).toHaveAttribute('id', tooltipId!);
  });
});
