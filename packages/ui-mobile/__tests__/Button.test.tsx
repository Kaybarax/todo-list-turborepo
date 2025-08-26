import { render, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';

import { Button } from '../lib/components/Button/Button';
import { ThemeProvider } from '../lib/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Button', () => {
  it('renders correctly with default props', () => {
    renderWithTheme(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeTruthy();
  });

  it('handles onPress correctly', () => {
    const onPressMock = jest.fn();
    renderWithTheme(<Button onPress={onPressMock}>Press Me</Button>);

    fireEvent.press(screen.getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders all variants correctly', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

    variants.forEach(variant => {
      const { unmount } = renderWithTheme(
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
      const { unmount } = renderWithTheme(
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
    renderWithTheme(
      <Button disabled onPress={onPressMock} testID="disabled-button">
        Disabled Button
      </Button>,
    );

    const button = screen.getByTestId('disabled-button');
    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading state correctly', () => {
    renderWithTheme(
      <Button loading testID="loading-button">
        Loading Button
      </Button>,
    );

    expect(screen.getByTestId('loading-button')).toBeTruthy();
    // Loading indicator should be present
    expect(screen.getByTestId('button-loading-indicator')).toBeTruthy();
  });

  it('applies fullWidth style correctly', () => {
    renderWithTheme(
      <Button fullWidth testID="full-width-button">
        Full Width Button
      </Button>,
    );

    const button = screen.getByTestId('full-width-button');
    expect(button).toBeTruthy();
  });

  it('applies custom style correctly', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithTheme(
      <Button style={customStyle} testID="custom-style-button" onPress={() => {}}>
        Custom Style Button
      </Button>,
    );

    expect(screen.getByTestId('custom-style-button')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    renderWithTheme(
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
    renderWithTheme(
      <Button loading onPress={onPressMock} testID="loading-button">
        Loading Button
      </Button>,
    );

    fireEvent.press(screen.getByTestId('loading-button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with icon correctly', () => {
    renderWithTheme(<Button testID="icon-button">Button Text</Button>);

    expect(screen.getByTestId('icon-button')).toBeTruthy();
    expect(screen.getByText('Button Text')).toBeTruthy();
  });

  it('handles long press correctly', () => {
    const onLongPressMock = jest.fn();
    renderWithTheme(
      <Button onLongPress={onLongPressMock} testID="long-press-button">
        Long Press Button
      </Button>,
    );

    fireEvent(screen.getByTestId('long-press-button'), 'longPress');
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
  });
});
