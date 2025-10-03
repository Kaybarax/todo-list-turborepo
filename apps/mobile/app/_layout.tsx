import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { WalletProvider } from '../src/providers/WalletProvider';
import { EnhancedThemeProvider, useEnhancedTheme } from '@todo/ui-mobile';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <EnhancedThemeProvider
        initialTheme="light"
        initialEvaTheme="light"
        followSystemTheme={true}
        enableEvaDesign={true}
      >
        <WalletProvider>
          <ErrorBoundary>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="todos" options={{ headerShown: false }} />
              <Stack.Screen name="wallet" options={{ headerShown: false }} />
            </Stack>
            <ThemedStatusBar />
          </ErrorBoundary>
        </WalletProvider>
      </EnhancedThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedStatusBar() {
  const { themeName } = useEnhancedTheme();
  const style: 'light' | 'dark' = themeName === 'dark' ? 'light' : 'dark';
  return <StatusBar style={style} />;
}
