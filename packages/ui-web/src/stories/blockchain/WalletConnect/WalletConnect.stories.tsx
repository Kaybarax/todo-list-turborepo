import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  WalletConnect,
  type WalletConnectProps,
  type WalletAccount,
} from '../../../../lib/components/blockchain/WalletConnect/WalletConnect';
import type { BlockchainNetwork } from '@todo/services';

const meta: Meta<typeof WalletConnect> = {
  title: 'Blockchain/WalletConnect',
  component: WalletConnect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A flexible wallet connection component that supports multiple blockchain networks and display variants.

## Features
- **Multi-Network Support**: Solana, Polkadot, Polygon, Moonbeam, and Base
- **Multiple Variants**: Default, compact, and button-only layouts
- **Real-time Balance**: Display wallet balance when connected
- **Network Switching**: Easy network selection and switching
- **Connection States**: Loading, connected, error, and disconnected states
- **Responsive Design**: Adapts to different screen sizes

## Usage Guidelines
- Use the **default** variant for main wallet connection areas
- Use the **compact** variant for navigation bars and headers
- Use the **button-only** variant for minimal space requirements
- Enable **showBalance** for financial applications
- Use **showNetworkSelector** when supporting multiple networks
- Handle connection errors gracefully with user feedback

## Accessibility
- Keyboard navigation support
- Screen reader announcements for connection state changes
- Focus management during network switching
- Clear visual indicators for connection status
- Semantic HTML with proper ARIA attributes`,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'button-only'],
      description: 'Visual variant of the component',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    showBalance: {
      control: { type: 'boolean' },
      description: 'Whether to show wallet balance when connected',
    },
    showNetworkSelector: {
      control: { type: 'boolean' },
      description: 'Whether to show network selector',
    },
    showHash: {
      control: { type: 'boolean' },
      description: 'Whether to show full address hash or truncated version',
    },
    isConnected: {
      control: { type: 'boolean' },
      description: 'Connection state',
    },
    isConnecting: {
      control: { type: 'boolean' },
      description: 'Loading state during connection',
    },
  },
  args: {
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export default meta;
type Story = StoryObj<typeof WalletConnect>;

const mockAccount = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  network: 'polygon' as BlockchainNetwork,
  balance: '1.2345',
  chainId: '137',
};

const supportedNetworks: BlockchainNetwork[] = [
  'solana' as BlockchainNetwork,
  'polkadot' as BlockchainNetwork,
  'polygon' as BlockchainNetwork,
  'moonbeam' as BlockchainNetwork,
  'base' as BlockchainNetwork,
];

// Default disconnected state
export const Default: Story = {
  args: {
    supportedNetworks,
    showBalance: true,
    showNetworkSelector: true,
    isConnected: false,
    isConnecting: false,
  },
};

// Connected state
export const Connected: Story = {
  args: {
    ...Default.args,
    isConnected: true,
    account: mockAccount,
  },
};

// Connecting state
export const Connecting: Story = {
  args: {
    ...Default.args,
    isConnecting: true,
  },
};

// Connected and switching network
export const ConnectedSwitching: Story = {
  args: {
    ...Connected.args,
    isConnecting: true,
  },
};

// Error state
export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Failed to connect to wallet. Please try again.',
  },
};

// Compact variant
export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
  },
};

// Compact connected
export const CompactConnected: Story = {
  args: {
    ...Connected.args,
    variant: 'compact',
  },
};

// Button-only variant
export const ButtonOnly: Story = {
  args: {
    ...Default.args,
    variant: 'button-only',
  },
};

// Button-only connected
export const ButtonOnlyConnected: Story = {
  args: {
    ...Connected.args,
    variant: 'button-only',
  },
};

// Small size
export const SmallSize: Story = {
  args: {
    ...Connected.args,
    size: 'sm',
  },
};

// Large size
export const LargeSize: Story = {
  args: {
    ...Connected.args,
    size: 'lg',
  },
};

// Without balance display
export const WithoutBalance: Story = {
  args: {
    ...Connected.args,
    showBalance: false,
  },
};

// Without network selector
export const WithoutNetworkSelector: Story = {
  args: {
    ...Connected.args,
    showNetworkSelector: false,
  },
};

// Show full hash
export const ShowFullHash: Story = {
  args: {
    ...Connected.args,
    showHash: true,
  },
};

// Different networks
export const SolanaNetwork: Story = {
  args: {
    ...Connected.args,
    account: {
      ...mockAccount,
      network: 'solana' as BlockchainNetwork,
      address: 'DjVE6JNiYqPL2QXyCUUh8rNjHrbz6h4dRqS5d4kkjd32',
    },
  },
};

export const PolkadotNetwork: Story = {
  args: {
    ...Connected.args,
    account: {
      ...mockAccount,
      network: 'polkadot' as BlockchainNetwork,
      address: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg',
    },
  },
};

export const MoonbeamNetwork: Story = {
  args: {
    ...Connected.args,
    account: {
      ...mockAccount,
      network: 'moonbeam' as BlockchainNetwork,
      address: '0x9876543210fedcba9876543210fedcba98765432',
    },
  },
};

export const BaseNetwork: Story = {
  args: {
    ...Connected.args,
    account: {
      ...mockAccount,
      network: 'base' as BlockchainNetwork,
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
    },
  },
};

// Limited networks
export const LimitedNetworks: Story = {
  args: {
    ...Default.args,
    supportedNetworks: ['polygon' as BlockchainNetwork, 'base' as BlockchainNetwork],
  },
};

// Single network
export const SingleNetwork: Story = {
  args: {
    ...Default.args,
    supportedNetworks: ['polygon' as BlockchainNetwork],
    showNetworkSelector: false,
  },
};

// Interactive demo
export const InteractiveDemo: Story = {
  args: {
    ...Default.args,
  },
  render: args => {
    const [isConnected, setIsConnected] = React.useState(false);
    const [isConnecting, setIsConnecting] = React.useState(false);
    const [account, setAccount] = React.useState<WalletAccount | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleConnect = async (newAccount: WalletAccount) => {
      setIsConnecting(true);
      setError(null);

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setAccount(newAccount);
      setIsConnected(true);
      setIsConnecting(false);
      action('onConnect')(newAccount);
    };

    const handleDisconnect = async () => {
      setIsConnecting(true);

      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAccount(null);
      setIsConnected(false);
      setIsConnecting(false);
      action('onDisconnect')();
    };

    const handleNetworkSwitch = async (network: BlockchainNetwork) => {
      setIsConnecting(true);

      // Simulate network switch delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (account) {
        const updatedAccount = {
          ...account,
          network,
          address:
            network === 'solana'
              ? 'DjVE6JNiYqPL2QXyCUUh8rNjHrbz6h4dRqS5d4kkjd32'
              : '0x' + Math.random().toString(16).substring(2, 42),
        };
        setAccount(updatedAccount);
      }

      setIsConnecting(false);
      action('onNetworkSwitch')(network);
    };

    return (
      <WalletConnect
        {...args}
        isConnected={isConnected}
        isConnecting={isConnecting}
        account={account}
        error={error}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onNetworkSwitch={handleNetworkSwitch}
      />
    );
  },
};
