import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import { NetworkSelector } from '../../lib/components/NetworkSelector';

// Test wrapper with UI Kitten provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <View style={{ padding: 16 }}>{children}</View>
  </ApplicationProvider>
);

const meta: Meta<typeof NetworkSelector> = {
  title: 'Components/NetworkSelector',
  component: NetworkSelector,
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
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setVariant('grid')}
            style={{
              padding: '8px 16px',
              backgroundColor: variant === 'grid' ? '#007AFF' : '#F2F2F7',
              color: variant === 'grid' ? 'white' : 'black',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Grid
          </button>
          <button
            onClick={() => setVariant('list')}
            style={{
              padding: '8px 16px',
              backgroundColor: variant === 'list' ? '#007AFF' : '#F2F2F7',
              color: variant === 'list' ? 'white' : 'black',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            List
          </button>
        </View>
        <NetworkSelector selectedNetwork={selectedNetwork} variant={variant} onNetworkSelect={setSelectedNetwork} />
        <View style={{ marginTop: 16, padding: 12, backgroundColor: '#F7F9FC', borderRadius: 8 }}>
          <text style={{ fontSize: 14, fontWeight: '600' }}>
            Selected: {selectedNetwork} | Variant: {variant}
          </text>
        </View>
      </View>
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
    <View style={{ gap: 24 }}>
      <View>
        <text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Grid Variant</text>
        <NetworkSelector
          selectedNetwork="solana"
          variant="grid"
          onNetworkSelect={network => console.log('Grid selected:', network)}
        />
      </View>
      <View>
        <text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>List Variant</text>
        <NetworkSelector
          selectedNetwork="polkadot"
          variant="list"
          onNetworkSelect={network => console.log('List selected:', network)}
        />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of grid and list variants.',
      },
    },
  },
};
