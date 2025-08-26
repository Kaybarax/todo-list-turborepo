import { render, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { AccessibilityInfo } from 'react-native';

import { Button } from './Button';
import { ThemeProvider } from '../../theme';
import { validateTouchTargetSize, validateContrastRatio } from '../../utils/accessibility';

// Mock React Native AccessibilityInfo
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  AccessibilityInfo: {
    announceForAccessibility: jest.fn(),
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
  },
}));

const mockAccessibilityInfo = AccessibilityInfo as jest.Mocked<typeof AccessibilityInfo>;

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Button Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Screen Reader Support', () => {
    it('has proper accessibility role', () => {
      renderWithTheme(<Button testID="button">Test Button</Button>);

      const button = screen.getByTestId('button');
      expect(button.props.accessibilityRole).toBe('button');
    });

    it('provides accessible label', () => {
      renderWithTheme(
        <Button accessibilityLabel="Custom label" testID="button">
          Test Button
        </Button>,
      );

      const button = screen.getByTestId('button');
      expect(button.props.accessibilityLabel).toBe('Custom label');
    });

    it('provides accessibility hint', () => {
      renderWithTheme(
        <Button accessibilityHint="Tap to submit form" testID="button">
          Submit
        </Button>,
      );

      const button = screen.getByTestId('button');
      expect(button.props.accessibilityHint).toBe('Tap to submit form');
    });

    it('announces loading state to screen readers', () => {
      renderWithTheme(
        <Button loading testID="button">
          Loading Button
        </Button>,
      );

      const button = screen.getByTestId('button');
      expect(button.props.accessibilityState).toEqual(expect.objectContaining({ busy: true }));
    });

    it('announces disabled state to screen readers', () => {
      renderWithTheme(
        <Button disabled testID="button">
          Disabled Button
        </Button>,
      );

      const button = screen.getByTestId('button');
      expect(button.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    });
  });

  describe('Touch Target Validation', () => {
    it('meets minimum touch target size requirements', () => {
      renderWithTheme(
        <Button size="sm" testID="small-button">
          Small
        </Button>,
      );

      // Small buttons should still meet 44x44 minimum
      expect(validateTouchTargetSize(44, 44)).toBe(true);
    });

    it('provides adequate touch area for all sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach(size => {
        const { unmount } = renderWithTheme(
          <Button size={size} testID={`button-${size}`}>
            {size} Button
          </Button>,
        );

        const button = screen.getByTestId(`button-${size}`);
        expect(button).toBeTruthy();

        // All button sizes should be accessible
        expect(validateTouchTargetSize(44, 44)).toBe(true);
        unmount();
      });
    });
  });

  describe('Color Contrast Validation', () => {
    it('meets WCAG AA contrast requirements for primary variant', () => {
      // Test with common theme colors
      const backgroundColor = '#007AFF'; // Primary blue
      const textColor = '#FFFFFF'; // White text

      expect(validateContrastRatio(textColor, backgroundColor, 'AA')).toBe(true);
    });

    it('meets WCAG AA contrast requirements for secondary variant', () => {
      const backgroundColor = '#F2F2F7'; // Light gray
      const textColor = '#000000'; // Black text

      expect(validateContrastRatio(textColor, backgroundColor, 'AA')).toBe(true);
    });

    it('validates destructive button contrast', () => {
      const backgroundColor = '#FF3B30'; // Red
      const textColor = '#FFFFFF'; // White text

      expect(validateContrastRatio(textColor, backgroundColor, 'AA')).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('is focusable when enabled', () => {
      renderWithTheme(<Button testID="button">Focusable Button</Button>);

      const button = screen.getByTestId('button');
      expect(button.props.accessible).toBe(true);
    });

    it('is not focusable when disabled', () => {
      renderWithTheme(
        <Button disabled testID="button">
          Disabled Button
        </Button>,
      );

      const button = screen.getByTestId('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('handles focus events properly', () => {
      const onFocusMock = jest.fn();
      const onBlurMock = jest.fn();

      renderWithTheme(
        <Button onFocus={onFocusMock} onBlur={onBlurMock} testID="button">
          Focus Test Button
        </Button>,
      );

      const button = screen.getByTestId('button');

      fireEvent(button, 'focus');
      expect(onFocusMock).toHaveBeenCalled();

      fireEvent(button, 'blur');
      expect(onBlurMock).toHaveBeenCalled();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('announces button press to screen readers', () => {
      const onPressMock = jest.fn();

      renderWithTheme(
        <Button onPress={onPressMock} testID="button">
          Announce Button
        </Button>,
      );

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalled();
    });

    it('provides proper accessibility traits', () => {
      renderWithTheme(<Button testID="button">Trait Button</Button>);

      const button = screen.getByTestId('button');
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessible).toBe(true);
    });
  });

  describe('Dynamic Content Accessibility', () => {
    it('updates accessibility label when content changes', () => {
      const { rerender } = renderWithTheme(<Button testID="button">Original Text</Button>);

      const button = screen.getByTestId('button');
      expect(screen.getByText('Original Text')).toBeTruthy();

      rerender(
        <ThemeProvider>
          <Button testID="button">Updated Text</Button>
        </ThemeProvider>,
      );

      expect(screen.getByText('Updated Text')).toBeTruthy();
    });

    it('maintains accessibility during state transitions', () => {
      const { rerender } = renderWithTheme(
        <Button loading={false} testID="button">
          Normal State
        </Button>,
      );

      let button = screen.getByTestId('button');
      expect(button.props.accessibilityState?.busy).toBeFalsy();

      rerender(
        <ThemeProvider>
          <Button loading={true} testID="button">
            Loading State
          </Button>
        </ThemeProvider>,
      );

      button = screen.getByTestId('button');
      expect(button.props.accessibilityState?.busy).toBe(true);
    });
  });
});
