import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Image } from '../lib/Image';

describe('Image', () => {
  it('renders img element when src provided', () => {
    render(<Image src="https://example.com/pic.jpg" alt="Sample" style={{ width: 100, height: 60 }} />);
    const img = screen.getByAltText('Sample');
    expect(img.tagName).toBe('IMG');
  });

  it('renders fallback when no src', () => {
    render(<Image alt="No image" fallback={<span>Fallback</span>} style={{ width: 80, height: 50 }} />);
    expect(screen.getByRole('img', { name: 'No image' })).toBeInTheDocument();
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });
});
