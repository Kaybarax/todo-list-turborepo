/**
 * Theme Error Boundary
 * Handles theme-related errors and provides fallback UI
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { EvaThemeValidationError } from './enhanced-validation';
import { ThemeValidationError } from './validation';

interface ThemeErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error; errorInfo: ErrorInfo }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface ThemeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ThemeErrorBoundary extends Component<ThemeErrorBoundaryProps, ThemeErrorBoundaryState> {
  constructor(props: ThemeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ThemeErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log theme-specific errors
    if (error instanceof ThemeValidationError || error instanceof EvaThemeValidationError) {
      console.error('Theme validation error:', error.message, error.type);
    } else {
      console.error('Theme error boundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ThemeErrorBoundaryProps) {
    const { resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error state when props change (if enabled)
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallbackComponent: FallbackComponent } = this.props;

    if (hasError && error) {
      // Use custom fallback component if provided
      if (FallbackComponent) {
        return <FallbackComponent error={error} errorInfo={this.state.errorInfo!} />;
      }

      // Default fallback UI
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Theme Error</Text>
          <Text style={styles.errorMessage}>
            {error instanceof ThemeValidationError || error instanceof EvaThemeValidationError
              ? `Theme validation failed: ${error.message}`
              : 'An error occurred while loading the theme'}
          </Text>
          {__DEV__ && <Text style={styles.errorDetails}>{error.stack}</Text>}
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fef2f2',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#991b1b',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 12,
    color: '#7f1d1d',
    fontFamily: 'monospace',
    marginTop: 10,
  },
});

export default ThemeErrorBoundary;
