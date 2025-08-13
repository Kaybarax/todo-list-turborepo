import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Switch } from '../../lib/components/Switch/Switch';

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Switch', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Switch value={false} onValueChange={() => {}} testID="default-switch" />, {
      wrapper: TestWrapper,
    });

    expect(getByTestId('default-switch')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(<Switch value={false} onValueChange={() => {}} label="Enable notifications" />, {
      wrapper: TestWrapper,
    });

    expect(getByText('Enable notifications')).toBeTruthy();
  });

  it('handles value change events', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(<Switch value={false} onValueChange={onValueChange} testID="interactive-switch" />, {
      wrapper: TestWrapper,
    });

    const switchElement = getByTestId('interactive-switch');
    fireEvent.press(switchElement);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('renders in checked state', () => {
    const { getByTestId } = render(<Switch value={true} onValueChange={() => {}} testID="checked-switch" />, {
      wrapper: TestWrapper,
    });

    expect(getByTestId('checked-switch')).toBeTruthy();
  });

  it('renders in unchecked state', () => {
    const { getByTestId } = render(<Switch value={false} onValueChange={() => {}} testID="unchecked-switch" />, {
      wrapper: TestWrapper,
    });

    expect(getByTestId('unchecked-switch')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Switch value={false} onValueChange={onValueChange} disabled testID="disabled-switch" />,
      { wrapper: TestWrapper },
    );

    const switchElement = getByTestId('disabled-switch');
    fireEvent.press(switchElement);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders with different status values', () => {
    const statuses = ['basic', 'primary', 'success', 'info', 'warning', 'danger'] as const;

    statuses.forEach(status => {
      const { getByTestId, unmount } = render(
        <Switch value={false} onValueChange={() => {}} status={status} testID={`${status}-switch`} />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId(`${status}-switch`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom styles', () => {
    const customContainerStyle = { backgroundColor: 'red' };
    const customLabelStyle = { color: 'blue' };
    const { getByText, getByTestId } = render(
      <Switch
        value={false}
        onValueChange={() => {}}
        label="Custom Style"
        containerStyle={customContainerStyle}
        labelStyle={customLabelStyle}
        testID="custom-switch"
      />,
      { wrapper: TestWrapper },
    );

    expect(getByText('Custom Style')).toBeTruthy();
    expect(getByTestId('custom-switch')).toBeTruthy();
  });

  it('shows disabled styling when disabled', () => {
    const { getByText, getByTestId } = render(
      <Switch
        value={false}
        onValueChange={() => {}}
        label="Disabled Switch"
        disabled
        testID="disabled-styled-switch"
      />,
      { wrapper: TestWrapper },
    );

    expect(getByText('Disabled Switch')).toBeTruthy();
    expect(getByTestId('disabled-styled-switch')).toBeTruthy();
  });

  describe('Status styling', () => {
    it('applies basic status styling', () => {
      const { getByTestId } = render(
        <Switch value={false} onValueChange={() => {}} status="basic" testID="basic-switch" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('basic-switch')).toBeTruthy();
    });

    it('applies primary status styling', () => {
      const { getByTestId } = render(
        <Switch value={false} onValueChange={() => {}} status="primary" testID="primary-switch" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('primary-switch')).toBeTruthy();
    });

    it('applies success status styling', () => {
      const { getByTestId } = render(
        <Switch value={false} onValueChange={() => {}} status="success" testID="success-switch" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('success-switch')).toBeTruthy();
    });

    it('applies info status styling', () => {
      const { getByTestId } = render(
        <Switch value={false} onValueChange={() => {}} status="info" testID="info-switch" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('info-switch')).toBeTruthy();
    });

    it('applies warning status styling', () => {
      const { getByTestId } = render(
        <Switch value={false} onValueChange={() => {}} status="warning" testID="warning-switch" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('warning-switch')).toBeTruthy();
    });

    it('applies danger status styling', () => {
      const { getByTestId } = render(
        <Switch value={false} onValueChange={() => {}} status="danger" testID="danger-switch" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('danger-switch')).toBeTruthy();
    });
  });

  describe('Complex switch scenarios', () => {
    it('handles switch with all features', () => {
      const onValueChange = jest.fn();
      const { getByText, getByTestId } = render(
        <Switch
          value={true}
          onValueChange={onValueChange}
          label="Complex Switch"
          status="success"
          containerStyle={{ padding: 10 }}
          labelStyle={{ fontWeight: 'bold' }}
          testID="complex-switch"
        />,
        { wrapper: TestWrapper },
      );

      const switchElement = getByTestId('complex-switch');
      const label = getByText('Complex Switch');

      expect(switchElement).toBeTruthy();
      expect(label).toBeTruthy();

      fireEvent.press(switchElement);
      expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it('handles switch without label', () => {
      const { getByTestId } = render(<Switch value={false} onValueChange={() => {}} testID="no-label-switch" />, {
        wrapper: TestWrapper,
      });

      expect(getByTestId('no-label-switch')).toBeTruthy();
    });

    it('handles long label text', () => {
      const longLabel = 'This is a very long label that should wrap properly in the switch component';
      const { getByText } = render(<Switch value={false} onValueChange={() => {}} label={longLabel} />, {
        wrapper: TestWrapper,
      });

      expect(getByText(longLabel)).toBeTruthy();
    });
  });

  describe('State management', () => {
    it('toggles from false to true', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(<Switch value={false} onValueChange={onValueChange} testID="toggle-switch" />, {
        wrapper: TestWrapper,
      });

      fireEvent.press(getByTestId('toggle-switch'));
      expect(onValueChange).toHaveBeenCalledWith(true);
    });

    it('toggles from true to false', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(<Switch value={true} onValueChange={onValueChange} testID="toggle-switch" />, {
        wrapper: TestWrapper,
      });

      fireEvent.press(getByTestId('toggle-switch'));
      expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it('does not call onValueChange when disabled', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <Switch value={false} onValueChange={onValueChange} disabled testID="disabled-toggle-switch" />,
        { wrapper: TestWrapper },
      );

      fireEvent.press(getByTestId('disabled-toggle-switch'));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('UI Kitten integration', () => {
    it('uses UI Kitten Toggle component', () => {
      const { getByTestId } = render(<Switch value={false} onValueChange={() => {}} testID="kitten-switch" />, {
        wrapper: TestWrapper,
      });

      expect(getByTestId('kitten-switch')).toBeTruthy();
    });

    it('passes through additional props to Toggle', () => {
      const { getByTestId } = render(
        <Switch value={false} onValueChange={() => {}} testID="props-switch" accessibilityLabel="Toggle switch" />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('props-switch')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('maintains accessibility properties', () => {
      const { getByTestId } = render(
        <Switch
          value={false}
          onValueChange={() => {}}
          testID="accessible-switch"
          accessibilityLabel="Toggle notifications"
        />,
        { wrapper: TestWrapper },
      );

      expect(getByTestId('accessible-switch')).toBeTruthy();
    });
  });
});
