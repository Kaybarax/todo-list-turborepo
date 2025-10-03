import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Button, Icon } from '@todo/ui-mobile';
import { useDesignTokens } from '../src/hooks/useDesignTokens';
import { useTheme } from '../src/providers/ThemeProvider';

export default function Home() {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  const { themeMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Theme Toggle Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.themeToggle,
              {
                backgroundColor: themeMode === 'light' ? '#2D3748' : '#EDF2F7',
                borderColor: themeMode === 'light' ? '#2D3748' : '#4299E1',
              },
            ]}
            onPress={toggleTheme}
            accessibilityLabel="Toggle color theme"
          >
            <Icon
              name={themeMode === 'light' ? 'sun-outline' : 'moon-outline'}
              size="lg"
              color={themeMode === 'light' ? '#FFFFFF' : '#4299E1'}
            />
          </TouchableOpacity>
        </View>

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

          <View style={themeMode === 'light' ? styles.walletButtonWrapperLight : styles.walletButtonWrapperDark}>
            <Link href="/wallet" asChild>
              <TouchableOpacity
                testID="nav-wallet"
                style={styles.walletButtonInner}
                onPress={() => {}}
                accessibilityLabel="Go to wallet"
                accessibilityRole="button"
              >
                <Text style={styles.walletButtonText}>Connect Wallet (Optional)</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Key Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.featuresHeader, { color: themeMode === 'light' ? '#F6AD55' : '#805AD5' }]}>
            Key Features
          </Text>

          {/* Feature Cards */}
          <View style={styles.featureContainer}>
            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: themeMode === 'light' ? '#FFFFFF' : '#2D3748',
                  borderColor: themeMode === 'light' ? '#E2E8F0' : '#4A5568',
                },
              ]}
            >
              <View style={styles.featureIconContainer}>
                <Icon name="file-text-outline" size="xl" color="#805AD5" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: themeMode === 'light' ? '#1A202C' : '#F7FAFC' }]}>
                  Smart Prioritization
                </Text>
                <Text
                  numberOfLines={0}
                  style={[styles.featureDescription, { color: themeMode === 'light' ? '#4A5568' : '#CBD5E0' }]}
                >
                  Create, categorize, and track your tasks with intelligent prioritization powered by AI.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: themeMode === 'light' ? '#FFFFFF' : '#2D3748',
                  borderColor: themeMode === 'light' ? '#E2E8F0' : '#4A5568',
                },
              ]}
            >
              <View style={styles.featureIconContainer}>
                <Icon name="shield-outline" size="xl" color="#48BB78" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: themeMode === 'light' ? '#1A202C' : '#F7FAFC' }]}>
                  Secure Blockchain Sync
                </Text>
                <Text
                  numberOfLines={0}
                  style={[styles.featureDescription, { color: themeMode === 'light' ? '#4A5568' : '#CBD5E0' }]}
                >
                  Secure your todos with decentralized storage and verification for maximum privacy.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: themeMode === 'light' ? '#FFFFFF' : '#2D3748',
                  borderColor: themeMode === 'light' ? '#E2E8F0' : '#4A5568',
                },
              ]}
            >
              <View style={styles.featureIconContainer}>
                <Icon name="sync-outline" size="xl" color="#ED8936" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: themeMode === 'light' ? '#1A202C' : '#F7FAFC' }]}>
                  Seamless Cross-Device Sync
                </Text>
                <Text
                  numberOfLines={0}
                  style={[styles.featureDescription, { color: themeMode === 'light' ? '#4A5568' : '#CBD5E0' }]}
                >
                  Access your todos anywhere with seamless synchronization across all your devices.
                </Text>
              </View>
            </View>
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
    walletButtonWrapperLight: {
      width: '100%',
      marginBottom: tokens.spacing.sm,
      backgroundColor: '#FFFFFF',
      borderColor: '#4299E1',
      borderWidth: 2,
      borderRadius: 12,
      overflow: 'hidden',
    },
    walletButtonWrapperDark: {
      width: '100%',
      marginBottom: tokens.spacing.sm,
      backgroundColor: '#1A202C',
      borderColor: '#4299E1',
      borderWidth: 2,
      borderRadius: 12,
      overflow: 'hidden',
    },
    walletButtonInner: {
      width: '100%',
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    walletButtonText: {
      fontSize: tokens.typography.fontSize.md,
      fontWeight: '600',
      color: '#4299E1',
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
      flexDirection: 'row',
      padding: tokens.spacing.md,
      paddingVertical: tokens.spacing.lg,
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: tokens.spacing.sm,
      minHeight: 95,
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
      flexShrink: 1,
      flexWrap: 'wrap',
      paddingBottom: 4,
    },
    featureTitle: {
      fontSize: tokens.typography.fontSize.md,
      fontWeight: '700',
      marginBottom: tokens.spacing.xs,
      lineHeight: tokens.typography.fontSize.md * 1.6,
    },
    featureDescription: {
      fontSize: tokens.typography.fontSize.xs,
      lineHeight: tokens.typography.fontSize.xs * 1.6,
      flexWrap: 'wrap',
      width: '100%',
    },
  });
