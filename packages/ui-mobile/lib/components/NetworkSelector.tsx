import { getNetworkColor, getSupportedWalletNetworks } from '@todo/services';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Badge } from './Badge';

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
        {supportedNetworks.map(network => {
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
                  <Text style={[styles.networkName, isSelected && { color: networkColor }]}>{networkInfo.name}</Text>
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
        {supportedNetworks.map(network => {
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
                <Text style={[styles.networkName, isSelected && { color: networkColor }]}>{networkInfo.name}</Text>
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

      <Text style={styles.helpText}>Select a blockchain network to connect your wallet</Text>
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
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 12,
    borderWidth: 2,
    flex: 1,
    maxWidth: '48%',
    minWidth: '45%',
    padding: 16,
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
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  networkDescription: {
    color: '#6b7280',
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    right: -4,
    top: -4,
  },
  selectedBadge: {
    height: 20,
    minWidth: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  helpText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  // List variant styles
  listContainer: {
    // List container styles
  },
  listItem: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    padding: 12,
  },
  listItemContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  networkInfo: {
    flex: 1,
    marginLeft: 12,
  },
});

export default NetworkSelector;
