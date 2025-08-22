import type { Meta, StoryObj } from '@storybook/react';
import { TodoList } from './TodoList';
import { TodoData } from '../TodoItem';
import { BlockchainNetwork } from '@todo/services';

// Mock data for stories
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

const meta: Meta<typeof TodoList> = {
  title: 'Todo/TodoList',
  component: TodoList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive todo list component with filtering, sorting, search, and statistics capabilities.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'grid'],
      description: 'Visual variant of the todo list layout',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the todo list text and spacing',
    },
    showStats: {
      control: 'boolean',
      description: 'Whether to show statistics cards',
    },
    showFilters: {
      control: 'boolean',
      description: 'Whether to show filter and search controls',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state of the todo list',
    },
  },
  args: {
    todos: mockTodos,
    onToggle: (todoId: string) => console.log('Toggle todo:', todoId),
    onEdit: (todo: TodoData) => console.log('Edit todo:', todo),
    onDelete: (todoId: string) => console.log('Delete todo:', todoId),
    onBlockchainSync: (todoId: string, network: BlockchainNetwork) =>
      console.log('Sync to blockchain:', todoId, network),
  },
};

export default meta;
type Story = StoryObj<typeof TodoList>;

export const Default: Story = {
  args: {},
};

export const WithoutStats: Story = {
  args: {
    showStats: false,
  },
};

export const WithoutFilters: Story = {
  args: {
    showFilters: false,
  },
};

export const CompactVariant: Story = {
  args: {
    variant: 'compact',
  },
};

export const GridVariant: Story = {
  args: {
    variant: 'grid',
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const EmptyList: Story = {
  args: {
    todos: [],
  },
};

export const EmptyWithCustomState: Story = {
  args: {
    todos: [],
    emptyState: (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-base-content">No todos yet</h3>
        <p className="text-base-content/70">Create your first todo to get started!</p>
      </div>
    ),
  },
};

export const SingleTodo: Story = {
  args: {
    todos: [mockTodos[0]],
  },
};

export const OnlyCompleted: Story = {
  args: {
    todos: mockTodos.filter(todo => todo.completed),
  },
};

export const OnlyActive: Story = {
  args: {
    todos: mockTodos.filter(todo => !todo.completed),
  },
};

export const HighPriorityOnly: Story = {
  args: {
    todos: mockTodos.filter(todo => todo.priority === 'high'),
  },
};

export const WithBlockchainTodos: Story = {
  args: {
    todos: mockTodos.filter(todo => todo.blockchainNetwork),
  },
};

export const OverdueTodos: Story = {
  args: {
    todos: mockTodos.filter(todo => todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed),
  },
};

export const ManyTodos: Story = {
  args: {
    todos: [
      ...mockTodos,
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `generated-${i}`,
        title: `Generated Todo ${i + 1}`,
        description: `This is a generated todo item for testing purposes ${i + 1}`,
        completed: Math.random() > 0.5,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        dueDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        tags: [`tag${i % 3}`, `category${i % 2}`],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        userId: 'user1',
        blockchainNetwork: Math.random() > 0.7 ? BlockchainNetwork.SOLANA : undefined,
        transactionHash: Math.random() > 0.7 ? `0x${Math.random().toString(16).substr(2, 16)}` : undefined,
      })),
    ],
  },
};

export const InitialFilters: Story = {
  args: {
    initialFilter: 'active',
    initialSort: 'priority',
    initialSearchTerm: 'project',
  },
};

export const WithNetworkDisplayInfo: Story = {
  args: {
    getNetworkDisplayInfo: (network: BlockchainNetwork) => ({
      displayName:
        network === BlockchainNetwork.SOLANA
          ? 'Solana Network'
          : network === BlockchainNetwork.POLYGON
            ? 'Polygon Network'
            : network === BlockchainNetwork.BASE
              ? 'Base Network'
              : network === BlockchainNetwork.MOONBEAM
                ? 'Moonbeam Network'
                : network === BlockchainNetwork.POLKADOT
                  ? 'Polkadot Network'
                  : network.charAt(0).toUpperCase() + network.slice(1),
    }),
  },
};

export const CustomSupportedNetworks: Story = {
  args: {
    supportedNetworks: [BlockchainNetwork.SOLANA, BlockchainNetwork.POLYGON],
  },
};

// Interactive story for testing all functionality
export const Interactive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive story for testing all TodoList functionality including filtering, sorting, and search.',
      },
    },
  },
};
