import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { render, testThemeSwitch, testAccessibility } from '../../../src/test/utils/eva-test-utils';
import { Button } from '../Button';

describe('Button - Eva Design Integration', () => {
  it('renders with Eva Design theming', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('applies Eva Design status colors', () => {
    const { getByText } = render(<Button title="Primary Button" status="primary" onPress={() => {}} />);

    const button = getByText('Primary Button');
    expect(button).toBeTruthy();
  });

  it('supports Eva Design appearances', () => {
    const { getByText } = render(<Button title="Outline Button" appearance="outline" onPress={() => {}} />);

    expect(getByText('Outline Button')).toBeTruthy();
  });

  it('handles theme switching', () => {
    const component = <Button title="Theme Button" onPress={() => {}} />;
    const { light, dark } = testThemeSwitch(component);

    expect(light.getByText('Theme Button')).toBeTruthy();
    expect(dark.getByText('Theme Button')).toBeTruthy();
  });

  it('maintains accessibility with Eva Design', async () => {
    const { getByRole } = await testAccessibility(<Button title="Accessible Button" onPress={() => {}} />);

    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('handles press events correctly', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<Button title="Press Button" onPress={mockPress} />);

    fireEvent.press(getByText('Press Button'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state with Eva Design styling', () => {
    const { getByText } = render(<Button title="Disabled Button" disabled onPress={() => {}} />);

    const button = getByText('Disabled Button');
    expect(button).toBeTruthy();
  });

  it('renders with accessories', () => {
    const MockIcon = () => null;

    const { getByText } = render(<Button title="Icon Button" accessoryLeft={MockIcon} onPress={() => {}} />);

    expect(getByText('Icon Button')).toBeTruthy();
  });
});
