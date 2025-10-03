import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, CardContent, NetworkSelector, type NetworkType } from '@todo/ui-mobile';
import { ErrorBanner } from '../src/components/ErrorBanner';
import { Snackbar } from '../src/components/Snackbar';
import { useWallet } from '../src/providers/WalletProvider';
import { useDesignTokens } from '../src/hooks/useDesignTokens';

export default function Wallet() {
  const {
    isConnected,
    isConnecting,
    account,
    connect,
    disconnect,
    switchNetwork,
    supportedNetworks,
    signMessage,
    sendTransaction,
    error,
  } = useWallet();
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  const [snack, setSnack] = useState<{ visible: boolean; msg: string; variant: 'success' | 'error' | 'info' }>({
    visible: false,
    msg: '',
    variant: 'info',
  });

  const handleNetworkSelect = async (network: NetworkType) => {
    try {
      if (isConnected) {
        await switchNetwork(network);
        setSnack({ visible: true, msg: `Switched to ${network}`, variant: 'success' });
      } else {
        await connect(network);
        setSnack({ visible: true, msg: `Connected to ${network}`, variant: 'success' });
      }
    } catch (error) {
      setSnack({ visible: true, msg: 'Failed to change network', variant: 'error' });
    }
  };

  const handleSignMessage = async () => {
    try {
      const message = 'Hello from Todo App Mobile!';
      const signature = await signMessage(message);
      Alert.alert('Message Signed', `Signature: ${signature.slice(0, 20)}...`, [{ text: 'OK' }]);
    } catch (error) {
      if (error instanceof Error && error.message !== 'User cancelled signing') {
        Alert.alert('Error', 'Failed to sign message: ' + error.message);
      }
    }
  };

  const handleSendTransaction = async () => {
    try {
      const txHash = await sendTransaction(
        '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Df8',
        '0.001',
        'Todo app mobile transaction',
      );
      Alert.alert('Transaction Sent', `Hash: ${txHash.slice(0, 20)}...`, [{ text: 'OK' }]);
    } catch (error) {
      if (error instanceof Error && error.message !== 'User cancelled transaction') {
        Alert.alert('Error', 'Failed to send transaction: ' + error.message);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {error ? <ErrorBanner message={error} /> : null}
        <Text testID="wallet-title" style={[styles.pageTitle, { color: tokens.colors.text.primary }]}>
          Wallet Connection
        </Text>
        <View style={styles.subtitleContainer}>
          <Text style={[styles.pageSubtitle, { color: tokens.colors.text.secondary }]}>
            Connect your wallet to enable blockchain features for your todos.
          </Text>
        </View>

        {/* Wallet Info Section */}
        {isConnected && account ? (
          <Card style={styles.walletInfoCard}>
            <CardContent>
              <View style={styles.walletHeader}>
                <Text style={[styles.walletTitle, { color: tokens.colors.text.primary }]}>Connected Wallet</Text>
                <Button variant="outline" size="sm" onPress={disconnect} disabled={isConnecting}>
                  Disconnect
                </Button>
              </View>

              <View style={styles.walletDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: tokens.colors.text.secondary }]}>Network</Text>
                  <Text style={[styles.detailValue, { color: tokens.colors.text.primary }]}>{account.network}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: tokens.colors.text.secondary }]}>Address</Text>
                  <Text
                    style={[styles.detailValue, { color: tokens.colors.text.primary }]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {account.address}
                  </Text>
                </View>

                {account.balance && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: tokens.colors.text.secondary }]}>Balance</Text>
                    <Text style={[styles.detailValue, { color: tokens.colors.text.primary }]}>{account.balance}</Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        ) : null}

        {/* Network Selector */}
        <Card style={styles.networkSelectorCard}>
          <CardContent>
            <Text style={[styles.sectionTitle, { color: tokens.colors.text.primary }]}>
              {isConnected ? 'Switch Network' : 'Select Network to Connect'}
            </Text>
            <NetworkSelector
              selectedNetwork={(account?.network as any) || 'solana'}
              onNetworkSelect={handleNetworkSelect}
              disabled={isConnecting}
              variant="grid"
            />
          </CardContent>
        </Card>

        {isConnected && account ? (
          <Card style={styles.actionsContainer}>
            <CardContent>
              <Text style={[styles.actionsTitle, { color: tokens.colors.text.primary }]}>Wallet Actions</Text>

              <Button
                variant="outline"
                size="lg"
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    await handleSignMessage();
                    setSnack({ visible: true, msg: 'Message signed', variant: 'success' });
                  } catch {
                    setSnack({ visible: true, msg: 'Failed to sign', variant: 'error' });
                  }
                }}
              >
                Sign Message
              </Button>

              <Button
                variant="primary"
                size="lg"
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    await handleSendTransaction();
                    setSnack({ visible: true, msg: 'Transaction sent', variant: 'success' });
                  } catch {
                    setSnack({ visible: true, msg: 'Failed to send transaction', variant: 'error' });
                  }
                }}
              >
                Send Test Transaction
              </Button>

              <View
                style={[
                  styles.featuresContainer,
                  { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border.default },
                ]}
              >
                <Text style={[styles.featuresTitle, { color: tokens.colors.text.primary }]}>Blockchain Features</Text>
                <View style={styles.featuresList}>
                  <Text style={[styles.featureItem, { color: tokens.colors.text.secondary }]}>
                    • Store todos on blockchain networks
                  </Text>
                  <Text style={[styles.featureItem, { color: tokens.colors.text.secondary }]}>
                    • Immutable and decentralized storage
                  </Text>
                  <Text style={[styles.featureItem, { color: tokens.colors.text.secondary }]}>
                    • Cross-network compatibility
                  </Text>
                  <Text style={[styles.featureItem, { color: tokens.colors.text.secondary }]}>
                    • Cryptographic verification
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        ) : null}
        <Snackbar
          visible={snack.visible}
          message={snack.msg}
          variant={snack.variant}
          onHide={() => setSnack(s => ({ ...s, visible: false }))}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },
    pageTitle: {
      fontSize: tokens.typography.fontSize.xxxl,
      fontWeight: 'bold',
      color: tokens.colors.text.primary,
      marginBottom: tokens.spacing.xs,
    },
    subtitleContainer: {
      width: '100%',
      marginBottom: tokens.spacing.lg,
    },
    pageSubtitle: {
      fontSize: tokens.typography.fontSize.md,
      color: tokens.colors.text.secondary,
      lineHeight: 22,
    },
    walletInfoCard: {
      marginBottom: tokens.spacing.md,
    },
    walletHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.md,
    },
    walletTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
    },
    walletDetails: {
      gap: tokens.spacing.sm,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: tokens.spacing.xs,
    },
    detailLabel: {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: '500',
      flex: 0,
      minWidth: 80,
    },
    detailValue: {
      fontSize: tokens.typography.fontSize.sm,
      flex: 1,
      textAlign: 'right',
    },
    networkSelectorCard: {
      marginBottom: tokens.spacing.md,
    },
    sectionTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      marginBottom: tokens.spacing.md,
    },
    actionsContainer: {
      marginBottom: tokens.spacing.md,
    },
    actionsTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      color: tokens.colors.text.primary,
      marginBottom: tokens.spacing.md,
    },
    actionButton: {
      marginBottom: tokens.spacing.sm,
    },
    featuresContainer: {
      marginTop: tokens.spacing.md,
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: tokens.colors.border.default,
    },
    featuresTitle: {
      fontSize: tokens.typography.fontSize.md,
      fontWeight: '600',
      color: tokens.colors.text.primary,
      marginBottom: tokens.spacing.sm,
      lineHeight: 20,
    },
    featuresList: {
      marginLeft: tokens.spacing.xs,
      marginTop: tokens.spacing.xs,
    },
    featureItem: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.text.secondary,
      marginBottom: tokens.spacing.sm,
      lineHeight: 20,
    },
  });
