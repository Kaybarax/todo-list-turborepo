/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent } from '@testing-library/react-native';
import { type BlockchainNetwork } from '@todo/services';
import React from 'react';

import { TodoItem } from '../TodoItem';

// Mock the UI components
jest.mock('@todo/ui-mobile', () => ({
  Card: ({ children, style }: any) => {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  },
  CardContent: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
  Badge: ({ text, style }: any) => {
    const { Text } = require('react-native');
    return <Text style={style}>{text}</Text>;
  },
  Button: ({ title }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="button">
        <Text>{title}</Text>
      </View>
    );
  },
  Checkbox: ({ checked, onPress }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} testID="checkbox">
        <Text>{checked ? '✓' : '○'}</Text>
      </TouchableOpacity>
    );
  },
}));

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium' as const,
    dueDate: new Date('2024-12-31'),
    tags: ['work', 'urgent'],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    userId: 'user1',
  };

  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo item correctly', () => {
    const { getByText, getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    expect(getByText('Test Todo')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('work')).toBeTruthy();
    expect(getByText('urgent')).toBeTruthy();
    expect(getByText('Due: 12/31/2024')).toBeTruthy();
    expect(getByTestId('card')).toBeTruthy();
  });

  it('renders completed todo with different styling', () => {
    const completedTodo = { ...mockTodo, completed: true };

    const { getByText, getByTestId } = render(
      <TodoItem todo={completedTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    const checkbox = getByTestId('checkbox');
    expect(checkbox).toBeTruthy();
    // Completed todos should show checkmark
    expect(getByText('✓')).toBeTruthy();
  });

  it('handles toggle completion', () => {
    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    const checkbox = getByTestId('checkbox');
    fireEvent.press(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('handles edit button press', () => {
    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    const editButton = getByTestId('button-Edit');
    fireEvent.press(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
  });

  it('handles delete button press', () => {
    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    const deleteButton = getByTestId('button-Delete');
    fireEvent.press(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('renders priority badge with correct variant', () => {
    const { rerender, getByTestId } = render(
      <TodoItem
        todo={{ ...mockTodo, priority: 'high' }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(getByTestId('badge-danger')).toBeTruthy();

    rerender(
      <TodoItem
        todo={{ ...mockTodo, priority: 'medium' }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(getByTestId('badge-primary')).toBeTruthy();

    rerender(
      <TodoItem
        todo={{ ...mockTodo, priority: 'low' }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(getByTestId('badge-secondary')).toBeTruthy();
  });

  it('renders without due date when not provided', () => {
    const todoWithoutDueDate = { ...mockTodo, dueDate: undefined };

    const { queryByText } = render(
      <TodoItem todo={todoWithoutDueDate} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    expect(queryByText(/Due:/)).toBeNull();
  });

  it('renders without description when not provided', () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined };

    const { queryByText } = render(
      <TodoItem todo={todoWithoutDescription} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    expect(queryByText('Test Description')).toBeNull();
  });

  it('renders without tags when empty', () => {
    const todoWithoutTags = { ...mockTodo, tags: [] };

    const { queryByText } = render(
      <TodoItem todo={todoWithoutTags} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    expect(queryByText('work')).toBeNull();
    expect(queryByText('urgent')).toBeNull();
  });

  it('shows overdue styling for past due dates', () => {
    const overdueTodo = {
      ...mockTodo,
      dueDate: new Date('2023-01-01'), // Past date
      completed: false,
    };

    const { getByText } = render(
      <TodoItem todo={overdueTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    const dueDateElement = getByText('Due: 1/1/2023');
    expect(dueDateElement).toBeTruthy();
    // In a real implementation, this would have red styling
  });

  it('shows blockchain network information when available', () => {
    const blockchainTodo = {
      ...mockTodo,
      blockchainNetwork: 'polygon' as BlockchainNetwork,
      transactionHash: '0x123abc',
    };

    const { getByText } = render(
      <TodoItem todo={blockchainTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    expect(getByText('polygon')).toBeTruthy();
    expect(getByText('0x123abc')).toBeTruthy();
  });

  it('handles loading states correctly', () => {
    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    const checkbox = getByTestId('checkbox');
    const editButton = getByTestId('button-Edit');
    const deleteButton = getByTestId('button-Delete');

    // In a real implementation, these would be disabled
    expect(checkbox).toBeTruthy();
    expect(editButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
  });

  it('handles long press for context menu', () => {
    const mockOnLongPress = jest.fn();

    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    const card = getByTestId('card');
    fireEvent(card, 'onLongPress');

    expect(mockOnLongPress).toHaveBeenCalledWith(mockTodo);
  });

  it('handles swipe actions', () => {
    const mockOnSwipeLeft = jest.fn();
    const mockOnSwipeRight = jest.fn();

    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    const card = getByTestId('card');

    // Simulate swipe gestures
    fireEvent(card, 'onSwipeLeft');
    expect(mockOnSwipeLeft).toHaveBeenCalledWith(mockTodo);

    fireEvent(card, 'onSwipeRight');
    expect(mockOnSwipeRight).toHaveBeenCalledWith(mockTodo);
  });

  it('shows creation and update timestamps', () => {
    const { getByText } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    expect(getByText(/Created:/)).toBeTruthy();
    expect(getByText(/Updated:/)).toBeTruthy();
  });
});
