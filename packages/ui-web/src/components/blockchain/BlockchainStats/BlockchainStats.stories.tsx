import type { Meta, StoryObj } from '@storybook/react';
import { BlockchainStats } from './BlockchainStats';
import type { BlockchainStatsData } from './BlockchainStats';

// Mock network color function for stories
const mockGetNetworkColor = (network: string): string => {
  const networkColors: Record<string, string> = {
    ethereum: '#6366f1',
    polygon: '#9333ea',
    base: '#3b82f6',
    moonbeam: '#14b8a6',
    polkadot: '#ec4899',
  };
  return networkColors[network.toLowerCase()] || '#6366f1';
};

const meta: Meta<typeof BlockchainStats> = {
  title: 'Blockchain/BlockchainStats',
  component: BlockchainStats,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible statistics display component for blockchain data visualization with network breakdown and sync progress.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant of the stats display',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the text and spacing',
    },
    showNetworkBreakdown: {
      control: { type: 'boolean' },
      description: 'Whether to show the network distribution section',
    },
    showSyncPercentage: {
      control: { type: 'boolean' },
      description: 'Whether to show the sync percentage stat',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const sampleData: BlockchainStatsData = {
  total: 25,
  onChain: 18,
  offChain: 7,
  networkBreakdown: {
    ethereum: 8,
    polygon: 5,
    base: 3,
    moonbeam: 2,
  },
  pendingTransactions: 2,
  syncPercentage: 72,
};

const fullySyncedData: BlockchainStatsData = {
  total: 20,
  onChain: 20,
  offChain: 0,
  networkBreakdown: {
    ethereum: 12,
    polygon: 5,
    base: 3,
  },
  pendingTransactions: 0,
  syncPercentage: 100,
};

const emptyData: BlockchainStatsData = {
  total: 0,
  onChain: 0,
  offChain: 0,
  networkBreakdown: {},
  pendingTransactions: 0,
  syncPercentage: 0,
};

const singleNetworkData: BlockchainStatsData = {
  total: 10,
  onChain: 8,
  offChain: 2,
  networkBreakdown: {
    ethereum: 8,
  },
  pendingTransactions: 1,
  syncPercentage: 80,
};

const highPendingData: BlockchainStatsData = {
  total: 30,
  onChain: 15,
  offChain: 15,
  networkBreakdown: {
    ethereum: 8,
    polygon: 4,
    base: 3,
  },
  pendingTransactions: 12,
  syncPercentage: 50,
};

export const Default: Story = {
  args: {
    data: sampleData,
    getNetworkColor: mockGetNetworkColor,
  },
};

export const Compact: Story = {
  args: {
    data: sampleData,
    variant: 'compact',
    getNetworkColor: mockGetNetworkColor,
  },
};

export const Detailed: Story = {
  args: {
    data: sampleData,
    variant: 'detailed',
    getNetworkColor: mockGetNetworkColor,
  },
};

export const SmallSize: Story = {
  args: {
    data: sampleData,
    size: 'sm',
    getNetworkColor: mockGetNetworkColor,
  },
};

export const LargeSize: Story = {
  args: {
    data: sampleData,
    size: 'lg',
    getNetworkColor: mockGetNetworkColor,
  },
};

export const FullySynced: Story = {
  args: {
    data: fullySyncedData,
    getNetworkColor: mockGetNetworkColor,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component when all todos are synced to blockchain (100% sync rate).',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    data: emptyData,
    getNetworkColor: mockGetNetworkColor,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component returns null when total is 0, so this story demonstrates the empty state behavior.',
      },
    },
  },
};

export const SingleNetwork: Story = {
  args: {
    data: singleNetworkData,
    getNetworkColor: mockGetNetworkColor,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with todos on a single blockchain network.',
      },
    },
  },
};

export const HighPendingTransactions: Story = {
  args: {
    data: highPendingData,
    getNetworkColor: mockGetNetworkColor,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the component with a high number of pending transactions.',
      },
    },
  },
};

export const WithoutNetworkBreakdown: Story = {
  args: {
    data: sampleData,
    showNetworkBreakdown: false,
    getNetworkColor: mockGetNetworkColor,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component without the network distribution section.',
      },
    },
  },
};

export const WithoutSyncPercentage: Story = {
  args: {
    data: sampleData,
    showSyncPercentage: false,
    getNetworkColor: mockGetNetworkColor,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component without the sync percentage stat.',
      },
    },
  },
};

export const WithoutNetworkColors: Story = {
  args: {
    data: sampleData,
    // No getNetworkColor function provided
  },
  parameters: {
    docs: {
      description: {
        story: 'Component without network color function, showing default styling.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Default Variant</h3>
        <BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Compact Variant</h3>
        <BlockchainStats data={sampleData} variant="compact" getNetworkColor={mockGetNetworkColor} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Detailed Variant</h3>
        <BlockchainStats data={sampleData} variant="detailed" getNetworkColor={mockGetNetworkColor} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available variants side by side.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Small Size</h3>
        <BlockchainStats data={sampleData} size="sm" getNetworkColor={mockGetNetworkColor} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Medium Size (Default)</h3>
        <BlockchainStats data={sampleData} size="md" getNetworkColor={mockGetNetworkColor} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Large Size</h3>
        <BlockchainStats data={sampleData} size="lg" getNetworkColor={mockGetNetworkColor} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available sizes side by side.',
      },
    },
  },
};
