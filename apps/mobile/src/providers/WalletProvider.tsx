import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { getSupportedWalletNetworks, getWalletConnectionUrls, generateMockAddress } from '@todo/services';

// Types for wallet connection
export interface WalletAccount {
  address: string;
  network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base';
  balance?: string;
}

export interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  account: WalletAccount | null;
  error: string | null;
  supportedNetworks: ('solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base')[];

  // Actions
  connect: (network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (to: string, amount: string, data?: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supportedNetworks = getSupportedWalletNetworks();

  // Mock wallet connection - will be replaced with actual WalletConnect integration
  const connect = async (network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulate wallet app opening with deep linking
      // const walletUrls = getWalletConnectionUrls();

      // In a real implementation, this would open the wallet app
      // await Linking.openURL(walletUrls[network]);

      // Simulate connection delay
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

      // Mock wallet connection
      const mockAccount: WalletAccount = {
        address: generateMockAddress(network),
        network,
        balance: generateMockBalance(),
      };

      setAccount(mockAccount);
      setIsConnected(true);

      // Store connection state
      await AsyncStorage.setItem('wallet-connected', 'true');
      await AsyncStorage.setItem('wallet-account', JSON.stringify(mockAccount));

      Alert.alert('Wallet Connected', `Successfully connected to ${network} network`, [{ text: 'OK' }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      Alert.alert('Connection Failed', errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    setIsConnecting(true);

    try {
      // Simulate disconnection delay
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

      setAccount(null);
      setIsConnected(false);
      setError(null);

      // Clear stored connection state
      await AsyncStorage.removeItem('wallet-connected');
      await AsyncStorage.removeItem('wallet-account');

      Alert.alert('Wallet Disconnected', 'Your wallet has been disconnected', [{ text: 'OK' }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setError(errorMessage);
      Alert.alert('Disconnection Failed', errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => {
    if (!account) {
      throw new Error('No wallet connected');
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Simulate network switch delay
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));

      const updatedAccount: WalletAccount = {
        ...account,
        address: generateMockAddress(network),
        network,
        balance: generateMockBalance(),
      };

      setAccount(updatedAccount);
      await AsyncStorage.setItem('wallet-account', JSON.stringify(updatedAccount));

      Alert.alert('Network Switched', `Switched to ${network} network`, [{ text: 'OK' }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch network';
      setError(errorMessage);
      Alert.alert('Network Switch Failed', errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!account) {
      throw new Error('No wallet connected');
    }

    return new Promise((resolve, reject) => {
      Alert.alert('Sign Message', `Do you want to sign this message?\n\n"${message}"`, [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => reject(new Error('User cancelled signing')),
        },
        {
          text: 'Sign',
          onPress: async () => {
            try {
              // Simulate signing delay
              await new Promise<void>(res => setTimeout(() => res(), 1000));

              // Mock signature
              const signature = `0x${Math.random().toString(16).substr(2, 128)}`;
              resolve(signature);
            } catch (error) {
              reject(error);
            }
          },
        },
      ]);
    });
  };

  const sendTransaction = async (to: string, amount: string, _data?: string): Promise<string> => {
    if (!account) {
      throw new Error('No wallet connected');
    }

    return new Promise((resolve, reject) => {
      Alert.alert('Send Transaction', `Send ${amount} to ${to.slice(0, 8)}...${to.slice(-8)}?`, [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => reject(new Error('User cancelled transaction')),
        },
        {
          text: 'Send',
          onPress: async () => {
            try {
              // Simulate transaction delay
              await new Promise<void>(res => setTimeout(() => res(), 3000));

              // Mock transaction hash
              const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
              resolve(txHash);
            } catch (error) {
              reject(error);
            }
          },
        },
      ]);
    });
  };

  // Restore connection state on mount
  useEffect(() => {
    const restoreWalletConnection = async () => {
      try {
        const isWalletConnected = await AsyncStorage.getItem('wallet-connected');
        const storedAccount = await AsyncStorage.getItem('wallet-account');

        if (isWalletConnected && storedAccount) {
          const parsedAccount = JSON.parse(storedAccount);
          setAccount(parsedAccount);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Failed to restore wallet connection:', err);
        await AsyncStorage.removeItem('wallet-connected');
        await AsyncStorage.removeItem('wallet-account');
      }
    };

    restoreWalletConnection();
  }, []);

  const value: WalletContextType = {
    isConnected,
    isConnecting,
    account,
    error,
    supportedNetworks,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
    sendTransaction,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

// Helper functions for mock data
function generateMockBalance(): string {
  return (Math.random() * 100).toFixed(4);
}
