import React from 'react';
import { render } from '@testing-library/react-native';
import Badge, { BadgeVariant, BadgeSize } from '../lib/components/Badge';

const variants: BadgeVariant[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];
const sizes: BadgeSize[] = ['small', 'medium', 'large'];

function findNodeByAccessibilityLabel(node: any, label: string): any | null {
  if (!node) return null;
  if (node.props && node.props.accessibilityLabel === label) return node;
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findNodeByAccessibilityLabel(child, label);
      if (found) return found;
    }
  }
  return null;
}

describe('Badge Accessibility', () => {
  it('applies accessibilityRole and composite label', () => {
    const { toJSON } = render(<Badge text="Hello" variant="primary" />);
    const tree = toJSON();
    const node = findNodeByAccessibilityLabel(tree, 'Hello badge, primary variant');
    expect(node).toBeTruthy();
    expect(node?.props?.accessibilityRole).toBe('text');
  });

  it('renders all variants with correct labels', () => {
    variants.forEach(v => {
      const { toJSON, unmount } = render(<Badge text={v} variant={v} />);
      const node = findNodeByAccessibilityLabel(toJSON(), `${v} badge, ${v} variant`);
      expect(node).toBeTruthy();
      unmount();
    });
  });

  it('supports all sizes without crashing', () => {
    sizes.forEach(s => {
      const { toJSON, unmount } = render(<Badge text={s} size={s} />);
      expect(toJSON()).toBeTruthy();
      unmount();
    });
  });
});
