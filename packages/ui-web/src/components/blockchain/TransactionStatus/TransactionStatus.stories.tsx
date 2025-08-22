import type { Meta, StoryObj } from '@storybook/react';
import { TransactionStatus } from './TransactionStatus';
import type { TransactionStatusType } from './TransactionStatus';

// Mock blockchain service for stories
const mockCreateBlockchainService = (network: string) => ({
  getTransactionStatus: async (hash: string): Promise<TransactionStatusType> => {
    // Simulate different scenarios based on hash
    if (hash.includes('confirmed')) return 'confirmed';
    if (hash.includes('failed')) return 'failed';

    // Simulate pending -> confirmed transition
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('confirmed');
      }, 2000);
    });
  },
});

const mockCreateFailingBlockchainService = (network: string) => ({
  getTransactionStatus: async (hash: string): Promise<TransactionStatusType> => {
    throw new Error('Network connection failed');
  },
});

const meta: Meta<typeof TransactionStatus> = {
  title: 'Blockchain/TransactionStatus',
  component: TransactionStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A flexible transaction status component with real-time polling capabilities for blockchain transactions.

## Features
- **Real-time Polling**: Automatically checks transaction status at configurable intervals
- **Multiple Networks**: Support for Ethereum, Polygon, Base, Moonbeam, and Solana
- **Status States**: Pending, confirmed, and failed transaction states
- **Multiple Variants**: Default, compact, and detailed display options
- **Error Handling**: Graceful handling of network errors and timeouts
- **Configurable**: Customizable polling intervals and maximum polling time

## Usage Guidelines
- Use the **default** variant for general transaction displays
- Use the **compact** variant for lists and tables
- Use the **detailed** variant for transaction detail pages
- Set appropriate **pollingInterval** based on network speed
- Configure **maxPollingTime** to prevent infinite polling
- Handle **onStatusChange** for application state updates

## Accessibility
- Screen reader announcements for status changes
- Clear visual indicators for each status state
- Semantic HTML with proper ARIA attributes
- Color-blind friendly status indicators
- Keyboard accessible when interactive`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant of the transaction status display',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the text and spacing',
    },
    showHash: {
      control: { type: 'boolean' },
      description: 'Whether to show the transaction hash',
    },
    autoRefresh: {
      control: { type: 'boolean' },
      description: 'Whether to automatically poll for status updates',
    },
    pollingInterval: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
      description: 'Polling interval in milliseconds',
    },
    maxPollingTime: {
      control: { type: 'number', min: 30000, max: 600000, step: 30000 },
      description: 'Maximum polling time in milliseconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample transaction hashes
const sampleHashes = {
  pending: '0x1234567890abcdef1234567890abcdef12345678',
  confirmed: '0xconfirmed567890abcdef1234567890abcdef12345678',
  failed: '0xfailed567890abcdef1234567890abcdef12345678',
};

export const Default: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'ethereum',
    createBlockchainService: mockCreateBlockchainService,
  },
};

export const Compact: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'polygon',
    variant: 'compact',
    createBlockchainService: mockCreateBlockchainService,
  },
};

export const Detailed: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'base',
    variant: 'detailed',
    createBlockchainService: mockCreateBlockchainService,
  },
};

export const SmallSize: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'moonbeam',
    size: 'sm',
    createBlockchainService: mockCreateBlockchainService,
  },
};

export const LargeSize: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'solana',
    size: 'lg',
    createBlockchainService: mockCreateBlockchainService,
  },
};

export const PendingStatus: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'ethereum',
    autoRefresh: false,
    createBlockchainService: mockCreateBlockchainService,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a transaction in pending state with spinning loader icon.',
      },
    },
  },
};

export const ConfirmedStatus: Story = {
  args: {
    transactionHash: sampleHashes.confirmed,
    network: 'polygon',
    autoRefresh: false,
    createBlockchainService: mockCreateBlockchainService,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a confirmed transaction with success styling and checkmark icon.',
      },
    },
  },
};

export const FailedStatus: Story = {
  args: {
    transactionHash: sampleHashes.failed,
    network: 'base',
    autoRefresh: false,
    createBlockchainService: mockCreateBlockchainService,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a failed transaction with error styling and X icon.',
      },
    },
  },
};

export const WithoutHash: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'ethereum',
    showHash: false,
    createBlockchainService: mockCreateBlockchainService,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component without displaying the transaction hash.',
      },
    },
  },
};

export const WithoutAutoRefresh: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'polygon',
    autoRefresh: false,
    createBlockchainService: mockCreateBlockchainService,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component without automatic status polling.',
      },
    },
  },
};

export const FastPolling: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'ethereum',
    pollingInterval: 1000,
    createBlockchainService: mockCreateBlockchainService,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component with fast polling interval (1 second).',
      },
    },
  },
};

export const NetworkError: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'ethereum',
    createBlockchainService: mockCreateFailingBlockchainService,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component handling network errors during status checking.',
      },
    },
  },
};

export const WithoutBlockchainService: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'ethereum',
    // No createBlockchainService provided
  },
  parameters: {
    docs: {
      description: {
        story: 'Component without blockchain service integration (static display).',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Default Variant</h3>
        <TransactionStatus
          transactionHash={sampleHashes.pending}
          network="ethereum"
          createBlockchainService={mockCreateBlockchainService}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3">Compact Variant</h3>
        <TransactionStatus
          transactionHash={sampleHashes.pending}
          network="polygon"
          variant="compact"
          createBlockchainService={mockCreateBlockchainService}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3">Detailed Variant</h3>
        <TransactionStatus
          transactionHash={sampleHashes.pending}
          network="base"
          variant="detailed"
          createBlockchainService={mockCreateBlockchainService}
        />
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Small Size</h3>
        <TransactionStatus
          transactionHash={sampleHashes.pending}
          network="ethereum"
          size="sm"
          createBlockchainService={mockCreateBlockchainService}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3">Medium Size (Default)</h3>
        <TransactionStatus
          transactionHash={sampleHashes.pending}
          network="polygon"
          size="md"
          createBlockchainService={mockCreateBlockchainService}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3">Large Size</h3>
        <TransactionStatus
          transactionHash={sampleHashes.pending}
          network="base"
          size="lg"
          createBlockchainService={mockCreateBlockchainService}
        />
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

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Pending Status</h3>
        <TransactionStatus
          transactionHash={sampleHashes.pending}
          network="ethereum"
          autoRefresh={false}
          createBlockchainService={mockCreateBlockchainService}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3">Confirmed Status</h3>
        <TransactionStatus
          transactionHash={sampleHashes.confirmed}
          network="polygon"
          autoRefresh={false}
          createBlockchainService={mockCreateBlockchainService}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-3">Failed Status</h3>
        <TransactionStatus
          transactionHash={sampleHashes.failed}
          network="base"
          autoRefresh={false}
          createBlockchainService={mockCreateBlockchainService}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all transaction status states.',
      },
    },
  },
};

export const DifferentNetworks: Story = {
  render: () => (
    <div className="space-y-4">
      <TransactionStatus
        transactionHash={sampleHashes.pending}
        network="ethereum"
        createBlockchainService={mockCreateBlockchainService}
      />
      <TransactionStatus
        transactionHash={sampleHashes.pending}
        network="polygon"
        createBlockchainService={mockCreateBlockchainService}
      />
      <TransactionStatus
        transactionHash={sampleHashes.pending}
        network="base"
        createBlockchainService={mockCreateBlockchainService}
      />
      <TransactionStatus
        transactionHash={sampleHashes.pending}
        network="moonbeam"
        createBlockchainService={mockCreateBlockchainService}
      />
      <TransactionStatus
        transactionHash={sampleHashes.pending}
        network="solana"
        createBlockchainService={mockCreateBlockchainService}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Component displaying transactions from different blockchain networks.',
      },
    },
  },
};

export const LivePollingDemo: Story = {
  args: {
    transactionHash: sampleHashes.pending,
    network: 'ethereum',
    pollingInterval: 2000,
    maxPollingTime: 10000,
    createBlockchainService: mockCreateBlockchainService,
  },
  parameters: {
    docs: {
      description: {
        story: 'Live demo showing status transition from pending to confirmed after 2 seconds.',
      },
    },
  },
};
