import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('renders correctly', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Switch 
        value={false} 
        onValueChange={onValueChange} 
        testID="test-switch" 
      />
    );
    
    expect(getByTestId('test-switch')).toBeTruthy();
    expect(getByTestId('test-switch-switch')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <Switch 
        value={false} 
        onValueChange={() => {}} 
        label="Enable notifications" 
      />
    );
    
    expect(getByText('Enable notifications')).toBeTruthy();
  });

  it('handles value change', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Switch 
        value={false} 
        onValueChange={onValueChange} 
        testID="test-switch" 
      />
    );
    
    fireEvent(getByTestId('test-switch-switch'), 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('disables interaction when disabled', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <Switch 
        value={false} 
        onValueChange={onValueChange} 
        disabled={true}
        testID="test-switch" 
      />
    );
    
    fireEvent(getByTestId('test-switch-switch'), 'valueChange', true);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <Switch 
        value={false} 
        onValueChange={() => {}} 
        containerStyle={{ padding: 10 }}
        labelStyle={{ fontWeight: 'bold' }}
        testID="styled-switch" 
      />
    );
    
    const container = getByTestId('styled-switch');
    expect(container.props.style).toContainEqual(
      expect.objectContaining({ padding: 10 })
    );
  });
});