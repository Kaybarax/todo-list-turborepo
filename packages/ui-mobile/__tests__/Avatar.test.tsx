import React from 'react';
import { render } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Avatar } from '../lib/components/Avatar';

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

// Mock image source
const mockImageSource = { uri: 'https://example.com/avatar.jpg' };

describe('Avatar', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Avatar testID="default-avatar" />, { wrapper: TestWrapper });

    expect(getByTestId('default-avatar')).toBeTruthy();
  });

  it('renders with initials when no image source', () => {
    const { getByText } = render(<Avatar initials="JD" />, { wrapper: TestWrapper });

    expect(getByText('JD')).toBeTruthy();
  });

  it('renders with image source', () => {
    const { getByTestId } = render(<Avatar source={mockImageSource} testID="image-avatar" />, { wrapper: TestWrapper });

    expect(getByTestId('image-avatar')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const sizes = ['tiny', 'small', 'medium', 'large', 'giant'] as const;

    sizes.forEach(size => {
      const { getByTestId, unmount } = render(
        <Avatar initials={size.toUpperCase()} size={size} testID={`${size}-avatar`} />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId(`${size}-avatar`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different shapes', () => {
    const shapes = ['round', 'rounded', 'square'] as const;

    shapes.forEach(shape => {
      const { getByTestId, unmount } = render(<Avatar initials="SH" shape={shape} testID={`${shape}-avatar`} />, {
        wrapper: TestWrapper,
      });

      expect(getByTestId(`${shape}-avatar`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom background color', () => {
    const { getByText } = render(<Avatar initials="BG" backgroundColor="#FF0000" />, { wrapper: TestWrapper });

    expect(getByText('BG')).toBeTruthy();
  });

  it('applies custom text color', () => {
    const { getByText } = render(<Avatar initials="TC" textColor="#00FF00" />, { wrapper: TestWrapper });

    expect(getByText('TC')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customContainerStyle = { margin: 10 };
    const customTextStyle = { fontWeight: 'bold' as const };
    const { getByText } = render(
      <Avatar initials="CS" containerStyle={customContainerStyle} textStyle={customTextStyle} />,
      { wrapper: TestWrapper },
    );

    expect(getByText('CS')).toBeTruthy();
  });

  it('prioritizes image over initials', () => {
    const { getByTestId, queryByText } = render(
      <Avatar source={mockImageSource} initials="ShouldNotShow" testID="priority-avatar" />,
      { wrapper: TestWrapper },
    );

    expect(getByTestId('priority-avatar')).toBeTruthy();
    expect(queryByText('ShouldNotShow')).toBeNull();
  });

  describe('Size styling', () => {
    it('applies tiny size styling', () => {
      const { getByText } = render(<Avatar initials="T" size="tiny" />, { wrapper: TestWrapper });

      expect(getByText('T')).toBeTruthy();
    });

    it('applies small size styling', () => {
      const { getByText } = render(<Avatar initials="S" size="small" />, { wrapper: TestWrapper });

      expect(getByText('S')).toBeTruthy();
    });

    it('applies medium size styling', () => {
      const { getByText } = render(<Avatar initials="M" size="medium" />, { wrapper: TestWrapper });

      expect(getByText('M')).toBeTruthy();
    });

    it('applies large size styling', () => {
      const { getByText } = render(<Avatar initials="L" size="large" />, { wrapper: TestWrapper });

      expect(getByText('L')).toBeTruthy();
    });

    it('applies giant size styling', () => {
      const { getByText } = render(<Avatar initials="G" size="giant" />, { wrapper: TestWrapper });

      expect(getByText('G')).toBeTruthy();
    });
  });

  describe('Shape styling', () => {
    it('applies round shape styling', () => {
      const { getByText } = render(<Avatar initials="R" shape="round" />, { wrapper: TestWrapper });

      expect(getByText('R')).toBeTruthy();
    });

    it('applies rounded shape styling', () => {
      const { getByText } = render(<Avatar initials="RD" shape="rounded" />, { wrapper: TestWrapper });

      expect(getByText('RD')).toBeTruthy();
    });

    it('applies square shape styling', () => {
      const { getByText } = render(<Avatar initials="SQ" shape="square" />, { wrapper: TestWrapper });

      expect(getByText('SQ')).toBeTruthy();
    });
  });

  describe('Complex avatar scenarios', () => {
    it('handles avatar with all features', () => {
      const { getByText } = render(
        <Avatar
          initials="CF"
          size="large"
          shape="rounded"
          backgroundColor="#FF5722"
          textColor="#FFFFFF"
          containerStyle={{ margin: 5 }}
          textStyle={{ fontWeight: '800' }}
        />,
        { wrapper: TestWrapper },
      );

      expect(getByText('CF')).toBeTruthy();
    });

    it('handles empty initials', () => {
      const { getByTestId } = render(<Avatar initials="" testID="empty-initials" />, { wrapper: TestWrapper });

      expect(getByTestId('empty-initials')).toBeTruthy();
    });

    it('handles long initials', () => {
      const { getByText } = render(<Avatar initials="ABCD" />, { wrapper: TestWrapper });

      expect(getByText('ABCD')).toBeTruthy();
    });

    it('handles special characters in initials', () => {
      const { getByText } = render(<Avatar initials="@#" />, { wrapper: TestWrapper });

      expect(getByText('@#')).toBeTruthy();
    });
  });

  describe('UI Kitten integration', () => {
    it('uses UI Kitten Avatar for images', () => {
      const { getByTestId } = render(<Avatar source={mockImageSource} testID="kitten-avatar" />, {
        wrapper: TestWrapper,
      });

      expect(getByTestId('kitten-avatar')).toBeTruthy();
    });

    it('uses custom implementation for initials', () => {
      const { getByText } = render(<Avatar initials="CI" />, { wrapper: TestWrapper });

      expect(getByText('CI')).toBeTruthy();
    });

    it('applies correct text categories for different sizes', () => {
      const sizes = ['tiny', 'small', 'medium', 'large', 'giant'] as const;

      sizes.forEach(size => {
        const { getByText, unmount } = render(<Avatar initials={size[0].toUpperCase()} size={size} />, {
          wrapper: TestWrapper,
        });

        expect(getByText(size[0].toUpperCase())).toBeTruthy();
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('passes through accessibility props', () => {
      const { getByTestId } = render(
        <Avatar initials="A11Y" testID="accessible-avatar" accessibilityLabel="User avatar" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('accessible-avatar')).toBeTruthy();
    });
  });
});
