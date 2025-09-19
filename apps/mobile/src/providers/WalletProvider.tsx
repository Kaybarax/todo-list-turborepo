/* eslint-disable no-unused-vars, promise/always-return */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupportedWalletNetworks, generateMockAddress } from '@todo/services';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';

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
  connect: (_network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (_network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => Promise<void>;
  signMessage: (_message: string) => Promise<string>;
  sendTransaction: (_to: string, _amount: string, _data?: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supportedNetworks = getSupportedWalletNetworks();

  const connect = async (network: WalletAccount['network']) => {
    setIsConnecting(true);
    setError(null);
    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      const mockAccount: WalletAccount = {
        address: generateMockAddress(network),
        network,
        balance: generateMockBalance(),
      };
      setAccount(mockAccount);
      setIsConnected(true);
      await AsyncStorage.setItem('wallet-connected', 'true');
      await AsyncStorage.setItem('wallet-account', JSON.stringify(mockAccount));
      Alert.alert('Wallet Connected', `Connected to ${network}`);
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
      await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
      setAccount(null);
      setIsConnected(false);
      setError(null);
      await AsyncStorage.removeItem('wallet-connected');
      await AsyncStorage.removeItem('wallet-account');
      Alert.alert('Wallet Disconnected');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (network: WalletAccount['network']) => {
    if (!account) throw new Error('No wallet connected');
    setIsConnecting(true);
    setError(null);
    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
      const updated: WalletAccount = {
        ...account,
        address: generateMockAddress(network),
        network,
        balance: generateMockBalance(),
      };
      setAccount(updated);
      await AsyncStorage.setItem('wallet-account', JSON.stringify(updated));
      Alert.alert('Network Switched', `Switched to ${network}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const signMessage = async (message: string) => {
    if (!account) throw new Error('No wallet connected');
    await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
    return `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`;
  };

  const sendTransaction = async (_to: string, _amount: string) => {
    if (!account) throw new Error('No wallet connected');
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    return `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`;
  };

  useEffect(() => {
    const restore = async () => {
      try {
        const isWalletConnected = await AsyncStorage.getItem('wallet-connected');
        const stored = await AsyncStorage.getItem('wallet-account');
        if (isWalletConnected && stored) {
          setAccount(JSON.parse(stored));
          setIsConnected(true);
        }
      } catch (e) {
        await AsyncStorage.removeItem('wallet-connected');
        await AsyncStorage.removeItem('wallet-account');
      }
    };
    void restore();
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
};

function generateMockBalance(): string {
  return (Math.random() * 100).toFixed(4);
}
