import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Checkbox } from './Checkbox';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('Checkbox Component', () => {
  it('renders correctly', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(<Checkbox checked={false} onValueChange={onValueChange} testID="test-checkbox" />);

    expect(getByTestId('test-checkbox')).toBeTruthy();
    expect(getByTestId('test-checkbox-box')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(<Checkbox checked={false} onValueChange={() => {}} label="Accept terms" />);

    expect(getByText('Accept terms')).toBeTruthy();
  });

  it('shows check icon when checked', () => {
    const { getByTestId } = render(<Checkbox checked={true} onValueChange={() => {}} testID="test-checkbox" />);

    expect(getByTestId('test-checkbox-check')).toBeTruthy();
  });

  it('handles value change', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(<Checkbox checked={false} onValueChange={onValueChange} testID="test-checkbox" />);

    fireEvent.press(getByTestId('test-checkbox'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('disables interaction when disabled', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox checked={false} onValueChange={onValueChange} disabled={true} testID="test-checkbox" />,
    );

    fireEvent.press(getByTestId('test-checkbox'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <Checkbox
        checked={false}
        onValueChange={() => {}}
        containerStyle={{ padding: 10 }}
        checkboxStyle={{ borderRadius: 10 }}
        labelStyle={{ fontWeight: 'bold' }}
        testID="styled-checkbox"
      />,
    );

    const container = getByTestId('styled-checkbox');
    const checkbox = getByTestId('styled-checkbox-box');

    expect(container.props.style).toContainEqual(expect.objectContaining({ padding: 10 }));
    expect(checkbox.props.style).toContainEqual(expect.objectContaining({ borderRadius: 10 }));
  });
});
