import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Mock NetworkSelector for Storybook (web-compatible)
interface NetworkSelectorProps {
  selectedNetwork: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base';
  onNetworkSelect: (network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => void;
  disabled?: boolean;
  variant?: 'grid' | 'list';
  showTestnets?: boolean;
  style?: any;
  testID?: string;
}

const NETWORK_INFO = {
  solana: { name: 'Solana', description: 'High-performance blockchain', icon: '◎', color: '#9333ea' },
  polkadot: { name: 'Polkadot', description: 'Interoperable blockchain', icon: '●', color: '#ec4899' },
  polygon: { name: 'Polygon', description: 'Ethereum scaling solution', icon: '⬟', color: '#6366f1' },
  moonbeam: { name: 'Moonbeam', description: 'Ethereum on Polkadot', icon: '🌙', color: '#14b8a6' },
  base: { name: 'Base', description: 'Coinbase L2 solution', icon: '🔵', color: '#3b82f6' },
};

const MockNetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  onNetworkSelect,
  disabled = false,
  variant = 'grid',
}) => {
  const supportedNetworks: ('solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base')[] = [
    'solana',
    'polkadot',
    'polygon',
    'moonbeam',
    'base',
  ];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: variant === 'grid' ? 'row' : 'column',
    flexWrap: variant === 'grid' ? 'wrap' : 'nowrap',
    gap: '12px',
    maxWidth: '600px',
  };

  const itemStyle = (network: string): React.CSSProperties => {
    const isSelected = selectedNetwork === network;
    const networkInfo = NETWORK_INFO[network as keyof typeof NETWORK_INFO];

    return {
      display: 'flex',
      flexDirection: variant === 'grid' ? 'column' : 'row',
      alignItems: 'center',
      padding: '16px',
      border: `2px solid ${isSelected ? networkInfo.color : '#e5e7eb'}`,
      borderRadius: '12px',
      backgroundColor: isSelected ? `${networkInfo.color}20` : '#ffffff',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      flex: variant === 'grid' ? '1 1 45%' : 'none',
      minWidth: variant === 'grid' ? '150px' : 'auto',
      position: 'relative',
      transition: 'all 0.2s ease',
    };
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={containerStyle}>
        {supportedNetworks.map(network => {
          const isSelected = selectedNetwork === network;
          const networkInfo = NETWORK_INFO[network];

          return (
            <div key={network} style={itemStyle(network)} onClick={() => !disabled && onNetworkSelect(network)}>
              <div
                style={{
                  fontSize: '24px',
                  marginBottom: variant === 'grid' ? '8px' : '0',
                  marginRight: variant === 'list' ? '12px' : '0',
                }}
              >
                {networkInfo.icon}
              </div>
              <div
                style={{
                  textAlign: variant === 'grid' ? 'center' : 'left',
                  flex: variant === 'list' ? 1 : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isSelected ? networkInfo.color : '#1f2937',
                    marginBottom: '4px',
                  }}
                >
                  {networkInfo.name}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    lineHeight: '14px',
                  }}
                >
                  {networkInfo.description}
                </div>
              </div>
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: networkInfo.color,
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
      {variant === 'grid' && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '12px',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          Select a blockchain network to connect your wallet
        </div>
      )}
    </div>
  );
};

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '16px', backgroundColor: '#f9fafb', minHeight: '400px' }}>{children}</div>
);

const meta: Meta<typeof MockNetworkSelector> = {
  title: 'Components/NetworkSelector',
  component: MockNetworkSelector,
  decorators: [
    Story => (
      <TestWrapper>
        <Story />
      </TestWrapper>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'NetworkSelector allows users to choose between different blockchain networks. Supports both grid and list variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedNetwork: {
      control: { type: 'select' },
      options: ['solana', 'polkadot', 'polygon', 'moonbeam', 'base'],
      description: 'Currently selected blockchain network',
      table: {
        type: { summary: 'solana | polkadot | polygon | moonbeam | base' },
        defaultValue: { summary: 'solana' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['grid', 'list'],
      description: 'Display variant for the network selector',
      table: {
        type: { summary: 'grid | list' },
        defaultValue: { summary: 'grid' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the selector is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showTestnets: {
      control: { type: 'boolean' },
      description: 'Whether to show testnet options',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onNetworkSelect: {
      action: 'network-selected',
      description: 'Callback fired when a network is selected',
      table: {
        type: { summary: '(network: NetworkType) => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    selectedNetwork: 'solana',
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

// Grid variant (default)
export const GridVariant: Story = {
  args: {
    selectedNetwork: 'polkadot',
    variant: 'grid',
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

// List variant
export const ListVariant: Story = {
  args: {
    selectedNetwork: 'polygon',
    variant: 'list',
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    selectedNetwork: 'moonbeam',
    disabled: true,
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

// Different selected networks
export const SolanaSelected: Story = {
  args: {
    selectedNetwork: 'solana',
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

export const PolkadotSelected: Story = {
  args: {
    selectedNetwork: 'polkadot',
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

export const PolygonSelected: Story = {
  args: {
    selectedNetwork: 'polygon',
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

export const MoonbeamSelected: Story = {
  args: {
    selectedNetwork: 'moonbeam',
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

export const BaseSelected: Story = {
  args: {
    selectedNetwork: 'base',
    onNetworkSelect: network => console.log('Selected network:', network),
  },
};

// Interactive demo
export const Interactive: Story = {
  render: () => {
    const [selectedNetwork, setSelectedNetwork] = React.useState<
      'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base'
    >('solana');
    const [variant, setVariant] = React.useState<'grid' | 'list'>('grid');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginBottom: '16px' }}>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: variant === 'grid' ? '#007AFF' : '#F2F2F7',
              color: variant === 'grid' ? 'white' : 'black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={() => setVariant('grid')}
          >
            Grid
          </button>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: variant === 'list' ? '#007AFF' : '#F2F2F7',
              color: variant === 'list' ? 'white' : 'black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={() => setVariant('list')}
          >
            List
          </button>
        </div>
        <MockNetworkSelector selectedNetwork={selectedNetwork} variant={variant} onNetworkSelect={setSelectedNetwork} />
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#F7F9FC', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            Selected: {selectedNetwork} | Variant: {variant}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing both grid and list variants with real-time selection updates.',
      },
    },
  },
};

// Comparison story
export const VariantComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Grid Variant</div>
        <MockNetworkSelector
          selectedNetwork="solana"
          variant="grid"
          onNetworkSelect={network => console.log('Grid selected:', network)}
        />
      </div>
      <div>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>List Variant</div>
        <MockNetworkSelector
          selectedNetwork="polkadot"
          variant="list"
          onNetworkSelect={network => console.log('List selected:', network)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of grid and list variants.',
      },
    },
  },
};
