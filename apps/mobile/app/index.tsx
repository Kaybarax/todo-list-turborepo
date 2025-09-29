import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Button, Card, CardContent } from '@todo/ui-mobile';
import { useDesignTokens } from '../src/hooks/useDesignTokens';
import { useTheme } from '../src/providers/ThemeProvider';

export default function Home() {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  const { themeMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={styles.content}>
        <Text testID="home-title" style={[styles.title, { color: tokens.colors.text.primary }]}>
          Welcome to Todo App
        </Text>
        <Text style={[styles.subtitle, { color: tokens.colors.text.secondary }]}>
          A modern todo application with blockchain integration for mobile devices.
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="/todos" asChild>
            <Button
              testID="nav-todos"
              variant="primary"
              size="lg"
              style={styles.button}
              onPress={() => {}}
              accessibilityLabel="Go to your todos"
            >
              Get Started
            </Button>
          </Link>

          <Link href="/wallet" asChild>
            <Button
              testID="nav-wallet"
              variant="outline"
              size="lg"
              style={styles.button}
              onPress={() => {}}
              accessibilityLabel="Go to wallet"
            >
              Connect Wallet
            </Button>
          </Link>

          <Button variant="ghost" size="sm" onPress={toggleTheme} accessibilityLabel="Toggle color theme">
            Toggle {themeMode === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
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
}

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
