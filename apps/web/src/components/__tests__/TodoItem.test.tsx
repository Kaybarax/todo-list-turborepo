import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../TodoItem';
import { createMockTodo } from '../../__tests__/test-utils';
import { BlockchainNetwork } from '@todo/services';

// Mock the UI components
jest.mock('@todo/ui-web', () => ({
  Button: ({ children, onClick, disabled, variant, size }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
  Badge: ({ children, variant }: any) => (
    <span data-testid={`badge-${children?.toString().toLowerCase().replace(/[^a-z0-9]/g, '-')}`} data-variant={variant}>
      {children}
    </span>
  ),
}));

// Mock the TransactionStatus component
jest.mock('../TransactionStatus', () => ({
  TransactionStatus: ({ transactionHash, network }: any) => (
    <div data-testid="transaction-status">
      <span>Tx: {transactionHash}</span>
      <span>Network: {network}</span>
    </div>
  ),
}));

describe('TodoItem', () => {
  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo item with all details', () => {
    const mockTodo = createMockTodo();

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
    expect(screen.getByText('Due: Dec 31, 2024')).toBeInTheDocument();
  });

  it('should render completed todo with proper styling', () => {
    const completedTodo = createMockTodo({ completed: true });

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

  it('should call onToggle when checkbox is clicked', () => {
    const mockTodo = createMockTodo();

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

  it('should call onEdit when edit button is clicked', () => {
    const mockTodo = createMockTodo();

    const { container } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Simulate mouse enter to show actions
    const todoContainer = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(todoContainer);

    const editButton = screen.getByTitle('Edit todo');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
  });

  it('should call onDelete when delete button is clicked', () => {
    const mockTodo = createMockTodo();

    const { container } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Simulate mouse enter to show actions
    const todoContainer = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(todoContainer);

    const deleteButton = screen.getByTitle('Delete todo');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should render high priority badge with destructive variant', () => {
    const highPriorityTodo = createMockTodo({ priority: 'high' });

    render(
      <TodoItem
        todo={highPriorityTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('badge-high')).toHaveAttribute('data-variant', 'destructive');
  });

  it('should render medium priority badge with default variant', () => {
    const mediumPriorityTodo = createMockTodo({ priority: 'medium' });

    render(
      <TodoItem
        todo={mediumPriorityTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('badge-medium')).toHaveAttribute('data-variant', 'default');
  });

  it('should render low priority badge with secondary variant', () => {
    const lowPriorityTodo = createMockTodo({ priority: 'low' });

    render(
      <TodoItem
        todo={lowPriorityTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('badge-low')).toHaveAttribute('data-variant', 'secondary');
  });

  it('should not render due date when not provided', () => {
    const todoWithoutDueDate = createMockTodo({ dueDate: undefined });

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

  it('should not render description when not provided', () => {
    const todoWithoutDescription = createMockTodo({ description: undefined });

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

  it('should not render tags when empty', () => {
    const todoWithoutTags = createMockTodo({ tags: [] });

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

  it('should highlight overdue todos', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const overdueTodo = createMockTodo({
      dueDate: yesterday,
      completed: false,
    });

    const { container } = render(
      <TodoItem
        todo={overdueTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check if the container has the overdue border class
    const todoContainer = container.firstChild as HTMLElement;
    expect(todoContainer).toHaveClass('border-red-200');
    
    // Check if the due date badge has destructive variant
    const dueDateBadge = screen.getByText(/Due:/);
    expect(dueDateBadge.closest('[data-variant="destructive"]')).toBeInTheDocument();
  });

  it('should render blockchain info when available', () => {
    const blockchainTodo = createMockTodo({
      blockchainNetwork: BlockchainNetwork.POLYGON,
      transactionHash: '0x123abc',
    });

    render(
      <TodoItem
        todo={blockchainTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check for the network display name (capitalized)
    expect(screen.getByText('Polygon')).toBeInTheDocument();
    
    // Check for transaction status component
    expect(screen.getByTestId('transaction-status')).toBeInTheDocument();
    expect(screen.getByText('Tx: 0x123abc')).toBeInTheDocument();
  });
});