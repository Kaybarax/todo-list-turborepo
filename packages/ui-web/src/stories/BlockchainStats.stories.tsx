import { type Meta, type StoryObj } from '@storybook/react';

import { BlockchainStats, type BlockchainStatsData } from '../components/blockchain/BlockchainStats/BlockchainStats';

const sampleData: BlockchainStatsData = {
  total: 150,
  onChain: 120,
  offChain: 30,
  networkBreakdown: {
    polygon: 75,
    ethereum: 30,
    solana: 15,
  },
  pendingTransactions: 8,
  syncPercentage: 85,
};

const highVolumeData: BlockchainStatsData = {
  total: 5420,
  onChain: 4890,
  offChain: 530,
  networkBreakdown: {
    polygon: 2445,
    ethereum: 1567,
    solana: 878,
  },
  pendingTransactions: 42,
  syncPercentage: 92,
};

const lowVolumeData: BlockchainStatsData = {
  total: 12,
  onChain: 8,
  offChain: 4,
  networkBreakdown: {
    polygon: 5,
    ethereum: 3,
  },
  pendingTransactions: 1,
  syncPercentage: 67,
};

const emptyData: BlockchainStatsData = {
  total: 0,
  onChain: 0,
  offChain: 0,
  networkBreakdown: {},
  pendingTransactions: 0,
  syncPercentage: 0,
};

const meta: Meta<typeof BlockchainStats> = {
  title: 'Blockchain/BlockchainStats',
  component: BlockchainStats,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible statistics display component for blockchain data with customizable visualization and network breakdown.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'The visual variant of the statistics display',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the statistics text',
    },
    showNetworkBreakdown: {
      control: 'boolean',
      description: 'Whether to show network-specific breakdown',
    },
    showSyncPercentage: {
      control: 'boolean',
      description: 'Whether to show sync progress percentage',
    },
    data: {
      control: 'object',
      description: 'The blockchain statistics data to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BlockchainStats>;

export const Default: Story = {
  args: {
    data: sampleData,
    variant: 'default',
    size: 'md',
    showNetworkBreakdown: true,
    showSyncPercentage: true,
  },
};

export const Compact: Story = {
  args: {
    data: sampleData,
    variant: 'compact',
    size: 'md',
    showNetworkBreakdown: true,
    showSyncPercentage: true,
  },
};

export const Detailed: Story = {
  args: {
    data: sampleData,
    variant: 'detailed',
    size: 'md',
    showNetworkBreakdown: true,
    showSyncPercentage: true,
  },
};

export const Small: Story = {
  args: {
    data: sampleData,
    variant: 'default',
    size: 'sm',
    showNetworkBreakdown: true,
    showSyncPercentage: true,
  },
};

export const Large: Story = {
  args: {
    data: sampleData,
    variant: 'default',
    size: 'lg',
    showNetworkBreakdown: true,
    showSyncPercentage: true,
  },
};

export const HighVolume: Story = {
  args: {
    data: highVolumeData,
    variant: 'default',
    size: 'md',
    showNetworkBreakdown: true,
    showSyncPercentage: true,
  },
};

export const LowVolume: Story = {
  args: {
    data: lowVolumeData,
    variant: 'default',
    size: 'md',
    showNetworkBreakdown: true,
    showSyncPercentage: true,
  },
};

export const Empty: Story = {
  args: {
    data: emptyData,
    variant: 'default',
    size: 'md',
    showNetworkBreakdown: true,
    showSyncPercentage: true,
  },
};

export const NoNetworkBreakdown: Story = {
  args: {
    data: sampleData,
    variant: 'default',
    size: 'md',
    showNetworkBreakdown: false,
    showSyncPercentage: true,
  },
};

export const NoSyncPercentage: Story = {
  args: {
    data: sampleData,
    variant: 'default',
    size: 'md',
    showNetworkBreakdown: true,
    showSyncPercentage: false,
  },
};

export const MinimalView: Story = {
  args: {
    data: sampleData,
    variant: 'compact',
    size: 'sm',
    showNetworkBreakdown: false,
    showSyncPercentage: false,
  },
};
