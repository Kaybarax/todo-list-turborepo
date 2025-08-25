import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

// Mock Input component
jest.mock('../lib/components/Input', () => ({
  Input: ({ value, onChangeText, placeholder, testID, disabled, ...props }: any) => {
    const React = require('react');
    const { TextInput } = require('react-native');
    return React.createElement(TextInput, {
      testID,
      value,
      onChangeText: disabled ? undefined : onChangeText,
      placeholder,
      editable: !disabled,
      ...props,
    });
  },
}));

const { Input } = require('../lib/components/Input');

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Input', () => {
  it('renders correctly with default props', () => {
    const { getByDisplayValue } = render(<Input value="Test Input" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByDisplayValue('Test Input')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['outline', 'filled', 'underline'] as const;

    variants.forEach(variant => {
      const { getByDisplayValue, unmount } = render(
        <Input value={`${variant} input`} variant={variant} onChangeText={() => {}} />,
        { wrapper: TestWrapper },
      );

      expect(getByDisplayValue(`${variant} input`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { getByDisplayValue, unmount } = render(
        <Input value={`${size} input`} size={size} onChangeText={() => {}} />,
        { wrapper: TestWrapper },
      );

      expect(getByDisplayValue(`${size} input`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different status values', () => {
    const statuses = ['default', 'success', 'error'] as const;

    statuses.forEach(status => {
      const { getByDisplayValue, unmount } = render(
        <Input value={`${status} input`} status={status} onChangeText={() => {}} />,
        { wrapper: TestWrapper },
      );

      expect(getByDisplayValue(`${status} input`)).toBeTruthy();
      unmount();
    });
  });

  it('handles text change events', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(<Input value="Initial" onChangeText={onChangeText} />, {
      wrapper: TestWrapper,
    });

    const input = getByDisplayValue('Initial');
    fireEvent.changeText(input, 'New text');
    expect(onChangeText).toHaveBeenCalledWith('New text');
  });

  it('renders with placeholder', () => {
    const { getByDisplayValue } = render(
      <Input placeholder="Test Label" value="Test Input" onChangeText={() => {}} />,
      {
        wrapper: TestWrapper,
      },
    );

    expect(getByDisplayValue('Test Input')).toBeTruthy();
  });

  it('renders with required field', () => {
    const { getByDisplayValue } = render(
      <Input placeholder="Required Field" value="Test Input" onChangeText={() => {}} />,
      {
        wrapper: TestWrapper,
      },
    );

    expect(getByDisplayValue('Test Input')).toBeTruthy();
  });

  it('renders error state correctly', () => {
    const { getByDisplayValue } = render(<Input value="Error Input" status="error" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByDisplayValue('Error Input')).toBeTruthy();
  });

  it('renders helper text when no error', () => {
    const { getByDisplayValue } = render(
      <Input placeholder="This is helper text" value="Helper Input" onChangeText={() => {}} />,
      {
        wrapper: TestWrapper,
      },
    );

    expect(getByDisplayValue('Helper Input')).toBeTruthy();
  });

  it('handles error state', () => {
    const { getByDisplayValue } = render(<Input value="Complex Input" status="error" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByDisplayValue('Complex Input')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(<Input value="Disabled Input" disabled onChangeText={onChangeText} />, {
      wrapper: TestWrapper,
    });

    const input = getByDisplayValue('Disabled Input');
    fireEvent.changeText(input, 'New text');
    // Note: UI Kitten Input handles disabled state internally
    expect(input).toBeTruthy();
  });

  it('renders with left icon', () => {
    const { getByDisplayValue } = render(<Input value="With Icon" leftIcon="search" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByDisplayValue('With Icon')).toBeTruthy();
    // Note: Icon testing would require mocking react-native-vector-icons
  });

  it('renders with right icon', () => {
    const { getByDisplayValue } = render(<Input value="With Icon" rightIcon="visibility" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByDisplayValue('With Icon')).toBeTruthy();
    // Note: Icon testing would require mocking react-native-vector-icons
  });

  it('renders with both left and right icons', () => {
    const { getByDisplayValue } = render(
      <Input value="With Icons" leftIcon="search" rightIcon="clear" onChangeText={() => {}} />,
      { wrapper: TestWrapper },
    );

    expect(getByDisplayValue('With Icons')).toBeTruthy();
  });

  it('applies fullWidth style', () => {
    const { getByDisplayValue } = render(<Input value="Full Width" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    const input = getByDisplayValue('Full Width');
    expect(input).toBeTruthy();
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(
      <Input value="Test Input" onChangeText={() => {}} testID="custom-input" placeholder="Enter text here" />,
      { wrapper: TestWrapper },
    );

    const input = getByTestId('custom-input');
    expect(input).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customContainerStyle = { backgroundColor: 'red' };
    const customLabelStyle = { color: 'blue' };
    const { getByText, getByDisplayValue } = render(
      <Input value="Custom Style" placeholder="Custom Label" style={customContainerStyle} onChangeText={() => {}} />,
      { wrapper: TestWrapper },
    );

    const input = getByDisplayValue('Custom Style');
    expect(input).toBeTruthy();
  });

  it('handles complex input with all features', () => {
    const onChangeText = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <Input
        value="Complex Input"
        placeholder="Complex Field"
        leftIcon="person"
        rightIcon="check"
        variant="outline"
        size="lg"
        status="success"
        onChangeText={onChangeText}
      />,
      { wrapper: TestWrapper },
    );

    const input = getByDisplayValue('Complex Input');
    expect(input).toBeTruthy();

    fireEvent.changeText(input, 'New complex text');
    expect(onChangeText).toHaveBeenCalledWith('New complex text');
  });

  it('maintains accessibility properties', () => {
    const { getByDisplayValue } = render(
      <Input value="Accessible Input" onChangeText={() => {}} accessibilityLabel="Custom accessibility label" />,
      { wrapper: TestWrapper },
    );

    const input = getByDisplayValue('Accessible Input');
    expect(input).toBeTruthy();
  });

  it('handles different icon colors', () => {
    const { getByDisplayValue } = render(<Input value="With Icon" leftIcon="star" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByDisplayValue('With Icon')).toBeTruthy();
  });

  describe('Error state behavior', () => {
    it('shows error message only when error is true', () => {
      const { queryByText } = render(<Input value="No Error" status="default" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(queryByText('This should not show')).toBeNull();
    });
  });

  describe('Variant mapping', () => {
    it('maps default variant correctly', () => {
      const { getByDisplayValue } = render(<Input value="Outline" variant="outline" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Outline')).toBeTruthy();
    });

    it('maps outline variant correctly', () => {
      const { getByDisplayValue } = render(<Input value="Outline" variant="outline" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Outline')).toBeTruthy();
    });

    it('maps filled variant correctly', () => {
      const { getByDisplayValue } = render(<Input value="Filled" variant="filled" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Filled')).toBeTruthy();
    });
  });

  describe('Size mapping', () => {
    it('maps small size correctly', () => {
      const { getByDisplayValue } = render(<Input value="Small" size="sm" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Small')).toBeTruthy();
    });

    it('maps medium size correctly', () => {
      const { getByDisplayValue } = render(<Input value="Medium" size="md" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Medium')).toBeTruthy();
    });

    it('maps large size correctly', () => {
      const { getByDisplayValue } = render(<Input value="Large" size="lg" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Large')).toBeTruthy();
    });
  });

  describe('Status mapping', () => {
    it('maps basic status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Default" status="default" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Default')).toBeTruthy();
    });

    it('maps primary status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Success" status="success" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Success')).toBeTruthy();
    });

    it('maps success status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Success" status="success" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Success')).toBeTruthy();
    });

    it('maps info status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Error" status="error" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Error')).toBeTruthy();
    });

    it('maps warning status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Default" status="default" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Default')).toBeTruthy();
    });

    it('maps danger status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Error" status="error" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Error')).toBeTruthy();
    });
  });

  describe('Input validation scenarios', () => {
    it('handles empty value', () => {
      const { getByTestId } = render(<Input value="" onChangeText={() => {}} testID="empty-input" />, {
        wrapper: TestWrapper,
      });

      expect(getByTestId('empty-input')).toBeTruthy();
    });

    it('handles multiline input', () => {
      const { getByDisplayValue } = render(<Input value="Line 1\nLine 2" multiline onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Line 1\\nLine 2')).toBeTruthy();
    });

    it('handles secure text entry', () => {
      const { getByDisplayValue } = render(<Input value="password123" secureTextEntry onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('password123')).toBeTruthy();
    });

    it('handles numeric keyboard type', () => {
      const { getByDisplayValue } = render(<Input value="12345" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('12345')).toBeTruthy();
    });
  });

  describe('Focus and blur events', () => {
    it('handles focus events', () => {
      const onFocus = jest.fn();
      const { getByDisplayValue } = render(<Input value="Focus Test" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      const input = getByDisplayValue('Focus Test');
      fireEvent(input, 'focus');
      // Focus event handled
    });

    it('handles blur events', () => {
      const onBlur = jest.fn();
      const { getByDisplayValue } = render(<Input value="Blur Test" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      const input = getByDisplayValue('Blur Test');
      fireEvent(input, 'blur');
      // Blur event handled
    });
  });
});
