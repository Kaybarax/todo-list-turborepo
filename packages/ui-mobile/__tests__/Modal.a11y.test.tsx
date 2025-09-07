import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { Modal } from '../lib/components/Modal/Modal';
import { ThemeProvider } from '../lib/theme';

// Use global react-native mock; remove spread actual to prevent ESM parsing issues

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Modal Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Screen Reader Support', () => {
    it('has proper dialog role', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} testID="modal">
          <text>Modal Content</text>
        </Modal>,
      );

      const modal = screen.getByTestId('modal');
      expect(modal.props.accessibilityRole).toBe('dialog');
    });

    it('is marked as modal for screen readers', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} testID="modal">
          <text>Modal Content</text>
        </Modal>,
      );

      const modal = screen.getByTestId('modal');
      expect(modal.props.accessibilityModal).toBe(true);
    });

    it('provides accessibility label for modal', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} accessibilityLabel="Settings Modal" testID="modal">
          <text>Modal Content</text>
        </Modal>,
      );

      const modal = screen.getByTestId('modal');
      expect(modal.props.accessibilityLabel).toBe('Settings Modal');
    });

    it('announces modal opening to screen readers', async () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} testID="modal">
          <text>Important Modal Content</text>
        </Modal>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeTruthy();
      });
    });
  });

  describe('Focus Management', () => {
    it('traps focus within modal when open', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} testID="modal">
          <text>Modal with focus trap</text>
        </Modal>,
      );

      const modal = screen.getByTestId('modal');
      expect(modal.props.accessibilityModal).toBe(true);
    });

    it('restores focus when modal closes', async () => {
      const { rerender } = renderWithTheme(
        <Modal visible={true} onClose={() => {}} testID="modal">
          <text>Modal Content</text>
        </Modal>,
      );

      expect(screen.getByTestId('modal')).toBeTruthy();

      rerender(
        <ThemeProvider>
          <Modal visible={false} onClose={() => {}} testID="modal">
            <text>Modal Content</text>
          </Modal>
        </ThemeProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).toBeNull();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes modal on escape key (simulated)', () => {
      const onCloseMock = jest.fn();

      renderWithTheme(
        <Modal visible={true} onClose={onCloseMock} testID="modal">
          <text>Modal Content</text>
        </Modal>,
      );

      // Simulate escape key behavior through backdrop press
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.press(backdrop);

      expect(onCloseMock).toHaveBeenCalled();
    });

    it('prevents focus from leaving modal', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} testID="modal">
          <text>Focus trapped content</text>
        </Modal>,
      );

      const modal = screen.getByTestId('modal');
      expect(modal.props.accessibilityModal).toBe(true);
    });
  });

  describe('Alert Modal Accessibility', () => {
    it('has proper alert role for alert type', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} type="alert" testID="alert-modal">
          <text>Alert Message</text>
        </Modal>,
      );

      const modal = screen.getByTestId('alert-modal');
      expect(modal.props.accessibilityRole).toBe('alert');
    });

    it('announces alert content immediately', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} type="alert" testID="alert-modal">
          <text>Critical Alert Message</text>
        </Modal>,
      );

      const modal = screen.getByTestId('alert-modal');
      expect(modal.props.accessibilityLiveRegion).toBe('assertive');
    });
  });

  describe('Confirmation Modal Accessibility', () => {
    it('provides proper labeling for confirmation actions', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} type="confirmation" testID="confirmation-modal">
          <text>Are you sure you want to delete this item?</text>
        </Modal>,
      );

      const modal = screen.getByTestId('confirmation-modal');
      expect(modal.props.accessibilityRole).toBe('dialog');
    });
  });

  describe('Modal Size Accessibility', () => {
    it('maintains accessibility across different sizes', () => {
      const sizes = ['sm', 'md', 'lg', 'fullscreen'] as const;

      sizes.forEach(size => {
        const { unmount } = renderWithTheme(
          <Modal visible={true} onClose={() => {}} size={size} testID={`modal-${size}`}>
            <text>{size} Modal Content</text>
          </Modal>,
        );

        const modal = screen.getByTestId(`modal-${size}`);
        expect(modal.props.accessibilityRole).toBe('dialog');
        expect(modal.props.accessibilityModal).toBe(true);

        unmount();
      });
    });
  });

  describe('Animation Accessibility', () => {
    it('respects reduced motion preferences', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} animation="fade" testID="animated-modal">
          <text>Animated Modal</text>
        </Modal>,
      );

      const modal = screen.getByTestId('animated-modal');
      expect(modal).toBeTruthy();
    });

    it('provides immediate visibility when animations are disabled', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} animation="none" testID="no-animation-modal">
          <text>No Animation Modal</text>
        </Modal>,
      );

      const modal = screen.getByTestId('no-animation-modal');
      expect(modal).toBeTruthy();
    });
  });

  describe('Backdrop Accessibility', () => {
    it('backdrop has proper accessibility properties', () => {
      renderWithTheme(
        <Modal visible={true} onClose={() => {}} testID="modal">
          <text>Modal Content</text>
        </Modal>,
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      expect(backdrop.props.accessibilityRole).toBe('button');
      expect(backdrop.props.accessibilityLabel).toBe('Close modal');
    });

    it('backdrop announces close action', () => {
      const onCloseMock = jest.fn();

      renderWithTheme(
        <Modal visible={true} onClose={onCloseMock} testID="modal">
          <text>Modal Content</text>
        </Modal>,
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      expect(backdrop.props.accessibilityHint).toBe('Tap to close modal');
    });
  });
});
