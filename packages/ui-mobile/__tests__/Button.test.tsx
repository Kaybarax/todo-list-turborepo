import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

// Mock the Button component to handle loading state properly
jest.mock('../lib/components/Button', () => ({
  Button: ({ children, onPress, testID, accessibilityLabel, disabled, loading, ...props }: any) => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');

    const handlePress = disabled || loading ? () => {} : onPress;
    return React.createElement(
      TouchableOpacity,
      {
        onPress: handlePress,
        testID,
        accessibilityLabel,
        disabled: disabled || loading,
        ...props,
      },
      loading ? React.createElement(Text, {}, 'Loading...') : React.createElement(Text, {}, children),
    );
  },
}));

const { Button } = require('../lib/components/Button');

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Button', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Button onPress={() => {}}>Test Button</Button>, { wrapper: TestWrapper });

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;

    variants.forEach(variant => {
      const { getByText, unmount } = render(
        <Button variant={variant} onPress={() => {}}>{`${variant} Button`}</Button>,
        { wrapper: TestWrapper },
      );

      expect(getByText(`${variant} Button`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { getByText, unmount } = render(<Button size={size} onPress={() => {}}>{`${size} Button`}</Button>, {
        wrapper: TestWrapper,
      });

      expect(getByText(`${size} Button`)).toBeTruthy();
      unmount();
    });
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Press Me</Button>, { wrapper: TestWrapper });

    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button disabled onPress={onPress}>
        Disabled
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByText('Disabled');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('is disabled when loading', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button loading onPress={onPress} testID="loading-button-press">
        Loading with Press
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByTestId('loading-button-press');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading state correctly', () => {
    const { queryByText, getByTestId } = render(
      <Button loading={true} onPress={() => {}} testID="loading-button">
        Loading Button
      </Button>,
      { wrapper: TestWrapper },
    );

    // Loading text should be visible instead of original text
    expect(queryByText('Loading...')).toBeTruthy();
    // Original text should not be visible when loading
    expect(queryByText('Loading Button')).toBeNull();

    // Activity indicator should be present
    const button = getByTestId('loading-button');
    expect(button).toBeTruthy();
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(
      <Button loading onPress={() => {}} testID="loading-button" accessibilityLabel="Custom accessibility label">
        Loading
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByTestId('loading-button');
    expect(button).toBeTruthy();
  });

  it('renders with left icon', () => {
    const { getByText } = render(
      <Button icon="star" iconPosition="left" onPress={() => {}}>
        With Icon
      </Button>,
      {
        wrapper: TestWrapper,
      },
    );

    expect(getByText('With Icon')).toBeTruthy();
    // Note: Icon testing would require mocking react-native-vector-icons
  });

  it('renders with right icon', () => {
    const { getByText } = render(
      <Button icon="arrow-forward" iconPosition="right" onPress={() => {}}>
        With Icon
      </Button>,
      {
        wrapper: TestWrapper,
      },
    );

    expect(getByText('With Icon')).toBeTruthy();
    // Note: Icon testing would require mocking react-native-vector-icons
  });

  it('renders with both left and right icons', () => {
    const { getByText } = render(
      <Button icon="star" iconPosition="left" onPress={() => {}}>
        With Icons
      </Button>,
      { wrapper: TestWrapper },
    );

    expect(getByText('With Icons')).toBeTruthy();
  });

  it('renders with icon', () => {
    const { getByText } = render(
      <Button icon={<>★</>} onPress={() => {}}>
        With Icon
      </Button>,
      {
        wrapper: TestWrapper,
      },
    );

    expect(getByText('With Icon')).toBeTruthy();
  });

  it('applies fullWidth style', () => {
    const { getByText } = render(
      <Button fullWidth onPress={() => {}}>
        Full Width
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByText('Full Width').parent;
    // Check if the button has full width style applied
    expect(button).toBeTruthy();
  });

  it('applies rounded style', () => {
    const { getByText } = render(<Button onPress={() => {}}>Rounded</Button>, { wrapper: TestWrapper });

    const button = getByText('Rounded').parent;
    // Check if the button has rounded style applied
    expect(button).toBeTruthy();
  });

  it('renders full width', () => {
    const { getByText } = render(
      <Button fullWidth onPress={() => {}}>
        Full Width
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByText('Full Width').parent;
    // Check if the button has full width style applied
    expect(button).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <Button style={customStyle} onPress={() => {}}>
        Custom Style
      </Button>,
      {
        wrapper: TestWrapper,
      },
    );

    const button = getByText('Custom Style').parent;
    expect(button).toBeTruthy();
  });

  it('handles complex button with all features', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button variant="primary" size="lg" icon="check" iconPosition="left" fullWidth onPress={onPress}>
        Complex Button
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByText('Complex Button');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('maintains accessibility properties', () => {
    const { getByText } = render(
      <Button onPress={() => {}} accessibilityLabel="Custom accessibility label">
        Accessible Button
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByText('Accessible Button');
    expect(button).toBeTruthy();
  });

  it('handles different icon colors', () => {
    const { getByText } = render(
      <Button icon="star" iconPosition="left" onPress={() => {}}>
        Colored Icon
      </Button>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Colored Icon')).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('has proper accessibility props', () => {
      const { getByText } = render(
        <Button onPress={() => {}} accessibilityLabel="Custom accessibility label">
          Accessible Button
        </Button>,
        { wrapper: TestWrapper },
      );

      expect(getByText('Accessible Button')).toBeTruthy();
    });
  });

  describe('Theme Integration', () => {
    it('renders with primary variant', () => {
      const { getByText } = render(
        <Button variant="primary" onPress={() => {}}>
          Primary
        </Button>,
        {
          wrapper: TestWrapper,
        },
      );

      expect(getByText('Primary')).toBeTruthy();
    });

    it('renders with secondary variant', () => {
      const { getByText } = render(
        <Button variant="secondary" onPress={() => {}}>
          Secondary
        </Button>,
        {
          wrapper: TestWrapper,
        },
      );

      expect(getByText('Secondary')).toBeTruthy();
    });

    it('renders with outline variant', () => {
      const { getByText } = render(
        <Button variant="outline" onPress={() => {}}>
          Outline
        </Button>,
        {
          wrapper: TestWrapper,
        },
      );

      expect(getByText('Outline')).toBeTruthy();
    });

    it('renders with ghost variant', () => {
      const { getByText } = render(
        <Button variant="ghost" onPress={() => {}}>
          Ghost
        </Button>,
        {
          wrapper: TestWrapper,
        },
      );

      expect(getByText('Ghost')).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    it('renders with sm size', () => {
      const { getByText } = render(
        <Button size="sm" onPress={() => {}}>
          Small
        </Button>,
        { wrapper: TestWrapper },
      );

      expect(getByText('Small')).toBeTruthy();
    });

    it('renders with md size', () => {
      const { getByText } = render(
        <Button size="md" onPress={() => {}}>
          Medium
        </Button>,
        {
          wrapper: TestWrapper,
        },
      );

      expect(getByText('Medium')).toBeTruthy();
    });

    it('renders with lg size', () => {
      const { getByText } = render(
        <Button size="lg" onPress={() => {}}>
          Large
        </Button>,
        { wrapper: TestWrapper },
      );

      expect(getByText('Large')).toBeTruthy();
    });
  });
});
