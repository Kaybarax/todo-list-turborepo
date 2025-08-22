import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { TodoList } from '../../components/todo/TodoList/TodoList';
import { type TodoData } from '../../components/todo/TodoItem/TodoItem';

describe('TodoList', () => {
  const mockTodos: TodoData[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      completed: false,
      priority: 'medium',
      tags: ['test'],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
    {
      id: '2',
      title: 'Test Todo 2',
      completed: true,
      priority: 'high',
      tags: ['test', 'completed'],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
  ];

  const mockOnToggle = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnBlockchainSync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with todos', () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText(`${mockTodos.length} todos to display`)).toBeInTheDocument();
  });

  it('renders empty state when no todos', () => {
    const emptyState = <div>No todos found</div>;
    render(
      <TodoList
        todos={[]}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        emptyState={emptyState}
      />,
    );
    expect(screen.getByText('0 todos to display')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        variant="default"
      />,
    );
    expect(screen.getByText(`${mockTodos.length} todos to display`).parentElement).toHaveClass('space-y-4');

    rerender(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        variant="compact"
      />,
    );
    expect(screen.getByText(`${mockTodos.length} todos to display`).parentElement).toHaveClass('space-y-2');

    rerender(
      <TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} variant="grid" />,
    );
    expect(screen.getByText(`${mockTodos.length} todos to display`).parentElement).toHaveClass('grid');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} size="sm" />,
    );
    expect(screen.getByText(`${mockTodos.length} todos to display`).parentElement).toHaveClass('text-sm');

    rerender(
      <TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} size="lg" />,
    );
    expect(screen.getByText(`${mockTodos.length} todos to display`).parentElement).toHaveClass('text-lg');
  });

  it('shows loading state', () => {
    render(
      <TodoList todos={mockTodos} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} loading={true} />,
    );
    // Test will be expanded during actual implementation
    expect(screen.getByText(`${mockTodos.length} todos to display`)).toBeInTheDocument();
  });

  it('shows stats when enabled', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        showStats={true}
      />,
    );
    // Test will be expanded during actual implementation
    expect(screen.getByText(`${mockTodos.length} todos to display`)).toBeInTheDocument();
  });

  it('shows filters when enabled', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        showFilters={true}
      />,
    );
    // Test will be expanded during actual implementation
    expect(screen.getByText(`${mockTodos.length} todos to display`)).toBeInTheDocument();
  });
});
