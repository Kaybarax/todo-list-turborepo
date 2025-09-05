import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EvaProvider } from '@todo/ui-mobile';

import { ThemeProvider } from '../src/providers/ThemeProvider';
import { WalletProvider } from '../src/providers/WalletProvider';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <EvaProvider>
          <WalletProvider>
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
          </WalletProvider>
        </EvaProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
