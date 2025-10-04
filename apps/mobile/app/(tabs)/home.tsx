import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Button, Icon, Card, CardContent, CardTitle, CardDescription, useEnhancedTheme } from '@todo/ui-mobile';
import { useDesignTokens } from '../../src/hooks/useDesignTokens';

export default function Home() {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  const { themeName, toggleTheme, evaTheme } = useEnhancedTheme();
  const themeMode = themeName; // For backward compatibility with existing code

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: evaTheme['background-basic-color-1'] }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title and Subtitle */}
        <View style={styles.heroSection}>
          <Text
            testID="home-title"
            style={[
              styles.title,
              {
                color: themeMode === 'light' ? '#F6AD55' : '#805AD5',
              },
            ]}
          >
            Todo Pro
          </Text>
          <Text style={[styles.subtitle, { color: themeMode === 'light' ? '#2D3748' : '#A0AEC0' }]}>
            A modern app for getting things done
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/todos" asChild>
            <Button
              testID="nav-todos"
              variant="primary"
              size="lg"
              style={styles.primaryButton}
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
              style={{ width: '100%', marginBottom: tokens.spacing.sm }}
              onPress={() => {}}
              accessibilityLabel="Go to wallet"
            >
              Connect Wallet (Optional)
            </Button>
          </Link>
        </View>

        {/* Key Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.featuresHeader, { color: themeMode === 'light' ? '#F6AD55' : '#805AD5' }]}>
            Key Features
          </Text>

          {/* Feature Cards */}
          <View style={styles.featureContainer}>
            <Card variant="elevated" padding="md" style={styles.featureCard} testID="feature-card-prioritization">
              <CardContent style={styles.cardContentWrapper}>
                <View style={styles.featureIconContainer}>
                  <Icon name="file-text-outline" size="xl" color="#805AD5" />
                </View>
                <View style={styles.featureContent}>
                  <CardTitle variant="h4" style={styles.cardTitle} numberOfLines={2}>
                    Smart Prioritization
                  </CardTitle>
                  <CardDescription style={styles.cardDescription} numberOfLines={3}>
                    Create, categorize, and track your tasks with intelligent prioritization powered by AI.
                  </CardDescription>
                </View>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="md" style={styles.featureCard} testID="feature-card-blockchain">
              <CardContent style={styles.cardContentWrapper}>
                <View style={styles.featureIconContainer}>
                  <Icon name="shield-outline" size="xl" color="#48BB78" />
                </View>
                <View style={styles.featureContent}>
                  <CardTitle variant="h4" style={styles.cardTitle} numberOfLines={2}>
                    Secure Blockchain Sync
                  </CardTitle>
                  <CardDescription style={styles.cardDescription} numberOfLines={3}>
                    Secure your todos with decentralized storage and verification for maximum privacy.
                  </CardDescription>
                </View>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="md" style={styles.featureCard} testID="feature-card-sync">
              <CardContent style={styles.cardContentWrapper}>
                <View style={styles.featureIconContainer}>
                  <Icon name="sync-outline" size="xl" color="#ED8936" />
                </View>
                <View style={styles.featureContent}>
                  <CardTitle variant="h4" style={styles.cardTitle} numberOfLines={2}>
                    Seamless Cross-Device Sync
                  </CardTitle>
                  <CardDescription style={styles.cardDescription} numberOfLines={3}>
                    Access your todos anywhere with seamless synchronization across all your devices.
                  </CardDescription>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: tokens.spacing.lg,
      paddingBottom: tokens.spacing.xxxl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: tokens.spacing.md,
    },
    themeToggle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    heroSection: {
      alignItems: 'center',
      marginBottom: tokens.spacing.xxl,
    },
    title: {
      fontSize: 40,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: tokens.spacing.lg,
    },
    subtitle: {
      fontSize: tokens.typography.fontSize.md,
      textAlign: 'center',
      lineHeight: tokens.typography.lineHeight.relaxed * tokens.typography.fontSize.md,
      paddingHorizontal: tokens.spacing.lg,
    },
    buttonContainer: {
      width: '100%',
      marginBottom: tokens.spacing.xl,
    },
    primaryButton: {
      width: '100%',
      marginBottom: tokens.spacing.sm,
      backgroundColor: '#4299E1',
      borderRadius: 12,
    },
    secondaryButton: {
      width: '100%',
      marginBottom: tokens.spacing.sm,
      backgroundColor: '#2D3748',
      borderRadius: 12,
    },
    outlineButton: {
      width: '100%',
      marginBottom: tokens.spacing.sm,
      borderColor: '#4299E1',
      borderWidth: 2,
      borderRadius: 12,
    },
    outlineButtonLight: {
      width: '100%',
      marginBottom: tokens.spacing.sm,
      borderColor: '#4299E1',
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderRadius: 12,
    },
    outlineButtonDark: {
      width: '100%',
      marginBottom: tokens.spacing.sm,
      borderColor: '#4299E1',
      backgroundColor: '#1A202C',
      borderWidth: 2,
      borderRadius: 12,
    },
    featuresSection: {
      width: '100%',
      marginBottom: tokens.spacing.lg,
    },
    featuresHeader: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '700',
      marginBottom: tokens.spacing.md,
    },
    featureContainer: {
      width: '100%',
    },
    featureCard: {
      marginBottom: tokens.spacing.sm,
    },
    cardContentWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    cardTitle: {
      marginBottom: 2,
    },
    cardDescription: {
      lineHeight: 18,
    },
    featureIconContainer: {
      marginRight: tokens.spacing.md,
      justifyContent: 'flex-start',
      paddingTop: 2,
      width: 32,
      alignSelf: 'flex-start',
    },
    featureContent: {
      flex: 1,
    },
  });
