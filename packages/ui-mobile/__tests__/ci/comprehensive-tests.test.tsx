import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

// Import components
import { Button } from '../../lib/components/Button/Button';
import { Card, CardContent, CardHeader } from '../../lib/components/Card/Card';
import { Input } from '../../lib/components/Input/Input';
import { Badge } from '../../lib/components/Badge/Badge';
import { Avatar } from '../../lib/components/Avatar/Avatar';
import { Switch } from '../../lib/components/Switch/Switch';

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Comprehensive Mobile Component Tests', () => {
  describe('Component Rendering', () => {
    it('renders Button component correctly', () => {
      const { getByText } = render(
        <Button title="Test Button" onPress={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('renders Card component correctly', () => {
      const { getByText } = render(
        <Card>
          <CardHeader title="Test Card" />
          <CardContent>Card content</CardContent>
        </Card>,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Test Card')).toBeTruthy();
      expect(getByText('Card content')).toBeTruthy();
    });

    it('renders Input component correctly', () => {
      const { getByDisplayValue } = render(
        <Input value="test value" onChangeText={() => {}} />,
        { wrapper: TestWrapper }
      );
      
      expect(getByDisplayValue('test value')).toBeTruthy();
    });

    it('renders Badge component correctly', () => {
      const { getByText } = render(
        <Badge text="Test Badge" />,
        { wrapper: TestWrapper }
      );
      
      expect(getByText('Test Badge')).toBeTruthy();
    });

    it('renders Avatar component correctly', () => {
      const { getByTestId } = render(
        <Avatar source={{ uri: 'https://example.com/avatar.jpg' }} testID="avatar" />,
        { wrapper: TestWrapper }
      );
      
      expect(getByTestId('avatar')).toBeTruthy();
    });

    it('renders Switch component correctly', () => {
      const { getByTestId } = render(
        <Switch checked={false} onValueChange={() => {}} testID="switch" />,
        { wrapper: TestWrapper }
      );
      
      expect(getByTestId('switch')).toBeTruthy();
    });
  });

  describe('Component Interactions', () => {
    it('Button handles press events', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Press Me" onPress={onPress} />,
        { wrapper: TestWrapper }
      );
      
      fireEvent.press(getByText('Press Me'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('Input handles text changes', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(
        <Input onChangeText={onChangeText} testID="input" />,
        { wrapper: TestWrapper }
      );
      
      fireEvent.changeText(getByTestId('input'), 'new text');
      expect(onChangeText).toHaveBeenCalledWith('new text');
    });

    it('Switch handles value changes', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <Switch checked={false} onValueChange={onValueChange} testID="switch" />,
        { wrapper: TestWrapper }
      );
      
      fireEvent(getByTestId('switch'), 'valueChange', true);
      expect(onValueChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Component Variants and Props', () => {
    it('Button renders with different variants', () => {
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

    it('Button renders with different sizes', () => {
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

    it('Badge renders with different variants', () => {
      const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const;
      
      variants.forEach((variant) => {
        const { getByText, unmount } = render(
          <Badge text={`${variant} Badge`} variant={variant} />,
          { wrapper: TestWrapper }
        );
        
        expect(getByText(`${variant} Badge`)).toBeTruthy();
        unmount();
      });
    });
  });

  describe('Component States', () => {
    it('Button handles disabled state', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Disabled Button" disabled onPress={onPress} />,
        { wrapper: TestWrapper }
      );
      
      const button = getByText('Disabled Button');
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('Button handles loading state', () => {
      const { queryByText, getByTestId } = render(
        <Button title="Loading Button" loading onPress={() => {}} testID="loading-button" />,
        { wrapper: TestWrapper }
      );
      
      // Title should not be visible when loading
      expect(queryByText('Loading Button')).toBeNull();
      
      // Button should be present
      const button = getByTestId('loading-button');
      expect(button).toBeTruthy();
    });

    it('Input handles disabled state', () => {
      const { getByTestId } = render(
        <Input disabled testID="disabled-input" />,
        { wrapper: TestWrapper }
      );
      
      const input = getByTestId('disabled-input');
      expect(input.props.editable).toBe(false);
    });
  });

  describe('Component Accessibility', () => {
    it('Button maintains accessibility properties', () => {
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

    it('Input maintains accessibility properties', () => {
      const { getByTestId } = render(
        <Input 
          testID="accessible-input"
          accessibilityLabel="Custom input label"
        />,
        { wrapper: TestWrapper }
      );
      
      const input = getByTestId('accessible-input');
      expect(input.props.accessibilityLabel).toBe('Custom input label');
    });

    it('Switch maintains accessibility properties', () => {
      const { getByTestId } = render(
        <Switch 
          checked={false} 
          onValueChange={() => {}} 
          testID="accessible-switch"
          accessibilityLabel="Custom switch label"
        />,
        { wrapper: TestWrapper }
      );
      
      const switchComponent = getByTestId('accessible-switch');
      expect(switchComponent.props.accessibilityLabel).toBe('Custom switch label');
    });
  });

  describe('Component Integration', () => {
    it('Components work together in complex layouts', () => {
      const { getByText, getByTestId } = render(
        <Card>
          <CardHeader title="User Profile" />
          <CardContent>
            <Input placeholder="Enter name" testID="name-input" />
            <Button title="Save" onPress={() => {}} />
            <Badge text="Active" />
            <Switch checked={true} onValueChange={() => {}} testID="status-switch" />
          </CardContent>
        </Card>,
        { wrapper: TestWrapper }
      );

      expect(getByText('User Profile')).toBeTruthy();
      expect(getByTestId('name-input')).toBeTruthy();
      expect(getByText('Save')).toBeTruthy();
      expect(getByText('Active')).toBeTruthy();
      expect(getByTestId('status-switch')).toBeTruthy();
    });

    it('Components handle complex interaction flows', () => {
      const handleSave = jest.fn();
      const handleToggle = jest.fn();
      
      const { getByText, getByTestId } = render(
        <Card>
          <CardContent>
            <Input placeholder="Enter text" testID="text-input" />
            <Switch checked={false} onValueChange={handleToggle} testID="toggle" />
            <Button title="Save Changes" onPress={handleSave} />
          </CardContent>
        </Card>,
        { wrapper: TestWrapper }
      );

      // Interact with input
      fireEvent.changeText(getByTestId('text-input'), 'test text');
      
      // Toggle switch
      fireEvent(getByTestId('toggle'), 'valueChange', true);
      expect(handleToggle).toHaveBeenCalledWith(true);
      
      // Press save button
      fireEvent.press(getByText('Save Changes'));
      expect(handleSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('Components handle missing props gracefully', () => {
      expect(() => {
        render(
          <div>
            <Button title="" onPress={() => {}} />
            <Badge text="" />
            <Input value="" />
          </div>,
          { wrapper: TestWrapper }
        );
      }).not.toThrow();
    });

    it('Components handle null and undefined values', () => {
      expect(() => {
        render(
          <div>
            <Button title={null as any} onPress={() => {}} />
            <Badge text={undefined as any} />
            <Input value={null as any} />
          </div>,
          { wrapper: TestWrapper }
        );
      }).not.toThrow();
    });

    it('Components can be unmounted without errors', () => {
      const { unmount } = render(
        <div>
          <Button title="Test" onPress={() => {}} />
          <Input value="test" />
          <Badge text="test" />
          <Switch checked={false} onValueChange={() => {}} />
        </div>,
        { wrapper: TestWrapper }
      );

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('Components handle rapid re-renders', () => {
      const TestComponent = ({ count }: { count: number }) => (
        <div>
          <Button title={`Button ${count}`} onPress={() => {}} />
          <Badge text={`Count: ${count}`} />
        </div>
      );

      const { rerender } = render(<TestComponent count={0} />, { wrapper: TestWrapper });

      // Rapidly re-render multiple times
      for (let i = 1; i <= 5; i++) {
        expect(() => {
          rerender(<TestComponent count={i} />);
        }).not.toThrow();
      }
    });

    it('Components handle multiple simultaneous interactions', () => {
      const handlers = {
        button1: jest.fn(),
        button2: jest.fn(),
        input: jest.fn(),
        switch: jest.fn(),
      };

      const { getByText, getByTestId } = render(
        <div>
          <Button title="Button 1" onPress={handlers.button1} />
          <Button title="Button 2" onPress={handlers.button2} />
          <Input onChangeText={handlers.input} testID="input" />
          <Switch checked={false} onValueChange={handlers.switch} testID="switch" />
        </div>,
        { wrapper: TestWrapper }
      );

      // Trigger multiple interactions simultaneously
      fireEvent.press(getByText('Button 1'));
      fireEvent.press(getByText('Button 2'));
      fireEvent.changeText(getByTestId('input'), 'test');
      fireEvent(getByTestId('switch'), 'valueChange', true);

      expect(handlers.button1).toHaveBeenCalledTimes(1);
      expect(handlers.button2).toHaveBeenCalledTimes(1);
      expect(handlers.input).toHaveBeenCalledWith('test');
      expect(handlers.switch).toHaveBeenCalledWith(true);
    });
  });
});