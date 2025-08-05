import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from './Badge';
import { getNetworkColor, getSupportedWalletNetworks } from '@todo/services';

export interface NetworkSelectorProps {
  selectedNetwork: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base';
  onNetworkSelect: (network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => void;
  disabled?: boolean;
  variant?: 'grid' | 'list';
  showTestnets?: boolean;
  style?: any;
}

const NETWORK_INFO = {
  solana: {
    name: 'Solana',
    description: 'High-performance blockchain',
    icon: '◎',
  },
  polkadot: {
    name: 'Polkadot',
    description: 'Interoperable blockchain',
    icon: '●',
  },
  polygon: {
    name: 'Polygon',
    description: 'Ethereum scaling solution',
    icon: '⬟',
  },
  moonbeam: {
    name: 'Moonbeam',
    description: 'Ethereum on Polkadot',
    icon: '🌙',
  },
  base: {
    name: 'Base',
    description: 'Coinbase L2 solution',
    icon: '🔵',
  },
};

export function NetworkSelector({
  selectedNetwork,
  onNetworkSelect,
  disabled = false,
  variant = 'grid',
  style,
}: NetworkSelectorProps) {
  const supportedNetworks = getSupportedWalletNetworks();

  if (variant === 'list') {
    return (
      <View style={[styles.listContainer, style]}>
        {supportedNetworks.map((network) => {
          const isSelected = selectedNetwork === network;
          const networkInfo = NETWORK_INFO[network];
          const networkColor = getNetworkColor(network);
          
          return (
            <TouchableOpacity
              key={network}
              onPress={() => onNetworkSelect(network)}
              disabled={disabled}
              style={[
                styles.listItem,
                isSelected && { backgroundColor: networkColor + '20', borderColor: networkColor },
                disabled && styles.disabled,
              ]}
            >
              <View style={styles.listItemContent}>
                <Text style={styles.networkIcon}>{networkInfo.icon}</Text>
                <View style={styles.networkInfo}>
                  <Text style={[styles.networkName, isSelected && { color: networkColor }]}>
                    {networkInfo.name}
                  </Text>
                  <Text style={styles.networkDescription}>{networkInfo.description}</Text>
                </View>
                {isSelected && (
                  <Badge
                    variant="primary"
                    size="small"
                    text="✓"
                    style={[styles.selectedBadge, { backgroundColor: networkColor }]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.gridContainer}>
        {supportedNetworks.map((network) => {
          const isSelected = selectedNetwork === network;
          const networkInfo = NETWORK_INFO[network];
          const networkColor = getNetworkColor(network);
          
          return (
            <TouchableOpacity
              key={network}
              onPress={() => onNetworkSelect(network)}
              disabled={disabled}
              style={[
                styles.networkButton,
                isSelected && { backgroundColor: networkColor + '20', borderColor: networkColor },
                disabled && styles.disabled,
              ]}
            >
              <View style={styles.networkContent}>
                <Text style={styles.networkIcon}>{networkInfo.icon}</Text>
                <Text style={[styles.networkName, isSelected && { color: networkColor }]}>
                  {networkInfo.name}
                </Text>
                <Text style={styles.networkDescription}>{networkInfo.description}</Text>
              </View>
              
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Badge
                    variant="primary"
                    size="small"
                    text="✓"
                    style={[styles.selectedBadge, { backgroundColor: networkColor }]}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      
      <Text style={styles.helpText}>
        Select a blockchain network to connect your wallet
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  networkButton: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  networkContent: {
    alignItems: 'center',
  },
  networkIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  networkName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  networkDescription: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  selectedBadge: {
    minWidth: 20,
    height: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  // List variant styles
  listContainer: {
    // List container styles
  },
  listItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkInfo: {
    flex: 1,
    marginLeft: 12,
  },
});

export default NetworkSelector;