import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@todo/ui-mobile';
import { useDesignTokens } from '../hooks/useDesignTokens';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _info: any) {
    // Intentionally minimal; consumers can also log via logger utility
    if (typeof console !== 'undefined' && console.error) {
      console.error('[ErrorBoundary] Caught error:', error);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Hook usage not allowed in class; render a themed fallback via a wrapper
      return <ThemedFallback onRetry={this.handleRetry} error={this.state.error} />;
    }
    return this.props.children;
  }
}

function ThemedFallback({ onRetry, error }: { onRetry: () => void; error?: Error }) {
  const tokens = useDesignTokens();
  const styles = createStyles(tokens);
  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <Text style={[styles.title, { color: tokens.colors.error }]}>Something went wrong</Text>
      {error ? (
        <Text style={[styles.message, { color: tokens.colors.text.secondary }]}>{String(error.message || error)}</Text>
      ) : null}
      <Button variant="outline" size="sm" onPress={onRetry} style={{ minHeight: 44, paddingHorizontal: 12 }}>
        Try again
      </Button>
    </View>
  );
}

const createStyles = (tokens: ReturnType<typeof useDesignTokens>) =>
  StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: tokens.spacing.lg },
    title: { fontSize: tokens.typography.fontSize.lg, fontWeight: '700', marginBottom: tokens.spacing.sm },
    message: { fontSize: tokens.typography.fontSize.sm, textAlign: 'center', marginBottom: tokens.spacing.md },
  });

export default ErrorBoundary;
