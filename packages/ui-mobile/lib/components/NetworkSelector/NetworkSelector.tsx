import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Select, SelectItem, Text, IndexPath } from '@ui-kitten/components';

export type NetworkType = 'polygon' | 'solana' | 'polkadot' | 'moonbeam' | 'base';

export interface NetworkSelectorProps {
  selectedNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
  supportedNetworks?: NetworkType[];
  disabled?: boolean;
  style?: any;
}

const NETWORK_OPTIONS: Record<NetworkType, { label: string; description: string }> = {
  polygon: { label: 'Polygon', description: 'Ethereum Layer 2' },
  solana: { label: 'Solana', description: 'High-performance blockchain' },
  polkadot: { label: 'Polkadot', description: 'Multi-chain protocol' },
  moonbeam: { label: 'Moonbeam', description: 'Ethereum on Polkadot' },
  base: { label: 'Base', description: 'Coinbase Layer 2' },
};

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  onNetworkChange,
  supportedNetworks = ['polygon', 'solana', 'polkadot', 'moonbeam', 'base'],
  disabled = false,
  style,
}) => {
  const selectedIndex = new IndexPath(supportedNetworks.indexOf(selectedNetwork));

  const handleSelect = (index: IndexPath | IndexPath[]) => {
    if (Array.isArray(index)) return;
    const networkIndex = index.row;
    const network = supportedNetworks[networkIndex];
    if (network) {
      onNetworkChange(network);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text category="label" style={styles.label}>
        Blockchain Network
      </Text>
      <Select
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        disabled={disabled}
        placeholder="Select Network"
        style={styles.select}
      >
        {supportedNetworks.map((network) => (
          <SelectItem
            key={network}
            title={NETWORK_OPTIONS[network].label}
          />
        ))}
      </Select>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  select: {
    backgroundColor: '#F7F9FC',
  },
});

export default NetworkSelector;