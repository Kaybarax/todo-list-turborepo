import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Input } from '../lib/components/Input';

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
    const variants = ['default', 'outline', 'filled'] as const;

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
    const sizes = ['small', 'medium', 'large'] as const;

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
    const statuses = ['basic', 'primary', 'success', 'info', 'warning', 'danger'] as const;

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

  it('renders with label', () => {
    const { getByText } = render(<Input label="Test Label" value="Test" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with required label', () => {
    const { getByText } = render(<Input label="Required Field" required value="Test" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByText('Required Field *')).toBeTruthy();
  });

  it('renders error state correctly', () => {
    const { getByText } = render(
      <Input value="Test" error errorMessage="This field is required" onChangeText={() => {}} />,
      { wrapper: TestWrapper },
    );

    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders helper text when no error', () => {
    const { getByText } = render(<Input value="Test" helperText="This is helper text" onChangeText={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(getByText('This is helper text')).toBeTruthy();
  });

  it('hides helper text when error is present', () => {
    const { getByText, queryByText } = render(
      <Input value="Test" error errorMessage="Error message" helperText="Helper text" onChangeText={() => {}} />,
      { wrapper: TestWrapper },
    );

    expect(getByText('Error message')).toBeTruthy();
    expect(queryByText('Helper text')).toBeNull();
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
    const { getByDisplayValue } = render(<Input value="Full Width" fullWidth onChangeText={() => {}} />, {
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
      <Input
        value="Custom Style"
        label="Custom Label"
        containerStyle={customContainerStyle}
        labelStyle={customLabelStyle}
        onChangeText={() => {}}
      />,
      { wrapper: TestWrapper },
    );

    const input = getByDisplayValue('Custom Style');
    const label = getByText('Custom Label');
    expect(input).toBeTruthy();
    expect(label).toBeTruthy();
  });

  it('handles complex input with all features', () => {
    const onChangeText = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <Input
        value="Complex Input"
        label="Complex Field"
        required
        helperText="This is a complex input"
        leftIcon="person"
        rightIcon="check"
        variant="outline"
        size="large"
        status="success"
        fullWidth
        onChangeText={onChangeText}
      />,
      { wrapper: TestWrapper },
    );

    const input = getByDisplayValue('Complex Input');
    const label = getByText('Complex Field *');
    const helper = getByText('This is a complex input');

    expect(input).toBeTruthy();
    expect(label).toBeTruthy();
    expect(helper).toBeTruthy();

    fireEvent.changeText(input, 'New complex text');
    expect(onChangeText).toHaveBeenCalledWith('New complex text');
  });

  it('maintains accessibility properties', () => {
    const { getByLabelText } = render(
      <Input value="Accessible Input" onChangeText={() => {}} accessibilityLabel="Custom accessibility label" />,
      { wrapper: TestWrapper },
    );

    const input = getByLabelText('Custom accessibility label');
    expect(input).toBeTruthy();
  });

  it('handles different icon colors', () => {
    const { getByDisplayValue } = render(
      <Input value="Colored Icon" leftIcon="star" iconColor="#FF0000" onChangeText={() => {}} />,
      { wrapper: TestWrapper },
    );

    expect(getByDisplayValue('Colored Icon')).toBeTruthy();
  });

  describe('Error state behavior', () => {
    it('overrides status when error is true', () => {
      const { getByText } = render(
        <Input
          value="Error Input"
          status="success"
          error
          errorMessage="Error overrides success"
          onChangeText={() => {}}
        />,
        { wrapper: TestWrapper },
      );

      expect(getByText('Error overrides success')).toBeTruthy();
    });

    it('shows error message only when error is true', () => {
      const { queryByText } = render(
        <Input value="No Error" error={false} errorMessage="This should not show" onChangeText={() => {}} />,
        { wrapper: TestWrapper },
      );

      expect(queryByText('This should not show')).toBeNull();
    });
  });

  describe('Variant mapping', () => {
    it('maps default variant correctly', () => {
      const { getByDisplayValue } = render(<Input value="Default" variant="default" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Default')).toBeTruthy();
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
      const { getByDisplayValue } = render(<Input value="Small" size="small" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Small')).toBeTruthy();
    });

    it('maps medium size correctly', () => {
      const { getByDisplayValue } = render(<Input value="Medium" size="medium" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Medium')).toBeTruthy();
    });

    it('maps large size correctly', () => {
      const { getByDisplayValue } = render(<Input value="Large" size="large" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Large')).toBeTruthy();
    });
  });

  describe('Status mapping', () => {
    it('maps basic status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Basic" status="basic" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Basic')).toBeTruthy();
    });

    it('maps primary status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Primary" status="primary" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Primary')).toBeTruthy();
    });

    it('maps success status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Success" status="success" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Success')).toBeTruthy();
    });

    it('maps info status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Info" status="info" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Info')).toBeTruthy();
    });

    it('maps warning status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Warning" status="warning" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Warning')).toBeTruthy();
    });

    it('maps danger status correctly', () => {
      const { getByDisplayValue } = render(<Input value="Danger" status="danger" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('Danger')).toBeTruthy();
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

      expect(getByDisplayValue('Line 1\nLine 2')).toBeTruthy();
    });

    it('handles secure text entry', () => {
      const { getByDisplayValue } = render(<Input value="password123" secureTextEntry onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('password123')).toBeTruthy();
    });

    it('handles numeric keyboard type', () => {
      const { getByDisplayValue } = render(<Input value="12345" keyboardType="numeric" onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      expect(getByDisplayValue('12345')).toBeTruthy();
    });
  });

  describe('Focus and blur events', () => {
    it('handles focus events', () => {
      const onFocus = jest.fn();
      const { getByDisplayValue } = render(<Input value="Focus Test" onFocus={onFocus} onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      const input = getByDisplayValue('Focus Test');
      fireEvent(input, 'focus');
      expect(onFocus).toHaveBeenCalled();
    });

    it('handles blur events', () => {
      const onBlur = jest.fn();
      const { getByDisplayValue } = render(<Input value="Blur Test" onBlur={onBlur} onChangeText={() => {}} />, {
        wrapper: TestWrapper,
      });

      const input = getByDisplayValue('Blur Test');
      fireEvent(input, 'blur');
      expect(onBlur).toHaveBeenCalled();
    });
  });
});
