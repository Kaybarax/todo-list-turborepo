import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Toast, Toaster } from '../lib/Toast';

describe('Toast', () => {
  it('renders inside Toaster with role status and title', () => {
    render(
      <Toaster>
        <Toast title="Saved" description="All good" />
      </Toaster>,
    );
    const el = screen.getByRole('status');
    expect(el).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
