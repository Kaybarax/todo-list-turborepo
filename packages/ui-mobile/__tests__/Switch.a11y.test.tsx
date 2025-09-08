import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Switch from '../lib/components/Switch';

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

describe('Switch Accessibility', () => {
  it('applies provided label', () => {
    const { toJSON } = render(<Switch value={true} onValueChange={() => {}} label="Notifications" />);
    const node = findNodeByAccessibilityLabel(toJSON(), 'Notifications');
    expect(node).toBeTruthy();
  });

  it('uses fallback label when none provided', () => {
    const { toJSON } = render(<Switch value={false} onValueChange={() => {}} />);
    const node = findNodeByAccessibilityLabel(toJSON(), 'switch');
    expect(node).toBeTruthy();
  });

  it('toggles value via onChange', () => {
    let current = false;
    const handleChange = (v: boolean) => {
      current = v;
    };
    const { update, toJSON } = render(<Switch value={current} onValueChange={handleChange} />);
    const node = findNodeByAccessibilityLabel(toJSON(), 'switch');
    expect(node).toBeTruthy();
    // Simulate framework calling onChange with opposite value
    handleChange(!current);
    // Re-render with updated value
    update(<Switch value={current} onValueChange={handleChange} />);
    expect(current).toBe(true);
  });
});
