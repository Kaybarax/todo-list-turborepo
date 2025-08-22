import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { TodoItem, type TodoData } from '../../components/todo/TodoItem/TodoItem';

describe('TodoItem', () => {
  const mockTodo: TodoData = {
    id: '1',
    title: 'Test Todo',
    description: 'Test description',
    completed: false,
    priority: 'medium',
    tags: ['test'],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1',
  };

  const mockOnToggle = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnBlockchainSync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        variant="default"
      />,
    );
    expect(screen.getByText(mockTodo.title).closest('.card')).toHaveClass('card-normal');

    rerender(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        variant="compact"
      />,
    );
    expect(screen.getByText(mockTodo.title).closest('.card')).toHaveClass('card-compact');
  });

  it('applies priority classes correctly', () => {
    const { rerender } = render(
      <TodoItem
        todo={{ ...mockTodo, priority: 'low' }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText(mockTodo.title).closest('.card')).toHaveClass('border-l-success');

    rerender(
      <TodoItem
        todo={{ ...mockTodo, priority: 'high' }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText(mockTodo.title).closest('.card')).toHaveClass('border-l-error');
  });

  it('applies completed state classes correctly', () => {
    render(
      <TodoItem
        todo={{ ...mockTodo, completed: true }}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText(mockTodo.title).closest('.card')).toHaveClass('opacity-60');
  });

  it('shows blockchain info when enabled', () => {
    const todoWithBlockchain = {
      ...mockTodo,
      blockchainNetwork: 'polygon',
      transactionHash: '0x123',
    };
    render(
      <TodoItem
        todo={todoWithBlockchain}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        showBlockchainInfo={true}
      />,
    );
    // Test will be expanded during actual implementation
    expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
  });

  it('hides actions when showActions is false', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        showActions={false}
      />,
    );
    // Test will be expanded during actual implementation
    expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
  });
});
