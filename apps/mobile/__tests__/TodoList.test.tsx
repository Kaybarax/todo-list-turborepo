import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

describe('TodoList', () => {
  it('renders todos and triggers actions', () => {
    jest.resetModules();
    const tokensModule = require('../src/hooks/useDesignTokens');
    jest.spyOn(tokensModule, 'useDesignTokens').mockReturnValue({
      colors: {
        text: { primary: '#000', secondary: '#333' },
        border: { default: '#ddd' },
        neutral: { 200: '#eee' } as any,
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      spacing: { sm: 8, md: 12 },
      typography: { fontSize: { xs: 12, sm: 14, md: 16 } },
    });

    const { TodoList } = require('../src/components/TodoList');

    const todos = [
      { id: '1', title: 'A', description: 'd', completed: false },
      { id: '2', title: 'B', completed: true },
    ];
    const onToggle = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const { getByLabelText, getAllByLabelText } = render(
      <TodoList
        todos={todos as any}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onRefresh={jest.fn()}
        refreshing={false}
      />,
    );

    fireEvent.press(getByLabelText('Mark todo as done'));
    expect(onToggle).toHaveBeenCalledWith('1');

    fireEvent.press(getAllByLabelText('Edit todo')[0]);
    expect(onEdit).toHaveBeenCalled();

    fireEvent.press(getAllByLabelText('Delete todo')[0]);
    expect(onDelete).toHaveBeenCalled();
  });
});
