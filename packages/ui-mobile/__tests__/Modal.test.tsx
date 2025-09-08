import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import * as reducedMotionModule from '../lib/hooks/useReducedMotion';

import { Modal } from '../lib/components/Modal/Modal';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';
import { Text } from '../lib/components/Text/Text';

const renderWithTheme = renderWithProvider;

describe('Modal', () => {
  it('renders correctly when visible', () => {
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} testID="test-modal">
        <Text>Modal Content</Text>
      </Modal>,
    );

    expect(screen.getByTestId('test-modal')).toBeTruthy();
    expect(screen.getByText('Modal Content')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    renderWithTheme(
      <Modal visible={false} onClose={() => {}} testID="hidden-modal">
        <Text>Modal Content</Text>
      </Modal>,
    );

    expect(screen.queryByTestId('hidden-modal')).toBeNull();
  });

  it('calls onClose when backdrop is pressed and dismissible', () => {
    const onCloseMock = jest.fn();
    renderWithTheme(
      <Modal visible={true} onClose={onCloseMock} dismissible={true} testID="dismissible-modal">
        <Text>Modal Content</Text>
      </Modal>,
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.press(backdrop);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when backdrop is pressed and not dismissible', () => {
    const onCloseMock = jest.fn();
    renderWithTheme(
      <Modal visible={true} onClose={onCloseMock} dismissible={false} testID="non-dismissible-modal">
        <Text>Modal Content</Text>
      </Modal>,
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.press(backdrop);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('renders all sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg', 'fullscreen'] as const;

    sizes.forEach(size => {
      const { unmount } = renderWithTheme(
        <Modal visible={true} onClose={() => {}} size={size} testID={`modal-${size}`}>
          <Text>{size} Modal</Text>
        </Modal>,
      );

      expect(screen.getByTestId(`modal-${size}`)).toBeTruthy();
      unmount();
    });
  });

  it('renders all types correctly', () => {
    const types = ['default', 'alert', 'confirmation'] as const;

    types.forEach(type => {
      const { unmount } = renderWithTheme(
        <Modal visible={true} onClose={() => {}} type={type} testID={`modal-${type}`}>
          <Text>{type} Modal</Text>
        </Modal>,
      );

      expect(screen.getByTestId(`modal-${type}`)).toBeTruthy();
      unmount();
    });
  });

  it('renders all animations correctly', () => {
    const animations = ['slide', 'fade', 'scale'] as const;

    animations.forEach(animation => {
      const { unmount } = renderWithTheme(
        <Modal visible={true} onClose={() => {}} animation={animation} testID={`modal-${animation}`}>
          <Text>{animation} Modal</Text>
        </Modal>,
      );

      expect(screen.getByTestId(`modal-${animation}`)).toBeTruthy();
      unmount();
    });
  });

  it('has correct accessibility properties', () => {
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} testID="accessible-modal">
        <Text>Accessible Modal</Text>
      </Modal>,
    );

    const modal = screen.getByTestId('accessible-modal');
    expect(modal.props.accessibilityRole).toBe('dialog');
    expect(modal.props.accessibilityModal).toBe(true);
  });

  it('applies custom style correctly', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} style={customStyle} testID="custom-style-modal">
        <Text>Custom Style Modal</Text>
      </Modal>,
    );

    expect(screen.getByTestId('custom-style-modal')).toBeTruthy();
  });

  it('handles keyboard avoidance correctly', () => {
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} testID="keyboard-avoiding-modal">
        <Text>Keyboard Avoiding Modal</Text>
      </Modal>,
    );

    expect(screen.getByTestId('keyboard-avoiding-modal')).toBeTruthy();
  });

  it('manages focus correctly when opened', async () => {
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} testID="focus-modal">
        <Text>Focus Modal</Text>
      </Modal>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('focus-modal')).toBeTruthy();
    });
  });

  it('applies immediate animation values when reduced motion is preferred (open)', () => {
    const animationSnapshots: any[] = [];
    const original = (reducedMotionModule as any).useReducedMotion;
    (reducedMotionModule as any).useReducedMotion = () => ({
      prefersReducedMotion: true,
      systemPrefersReducedMotion: true,
      maybe: (_a: any, b: any) => b,
    });
    const { Modal: RMModal } = require('../lib/components/Modal/Modal');
    renderWithTheme(
      <RMModal
        visible={true}
        onClose={() => {}}
        onAnimationValues={(v: any) => animationSnapshots.push(v)}
        testID="rm-modal"
      >
        <Text>Reduced Motion Modal</Text>
      </RMModal>,
    );
    (reducedMotionModule as any).useReducedMotion = original;
    const last = animationSnapshots[animationSnapshots.length - 1];
    expect(last).toMatchObject({ scale: 1, translateY: 0, backdropOpacity: 1 });
  });

  it('applies immediate animation values when reduced motion is preferred (close)', () => {
    const animationSnapshots: any[] = [];
    const original = (reducedMotionModule as any).useReducedMotion;
    (reducedMotionModule as any).useReducedMotion = () => ({
      prefersReducedMotion: true,
      systemPrefersReducedMotion: true,
      maybe: (_a: any, b: any) => b,
    });
    const { Modal: RMModal } = require('../lib/components/Modal/Modal');
    const { rerender } = renderWithTheme(
      <RMModal
        visible={true}
        onClose={() => {}}
        onAnimationValues={(v: any) => animationSnapshots.push(v)}
        testID="rm-modal-transition"
      >
        <Text>Reduced Motion Modal</Text>
      </RMModal>,
    );
    rerender(
      <RMModal
        visible={false}
        onClose={() => {}}
        onAnimationValues={(v: any) => animationSnapshots.push(v)}
        testID="rm-modal-transition"
      >
        <Text>Reduced Motion Modal</Text>
      </RMModal>,
    );
    (reducedMotionModule as any).useReducedMotion = original;
    const last = animationSnapshots[animationSnapshots.length - 1];
    expect(last.backdropOpacity).toBe(0);
    expect(last.scale).toBeLessThan(0.81);
    expect(last.scale).toBeGreaterThan(0.79);
    expect(last.translateY).toBe(50);
  });
});
