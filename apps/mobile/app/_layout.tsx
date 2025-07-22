import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletProvider } from '../src/providers/WalletProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Todo App',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="todos" 
            options={{ 
              title: 'My Todos',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="wallet" 
            options={{ 
              title: 'Wallet',
              headerShown: true,
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </WalletProvider>
    </SafeAreaProvider>
  );
}