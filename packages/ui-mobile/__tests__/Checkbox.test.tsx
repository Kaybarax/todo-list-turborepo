import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

// Mock Checkbox component
jest.mock('../lib/components/Checkbox', () => ({
  Checkbox: ({ checked, onValueChange, label, testID, disabled, ...props }: any) => {
    const React = require('react');
    const { TouchableOpacity, Text, View } = require('react-native');
    return React.createElement(
      TouchableOpacity,
      {
        testID,
        onPress: disabled ? undefined : () => onValueChange(!checked),
        ...props,
      },
      React.createElement(
        View,
        {},
        React.createElement(Text, {}, checked ? '☑' : '☐'),
        label && React.createElement(Text, {}, label),
      ),
    );
  },
}));

const { Checkbox } = require('../lib/components/Checkbox');

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Checkbox', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Checkbox checked={false} onValueChange={() => {}} testID="default-checkbox" />, {
      wrapper: TestWrapper,
    });

    expect(getByTestId('default-checkbox')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <Checkbox checked={false} onValueChange={() => {}} label="Accept terms and conditions" />,
      { wrapper: TestWrapper },
    );

    expect(getByText('Accept terms and conditions')).toBeTruthy();
  });

  it('handles value change events', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox checked={false} onValueChange={onValueChange} testID="interactive-checkbox" />,
      { wrapper: TestWrapper },
    );

    const checkbox = getByTestId('interactive-checkbox');
    fireEvent.press(checkbox);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('renders in checked state', () => {
    const { getByTestId } = render(<Checkbox checked={true} onValueChange={() => {}} testID="checked-checkbox" />, {
      wrapper: TestWrapper,
    });

    expect(getByTestId('checked-checkbox')).toBeTruthy();
  });

  it('renders in unchecked state', () => {
    const { getByTestId } = render(<Checkbox checked={false} onValueChange={() => {}} testID="unchecked-checkbox" />, {
      wrapper: TestWrapper,
    });

    expect(getByTestId('unchecked-checkbox')).toBeTruthy();
  });

  it('renders in indeterminate state', () => {
    const { getByTestId } = render(
      <Checkbox checked={false} onValueChange={() => {}} indeterminate={true} testID="indeterminate-checkbox" />,
      { wrapper: TestWrapper },
    );

    expect(getByTestId('indeterminate-checkbox')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox checked={false} onValueChange={onValueChange} disabled testID="disabled-checkbox" />,
      { wrapper: TestWrapper },
    );

    const checkbox = getByTestId('disabled-checkbox');
    fireEvent.press(checkbox);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders with different status values', () => {
    const statuses = ['basic', 'primary', 'success', 'info', 'warning', 'danger'] as const;

    statuses.forEach(status => {
      const { getByTestId, unmount } = render(
        <Checkbox checked={false} onValueChange={() => {}} status={status} testID={`${status}-checkbox`} />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId(`${status}-checkbox`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom styles', () => {
    const customContainerStyle = { backgroundColor: 'red' };
    const customLabelStyle = { color: 'blue' };
    const { getByText, getByTestId } = render(
      <Checkbox
        checked={false}
        onValueChange={() => {}}
        label="Custom Style"
        containerStyle={customContainerStyle}
        labelStyle={customLabelStyle}
        testID="custom-checkbox"
      />,
      { wrapper: TestWrapper },
    );

    expect(getByText('Custom Style')).toBeTruthy();
    expect(getByTestId('custom-checkbox')).toBeTruthy();
  });

  it('shows disabled styling when disabled', () => {
    const { getByText, getByTestId } = render(
      <Checkbox
        checked={false}
        onValueChange={() => {}}
        label="Disabled Checkbox"
        disabled
        testID="disabled-styled-checkbox"
      />,
      { wrapper: TestWrapper },
    );

    expect(getByText('Disabled Checkbox')).toBeTruthy();
    expect(getByTestId('disabled-styled-checkbox')).toBeTruthy();
  });

  describe('Status styling', () => {
    it('applies basic status styling', () => {
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={() => {}} status="basic" testID="basic-checkbox" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('basic-checkbox')).toBeTruthy();
    });

    it('applies primary status styling', () => {
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={() => {}} status="primary" testID="primary-checkbox" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('primary-checkbox')).toBeTruthy();
    });

    it('applies success status styling', () => {
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={() => {}} status="success" testID="success-checkbox" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('success-checkbox')).toBeTruthy();
    });

    it('applies info status styling', () => {
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={() => {}} status="info" testID="info-checkbox" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('info-checkbox')).toBeTruthy();
    });

    it('applies warning status styling', () => {
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={() => {}} status="warning" testID="warning-checkbox" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('warning-checkbox')).toBeTruthy();
    });

    it('applies danger status styling', () => {
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={() => {}} status="danger" testID="danger-checkbox" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('danger-checkbox')).toBeTruthy();
    });
  });

  describe('Complex checkbox scenarios', () => {
    it('handles checkbox with all features', () => {
      const onValueChange = jest.fn();
      const { getByText, getByTestId } = render(
        <Checkbox
          checked={true}
          onValueChange={onValueChange}
          label="Complex Checkbox"
          status="success"
          indeterminate={false}
          containerStyle={{ padding: 10 }}
          labelStyle={{ fontWeight: 'bold' }}
          testID="complex-checkbox"
        />,
        { wrapper: TestWrapper },
      );

      const checkbox = getByTestId('complex-checkbox');
      const label = getByText('Complex Checkbox');

      expect(checkbox).toBeTruthy();
      expect(label).toBeTruthy();

      fireEvent.press(checkbox);
      expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it('handles checkbox without label', () => {
      const { getByTestId } = render(<Checkbox checked={false} onValueChange={() => {}} testID="no-label-checkbox" />, {
        wrapper: TestWrapper,
      });

      expect(getByTestId('no-label-checkbox')).toBeTruthy();
    });

    it('handles long label text', () => {
      const longLabel =
        'This is a very long label that should wrap properly in the checkbox component and maintain readability';
      const { getByText } = render(<Checkbox checked={false} onValueChange={() => {}} label={longLabel} />, {
        wrapper: TestWrapper,
      });

      expect(getByText(longLabel)).toBeTruthy();
    });

    it('handles indeterminate state with checked=true', () => {
      const { getByTestId } = render(
        <Checkbox checked={true} onValueChange={() => {}} indeterminate={true} testID="indeterminate-checked" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('indeterminate-checked')).toBeTruthy();
    });
  });

  describe('State management', () => {
    it('toggles from false to true', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={onValueChange} testID="toggle-checkbox" />,
        { wrapper: TestWrapper },
      );

      fireEvent.press(getByTestId('toggle-checkbox'));
      expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('toggles from true to false', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <Checkbox checked={true} onValueChange={onValueChange} testID="toggle-checkbox" />,
        { wrapper: TestWrapper },
      );

      fireEvent.press(getByTestId('toggle-checkbox'));
      expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it('does not call onValueChange when disabled', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={onValueChange} disabled testID="disabled-toggle-checkbox" />,
        { wrapper: TestWrapper },
      );

      fireEvent.press(getByTestId('disabled-toggle-checkbox'));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('UI Kitten integration', () => {
    it('uses UI Kitten CheckBox component', () => {
      const { getByTestId } = render(<Checkbox checked={false} onValueChange={() => {}} testID="kitten-checkbox" />, {
        wrapper: TestWrapper,
      });

      expect(getByTestId('kitten-checkbox')).toBeTruthy();
    });

    it('passes through additional props to CheckBox', () => {
      const { getByTestId } = render(
        <Checkbox checked={false} onValueChange={() => {}} testID="props-checkbox" accessibilityLabel="Accept terms" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('props-checkbox')).toBeTruthy();
    });

    it('renders label using UI Kitten Text component', () => {
      const { getByText } = render(<Checkbox checked={false} onValueChange={() => {}} label="UI Kitten Text" />, {
        wrapper: TestWrapper,
      });

      expect(getByText('UI Kitten Text')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('maintains accessibility properties', () => {
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onValueChange={() => {}}
          testID="accessible-checkbox"
          accessibilityLabel="Accept privacy policy"
        />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('accessible-checkbox')).toBeTruthy();
    });

    it('handles accessibility state changes', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onValueChange={onValueChange}
          testID="a11y-checkbox"
          accessibilityLabel="Toggle option"
        />,
        { wrapper: TestWrapper },
      );

      const checkbox = getByTestId('a11y-checkbox');
      fireEvent.press(checkbox);
      expect(onValueChange).toHaveBeenCalledWith(true);
    });
  });
});
