import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { ThemeProvider, useTheme } from '../src/providers/ThemeProvider';
import { WalletProvider } from '../src/providers/WalletProvider';
import { EvaProvider } from '@todo/ui-mobile';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemeBridge>
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
        </ThemeBridge>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { themeMode } = useTheme();
  return (
    <EvaProvider theme={themeMode} useCustomMapping={false}>
      {children}
    </EvaProvider>
  );
}

function ThemedStatusBar() {
  const { themeMode } = useTheme();
  const style: 'light' | 'dark' = themeMode === 'dark' ? 'light' : 'dark';
  return <StatusBar style={style} />;
}
