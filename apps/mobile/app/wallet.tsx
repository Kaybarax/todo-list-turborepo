import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { WalletConnect } from '../src/components/WalletConnect';
import { ErrorBanner } from '../src/components/ErrorBanner';
import { Snackbar } from '../src/components/Snackbar';
import { useWallet } from '../src/providers/WalletProvider';
import { useDesignTokens } from '../src/hooks/useDesignTokens';

export default function Wallet() {
  const { isConnected, account, signMessage, sendTransaction, error } = useWallet();
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  const [snack, setSnack] = useState<{ visible: boolean; msg: string; variant: 'success' | 'error' | 'info' }>({
    visible: false,
    msg: '',
    variant: 'info',
  });

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
        <Text style={[styles.pageSubtitle, { color: tokens.colors.text.secondary }]}>
          Connect your wallet to enable blockchain features for your todos.
        </Text>

        <WalletConnect />

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
        ) : (
          <Card
            style={[
              styles.disconnectedContainer,
              { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border.default },
            ]}
          >
            <CardContent>
              <Text style={[styles.disconnectedTitle, { color: tokens.colors.text.primary }]}>No wallet connected</Text>
              <Text style={[styles.disconnectedSubtitle, { color: tokens.colors.text.secondary }]}>
                Connect your wallet to access blockchain features.
              </Text>
            </CardContent>
          </Card>
        )}

        <Card style={styles.networksContainer}>
          <CardContent>
            <Text style={[styles.networksTitle, { color: tokens.colors.text.primary }]}>Supported Networks</Text>

            <View style={styles.networksList}>
              <View style={styles.networkItem}>
                <View style={[styles.networkDot, { backgroundColor: '#9333ea' }]} />
                <View style={styles.networkInfo}>
                  <Text style={[styles.networkName, { color: tokens.colors.text.primary }]}>Solana</Text>
                  <Text style={[styles.networkDescription, { color: tokens.colors.text.secondary }]}>
                    Fast and low-cost transactions
                  </Text>
                </View>
              </View>

              <View style={styles.networkItem}>
                <View style={[styles.networkDot, { backgroundColor: '#ec4899' }]} />
                <View style={styles.networkInfo}>
                  <Text style={[styles.networkName, { color: tokens.colors.text.primary }]}>Polkadot</Text>
                  <Text style={[styles.networkDescription, { color: tokens.colors.text.secondary }]}>
                    Interoperable blockchain network
                  </Text>
                </View>
              </View>

              <View style={styles.networkItem}>
                <View style={[styles.networkDot, { backgroundColor: '#6366f1' }]} />
                <View style={styles.networkInfo}>
                  <Text style={[styles.networkName, { color: tokens.colors.text.primary }]}>Polygon</Text>
                  <Text style={[styles.networkDescription, { color: tokens.colors.text.secondary }]}>
                    Ethereum-compatible scaling solution
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
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
      padding: 20,
    },
    pageTitle: {
      fontSize: tokens.typography.fontSize.xxxl,
      fontWeight: 'bold',
      color: tokens.colors.text.primary,
      marginBottom: 8,
    },
    pageSubtitle: {
      fontSize: tokens.typography.fontSize.md,
      color: tokens.colors.text.secondary,
      marginBottom: 24,
      lineHeight: tokens.typography.lineHeight.relaxed,
    },
    actionsContainer: {
      marginTop: 20,
    },
    actionsTitle: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: '600',
      color: tokens.colors.text.primary,
      marginBottom: 16,
    },
    actionButton: {
      marginBottom: 12,
    },
    featuresContainer: {
      marginTop: 20,
      padding: 16,
      backgroundColor: tokens.colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: tokens.colors.border.default,
    },
    featuresTitle: {
      fontSize: tokens.typography.fontSize.md,
      fontWeight: '600',
      color: tokens.colors.text.primary,
      marginBottom: 8,
    },
    featuresList: {
      marginLeft: 8,
    },
    featureItem: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.text.secondary,
      marginBottom: 4,
    },
    disconnectedContainer: {
      backgroundColor: tokens.colors.surface,
      borderWidth: 2,
      borderColor: tokens.colors.border.default,
      borderStyle: 'dashed',
      marginTop: 20,
    },
    disconnectedTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      color: tokens.colors.text.primary,
      marginBottom: 8,
    },
    disconnectedSubtitle: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.text.secondary,
      textAlign: 'center',
    },
    networksContainer: {
      marginTop: 20,
    },
    networksTitle: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: '600',
      color: tokens.colors.text.primary,
      marginBottom: 16,
    },
    networksList: {
      gap: 16,
    },
    networkItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    networkDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    networkInfo: {
      flex: 1,
    },
    networkName: {
      fontSize: tokens.typography.fontSize.md,
      fontWeight: '600',
      color: tokens.colors.text.primary,
      marginBottom: 2,
    },
    networkDescription: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.text.secondary,
    },
  });
