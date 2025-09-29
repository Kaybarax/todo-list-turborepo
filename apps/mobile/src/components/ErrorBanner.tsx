import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDesignTokens } from '../hooks/useDesignTokens';

type Props = { message: string };

export const ErrorBanner: React.FC<Props> = ({ message }) => {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      backgroundColor: tokens.colors.surface,
      borderWidth: 1,
      borderColor: tokens.colors.border.error,
    },
    title: { fontWeight: '600', color: tokens.colors.error, marginBottom: 4 },
    text: { color: tokens.colors.text.secondary },
  });

export default ErrorBanner;
