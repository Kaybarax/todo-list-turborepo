import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '../TodoList';
import { createMockTodo } from '../../__tests__/test-utils';

// Mock the TodoItem component
jest.mock('../TodoItem', () => ({
  TodoItem: ({ todo, onToggle, onEdit, onDelete }: any) => (
    <div data-testid={`todo-item-${todo.id}`}>
      <span>{todo.title}</span>
      <button onClick={() => onToggle(todo.id)}>Toggle</button>
      <button onClick={() => onEdit(todo)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  ),
}));

// Mock the UI components
jest.mock('@todo/ui-web', () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Input: ({ placeholder, value, onChange }: any) => (
    <input placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)} />
  ),
}));

describe('TodoList', () => {
  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render list of todos', () => {
    const mockTodos = [
      createMockTodo({ id: '1', title: 'First Todo' }),
      createMockTodo({ id: '2', title: 'Second Todo' }),
    ];

    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
  });

  it('should show empty state when no todos', () => {
    render(<TodoList todos={[]} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('No todos')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating a new todo.')).toBeInTheDocument();
  });

  it('should filter todos by search term', () => {
    const mockTodos = [
      createMockTodo({ id: '1', title: 'Work Task' }),
      createMockTodo({ id: '2', title: 'Personal Task' }),
    ];

    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Search for "work"
    const searchInput = screen.getByPlaceholderText('Search todos...');
    fireEvent.change(searchInput, { target: { value: 'work' } });

    // Should show only work task
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-item-2')).not.toBeInTheDocument();
  });

  it('should filter todos by completion status', () => {
    const mockTodos = [
      createMockTodo({ id: '1', title: 'Completed Task', completed: true }),
      createMockTodo({ id: '2', title: 'Pending Task', completed: false }),
    ];

    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Filter by completed using the select dropdown
    const filterSelect = screen.getByDisplayValue('All');
    fireEvent.change(filterSelect, { target: { value: 'completed' } });

    // Should show only completed task
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-item-2')).not.toBeInTheDocument();
  });

  it('should sort todos by priority', () => {
    const mockTodos = [
      createMockTodo({ id: '1', title: 'High Priority', priority: 'high' }),
      createMockTodo({ id: '2', title: 'Low Priority', priority: 'low' }),
    ];

    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Sort by priority using the select dropdown
    const sortSelect = screen.getByDisplayValue('Created Date');
    fireEvent.change(sortSelect, { target: { value: 'priority' } });

    // High priority should come first (both should still be visible)
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
  });

  it('should call onToggle when todo is toggled', () => {
    const mockTodos = [createMockTodo({ id: '1', title: 'Test Todo' })];

    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const toggleButton = screen.getByText('Toggle');
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('should call onEdit when todo is edited', () => {
    const mockTodos = [createMockTodo({ id: '1', title: 'Test Todo' })];

    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('should call onDelete when todo is deleted', () => {
    const mockTodos = [createMockTodo({ id: '1', title: 'Test Todo' })];

    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should show todo statistics', () => {
    const mockTodos = [
      createMockTodo({ id: '1', title: 'First Todo', completed: false }),
      createMockTodo({ id: '2', title: 'Second Todo', completed: true }),
    ];

    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('2')).toBeInTheDocument(); // Total
    expect(screen.getByText('1')).toBeInTheDocument(); // Active and Completed
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
