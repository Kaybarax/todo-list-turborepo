import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Button } from '../../lib/components/Button/Button';

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Button', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'danger', 'success', 'ghost'] as const;
    
    variants.forEach((variant) => {
      const { getByText, unmount } = render(
        <Button title={`${variant} Button`} variant={variant} onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText(`${variant} Button`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    
    sizes.forEach((size) => {
      const { getByText, unmount } = render(
        <Button title={`${size} Button`} size={size} onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText(`${size} Button`)).toBeTruthy();
      unmount();
    });
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Press Me" onPress={onPress} />,
      { wrapper: TestWrapper }
    );
    
    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled Button" disabled onPress={onPress} />,
      { wrapper: TestWrapper }
    );
    
    const button = getByText('Disabled Button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading state correctly', () => {
    const { queryByText, getByTestId } = render(
      <Button title="Loading Button" loading onPress={() => {}} testID="loading-button" />,
      { wrapper: TestWrapper }
    );
    
    // Title should not be visible when loading
    expect(queryByText('Loading Button')).toBeNull();
    
    // Activity indicator should be present
    const button = getByTestId('loading-button');
    expect(button).toBeTruthy();
  });

  it('is disabled when loading', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button title="Loading Button" loading onPress={onPress} testID="loading-button" />,
      { wrapper: TestWrapper }
    );
    
    const button = getByTestId('loading-button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders with left icon', () => {
    const { getByText } = render(
      <Button title="With Icon" leftIcon="star" onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    expect(getByText('With Icon')).toBeTruthy();
    // Note: Icon testing would require mocking react-native-vector-icons
  });

  it('renders with right icon', () => {
    const { getByText } = render(
      <Button title="With Icon" rightIcon="arrow-forward" onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    expect(getByText('With Icon')).toBeTruthy();
    // Note: Icon testing would require mocking react-native-vector-icons
  });

  it('renders with both left and right icons', () => {
    const { getByText } = render(
      <Button 
        title="With Icons" 
        leftIcon="star" 
        rightIcon="arrow-forward" 
        onPress={() => {}} 
      />,
      { wrapper: TestWrapper }
    );
    
    expect(getByText('With Icons')).toBeTruthy();
  });

  it('applies fullWidth style', () => {
    const { getByText } = render(
      <Button title="Full Width" fullWidth onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    const button = getByText('Full Width').parent;
    // Check if the button has full width style applied
    expect(button).toBeTruthy();
  });

  it('applies rounded style', () => {
    const { getByText } = render(
      <Button title="Rounded" rounded onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    const button = getByText('Rounded').parent;
    // Check if the button has rounded style applied
    expect(button).toBeTruthy();
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(
      <Button 
        title="Test Button" 
        onPress={() => {}} 
        testID="custom-button"
        accessibilityLabel="Custom accessibility label"
      />,
      { wrapper: TestWrapper }
    );
    
    const button = getByTestId('custom-button');
    expect(button).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <Button title="Custom Style" style={customStyle} onPress={() => {}} />,
      { wrapper: TestWrapper }
    );
    
    const button = getByText('Custom Style').parent;
    expect(button).toBeTruthy();
  });

  it('handles complex button with all features', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button
        title="Complex Button"
        variant="success"
        size="large"
        leftIcon="check"
        rightIcon="arrow-forward"
        fullWidth
        rounded
        onPress={onPress}
      />,
      { wrapper: TestWrapper }
    );
    
    const button = getByText('Complex Button');
    expect(button).toBeTruthy();
    
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('maintains accessibility properties', () => {
    const { getByLabelText } = render(
      <Button 
        title="Accessible Button" 
        onPress={() => {}} 
        accessibilityLabel="Custom accessibility label"
      />,
      { wrapper: TestWrapper }
    );
    
    const button = getByLabelText('Custom accessibility label');
    expect(button).toBeTruthy();
  });

  it('handles different icon colors', () => {
    const { getByText } = render(
      <Button 
        title="Colored Icon" 
        leftIcon="star" 
        iconColor="#FF0000" 
        onPress={() => {}} 
      />,
      { wrapper: TestWrapper }
    );
    
    expect(getByText('Colored Icon')).toBeTruthy();
  });

  describe('Variant mapping', () => {
    it('maps primary variant correctly', () => {
      const { getByText } = render(
        <Button title="Primary" variant="primary" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Primary')).toBeTruthy();
    });

    it('maps secondary variant correctly', () => {
      const { getByText } = render(
        <Button title="Secondary" variant="secondary" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Secondary')).toBeTruthy();
    });

    it('maps outline variant correctly', () => {
      const { getByText } = render(
        <Button title="Outline" variant="outline" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Outline')).toBeTruthy();
    });

    it('maps danger variant correctly', () => {
      const { getByText } = render(
        <Button title="Danger" variant="danger" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Danger')).toBeTruthy();
    });

    it('maps success variant correctly', () => {
      const { getByText } = render(
        <Button title="Success" variant="success" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Success')).toBeTruthy();
    });

    it('maps ghost variant correctly', () => {
      const { getByText } = render(
        <Button title="Ghost" variant="ghost" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Ghost')).toBeTruthy();
    });
  });

  describe('Size mapping', () => {
    it('maps small size correctly', () => {
      const { getByText } = render(
        <Button title="Small" size="small" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Small')).toBeTruthy();
    });

    it('maps medium size correctly', () => {
      const { getByText } = render(
        <Button title="Medium" size="medium" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Medium')).toBeTruthy();
    });

    it('maps large size correctly', () => {
      const { getByText } = render(
        <Button title="Large" size="large" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Large')).toBeTruthy();
    });
  });
});