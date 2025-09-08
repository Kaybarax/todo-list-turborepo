import React from 'react';
import { render } from '@testing-library/react-native';
import Avatar from '../lib/components/Avatar';

describe('Avatar Accessibility', () => {
  it('falls back to initials label when initials provided and no image', () => {
    const { toJSON } = render(<Avatar initials="JD" />);
    const tree: any = toJSON();
    expect(tree?.props?.accessibilityLabel).toBe('Avatar JD');
    expect(tree?.props?.accessibilityRole).toBe('image');
  });

  it('falls back to generic label when no data', () => {
    const { toJSON } = render(<Avatar />);
    const tree: any = toJSON();
    expect(tree?.props?.accessibilityLabel).toBe('Avatar');
  });

  it('uses image label when source provided', () => {
    const { toJSON } = render(<Avatar source={{ uri: 'https://example.com/a.png' }} />);
    // structure: wrapper View -> kitten Avatar, so label is on wrapper
    const tree: any = toJSON();
    expect(tree?.props?.accessibilityLabel).toBe('User avatar image');
  });
});
