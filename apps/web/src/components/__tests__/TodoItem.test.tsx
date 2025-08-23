import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoItem, type TodoData } from '../todo/TodoItem';
import { BlockchainNetwork } from '@todo/services';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Edit: ({ className }: { className?: string }) => <div data-testid="edit-icon" className={className} />,
  Trash2: ({ className }: { className?: string }) => <div data-testid="trash-icon" className={className} />,
}));

describe('TodoItem', () => {
  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnBlockchainSync = jest.fn();

  const baseTodo: TodoData = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-12-31'),
    tags: ['work', 'urgent'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    userId: 'user-1',
  };

  const mockTransactionStatus = ({ transactionHash, network }: { transactionHash: string; network: string }) => (
    <div data-testid="transaction-status">
      <span>Tx: {transactionHash}</span>
      <span>Network: {network}</span>
    </div>
  );

  const mockGetNetworkDisplayInfo = (network: string) => ({
    displayName: network.charAt(0).toUpperCase() + network.slice(1),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render todo item with all details', () => {
      render(<TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.getByText('urgent')).toBeInTheDocument();
      expect(screen.getByText('Due: Dec 31, 2024')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
    });

    it('should render with default variant', () => {
      const { container } = render(
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const todoElement = container.firstChild as HTMLElement;
      expect(todoElement).toHaveClass('card', 'bg-base-100', 'shadow-sm');
    });

    it('should render with compact variant', () => {
      render(
        <TodoItem
          todo={baseTodo}
          variant="compact"
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      // Description should not be shown in compact variant
      expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
      // Tags should not be shown in compact variant
      expect(screen.queryByText('work')).not.toBeInTheDocument();
    });

    it('should render with detailed variant', () => {
      render(
        <TodoItem
          todo={baseTodo}
          variant="detailed"
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      // Actions should be visible in detailed variant
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    });

    it('should render completed todo with proper styling', () => {
      const completedTodo = { ...baseTodo, completed: true };

      render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const titleElement = screen.getByText('Test Todo');
      expect(titleElement).toHaveClass('line-through', 'text-base-content/50');
    });

    it('should not render description when not provided', () => {
      const todoWithoutDescription = { ...baseTodo, description: undefined };

      render(
        <TodoItem todo={todoWithoutDescription} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    });

    it('should not render tags when empty', () => {
      const todoWithoutTags = { ...baseTodo, tags: [] };

      render(<TodoItem todo={todoWithoutTags} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      expect(screen.queryByText('work')).not.toBeInTheDocument();
      expect(screen.queryByText('urgent')).not.toBeInTheDocument();
    });

    it('should not render due date when not provided', () => {
      const todoWithoutDueDate = { ...baseTodo, dueDate: undefined };

      render(
        <TodoItem todo={todoWithoutDueDate} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
    });
  });

  describe('Priority Variants', () => {
    it('should render high priority badge with destructive variant', () => {
      const highPriorityTodo = { ...baseTodo, priority: 'high' as const };

      render(<TodoItem todo={highPriorityTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const priorityBadge = screen.getByText('high').closest('.badge');
      expect(priorityBadge).toHaveClass('badge-error');
    });

    it('should render medium priority badge with default variant', () => {
      const mediumPriorityTodo = { ...baseTodo, priority: 'medium' as const };

      render(
        <TodoItem todo={mediumPriorityTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const priorityBadge = screen.getByText('medium').closest('.badge');
      expect(priorityBadge).toHaveClass('badge');
    });

    it('should render low priority badge with secondary variant', () => {
      const lowPriorityTodo = { ...baseTodo, priority: 'low' as const };

      render(<TodoItem todo={lowPriorityTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const priorityBadge = screen.getByText('low').closest('.badge');
      expect(priorityBadge).toHaveClass('badge-secondary');
    });
  });

  describe('User Interactions', () => {
    it('should call onToggle when checkbox is clicked', () => {
      render(<TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnToggle).toHaveBeenCalledWith('1');
    });

    it('should show actions on mouse enter', async () => {
      const { container } = render(
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(todoContainer);

      await waitFor(() => {
        expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
        expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
      });
    });

    it('should hide actions on mouse leave', async () => {
      const { container } = render(
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(todoContainer);
      fireEvent.mouseLeave(todoContainer);

      await waitFor(() => {
        expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
      });
    });

    it('should call onEdit when edit button is clicked', async () => {
      const { container } = render(
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(todoContainer);

      await waitFor(() => {
        const editButton = screen.getByTitle('Edit todo');
        fireEvent.click(editButton);
        expect(mockOnEdit).toHaveBeenCalledWith(baseTodo);
      });
    });

    it('should call onDelete when delete button is clicked', async () => {
      const { container } = render(
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(todoContainer);

      await waitFor(() => {
        const deleteButton = screen.getByTitle('Delete todo');
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith('1');
      });
    });

    it('should not show actions when showActions is false', () => {
      const { container } = render(
        <TodoItem
          todo={baseTodo}
          showActions={false}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(todoContainer);

      expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
    });
  });

  describe('Overdue Functionality', () => {
    it('should highlight overdue todos', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const overdueTodo = {
        ...baseTodo,
        dueDate: yesterday,
        completed: false,
      };

      const { container } = render(
        <TodoItem todo={overdueTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      expect(todoContainer).toHaveClass('border-error');

      const dueDateBadge = screen.getByText(/Due:/).closest('.badge');
      expect(dueDateBadge).toHaveClass('badge-error');
    });

    it('should not highlight completed overdue todos', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const completedOverdueTodo = {
        ...baseTodo,
        dueDate: yesterday,
        completed: true,
      };

      const { container } = render(
        <TodoItem todo={completedOverdueTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      expect(todoContainer).not.toHaveClass('border-error');
    });
  });

  describe('Blockchain Integration', () => {
    it('should render blockchain info when available', () => {
      const blockchainTodo = {
        ...baseTodo,
        blockchainNetwork: BlockchainNetwork.POLYGON,
        transactionHash: '0x123abc',
      };

      render(
        <TodoItem
          todo={blockchainTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          getNetworkDisplayInfo={mockGetNetworkDisplayInfo}
          TransactionStatusComponent={mockTransactionStatus}
        />,
      );

      expect(screen.getByText('Polygon')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-status')).toBeInTheDocument();
      expect(screen.getByText('Tx: 0x123abc')).toBeInTheDocument();
    });

    it('should not render blockchain info when showBlockchainInfo is false', () => {
      const blockchainTodo = {
        ...baseTodo,
        blockchainNetwork: BlockchainNetwork.POLYGON,
        transactionHash: '0x123abc',
      };

      render(
        <TodoItem
          todo={blockchainTodo}
          showBlockchainInfo={false}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          getNetworkDisplayInfo={mockGetNetworkDisplayInfo}
          TransactionStatusComponent={mockTransactionStatus}
        />,
      );

      expect(screen.queryByText('Polygon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('transaction-status')).not.toBeInTheDocument();
    });

    it('should render blockchain sync options when not synced', () => {
      const unsyncedTodo = {
        ...baseTodo,
        blockchainNetwork: undefined,
        transactionHash: undefined,
      };

      render(
        <TodoItem
          todo={unsyncedTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onBlockchainSync={mockOnBlockchainSync}
          getNetworkDisplayInfo={mockGetNetworkDisplayInfo}
        />,
      );

      expect(screen.getByText('Sync to blockchain')).toBeInTheDocument();
    });

    it('should call onBlockchainSync when network button is clicked', () => {
      const unsyncedTodo = {
        ...baseTodo,
        blockchainNetwork: undefined,
        transactionHash: undefined,
      };

      render(
        <TodoItem
          todo={unsyncedTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onBlockchainSync={mockOnBlockchainSync}
          getNetworkDisplayInfo={mockGetNetworkDisplayInfo}
        />,
      );

      // Open the blockchain sync details
      const syncSummary = screen.getByText('Sync to blockchain');
      fireEvent.click(syncSummary);

      // Click on a network button
      const polygonButton = screen.getByText('Polygon');
      fireEvent.click(polygonButton);

      expect(mockOnBlockchainSync).toHaveBeenCalledWith('1', 'polygon');
    });

    it('should not render blockchain sync in compact variant', () => {
      const unsyncedTodo = {
        ...baseTodo,
        blockchainNetwork: undefined,
        transactionHash: undefined,
      };

      render(
        <TodoItem
          todo={unsyncedTodo}
          variant="compact"
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onBlockchainSync={mockOnBlockchainSync}
        />,
      );

      expect(screen.queryByText('Sync to blockchain')).not.toBeInTheDocument();
    });

    it('should use fallback network display name when getNetworkDisplayInfo is not provided', () => {
      const blockchainTodo = {
        ...baseTodo,
        blockchainNetwork: BlockchainNetwork.POLYGON,
      };

      render(<TodoItem todo={blockchainTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      expect(screen.getByText('Polygon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('should have proper button titles for actions', async () => {
      const { container } = render(
        <TodoItem todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(todoContainer);

      await waitFor(() => {
        expect(screen.getByTitle('Edit todo')).toBeInTheDocument();
        expect(screen.getByTitle('Delete todo')).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation for blockchain sync', () => {
      const unsyncedTodo = {
        ...baseTodo,
        blockchainNetwork: undefined,
        transactionHash: undefined,
      };

      render(
        <TodoItem
          todo={unsyncedTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onBlockchainSync={mockOnBlockchainSync}
        />,
      );

      const syncSummary = screen.getByText('Sync to blockchain');
      expect(syncSummary).toHaveClass('cursor-pointer');
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <TodoItem
          todo={baseTodo}
          className="custom-class"
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      const todoContainer = container.firstChild as HTMLElement;
      expect(todoContainer).toHaveClass('custom-class');
    });

    it('should accept custom supported networks', () => {
      const unsyncedTodo = {
        ...baseTodo,
        blockchainNetwork: undefined,
        transactionHash: undefined,
      };

      render(
        <TodoItem
          todo={unsyncedTodo}
          onToggle={mockOnToggle}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onBlockchainSync={mockOnBlockchainSync}
          supportedNetworks={[BlockchainNetwork.POLYGON, BlockchainNetwork.BASE]}
          getNetworkDisplayInfo={mockGetNetworkDisplayInfo}
        />,
      );

      // Open the blockchain sync details
      const syncSummary = screen.getByText('Sync to blockchain');
      fireEvent.click(syncSummary);

      expect(screen.getByText('Polygon')).toBeInTheDocument();
      expect(screen.getByText('Base')).toBeInTheDocument();
      expect(screen.queryByText('Solana')).not.toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <TodoItem ref={ref} todo={baseTodo} onToggle={mockOnToggle} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
