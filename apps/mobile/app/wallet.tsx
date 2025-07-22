import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WalletConnect } from '../src/components/WalletConnect';
import { useWallet } from '../src/providers/WalletProvider';

export default function WalletScreen() {
  const { isConnected, account, signMessage, sendTransaction } = useWallet();

  const handleSignMessage = async () => {
    try {
      const message = 'Hello from Todo App Mobile!';
      const signature = await signMessage(message);
      Alert.alert(
        'Message Signed',
        `Signature: ${signature.slice(0, 20)}...`,
        [{ text: 'OK' }]
      );
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
        'Todo app mobile transaction'
      );
      Alert.alert(
        'Transaction Sent',
        `Hash: ${txHash.slice(0, 20)}...`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      if (error instanceof Error && error.message !== 'User cancelled transaction') {
        Alert.alert('Error', 'Failed to send transaction: ' + error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Wallet Connection</Text>
        <Text style={styles.pageSubtitle}>
          Connect your wallet to enable blockchain features for your todos.
        </Text>

        <WalletConnect />

        {isConnected && account ? (
          <View style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Wallet Actions</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSignMessage}
            >
              <Text style={styles.actionButtonText}>Sign Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryActionButton]}
              onPress={handleSendTransaction}
            >
              <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                Send Test Transaction
              </Text>
            </TouchableOpacity>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Blockchain Features</Text>
              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>• Store todos on blockchain networks</Text>
                <Text style={styles.featureItem}>• Immutable and decentralized storage</Text>
                <Text style={styles.featureItem}>• Cross-network compatibility</Text>
                <Text style={styles.featureItem}>• Cryptographic verification</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.disconnectedContainer}>
            <Text style={styles.disconnectedTitle}>No wallet connected</Text>
            <Text style={styles.disconnectedSubtitle}>
              Connect your wallet to access blockchain features.
            </Text>
          </View>
        )}

        <View style={styles.networksContainer}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryActionButton: {
    backgroundColor: '#2563eb',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  primaryActionButtonText: {
    color: '#ffffff',
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
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    padding: 40,
    marginTop: 20,
    alignItems: 'center',
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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