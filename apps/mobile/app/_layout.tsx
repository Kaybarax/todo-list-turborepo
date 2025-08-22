import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { WalletProvider } from '../src/providers/WalletProvider';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <Stack
          screenOptions={{
            headerShown: false, // We'll use our own Header component
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Todo App',
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
    </SafeAreaProvider>
  );
};

export default RootLayout;
