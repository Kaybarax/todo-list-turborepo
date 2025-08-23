import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TodoItem } from '../../../../lib/components/todo/TodoItem/TodoItem';
import type { TodoItemProps, TodoData } from '../../../../lib/components/todo/TodoItem/TodoItem';
import { BlockchainNetwork } from '@todo/services';

const meta: Meta<typeof TodoItem> = {
  title: 'Todo/TodoItem',
  component: TodoItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible todo item component that displays todo information with support for blockchain integration, multiple variants, and customizable actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant of the todo item',
    },
    showActions: {
      control: 'boolean',
      description: 'Whether to show edit/delete action buttons',
    },
    showBlockchainInfo: {
      control: 'boolean',
      description: 'Whether to show blockchain-related information',
    },
    onToggle: { action: 'toggled' },
    onEdit: { action: 'edited' },
    onDelete: { action: 'deleted' },
    onBlockchainSync: { action: 'blockchain-sync' },
  },
  args: {
    onToggle: fn(),
    onEdit: fn(),
    onDelete: fn(),
    onBlockchainSync: fn(),
    showActions: true,
    showBlockchainInfo: true,
  },
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const baseTodo: TodoData = {
  id: '1',
  title: 'Complete project documentation',
  description: 'Write comprehensive documentation for the new feature including API docs and user guides.',
  completed: false,
  priority: 'high',
  dueDate: new Date('2024-12-31'),
  tags: ['documentation', 'urgent'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  userId: 'user-1',
};

const completedTodo: TodoData = {
  ...baseTodo,
  id: '2',
  title: 'Setup development environment',
  description: 'Install and configure all necessary development tools.',
  completed: true,
  priority: 'medium',
  dueDate: new Date('2024-01-10'),
  tags: ['setup', 'development'],
};

const blockchainTodo: TodoData = {
  ...baseTodo,
  id: '3',
  title: 'Deploy smart contract',
  description: 'Deploy the updated smart contract to the mainnet.',
  priority: 'high',
  blockchainNetwork: BlockchainNetwork.POLYGON,
  transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
  tags: ['blockchain', 'deployment'],
};

const overdueTodo: TodoData = {
  ...baseTodo,
  id: '4',
  title: 'Review security audit',
  description: 'Review and address findings from the security audit.',
  completed: false,
  priority: 'high',
  dueDate: new Date('2024-01-01'), // Past date
  tags: ['security', 'audit'],
};

const simpleTodo: TodoData = {
  id: '5',
  title: 'Simple todo without description',
  completed: false,
  priority: 'low',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-1',
};

// Mock TransactionStatus component for stories
const MockTransactionStatus = ({ transactionHash, network }: { transactionHash: string; network: string }) => (
  <div className="text-xs text-base-content/70 bg-base-200 p-2 rounded">
    <div>Status: Confirmed</div>
    <div>Hash: {transactionHash.slice(0, 10)}...</div>
    <div>Network: {network}</div>
  </div>
);

// Mock network display function
const mockGetNetworkDisplayInfo = (network: string) => ({
  displayName: network.charAt(0).toUpperCase() + network.slice(1),
});

export const Default: Story = {
  args: {
    todo: baseTodo,
  },
};

export const Completed: Story = {
  args: {
    todo: completedTodo,
  },
};

export const WithBlockchain: Story = {
  args: {
    todo: blockchainTodo,
    TransactionStatusComponent: MockTransactionStatus,
    getNetworkDisplayInfo: mockGetNetworkDisplayInfo,
  },
};

export const Overdue: Story = {
  args: {
    todo: overdueTodo,
  },
};

export const Simple: Story = {
  args: {
    todo: simpleTodo,
  },
};

export const CompactVariant: Story = {
  args: {
    todo: baseTodo,
    variant: 'compact',
  },
};

export const DetailedVariant: Story = {
  args: {
    todo: baseTodo,
    variant: 'detailed',
  },
};

export const WithoutActions: Story = {
  args: {
    todo: baseTodo,
    showActions: false,
  },
};

export const WithoutBlockchainInfo: Story = {
  args: {
    todo: blockchainTodo,
    showBlockchainInfo: false,
  },
};

export const LowPriority: Story = {
  args: {
    todo: {
      ...baseTodo,
      priority: 'low',
      title: 'Low priority task',
      description: 'This is a low priority task that can be done later.',
    },
  },
};

export const MediumPriority: Story = {
  args: {
    todo: {
      ...baseTodo,
      priority: 'medium',
      title: 'Medium priority task',
      description: 'This is a medium priority task.',
    },
  },
};

export const HighPriority: Story = {
  args: {
    todo: {
      ...baseTodo,
      priority: 'high',
      title: 'High priority task',
      description: 'This is a high priority task that needs immediate attention.',
    },
  },
};

export const WithBlockchainSync: Story = {
  args: {
    todo: {
      ...baseTodo,
      blockchainNetwork: undefined,
      transactionHash: undefined,
      title: 'Todo ready for blockchain sync',
      description: 'This todo can be synced to various blockchain networks.',
    },
    getNetworkDisplayInfo: mockGetNetworkDisplayInfo,
  },
};

export const ManyTags: Story = {
  args: {
    todo: {
      ...baseTodo,
      title: 'Todo with many tags',
      tags: ['frontend', 'backend', 'testing', 'documentation', 'urgent', 'feature', 'bug-fix'],
    },
  },
};

export const AllVariants: Story = {
  render: args => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Default Variant</h3>
        <TodoItem {...args} variant="default" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Compact Variant</h3>
        <TodoItem {...args} variant="compact" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Detailed Variant</h3>
        <TodoItem {...args} variant="detailed" />
      </div>
    </div>
  ),
  args: {
    todo: baseTodo,
    onToggle: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const AllPriorities: Story = {
  render: args => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Low Priority</h3>
        <TodoItem {...args} todo={{ ...baseTodo, priority: 'low', title: 'Low priority task' }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Medium Priority</h3>
        <TodoItem {...args} todo={{ ...baseTodo, priority: 'medium', title: 'Medium priority task' }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">High Priority</h3>
        <TodoItem {...args} todo={{ ...baseTodo, priority: 'high', title: 'High priority task' }} />
      </div>
    </div>
  ),
  args: {
    todo: baseTodo,
    onToggle: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};
