import { type Meta, type StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TransactionStatus } from '../components/blockchain/TransactionStatus/TransactionStatus';

const sampleHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const shortHash = '0x123456789012345678901234567890123456789012345678901234567890abcd';

const meta: Meta<typeof TransactionStatus> = {
  title: 'Blockchain/TransactionStatus',
  component: TransactionStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable transaction status component with real-time updates and proper blockchain service integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'The visual variant of the transaction status',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the status text',
    },
    status: {
      control: 'select',
      options: ['pending', 'confirmed', 'failed'],
      description: 'The current status of the transaction',
    },
    showHash: {
      control: 'boolean',
      description: 'Whether to show the transaction hash',
    },
    autoRefresh: {
      control: 'boolean',
      description: 'Whether to automatically refresh the status',
    },
    transactionHash: {
      control: 'text',
      description: 'The transaction hash to display',
    },
    network: {
      control: 'text',
      description: 'The blockchain network name',
    },
    onStatusChange: {
      action: 'status-changed',
      description: 'Function called when transaction status changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionStatus>;

export const Pending: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'polygon',
    status: 'pending',
    variant: 'default',
    size: 'md',
    showHash: true,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const Confirmed: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'ethereum',
    status: 'confirmed',
    variant: 'default',
    size: 'md',
    showHash: true,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const Failed: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'solana',
    status: 'failed',
    variant: 'default',
    size: 'md',
    showHash: true,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const Compact: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'polygon',
    status: 'pending',
    variant: 'compact',
    size: 'md',
    showHash: true,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const Detailed: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'polygon',
    status: 'confirmed',
    variant: 'detailed',
    size: 'md',
    showHash: true,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const Small: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'polygon',
    status: 'pending',
    variant: 'default',
    size: 'sm',
    showHash: true,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const Large: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'polygon',
    status: 'confirmed',
    variant: 'default',
    size: 'lg',
    showHash: true,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const NoHash: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'polygon',
    status: 'pending',
    variant: 'default',
    size: 'md',
    showHash: false,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const AutoRefresh: Story = {
  args: {
    transactionHash: sampleHash,
    network: 'polygon',
    status: 'pending',
    variant: 'default',
    size: 'md',
    showHash: true,
    autoRefresh: true,
    onStatusChange: action('onStatusChange'),
  },
};

export const ShortHash: Story = {
  args: {
    transactionHash: shortHash,
    network: 'polygon',
    status: 'confirmed',
    variant: 'default',
    size: 'md',
    showHash: true,
    autoRefresh: false,
    onStatusChange: action('onStatusChange'),
  },
};

export const DifferentNetworks: Story = {
  render: () => (
    <div className="space-y-4">
      <TransactionStatus
        transactionHash={sampleHash}
        network="polygon"
        status="confirmed"
        onStatusChange={action('onStatusChange')}
      />
      <TransactionStatus
        transactionHash={sampleHash}
        network="ethereum"
        status="pending"
        onStatusChange={action('onStatusChange')}
      />
      <TransactionStatus
        transactionHash={sampleHash}
        network="solana"
        status="failed"
        onStatusChange={action('onStatusChange')}
      />
    </div>
  ),
};
