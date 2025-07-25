import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '../TodoList';
import { vi } from 'vitest';

// Mock the TodoItem component
vi.mock('../TodoItem', () => ({
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
vi.mock('@todo/ui-web', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
  Input: ({ value, onChange, placeholder }: any) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

describe('TodoList', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'First Todo',
      description: 'First Description',
      completed: false,
      priority: 'high' as const,
      dueDate: '2024-12-31',
      tags: ['work'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'user1',
    },
    {
      id: '2',
      title: 'Second Todo',
      description: 'Second Description',
      completed: true,
      priority: 'medium' as const,
      dueDate: '2024-11-30',
      tags: ['personal'],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      userId: 'user1',
    },
  ];

  const mockOnToggle = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnLoadMore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders todo list correctly', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        hasMore={false}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
  });

  it('renders empty state when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        hasMore={false}
        isLoading={false}
      />
    );

    expect(screen.getByText('No todos found')).toBeInTheDocument();
    expect(screen.getByText('Create your first todo to get started!')).toBeInTheDocument();
  });

  it('handles search functionality', () => {
    const mockOnSearch = vi.fn();
    
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        onSearch={mockOnSearch}
        hasMore={false}
        isLoading={false}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search todos...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('handles filter functionality', () => {
    const mockOnFilter = vi.fn();
    
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        onFilter={mockOnFilter}
        hasMore={false}
        isLoading={false}
      />
    );

    const filterSelect = screen.getByDisplayValue('all');
    fireEvent.change(filterSelect, { target: { value: 'completed' } });

    expect(mockOnFilter).toHaveBeenCalledWith('completed');
  });

  it('handles sort functionality', () => {
    const mockOnSort = vi.fn();
    
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        onSort={mockOnSort}
        hasMore={false}
        isLoading={false}
      />
    );

    const sortSelect = screen.getByDisplayValue('createdAt');
    fireEvent.change(sortSelect, { target: { value: 'priority' } });

    expect(mockOnSort).toHaveBeenCalledWith('priority');
  });

  it('shows load more button when hasMore is true', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={false}
      />
    );

    const loadMoreButton = screen.getByText('Load More');
    expect(loadMoreButton).toBeInTheDocument();
    
    fireEvent.click(loadMoreButton);
    expect(mockOnLoadMore).toHaveBeenCalled();
  });

  it('hides load more button when hasMore is false', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        hasMore={false}
        isLoading={false}
      />
    );

    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        hasMore={false}
        isLoading={true}
      />
    );

    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
  });

  it('passes correct props to TodoItem components', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        hasMore={false}
        isLoading={false}
      />
    );

    // Check that toggle buttons are rendered (indicating props are passed)
    const toggleButtons = screen.getAllByText('Toggle');
    expect(toggleButtons).toHaveLength(2);

    // Test that callbacks work
    fireEvent.click(toggleButtons[0]);
    expect(mockOnToggle).toHaveBeenCalledWith('1');

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTodos[0]);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('handles priority filter correctly', () => {
    const mockOnFilter = vi.fn();
    
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        onFilter={mockOnFilter}
        hasMore={false}
        isLoading={false}
      />
    );

    const prioritySelect = screen.getByDisplayValue('all');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    expect(mockOnFilter).toHaveBeenCalledWith('high');
  });

  it('shows correct todo count', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        hasMore={false}
        isLoading={false}
        totalCount={25}
      />
    );

    expect(screen.getByText('Showing 2 of 25 todos')).toBeInTheDocument();
  });

  it('handles bulk actions when provided', () => {
    const mockOnBulkComplete = vi.fn();
    const mockOnBulkDelete = vi.fn();
    
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onLoadMore={mockOnLoadMore}
        onBulkComplete={mockOnBulkComplete}
        onBulkDelete={mockOnBulkDelete}
        hasMore={false}
        isLoading={false}
      />
    );

    expect(screen.getByText('Complete All')).toBeInTheDocument();
    expect(screen.getByText('Delete All')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Complete All'));
    expect(mockOnBulkComplete).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Delete All'));
    expect(mockOnBulkDelete).toHaveBeenCalled();
  });
});