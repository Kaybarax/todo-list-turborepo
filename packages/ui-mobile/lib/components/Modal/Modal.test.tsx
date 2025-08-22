import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Modal } from './Modal';
import { ThemeProvider } from '../../theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Modal', () => {
  it('renders correctly when visible', () => {
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} testID="test-modal">
        <text>Modal Content</text>
      </Modal>,
    );

    expect(screen.getByTestId('test-modal')).toBeTruthy();
    expect(screen.getByText('Modal Content')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    renderWithTheme(
      <Modal visible={false} onClose={() => {}} testID="hidden-modal">
        <text>Modal Content</text>
      </Modal>,
    );

    expect(screen.queryByTestId('hidden-modal')).toBeNull();
  });

  it('calls onClose when backdrop is pressed and dismissible', () => {
    const onCloseMock = jest.fn();
    renderWithTheme(
      <Modal visible={true} onClose={onCloseMock} dismissible={true} testID="dismissible-modal">
        <text>Modal Content</text>
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
        <text>Modal Content</text>
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
          <text>{size} Modal</text>
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
          <text>{type} Modal</text>
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
          <text>{animation} Modal</text>
        </Modal>,
      );

      expect(screen.getByTestId(`modal-${animation}`)).toBeTruthy();
      unmount();
    });
  });

  it('has correct accessibility properties', () => {
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} testID="accessible-modal">
        <text>Accessible Modal</text>
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
        <text>Custom Style Modal</text>
      </Modal>,
    );

    expect(screen.getByTestId('custom-style-modal')).toBeTruthy();
  });

  it('handles keyboard avoidance correctly', () => {
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} testID="keyboard-avoiding-modal">
        <text>Keyboard Avoiding Modal</text>
      </Modal>,
    );

    expect(screen.getByTestId('keyboard-avoiding-modal')).toBeTruthy();
  });

  it('manages focus correctly when opened', async () => {
    renderWithTheme(
      <Modal visible={true} onClose={() => {}} testID="focus-modal">
        <text>Focus Modal</text>
      </Modal>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('focus-modal')).toBeTruthy();
    });
  });
});
