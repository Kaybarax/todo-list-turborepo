import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { WalletProvider } from '../src/providers/WalletProvider';
import { ThemeProvider } from '@todo/ui-mobile/lib/theme';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="todos"
              options={{
                title: 'My Todos',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="wallet"
              options={{
                title: 'Wallet',
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </WalletProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
