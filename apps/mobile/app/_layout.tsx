import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}