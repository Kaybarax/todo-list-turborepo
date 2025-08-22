import { type Meta, type StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { WalletConnect, type WalletAccount } from '../components/blockchain/WalletConnect/WalletConnect';

const sampleAccount: WalletAccount = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  network: 'polygon',
  balance: '1.5 MATIC',
};

const ethereumAccount: WalletAccount = {
  address: '0xabcdef1234567890abcdef1234567890abcdef12',
  network: 'ethereum',
  balance: '0.25 ETH',
};

const solanaAccount: WalletAccount = {
  address: 'DjVE6JNiYqPL2QXyCUUh8rNjHrbz6hXHNwkTtcxjQ8VE',
  network: 'solana',
  balance: '12.5 SOL',
};

const accountWithoutBalance: WalletAccount = {
  address: '0x9876543210fedcba9876543210fedcba98765432',
  network: 'polygon',
};

const meta: Meta<typeof WalletConnect> = {
  title: 'Blockchain/WalletConnect',
  component: WalletConnect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible wallet connection component supporting multiple networks with customizable display options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'button-only'],
      description: 'The visual variant of the wallet connect component',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the component text',
    },
    showBalance: {
      control: 'boolean',
      description: 'Whether to show wallet balance',
    },
    showNetworkSelector: {
      control: 'boolean',
      description: 'Whether to show network selector',
    },
    supportedNetworks: {
      control: 'object',
      description: 'Array of supported blockchain networks',
    },
    connectedAccount: {
      control: 'object',
      description: 'Currently connected wallet account',
    },
    onConnect: {
      action: 'connected',
      description: 'Function called when wallet is connected',
    },
    onDisconnect: {
      action: 'disconnected',
      description: 'Function called when wallet is disconnected',
    },
    onNetworkSwitch: {
      action: 'network-switched',
      description: 'Function called when network is switched',
    },
  },
};

export default meta;
type Story = StoryObj<typeof WalletConnect>;

export const Disconnected: Story = {
  args: {
    connectedAccount: null,
    variant: 'default',
    size: 'md',
    showBalance: true,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum', 'solana'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const ConnectedPolygon: Story = {
  args: {
    connectedAccount: sampleAccount,
    variant: 'default',
    size: 'md',
    showBalance: true,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum', 'solana'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const ConnectedEthereum: Story = {
  args: {
    connectedAccount: ethereumAccount,
    variant: 'default',
    size: 'md',
    showBalance: true,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum', 'solana'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const ConnectedSolana: Story = {
  args: {
    connectedAccount: solanaAccount,
    variant: 'default',
    size: 'md',
    showBalance: true,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum', 'solana'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const Compact: Story = {
  args: {
    connectedAccount: sampleAccount,
    variant: 'compact',
    size: 'md',
    showBalance: true,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const ButtonOnly: Story = {
  args: {
    connectedAccount: null,
    variant: 'button-only',
    size: 'md',
    showBalance: false,
    showNetworkSelector: false,
    supportedNetworks: ['polygon'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const Small: Story = {
  args: {
    connectedAccount: sampleAccount,
    variant: 'default',
    size: 'sm',
    showBalance: true,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const Large: Story = {
  args: {
    connectedAccount: sampleAccount,
    variant: 'default',
    size: 'lg',
    showBalance: true,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum', 'solana'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const NoBalance: Story = {
  args: {
    connectedAccount: accountWithoutBalance,
    variant: 'default',
    size: 'md',
    showBalance: true,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const HideBalance: Story = {
  args: {
    connectedAccount: sampleAccount,
    variant: 'default',
    size: 'md',
    showBalance: false,
    showNetworkSelector: true,
    supportedNetworks: ['polygon', 'ethereum'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const HideNetworkSelector: Story = {
  args: {
    connectedAccount: sampleAccount,
    variant: 'default',
    size: 'md',
    showBalance: true,
    showNetworkSelector: false,
    supportedNetworks: ['polygon'],
    onConnect: action('onConnect'),
    onDisconnect: action('onDisconnect'),
    onNetworkSwitch: action('onNetworkSwitch'),
  },
};

export const MultipleWallets: Story = {
  render: () => (
    <div className="space-y-4">
      <WalletConnect
        connectedAccount={sampleAccount}
        onConnect={action('onConnect')}
        onDisconnect={action('onDisconnect')}
        onNetworkSwitch={action('onNetworkSwitch')}
      />
      <WalletConnect
        connectedAccount={ethereumAccount}
        onConnect={action('onConnect')}
        onDisconnect={action('onDisconnect')}
        onNetworkSwitch={action('onNetworkSwitch')}
      />
      <WalletConnect
        connectedAccount={null}
        onConnect={action('onConnect')}
        onDisconnect={action('onDisconnect')}
        onNetworkSwitch={action('onNetworkSwitch')}
      />
    </div>
  ),
};
