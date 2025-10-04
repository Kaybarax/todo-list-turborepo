import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { WalletProvider } from '../src/providers/WalletProvider';
import { EnhancedThemeProvider, useEnhancedTheme } from '@todo/ui-mobile';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { GlobalThemeFAB } from '../src/components/GlobalThemeFAB';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              <GlobalThemeFAB />
            </ErrorBoundary>
          </WalletProvider>
        </EnhancedThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ThemedStatusBar() {
  const { themeName } = useEnhancedTheme();
  const style: 'light' | 'dark' = themeName === 'dark' ? 'light' : 'dark';
  return <StatusBar style={style} />;
}
