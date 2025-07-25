import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../TodoItem';
import { vi } from 'vitest';

// Mock the UI components
vi.mock('@todo/ui-web', () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
}));

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium' as const,
    dueDate: '2024-12-31',
    tags: ['work', 'urgent'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: 'user1',
  };

  const mockOnToggle = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders todo item correctly', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('Due: 2024-12-31')).toBeInTheDocument();
  });

  it('renders completed todo with different styling', () => {
    const completedTodo = { ...mockTodo, completed: true };
    
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const titleElement = screen.getByText('Test Todo');
    expect(titleElement).toHaveClass('line-through');
    expect(titleElement).toHaveClass('text-gray-500');
  });

  it('handles toggle completion', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('handles edit button click', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
  });

  it('handles delete button click', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('renders priority badge with correct variant', () => {
    const { rerender } = render(
      <TodoItem
        todo={{ ...mockTodo, priority: 'high' }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'destructive');

    rerender(
      <TodoItem
        todo={{ ...mockTodo, priority: 'medium' }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'default');

    rerender(
      <TodoItem
        todo={{ ...mockTodo, priority: 'low' }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'secondary');
  });

  it('renders without due date when not provided', () => {
    const todoWithoutDueDate = { ...mockTodo, dueDate: undefined };
    
    render(
      <TodoItem
        todo={todoWithoutDueDate}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined };
    
    render(
      <TodoItem
        todo={todoWithoutDescription}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders without tags when empty', () => {
    const todoWithoutTags = { ...mockTodo, tags: [] };
    
    render(
      <TodoItem
        todo={todoWithoutTags}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('work')).not.toBeInTheDocument();
    expect(screen.queryByText('urgent')).not.toBeInTheDocument();
  });

  it('shows overdue styling for past due dates', () => {
    const overdueTodo = { 
      ...mockTodo, 
      dueDate: '2023-01-01', // Past date
      completed: false 
    };
    
    render(
      <TodoItem
        todo={overdueTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const dueDateElement = screen.getByText('Due: 2023-01-01');
    expect(dueDateElement).toHaveClass('text-red-600');
  });

  it('shows blockchain network information when available', () => {
    const blockchainTodo = { 
      ...mockTodo, 
      blockchainNetwork: 'polygon',
      transactionHash: '0x123abc'
    };
    
    render(
      <TodoItem
        todo={blockchainTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('polygon')).toBeInTheDocument();
    expect(screen.getByText('0x123abc')).toBeInTheDocument();
  });

  it('handles loading states correctly', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const editButton = screen.getByText('Edit');
    const deleteButton = screen.getByText('Delete');

    expect(checkbox).toBeDisabled();
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});