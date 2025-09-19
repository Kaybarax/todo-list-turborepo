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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {error ? <ErrorBanner message={error} /> : null}
        <Text style={styles.pageTitle}>Wallet Connection</Text>
        <Text style={styles.pageSubtitle}>Connect your wallet to enable blockchain features for your todos.</Text>

        <WalletConnect />

        {isConnected && account ? (
          <Card style={styles.actionsContainer}>
            <CardContent>
              <Text style={styles.actionsTitle}>Wallet Actions</Text>

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

              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Blockchain Features</Text>
                <View style={styles.featuresList}>
                  <Text style={styles.featureItem}>• Store todos on blockchain networks</Text>
                  <Text style={styles.featureItem}>• Immutable and decentralized storage</Text>
                  <Text style={styles.featureItem}>• Cross-network compatibility</Text>
                  <Text style={styles.featureItem}>• Cryptographic verification</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        ) : (
          <Card style={styles.disconnectedContainer}>
            <CardContent>
              <Text style={styles.disconnectedTitle}>No wallet connected</Text>
              <Text style={styles.disconnectedSubtitle}>Connect your wallet to access blockchain features.</Text>
            </CardContent>
          </Card>
        )}

        <Card style={styles.networksContainer}>
          <CardContent>
            <Text style={styles.networksTitle}>Supported Networks</Text>

            <View style={styles.networksList}>
              <View style={styles.networkItem}>
                <View style={[styles.networkDot, { backgroundColor: '#9333ea' }]} />
                <View style={styles.networkInfo}>
                  <Text style={styles.networkName}>Solana</Text>
                  <Text style={styles.networkDescription}>Fast and low-cost transactions</Text>
                </View>
              </View>

              <View style={styles.networkItem}>
                <View style={[styles.networkDot, { backgroundColor: '#ec4899' }]} />
                <View style={styles.networkInfo}>
                  <Text style={styles.networkName}>Polkadot</Text>
                  <Text style={styles.networkDescription}>Interoperable blockchain network</Text>
                </View>
              </View>

              <View style={styles.networkItem}>
                <View style={[styles.networkDot, { backgroundColor: '#6366f1' }]} />
                <View style={styles.networkInfo}>
                  <Text style={styles.networkName}>Polygon</Text>
                  <Text style={styles.networkDescription}>Ethereum-compatible scaling solution</Text>
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
      backgroundColor: '#f8f9fa',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 8,
    },
    pageSubtitle: {
      fontSize: 16,
      color: '#6b7280',
      marginBottom: 24,
      lineHeight: 24,
    },
    actionsContainer: {
      marginTop: 20,
    },
    actionsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 16,
    },
    actionButton: {
      marginBottom: 12,
    },
    featuresContainer: {
      marginTop: 20,
      padding: 16,
      backgroundColor: '#eff6ff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#bfdbfe',
    },
    featuresTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: 8,
    },
    featuresList: {
      marginLeft: 8,
    },
    featureItem: {
      fontSize: 14,
      color: '#1e40af',
      marginBottom: 4,
    },
    disconnectedContainer: {
      backgroundColor: '#f9fafb',
      borderWidth: 2,
      borderColor: '#e5e7eb',
      borderStyle: 'dashed',
      marginTop: 20,
    },
    disconnectedTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 8,
    },
    disconnectedSubtitle: {
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'center',
    },
    networksContainer: {
      marginTop: 20,
    },
    networksTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1f2937',
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
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 2,
    },
    networkDescription: {
      fontSize: 14,
      color: '#6b7280',
    },
  });
