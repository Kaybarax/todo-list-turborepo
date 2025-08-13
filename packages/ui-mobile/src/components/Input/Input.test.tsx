import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(<Input label="Email" placeholder="Enter email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('renders with error message', () => {
    const { getByText } = render(<Input placeholder="Enter email" error={true} errorMessage="Invalid email" />);
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('handles text input', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" onChangeText={onChangeText} />);

    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'Hello world');

    expect(onChangeText).toHaveBeenCalledWith('Hello world');
  });

  it('renders with left icon', () => {
    const { getByTestId } = render(<Input placeholder="Search" leftIcon={<Text testID="left-icon">🔍</Text>} />);
    expect(getByTestId('left-icon')).toBeTruthy();
  });

  it('renders with right icon', () => {
    const { getByTestId } = render(<Input placeholder="Password" rightIcon={<Text testID="right-icon">👁️</Text>} />);
    expect(getByTestId('right-icon')).toBeTruthy();
  });
});
