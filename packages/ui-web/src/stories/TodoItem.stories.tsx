import { type Meta, type StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TodoItem, type TodoData } from '../components/todo/TodoItem/TodoItem';

const sampleTodo: TodoData = {
  id: '1',
  title: 'Complete project documentation',
  description: 'Write comprehensive documentation for the new feature including API docs and user guides',
  completed: false,
  priority: 'medium',
  dueDate: new Date('2024-12-31'),
  tags: ['documentation', 'project'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  userId: 'user123',
};

const completedTodo: TodoData = {
  ...sampleTodo,
  id: '2',
  title: 'Setup development environment',
  completed: true,
  priority: 'high',
  tags: ['setup', 'development'],
};

const blockchainTodo: TodoData = {
  ...sampleTodo,
  id: '3',
  title: 'Deploy smart contract',
  priority: 'high',
  blockchainNetwork: 'polygon',
  transactionHash: '0x1234567890abcdef',
  blockchainAddress: '0xabcdef1234567890',
  tags: ['blockchain', 'deployment'],
};

const meta: Meta<typeof TodoItem> = {
  title: 'Todo/TodoItem',
  component: TodoItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible todo item component that displays todo information with customizable actions and blockchain integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'The visual variant of the todo item',
    },
    showActions: {
      control: 'boolean',
      description: 'Whether to show action buttons',
    },
    showBlockchainInfo: {
      control: 'boolean',
      description: 'Whether to show blockchain information',
    },
    onToggle: {
      action: 'toggled',
      description: 'Function called when todo completion is toggled',
    },
    onEdit: {
      action: 'edited',
      description: 'Function called when todo is edited',
    },
    onDelete: {
      action: 'deleted',
      description: 'Function called when todo is deleted',
    },
    onBlockchainSync: {
      action: 'blockchain-synced',
      description: 'Function called when todo is synced to blockchain',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TodoItem>;

export const Default: Story = {
  args: {
    todo: sampleTodo,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
  },
};

export const Compact: Story = {
  args: {
    todo: sampleTodo,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'compact',
  },
};

export const Detailed: Story = {
  args: {
    todo: sampleTodo,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'detailed',
  },
};

export const Completed: Story = {
  args: {
    todo: completedTodo,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
  },
};

export const HighPriority: Story = {
  args: {
    todo: { ...sampleTodo, priority: 'high' },
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
  },
};

export const LowPriority: Story = {
  args: {
    todo: { ...sampleTodo, priority: 'low' },
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
  },
};

export const WithBlockchain: Story = {
  args: {
    todo: blockchainTodo,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    onBlockchainSync: action('onBlockchainSync'),
    variant: 'default',
    showBlockchainInfo: true,
  },
};

export const NoActions: Story = {
  args: {
    todo: sampleTodo,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    showActions: false,
  },
};

export const NoBlockchainInfo: Story = {
  args: {
    todo: blockchainTodo,
    onToggle: action('onToggle'),
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    variant: 'default',
    showBlockchainInfo: false,
  },
};
