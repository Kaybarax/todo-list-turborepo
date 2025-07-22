import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.title}>Wallet Connection</Text>
          <Text style={styles.subtitle}>
            Wallet connectivity will be implemented in the next task.
          </Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusItem}>⏳ WalletConnect React Native integration</Text>
            <Text style={styles.statusItem}>⏳ Multi-network support (Solana, Polkadot, Polygon)</Text>
            <Text style={styles.statusItem}>⏳ Mobile wallet authentication</Text>
            <Text style={styles.statusItem}>⏳ Deep linking for wallet apps</Text>
            <Text style={styles.statusItem}>⏳ Transaction signing</Text>
          </View>
        </View>
      </View>
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
});