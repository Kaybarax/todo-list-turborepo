import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useWallet } from '../providers/WalletProvider';

export function WalletConnect() {
  const {
    isConnected,
    isConnecting,
    account,
    error,
    supportedNetworks,
    connect,
    disconnect,
    switchNetwork,
  } = useWallet();

  const [selectedNetwork, setSelectedNetwork] = useState<'solana' | 'polkadot' | 'polygon'>('solana');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  const handleConnect = async () => {
    try {
      await connect(selectedNetwork);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnect();
            } catch (err) {
              console.error('Disconnection failed:', err);
            }
          }
        },
      ]
    );
  };

  const handleNetworkSwitch = async (network: 'solana' | 'polkadot' | 'polygon') => {
    try {
      await switchNetwork(network);
      setShowNetworkSelector(false);
    } catch (err) {
      console.error('Network switch failed:', err);
    }
  };

  const getNetworkColor = (network: string) => {
    const colors = {
      solana: '#9333ea',
      polkadot: '#ec4899',
      polygon: '#6366f1',
    };
    return colors[network as keyof typeof colors] || '#6b7280';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet Connected</Text>
          <TouchableOpacity
            onPress={handleDisconnect}
            disabled={isConnecting}
            style={styles.disconnectButton}
          >
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accountInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network:</Text>
            <View style={styles.networkContainer}>
              <View
                style={[
                  styles.networkBadge,
                  { backgroundColor: getNetworkColor(account.network) },
                ]}
              >
                <Text style={styles.networkText}>{account.network}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNetworkSelector(!showNetworkSelector)}
                disabled={isConnecting}
                style={styles.switchButton}
              >
                <Text style={styles.switchButtonText}>Switch</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showNetworkSelector && (
            <View style={styles.networkSelector}>
              <Text style={styles.selectorTitle}>Select Network:</Text>
              <View style={styles.networkOptions}>
                {supportedNetworks.map((network) => (
                  <TouchableOpacity
                    key={network}
                    onPress={() => handleNetworkSwitch(network)}
                    disabled={isConnecting || network === account.network}
                    style={[
                      styles.networkOption,
                      { backgroundColor: getNetworkColor(network) },
                      (network === account.network || isConnecting) && styles.networkOptionDisabled,
                    ]}
                  >
                    <Text style={styles.networkOptionText}>{network}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.addressText}>{formatAddress(account.address)}</Text>
          </View>

          {account.balance && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Balance:</Text>
              <Text style={styles.balanceText}>{account.balance} ETH</Text>
            </View>
          )}
        </View>

        {isConnecting && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Wallet</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.connectSection}>
        <Text style={styles.sectionTitle}>Select Network:</Text>
        <View style={styles.networkOptions}>
          {supportedNetworks.map((network) => (
            <TouchableOpacity
              key={network}
              onPress={() => setSelectedNetwork(network)}
              style={[
                styles.networkOption,
                { backgroundColor: getNetworkColor(network) },
                selectedNetwork === network && styles.networkOptionSelected,
              ]}
            >
              <Text style={styles.networkOptionText}>{network}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleConnect}
          disabled={isConnecting}
          style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
        >
          {isConnecting ? (
            <View style={styles.connectingContainer}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.connectButtonText}>Connecting...</Text>
            </View>
          ) : (
            <Text style={styles.connectButtonText}>
              Connect to {selectedNetwork}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>• This is a demo implementation</Text>
          <Text style={styles.infoText}>• Real wallet integration will be added in production</Text>
          <Text style={styles.infoText}>• Supports Solana, Polkadot, and Polygon networks</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  disconnectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  disconnectButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  accountInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  networkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  networkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  switchButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
  switchButtonText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '500',
  },
  networkSelector: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  networkOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  networkOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  networkOptionSelected: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  networkOptionDisabled: {
    opacity: 0.5,
  },
  networkOptionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  connectSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  connectButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  connectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
});