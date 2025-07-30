import React, { useState } from 'react';
import {
  View,
  Text,

  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Card, CardContent, Button, Badge } from '@todo/ui-mobile';
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
      <Card style={styles.container}>
        <CardContent>
          <View style={styles.header}>
            <Text style={styles.title}>Wallet Connected</Text>
            <Button
              variant="outline"
              size="small"
              title="Disconnect"
              onPress={handleDisconnect}
              disabled={isConnecting}
              style={styles.disconnectButton}
            />
          </View>

        <View style={styles.accountInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network:</Text>
            <View style={styles.networkContainer}>
              <Badge
                variant="primary"
                size="small"
                text={account.network}
                style={[
                  styles.networkBadge,
                  { backgroundColor: getNetworkColor(account.network) },
                ]}
              />
              <Button
                variant="outline"
                size="small"
                title="Switch"
                onPress={() => setShowNetworkSelector(!showNetworkSelector)}
                disabled={isConnecting}
                style={styles.switchButton}
              />
            </View>
          </View>

          {showNetworkSelector && (
            <View style={styles.networkSelector}>
              <Text style={styles.selectorTitle}>Select Network:</Text>
              <View style={styles.networkOptions}>
                {supportedNetworks.map((network) => (
                  <Button
                    key={network}
                    variant="primary"
                    size="small"
                    title={network}
                    onPress={() => handleNetworkSwitch(network)}
                    disabled={isConnecting || network === account.network}
                    style={{
                      ...styles.networkOption,
                      backgroundColor: getNetworkColor(network),
                      ...(network === account.network || isConnecting ? styles.networkOptionDisabled : {}),
                    }}
                  />
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <CardContent>
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
              <Button
                key={network}
                variant={selectedNetwork === network ? "primary" : "outline"}
                size="small"
                title={network}
                onPress={() => setSelectedNetwork(network)}
                style={{
                  ...styles.networkOption,
                  ...(selectedNetwork === network ? { backgroundColor: getNetworkColor(network) } : {}),
                }}
              />
            ))}
          </View>

          <Button
            variant="primary"
            size="large"
            title={isConnecting ? "Connecting..." : `Connect to ${selectedNetwork}`}
            onPress={handleConnect}
            disabled={isConnecting}
            loading={isConnecting}
            style={styles.connectButton}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>• This is a demo implementation</Text>
            <Text style={styles.infoText}>• Real wallet integration will be added in production</Text>
            <Text style={styles.infoText}>• Supports Solana, Polkadot, and Polygon networks</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    // Custom styling can be added here if needed
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
    // Custom styling can be added here if needed
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
    marginRight: 8,
  },
  switchButton: {
    // Custom styling can be added here if needed
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
    minWidth: 80,
  },
  networkOptionDisabled: {
    opacity: 0.5,
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
    marginTop: 16,
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