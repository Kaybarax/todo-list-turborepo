import { Card, CardContent, Button } from '@todo/ui-mobile';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDesignTokens } from '../src/hooks/useDesignTokens';

const HomeScreen = () => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: tokens.colors.text.primary }]}>Welcome to Todo App</Text>
        <Text style={[styles.subtitle, { color: tokens.colors.text.secondary }]}>
          A modern todo application with blockchain integration for mobile devices.
        </Text>

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
              <Text style={[styles.featureTitle, { color: tokens.colors.text.primary }]}>📝 Smart Todo Management</Text>
              <Text style={[styles.featureDescription, { color: tokens.colors.text.secondary }]}>
                Create, organize, and track your tasks with intelligent categorization and priority management.
              </Text>
            </CardContent>
          </Card>

          <Card style={styles.featureCard}>
            <CardContent>
              <Text style={[styles.featureTitle, { color: tokens.colors.text.primary }]}>
                🔗 Blockchain Integration
              </Text>
              <Text style={[styles.featureDescription, { color: tokens.colors.text.secondary }]}>
                Secure your todos on the blockchain with decentralized storage and verification.
              </Text>
            </CardContent>
          </Card>

          <Card style={styles.featureCard}>
            <CardContent>
              <Text style={[styles.featureTitle, { color: tokens.colors.text.primary }]}>📱 Cross-Platform Sync</Text>
              <Text style={[styles.featureDescription, { color: tokens.colors.text.secondary }]}>
                Access your todos anywhere with seamless synchronization across all your devices.
              </Text>
            </CardContent>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: tokens.spacing.xl,
      alignItems: 'center',
    },
    title: {
      fontSize: tokens.typography.fontSize.xxxl,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: tokens.spacing.lg,
    },
    subtitle: {
      fontSize: tokens.typography.fontSize.md,
      textAlign: 'center',
      marginBottom: tokens.spacing.xxxl,
      lineHeight: tokens.typography.lineHeight.relaxed,
    },
    buttonContainer: {
      width: '100%',
      marginBottom: tokens.spacing.xxxl,
    },
    button: {
      marginBottom: tokens.spacing.md,
    },
    featureContainer: {
      width: '100%',
    },
    featureCard: {
      marginBottom: tokens.spacing.md,
    },
    featureTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      marginBottom: tokens.spacing.sm,
    },
    featureDescription: {
      fontSize: tokens.typography.fontSize.sm,
      lineHeight: tokens.typography.lineHeight.normal,
    },
  });
