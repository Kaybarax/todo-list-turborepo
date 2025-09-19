import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { WalletProvider } from '../src/providers/WalletProvider';
import { EvaProvider } from '@todo/ui-mobile';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <EvaProvider theme="light">
        <ThemeProvider>
          <WalletProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="todos" options={{ headerShown: false }} />
              <Stack.Screen name="wallet" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </WalletProvider>
        </ThemeProvider>
      </EvaProvider>
    </SafeAreaProvider>
  );
}
