'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupportedWalletNetworks, generateMockAddress } from '@todo/services';

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
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock wallet connection
      const mockAccount: WalletAccount = {
        address: generateMockAddress(network),
        network,
        balance: generateMockBalance(),
      };

      setAccount(mockAccount);
      setIsConnected(true);
      
      // Store connection state
      localStorage.setItem('wallet-connected', 'true');
      localStorage.setItem('wallet-account', JSON.stringify(mockAccount));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate disconnection delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setAccount(null);
      setIsConnected(false);
      setError(null);
      
      // Clear stored connection state
      localStorage.removeItem('wallet-connected');
      localStorage.removeItem('wallet-account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedAccount: WalletAccount = {
        ...account,
        address: generateMockAddress(network),
        network,
        balance: generateMockBalance(),
      };

      setAccount(updatedAccount);
      localStorage.setItem('wallet-account', JSON.stringify(updatedAccount));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch network');
    } finally {
      setIsConnecting(false);
    }
  };

  const signMessage = async (_message: string): Promise<string> => {
    if (!account) {
      throw new Error('No wallet connected');
    }

    // Simulate signing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock signature
    return `0x${Math.random().toString(16).substr(2, 128)}`;
  };

  const sendTransaction = async (_to: string, _amount: string, _data?: string): Promise<string> => {
    if (!account) {
      throw new Error('No wallet connected');
    }

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock transaction hash
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  };

  // Restore connection state on mount
  useEffect(() => {
    const isWalletConnected = localStorage.getItem('wallet-connected');
    const storedAccount = localStorage.getItem('wallet-account');

    if (isWalletConnected && storedAccount) {
      try {
        const parsedAccount = JSON.parse(storedAccount);
        setAccount(parsedAccount);
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to restore wallet connection:', err);
        localStorage.removeItem('wallet-connected');
        localStorage.removeItem('wallet-account');
      }
    }
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

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Helper functions for mock data
function generateMockBalance(): string {
  return (Math.random() * 100).toFixed(4);
}