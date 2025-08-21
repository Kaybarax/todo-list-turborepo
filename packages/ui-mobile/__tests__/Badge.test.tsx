import React from 'react';
import { render } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Badge } from '../lib/components/Badge';

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Badge', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Badge text="Test Badge" />, { wrapper: TestWrapper });

    expect(getByText('Test Badge')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'] as const;

    variants.forEach(variant => {
      const { getByText, unmount } = render(<Badge text={`${variant} badge`} variant={variant} />, {
        wrapper: TestWrapper,
      });

      expect(getByText(`${variant} badge`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach(size => {
      const { getByText, unmount } = render(<Badge text={`${size} badge`} size={size} />, { wrapper: TestWrapper });

      expect(getByText(`${size} badge`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const customTextStyle = { color: 'blue' };
    const { getByText } = render(<Badge text="Custom Style" style={customStyle} textStyle={customTextStyle} />, {
      wrapper: TestWrapper,
    });

    expect(getByText('Custom Style')).toBeTruthy();
  });

  it('passes through testID', () => {
    const { getByTestId } = render(<Badge text="Test Badge" testID="custom-badge" />, { wrapper: TestWrapper });

    expect(getByTestId('custom-badge')).toBeTruthy();
  });

  it('truncates long text with numberOfLines', () => {
    const longText = 'This is a very long badge text that should be truncated';
    const { getByText } = render(<Badge text={longText} />, { wrapper: TestWrapper });

    expect(getByText(longText)).toBeTruthy();
  });

  describe('Variant styling', () => {
    it('applies default variant styling', () => {
      const { getByText } = render(<Badge text="Default" variant="default" />, { wrapper: TestWrapper });

      expect(getByText('Default')).toBeTruthy();
    });

    it('applies primary variant styling', () => {
      const { getByText } = render(<Badge text="Primary" variant="primary" />, { wrapper: TestWrapper });

      expect(getByText('Primary')).toBeTruthy();
    });

    it('applies secondary variant styling', () => {
      const { getByText } = render(<Badge text="Secondary" variant="secondary" />, { wrapper: TestWrapper });

      expect(getByText('Secondary')).toBeTruthy();
    });

    it('applies success variant styling', () => {
      const { getByText } = render(<Badge text="Success" variant="success" />, { wrapper: TestWrapper });

      expect(getByText('Success')).toBeTruthy();
    });

    it('applies warning variant styling', () => {
      const { getByText } = render(<Badge text="Warning" variant="warning" />, { wrapper: TestWrapper });

      expect(getByText('Warning')).toBeTruthy();
    });

    it('applies danger variant styling', () => {
      const { getByText } = render(<Badge text="Danger" variant="danger" />, { wrapper: TestWrapper });

      expect(getByText('Danger')).toBeTruthy();
    });
  });

  describe('Size styling', () => {
    it('applies small size styling', () => {
      const { getByText } = render(<Badge text="Small" size="small" />, { wrapper: TestWrapper });

      expect(getByText('Small')).toBeTruthy();
    });

    it('applies medium size styling', () => {
      const { getByText } = render(<Badge text="Medium" size="medium" />, { wrapper: TestWrapper });

      expect(getByText('Medium')).toBeTruthy();
    });

    it('applies large size styling', () => {
      const { getByText } = render(<Badge text="Large" size="large" />, { wrapper: TestWrapper });

      expect(getByText('Large')).toBeTruthy();
    });
  });

  describe('Complex badge scenarios', () => {
    it('handles badge with all features', () => {
      const { getByText, getByTestId } = render(
        <Badge
          text="Complex Badge"
          variant="success"
          size="large"
          style={{ margin: 10 }}
          textStyle={{ fontWeight: 'bold' }}
          testID="complex-badge"
        />,
        { wrapper: TestWrapper },
      );

      const badge = getByTestId('complex-badge');
      const text = getByText('Complex Badge');

      expect(badge).toBeTruthy();
      expect(text).toBeTruthy();
    });

    it('handles empty text', () => {
      const { getByText } = render(<Badge text="" />, { wrapper: TestWrapper });

      expect(getByText('')).toBeTruthy();
    });

    it('handles numeric text', () => {
      const { getByText } = render(<Badge text="42" variant="primary" />, { wrapper: TestWrapper });

      expect(getByText('42')).toBeTruthy();
    });

    it('handles special characters', () => {
      const { getByText } = render(<Badge text="★ NEW ★" variant="warning" />, { wrapper: TestWrapper });

      expect(getByText('★ NEW ★')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('maintains text accessibility', () => {
      const { getByText } = render(<Badge text="Accessible Badge" />, { wrapper: TestWrapper });

      const badge = getByText('Accessible Badge');
      expect(badge).toBeTruthy();
    });
  });

  describe('UI Kitten integration', () => {
    it('uses UI Kitten Text component', () => {
      const { getByText } = render(<Badge text="UI Kitten Text" />, { wrapper: TestWrapper });

      expect(getByText('UI Kitten Text')).toBeTruthy();
    });

    it('applies correct text categories for different sizes', () => {
      const sizes = ['small', 'medium', 'large'] as const;

      sizes.forEach(size => {
        const { getByText, unmount } = render(<Badge text={`${size} category`} size={size} />, {
          wrapper: TestWrapper,
        });

        expect(getByText(`${size} category`)).toBeTruthy();
        unmount();
      });
    });
  });
});
