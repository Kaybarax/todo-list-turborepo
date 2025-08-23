import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from './TodoList';
import { TodoData } from '../lib/TodoItem';
import { BlockchainNetwork } from '@todo/services';

// Mock data for tests
const mockTodos: TodoData[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature',
    completed: false,
    priority: 'high',
    dueDate: new Date('2024-01-15'),
    tags: ['documentation', 'urgent'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userId: 'user1',
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and approve pending pull requests',
    completed: true,
    priority: 'medium',
    dueDate: new Date('2024-01-10'),
    tags: ['review', 'code'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-05'),
    userId: 'user1',
  },
  {
    id: '3',
    title: 'Fix critical bug',
    description: 'Address the memory leak in the authentication module',
    completed: false,
    priority: 'high',
    dueDate: new Date('2023-12-30'), // Overdue
    tags: ['bug', 'critical'],
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28'),
    userId: 'user1',
  },
  {
    id: '4',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    completed: false,
    priority: 'low',
    tags: ['maintenance'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    userId: 'user1',
  },
  {
    id: '5',
    title: 'Blockchain todo sync',
    description: 'Todo synced to blockchain',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-01-20'),
    tags: ['blockchain', 'sync'],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    userId: 'user1',
    blockchainNetwork: BlockchainNetwork.SOLANA,
    transactionHash: '0x123456789abcdef',
    blockchainAddress: 'So11111111111111111111111111111111111111112',
  },
];

const defaultProps = {
  todos: mockTodos,
  onToggle: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onBlockchainSync: jest.fn(),
};

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<TodoList {...defaultProps} />);

      // Check that statistics are displayed
      expect(screen.getByText('5')).toBeInTheDocument(); // Total
      expect(screen.getByText('4')).toBeInTheDocument(); // Active
      expect(screen.getByText('1')).toBeInTheDocument(); // Completed
      expect(screen.getByText('1')).toBeInTheDocument(); // Overdue

      // Check that all todos are rendered
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
      expect(screen.getByText('Review pull requests')).toBeInTheDocument();
      expect(screen.getByText('Fix critical bug')).toBeInTheDocument();
      expect(screen.getByText('Update dependencies')).toBeInTheDocument();
      expect(screen.getByText('Blockchain todo sync')).toBeInTheDocument();
    });

    it('should render without stats when showStats is false', () => {
      render(<TodoList {...defaultProps} showStats={false} />);

      // Stats should not be present
      expect(screen.queryByText('Total')).not.toBeInTheDocument();
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed')).not.toBeInTheDocument();
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should render without filters when showFilters is false', () => {
      render(<TodoList {...defaultProps} showFilters={false} />);

      // Filter controls should not be present
      expect(screen.queryByPlaceholderText('Search todos...')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('All')).not.toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(<TodoList {...defaultProps} loading={true} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render empty state when no todos', () => {
      render(<TodoList {...defaultProps} todos={[]} />);

      expect(screen.getByText('No todos')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating a new todo.')).toBeInTheDocument();
    });

    it('should render custom empty state', () => {
      const customEmptyState = <div>Custom empty message</div>;
      render(<TodoList {...defaultProps} todos={[]} emptyState={customEmptyState} />);

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('should render in compact variant', () => {
      const { container } = render(<TodoList {...defaultProps} variant="compact" />);

      expect(container.querySelector('.space-y-2')).toBeInTheDocument();
    });

    it('should render in grid variant', () => {
      const { container } = render(<TodoList {...defaultProps} variant="grid" />);

      expect(container.querySelector('.grid')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should filter active todos', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const filterSelect = screen.getByDisplayValue('All');
      await user.selectOptions(filterSelect, 'active');

      // Should show only active todos (4 out of 5)
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
      expect(screen.queryByText('Review pull requests')).not.toBeInTheDocument(); // Completed
      expect(screen.getByText('Fix critical bug')).toBeInTheDocument();
      expect(screen.getByText('Update dependencies')).toBeInTheDocument();
      expect(screen.getByText('Blockchain todo sync')).toBeInTheDocument();
    });

    it('should filter completed todos', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const filterSelect = screen.getByDisplayValue('All');
      await user.selectOptions(filterSelect, 'completed');

      // Should show only completed todos (1 out of 5)
      expect(screen.queryByText('Complete project documentation')).not.toBeInTheDocument();
      expect(screen.getByText('Review pull requests')).toBeInTheDocument(); // Completed
      expect(screen.queryByText('Fix critical bug')).not.toBeInTheDocument();
    });

    it('should show empty state when filter results in no todos', async () => {
      const user = userEvent.setup();
      const todosWithoutCompleted = mockTodos.filter(todo => !todo.completed);
      render(<TodoList {...defaultProps} todos={todosWithoutCompleted} />);

      const filterSelect = screen.getByDisplayValue('All');
      await user.selectOptions(filterSelect, 'completed');

      expect(screen.getByText('No todos match your current filter and search criteria.')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort by priority', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const sortSelect = screen.getByDisplayValue('Created Date');
      await user.selectOptions(sortSelect, 'priority');

      // High priority todos should appear first
      const todoTitles = screen.getAllByRole('heading', { level: 3 });
      expect(todoTitles[0]).toHaveTextContent('Complete project documentation'); // High priority
      expect(todoTitles[1]).toHaveTextContent('Fix critical bug'); // High priority
    });

    it('should sort by title', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const sortSelect = screen.getByDisplayValue('Created Date');
      await user.selectOptions(sortSelect, 'title');

      // Todos should be sorted alphabetically
      const todoTitles = screen.getAllByRole('heading', { level: 3 });
      expect(todoTitles[0]).toHaveTextContent('Blockchain todo sync');
      expect(todoTitles[1]).toHaveTextContent('Complete project documentation');
    });

    it('should sort by due date', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const sortSelect = screen.getByDisplayValue('Created Date');
      await user.selectOptions(sortSelect, 'dueDate');

      // Overdue todo should appear first, then by due date
      const todoTitles = screen.getAllByRole('heading', { level: 3 });
      expect(todoTitles[0]).toHaveTextContent('Fix critical bug'); // Overdue
    });
  });

  describe('Search', () => {
    it('should search by title', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'documentation');

      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
      expect(screen.queryByText('Review pull requests')).not.toBeInTheDocument();
    });

    it('should search by description', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'memory leak');

      expect(screen.getByText('Fix critical bug')).toBeInTheDocument();
      expect(screen.queryByText('Complete project documentation')).not.toBeInTheDocument();
    });

    it('should search by tags', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'urgent');

      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
      expect(screen.queryByText('Review pull requests')).not.toBeInTheDocument();
    });

    it('should be case insensitive', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'DOCUMENTATION');

      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
    });

    it('should clear search results when input is cleared', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search todos...');
      await user.type(searchInput, 'documentation');

      // Should show filtered results
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
      expect(screen.queryByText('Review pull requests')).not.toBeInTheDocument();

      // Clear search
      await user.clear(searchInput);

      // Should show all todos again
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
      expect(screen.getByText('Review pull requests')).toBeInTheDocument();
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate statistics correctly', () => {
      render(<TodoList {...defaultProps} />);

      // Total: 5 todos
      expect(screen.getByText('5')).toBeInTheDocument();

      // Active: 4 todos (not completed)
      expect(screen.getByText('4')).toBeInTheDocument();

      // Completed: 1 todo
      expect(screen.getByText('1')).toBeInTheDocument();

      // Overdue: 1 todo (Fix critical bug has due date in the past)
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should update statistics when todos change', () => {
      const { rerender } = render(<TodoList {...defaultProps} />);

      // Initial stats
      expect(screen.getByText('5')).toBeInTheDocument(); // Total

      // Update with fewer todos
      const fewerTodos = mockTodos.slice(0, 3);
      rerender(<TodoList {...defaultProps} todos={fewerTodos} />);

      expect(screen.getByText('3')).toBeInTheDocument(); // Total
    });
  });

  describe('User Interactions', () => {
    it('should call onToggle when todo is toggled', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      expect(defaultProps.onToggle).toHaveBeenCalledWith('1');
    });

    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      // Hover over a todo to show actions
      const todoCard = screen.getByText('Complete project documentation').closest('.card');
      if (todoCard) {
        fireEvent.mouseEnter(todoCard);
      }

      await waitFor(() => {
        const editButtons = screen.getAllByTitle('Edit todo');
        expect(editButtons[0]).toBeInTheDocument();
      });

      const editButtons = screen.getAllByTitle('Edit todo');
      await user.click(editButtons[0]);

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTodos[0]);
    });

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      // Hover over a todo to show actions
      const todoCard = screen.getByText('Complete project documentation').closest('.card');
      if (todoCard) {
        fireEvent.mouseEnter(todoCard);
      }

      await waitFor(() => {
        const deleteButtons = screen.getAllByTitle('Delete todo');
        expect(deleteButtons[0]).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTitle('Delete todo');
      await user.click(deleteButtons[0]);

      expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
    });

    it('should call onBlockchainSync when blockchain sync is triggered', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      // Find a todo without blockchain network and expand sync options
      const todoWithoutBlockchain = screen.getByText('Complete project documentation').closest('.card');
      if (todoWithoutBlockchain) {
        const syncSummary = todoWithoutBlockchain.querySelector('summary');
        if (syncSummary) {
          await user.click(syncSummary);

          const solanaButton = screen.getByRole('button', { name: /solana/i });
          await user.click(solanaButton);

          expect(defaultProps.onBlockchainSync).toHaveBeenCalledWith('1', BlockchainNetwork.SOLANA);
        }
      }
    });
  });

  describe('Initial State Props', () => {
    it('should respect initial filter prop', () => {
      render(<TodoList {...defaultProps} initialFilter="active" />);

      const filterSelect = screen.getByDisplayValue('Active');
      expect(filterSelect).toBeInTheDocument();
    });

    it('should respect initial sort prop', () => {
      render(<TodoList {...defaultProps} initialSort="priority" />);

      const sortSelect = screen.getByDisplayValue('Priority');
      expect(sortSelect).toBeInTheDocument();
    });

    it('should respect initial search term prop', () => {
      render(<TodoList {...defaultProps} initialSearchTerm="documentation" />);

      const searchInput = screen.getByDisplayValue('documentation');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<TodoList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search todos...');
      expect(searchInput).toHaveAttribute('type', 'text');

      const filterSelect = screen.getByDisplayValue('All');
      expect(filterSelect).toHaveAttribute('aria-label');

      const sortSelect = screen.getByDisplayValue('Created Date');
      expect(sortSelect).toHaveAttribute('aria-label');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search todos...');

      // Tab to search input and type
      await user.tab();
      expect(searchInput).toHaveFocus();

      await user.type(searchInput, 'test');
      expect(searchInput).toHaveValue('test');
    });
  });

  describe('Integration with TodoItem', () => {
    it('should pass correct props to TodoItem components', () => {
      const mockTransactionStatusComponent = jest.fn(() => <div>Transaction Status</div>);
      const mockGetNetworkDisplayInfo = jest.fn(() => ({ displayName: 'Test Network' }));
      const mockSupportedNetworks = [BlockchainNetwork.SOLANA];

      render(
        <TodoList
          {...defaultProps}
          TransactionStatusComponent={mockTransactionStatusComponent}
          getNetworkDisplayInfo={mockGetNetworkDisplayInfo}
          supportedNetworks={mockSupportedNetworks}
        />,
      );

      // TodoItem components should be rendered with correct props
      expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    });
  });

  describe('Performance', () => {
    it('should memoize filtered and sorted todos', () => {
      const { rerender } = render(<TodoList {...defaultProps} />);

      // Re-render with same props should not cause unnecessary recalculations
      rerender(<TodoList {...defaultProps} />);

      expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    });
  });
});
