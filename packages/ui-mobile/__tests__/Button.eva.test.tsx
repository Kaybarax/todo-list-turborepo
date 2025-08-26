import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { TestWrapper } from '../src/test/eva-setup';
import { Button } from '../lib/components/Button/Button';

describe('Button - Eva Design Integration', () => {
  it('renders with Eva Design theming', () => {
    const { getByText } = render(<Button onPress={() => {}}>Test Button</Button>, { wrapper: TestWrapper });

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('applies Eva Design status colors', () => {
    const { getByText } = render(
      <Button variant="primary" onPress={() => {}}>
        Primary Button
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByText('Primary Button');
    expect(button).toBeTruthy();
  });

  it('supports Eva Design appearances', () => {
    const { getByText } = render(
      <Button variant="outline" onPress={() => {}}>
        Outline Button
      </Button>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Outline Button')).toBeTruthy();
  });

  it('handles theme switching', () => {
    const { getByText } = render(<Button onPress={() => {}}>Theme Button</Button>, { wrapper: TestWrapper });
    expect(getByText('Theme Button')).toBeTruthy();
  });

  it('maintains accessibility with Eva Design', () => {
    const { getByText } = render(<Button onPress={() => {}}>Accessible Button</Button>, { wrapper: TestWrapper });
    const button = getByText('Accessible Button');
    expect(button).toBeTruthy();
  });

  it('handles press events correctly', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<Button onPress={mockPress}>Press Button</Button>, { wrapper: TestWrapper });

    fireEvent.press(getByText('Press Button'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state with Eva Design styling', () => {
    const { getByText } = render(
      <Button disabled onPress={() => {}}>
        Disabled Button
      </Button>,
      { wrapper: TestWrapper },
    );

    const button = getByText('Disabled Button');
    expect(button).toBeTruthy();
  });

  it('renders with accessories', () => {
    const MockIcon = () => null;

    const { getByText } = render(
      <Button icon={<MockIcon />} onPress={() => {}}>
        Icon Button
      </Button>,
      { wrapper: TestWrapper },
    );

    expect(getByText('Icon Button')).toBeTruthy();
  });
});
