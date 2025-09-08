import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';

// We mock only the hook before importing the component to avoid invalid hook call issues.
jest.mock('../lib/hooks/useReducedMotion', () => ({
  useReducedMotion: () => ({
    prefersReducedMotion: true,
    systemPrefersReducedMotion: true,
    maybe: (a: any, b: any) => b,
  }),
}));

import { Modal } from '../lib/components/Modal/Modal';
import { Text } from '../lib/components/Text/Text';

describe('Modal reduced motion (deep)', () => {
  it('emits final animation values instantly via onAnimationValues diagnostic prop', () => {
    const captured: Array<{ scale: number; translateY: number; backdropOpacity: number }> = [];
    renderWithProvider(
      <Modal visible onClose={() => {}} testID="reduced-motion-modal" onAnimationValues={vals => captured.push(vals)}>
        <Text>Content</Text>
      </Modal>,
    );
    expect(screen.getByTestId('reduced-motion-modal')).toBeTruthy();
    const last = captured.pop();
    expect(last).toEqual({ scale: 1, translateY: 0, backdropOpacity: 1 });
  });
});
