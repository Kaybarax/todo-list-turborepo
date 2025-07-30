import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent } from '@todo/ui-mobile';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Todo App</Text>
        <Text style={styles.subtitle}>
          A modern todo application with blockchain integration for mobile devices.
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="/todos" asChild>
            <TouchableOpacity style={[styles.button, styles.primaryButton]}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/wallet" asChild>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <Text style={styles.secondaryButtonText}>Connect Wallet</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.featureContainer}>
          <Card style={styles.featureCard}>
            <CardContent>
              <Text style={styles.featureTitle}>Traditional Storage</Text>
              <Text style={styles.featureDescription}>
                Store your todos securely with fast synchronization across devices.
              </Text>
            </CardContent>
          </Card>

          <Card style={styles.featureCard}>
            <CardContent>
              <Text style={styles.featureTitle}>Blockchain Storage</Text>
              <Text style={styles.featureDescription}>
                Store todos on blockchain networks for decentralized, immutable storage.
              </Text>
            </CardContent>
          </Card>

          <Card style={styles.featureCard}>
            <CardContent>
              <Text style={styles.featureTitle}>Multi-Network Support</Text>
              <Text style={styles.featureDescription}>
                Choose from Solana, Polkadot, or Polygon networks based on your preferences.
              </Text>
            </CardContent>
          </Card>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 32,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  featureContainer: {
    width: '100%',
  },
  featureCard: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});