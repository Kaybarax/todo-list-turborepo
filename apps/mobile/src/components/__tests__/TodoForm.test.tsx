import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TodoForm } from '../TodoForm';

// Mock the UI components
jest.mock('@todo/ui-mobile', () => ({
  Button: ({ title, onPress, disabled, loading }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} testID="button">
        <Text>{loading ? 'Loading...' : title}</Text>
      </TouchableOpacity>
    );
  },
  Input: ({ value, onChangeText, placeholder }: any) => {
    const { TextInput } = require('react-native');
    return (
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} testID={`input-${placeholder}`} />
    );
  },
  Card: ({ children }: any) => {
    const { View } = require('react-native');
    return <View testID="card">{children}</View>;
  },
}));

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(getByPlaceholderText('Enter todo title')).toBeTruthy();
    expect(getByPlaceholderText('Enter description (optional)')).toBeTruthy();
    expect(getByText('Create Todo')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('renders edit form with initial values', () => {
    const initialData = {
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'high' as const,
      dueDate: '2024-12-31',
      tags: ['test', 'work'],
    };

    const { getByDisplayValue, getByText } = render(
      <TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={initialData} />,
    );

    expect(getByDisplayValue('Test Todo')).toBeTruthy();
    expect(getByDisplayValue('Test Description')).toBeTruthy();
    expect(getByText('Update Todo')).toBeTruthy();
  });

  it('handles form submission with valid data', async () => {
    const { getByPlaceholderText, getByText } = render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.changeText(getByPlaceholderText('Enter todo title'), 'New Todo');
    fireEvent.changeText(getByPlaceholderText('Enter description (optional)'), 'New Description');
    fireEvent.changeText(getByPlaceholderText('Enter tags separated by commas'), 'work, urgent');

    fireEvent.press(getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Description',
        priority: 'medium',
        dueDate: '',
        tags: ['work', 'urgent'],
      });
    });
  });

  it('validates required title field', async () => {
    const { getByText } = render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.press(getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('handles cancel button press', () => {
    const { getByText } = render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.press(getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { getByPlaceholderText, getByText } = render(<TodoForm onSubmit={slowSubmit} onCancel={mockOnCancel} />);

    fireEvent.changeText(getByPlaceholderText('Enter todo title'), 'Test Todo');
    fireEvent.press(getByText('Create Todo'));

    expect(getByText('Loading...')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('Create Todo')).toBeTruthy();
    });
  });

  it('handles priority selection', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    fireEvent.changeText(getByPlaceholderText('Enter todo title'), 'Test Todo');

    // Simulate priority picker selection
    const priorityPicker = getByTestId('priority-picker');
    fireEvent(priorityPicker, 'onValueChange', 'high');

    fireEvent.press(getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: '',
        priority: 'high',
        dueDate: '',
        tags: [],
      });
    });
  });

  it('handles date selection', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    fireEvent.changeText(getByPlaceholderText('Enter todo title'), 'Test Todo');

    // Simulate date picker selection
    const datePicker = getByTestId('date-picker');
    fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: new Date('2024-12-31').getTime() } });

    fireEvent.press(getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: '',
        priority: 'medium',
        dueDate: '2024-12-31',
        tags: [],
      });
    });
  });

  it('handles tags parsing correctly', async () => {
    const { getByPlaceholderText, getByText } = render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.changeText(getByPlaceholderText('Enter todo title'), 'Test Todo');
    fireEvent.changeText(
      getByPlaceholderText('Enter tags separated by commas'),
      '  work  ,  urgent  ,  ,  important  ',
    );

    fireEvent.press(getByText('Create Todo'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: ['work', 'urgent', 'important'],
      });
    });
  });

  it('resets form after successful submission', async () => {
    const { getByPlaceholderText, getByText } = render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = getByPlaceholderText('Enter todo title');
    fireEvent.changeText(titleInput, 'Test Todo');
    fireEvent.press(getByText('Create Todo'));

    await waitFor(() => {
      expect(titleInput.props.value).toBe('');
    });
  });

  it('handles keyboard dismissal', () => {
    const { getByTestId } = render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const scrollView = getByTestId('form-scroll-view');
    fireEvent(scrollView, 'onTouchStart');

    // Verify keyboard dismissal behavior
    expect(scrollView.props.keyboardShouldPersistTaps).toBe('handled');
  });

  it('handles form validation errors', async () => {
    const mockSubmitWithError = jest.fn().mockRejectedValue(new Error('Validation failed'));

    const { getByPlaceholderText, getByText } = render(
      <TodoForm onSubmit={mockSubmitWithError} onCancel={mockOnCancel} />,
    );

    fireEvent.changeText(getByPlaceholderText('Enter todo title'), 'Test Todo');
    fireEvent.press(getByText('Create Todo'));

    await waitFor(() => {
      expect(mockSubmitWithError).toHaveBeenCalled();
    });
  });
});
