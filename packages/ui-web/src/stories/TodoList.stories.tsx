import { type Meta, type StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TodoList } from '../components/todo/TodoList/TodoList';
import { type TodoData } from '../components/todo/TodoItem/TodoItem';

const sampleTodos: TodoData[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-12-31'),
    tags: ['documentation', 'project'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    userId: 'user123',
  },
  {
    id: '2',
    title: 'Setup development environment',
    completed: true,
    priority: 'high',
    tags: ['setup', 'development'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    userId: 'user123',
  },
  {
    id: '3',
    title: 'Deploy smart contract',
    description: 'Deploy the todo smart contract to Polygon network',
    completed: false,
    priority: 'high',
    blockchainNetwork: 'polygon',
    transactionHash: '0x1234567890abcdef',
    tags: ['blockchain', 'deployment'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    userId: 'user123',
  },
  {
    id: '4',
    title: 'Review code changes',
    completed: false,
    priority: 'low',
    tags: ['review', 'code'],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    userId: 'user123',
  },
  {
    id: '5',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    completed: true,
    priority: 'medium',
    tags: ['maintenance', 'dependencies'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08'),
    userId: 'user123',
  },
];

const EmptyState = () => (
  <div className="text-center py-8 text-gray-500">
    <div className="text-4xl mb-4">📝</div>
    <h3 className="text-lg font-medium mb-2">No todos yet</h3>
    <p>Create your first todo to get started!</p>
  </div>
);

const meta: Meta<typeof TodoList> = {
  title: 'Todo/TodoList',
  component: TodoList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A reusable list component with filtering, sorting, and search capabilities for displaying todos.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'grid'],
      description: 'The layout variant of the todo list',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the list elements',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the list is in a loading state',
    },
    showStats: {
      control: 'boolean',
      description: 'Whether to show todo statistics',
    },
    showFilters: {
      control: 'boolean',
      description: 'Whether to show filter controls',
    },
    onToggle: {
      action: 'toggled',
      description: 'Function called when a todo completion is toggled',
    },
    onEdit: {
      action: 'edited',
      description: 'Function called when a todo is edited',
    },
    onDelete: {
      action: 'deleted',
      description: 'Function called when a todo is deleted',
    },
    onBlockchainSync: {
      action: 'blockchain-synced',
      description: 'Function called when a todo is synced to blockchain',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TodoList>;

export const Default: Story = {
  args: {
    todos: sampleTodos,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    onBlockchainSync: action('onBlockchainSync'),
    variant: 'default',
    size: 'md',
  },
};

export const Compact: Story = {
  args: {
    todos: sampleTodos,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'compact',
    size: 'md',
  },
};

export const Grid: Story = {
  args: {
    todos: sampleTodos,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'grid',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    todos: sampleTodos.slice(0, 3),
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    todos: sampleTodos.slice(0, 3),
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    size: 'lg',
  },
};

export const Empty: Story = {
  args: {
    todos: [],
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    size: 'md',
    emptyState: <EmptyState />,
  },
};

export const Loading: Story = {
  args: {
    todos: sampleTodos,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    size: 'md',
    loading: true,
  },
};

export const WithStats: Story = {
  args: {
    todos: sampleTodos,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    size: 'md',
    showStats: true,
  },
};

export const WithFilters: Story = {
  args: {
    todos: sampleTodos,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    size: 'md',
    showFilters: true,
  },
};

export const WithStatsAndFilters: Story = {
  args: {
    todos: sampleTodos,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    size: 'md',
    showStats: true,
    showFilters: true,
  },
};

export const SingleTodo: Story = {
  args: {
    todos: [sampleTodos[0]],
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    size: 'md',
  },
};
