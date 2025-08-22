import { Card, CardContent, Button } from '@todo/ui-mobile';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Todo App</Text>
        <Text style={styles.subtitle}>A modern todo application with blockchain integration for mobile devices.</Text>

        <View style={styles.buttonContainer}>
          <Link href="/todos" asChild>
            <Button variant="primary" size="lg" style={styles.button} onPress={() => {}}>
              Get Started
            </Button>
          </Link>

          <Link href="/wallet" asChild>
            <Button variant="outline" size="lg" style={styles.button} onPress={() => {}}>
              Connect Wallet
            </Button>
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
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 32,
  },
  button: {
    marginBottom: 12,
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
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
