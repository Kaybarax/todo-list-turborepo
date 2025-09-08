import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../lib/components/Button/Button';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';

describe('Button', () => {
  it('renders correctly with default props', () => {
    renderWithProvider(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeTruthy();
  });

  it('handles onPress correctly', () => {
    const onPressMock = jest.fn();
    renderWithProvider(<Button onPress={onPressMock}>Press Me</Button>);

    fireEvent.press(screen.getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders all variants correctly', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

    variants.forEach(variant => {
      const { unmount } = renderWithProvider(
        <Button variant={variant} testID={`button-${variant}`}>
          {variant} Button
        </Button>,
      );

      expect(screen.getByTestId(`button-${variant}`)).toBeTruthy();
      unmount();
    });
  });

  it('renders all sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { unmount } = renderWithProvider(
        <Button size={size} testID={`button-${size}`}>
          {size} Button
        </Button>,
      );

      expect(screen.getByTestId(`button-${size}`)).toBeTruthy();
      unmount();
    });
  });

  it('disables button when disabled prop is true', () => {
    const onPressMock = jest.fn();
    renderWithProvider(
      <Button disabled onPress={onPressMock} testID="disabled-button">
        Disabled Button
      </Button>,
    );

    const button = screen.getByTestId('disabled-button');
    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading state correctly', () => {
    renderWithProvider(
      <Button loading testID="loading-button">
        Loading Button
      </Button>,
    );

    expect(screen.getByTestId('loading-button')).toBeTruthy();
    // Loading indicator should be present
    expect(screen.getByTestId('button-loading-indicator')).toBeTruthy();
  });

  it('applies fullWidth style correctly', () => {
    renderWithProvider(
      <Button fullWidth testID="full-width-button">
        Full Width Button
      </Button>,
    );

    const button = screen.getByTestId('full-width-button');
    expect(button).toBeTruthy();
  });

  it('applies custom style correctly', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithProvider(
      <Button style={customStyle} testID="custom-style-button" onPress={() => {}}>
        Custom Style Button
      </Button>,
    );

    expect(screen.getByTestId('custom-style-button')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    renderWithProvider(
      <Button
        accessibilityLabel="Custom accessibility label"
        accessibilityHint="Custom accessibility hint"
        testID="accessible-button"
      >
        Accessible Button
      </Button>,
    );

    const button = screen.getByTestId('accessible-button');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityLabel).toBe('Custom accessibility label');
    expect(button.props.accessibilityHint).toBe('Custom accessibility hint');
    expect(button.props.accessibilityRole).toBe('button');
  });

  it('prevents press when loading', () => {
    const onPressMock = jest.fn();
    renderWithProvider(
      <Button loading onPress={onPressMock} testID="loading-button">
        Loading Button
      </Button>,
    );

    fireEvent.press(screen.getByTestId('loading-button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with icon correctly', () => {
    renderWithProvider(<Button testID="icon-button">Button Text</Button>);

    expect(screen.getByTestId('icon-button')).toBeTruthy();
    expect(screen.getByText('Button Text')).toBeTruthy();
  });

  it('handles long press correctly', () => {
    const onLongPressMock = jest.fn();
    renderWithProvider(
      <Button onLongPress={onLongPressMock} testID="long-press-button">
        Long Press Button
      </Button>,
    );

    fireEvent(screen.getByTestId('long-press-button'), 'longPress');
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
  });
});
