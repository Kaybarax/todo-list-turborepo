'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button, Badge } from '../../core';
import { getNetworkColor } from '@todo/services';
import type { BlockchainNetwork } from '@todo/services';

// Types for wallet connection
export interface WalletAccount {
  address: string;
  network: BlockchainNetwork;
  balance?: string;
  chainId?: string | number;
  publicKey?: string;
}

export interface WalletConnectProps extends VariantProps<typeof walletConnectVariants> {
  // Connection callbacks
  onConnect?: (account: WalletAccount) => void;
  onDisconnect?: () => void;
  onNetworkSwitch?: (network: BlockchainNetwork) => void;

  // Configuration
  supportedNetworks?: BlockchainNetwork[];
  defaultNetwork?: BlockchainNetwork;

  // Display options
  showBalance?: boolean;
  showNetworkSelector?: boolean;
  showHash?: boolean;

  // State
  isConnected?: boolean;
  isConnecting?: boolean;
  account?: WalletAccount | null;
  error?: string | null;

  // Styling
  className?: string;
  'data-testid'?: string;
}

const walletConnectVariants = cva('bg-white rounded-lg shadow-sm border p-4', {
  variants: {
    variant: {
      default: '',
      compact: 'p-3',
      'button-only': 'p-0 bg-transparent shadow-none border-none',
    },
    size: {
      sm: 'text-sm',
      md: '',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const defaultSupportedNetworks: BlockchainNetwork[] = [
  'solana' as BlockchainNetwork,
  'polkadot' as BlockchainNetwork,
  'polygon' as BlockchainNetwork,
  'moonbeam' as BlockchainNetwork,
  'base' as BlockchainNetwork,
];

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
  onNetworkSwitch,
  supportedNetworks = defaultSupportedNetworks,
  defaultNetwork = 'solana' as BlockchainNetwork,
  showBalance = true,
  showNetworkSelector = true,
  showHash = false,
  isConnected = false,
  isConnecting = false,
  account = null,
  error = null,
  variant = 'default',
  size = 'md',
  className,
  'data-testid': dataTestId,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<BlockchainNetwork>(defaultNetwork);
  const [showNetworkSwitcher, setShowNetworkSwitcher] = useState(false);

  const handleConnect = useCallback(async () => {
    try {
      if (onConnect) {
        // Create a mock account for demonstration
        const mockAccount: WalletAccount = {
          address: generateMockAddress(selectedNetwork),
          network: selectedNetwork,
          balance: generateMockBalance(),
        };
        onConnect(mockAccount);
      }
    } catch (err) {
      console.error('Connection failed:', err);
    }
  }, [onConnect, selectedNetwork]);

  const handleDisconnect = useCallback(async () => {
    try {
      if (onDisconnect) {
        onDisconnect();
      }
    } catch (err) {
      console.error('Disconnection failed:', err);
    }
  }, [onDisconnect]);

  const handleNetworkSwitch = useCallback(
    async (network: BlockchainNetwork) => {
      try {
        if (onNetworkSwitch) {
          onNetworkSwitch(network);
        }
        setShowNetworkSwitcher(false);
      } catch (err) {
        console.error('Network switch failed:', err);
      }
    },
    [onNetworkSwitch],
  );

  const getNetworkColorClasses = useCallback((network: string) => {
    const baseColor = getNetworkColor(network);
    // Convert hex color to Tailwind classes
    const colorMap: Record<string, string> = {
      '#9333ea': 'bg-purple-100 text-purple-800 border-purple-200',
      '#ec4899': 'bg-pink-100 text-pink-800 border-pink-200',
      '#6366f1': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '#14b8a6': 'bg-teal-100 text-teal-800 border-teal-200',
      '#3b82f6': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colorMap[baseColor] || 'bg-gray-100 text-gray-800 border-gray-200';
  }, []);

  const formatAddress = useCallback(
    (address: string) => {
      if (showHash) {
        return address;
      }
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
    [showHash],
  );

  const containerClasses = useMemo(
    () => walletConnectVariants({ variant, size, className }),
    [variant, size, className],
  );

  // Button-only variant renders just the connect/disconnect button
  if (variant === 'button-only') {
    if (isConnected && account) {
      return (
        <Button
          onClick={handleDisconnect}
          disabled={isConnecting}
          variant="destructive"
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          className={className}
          data-testid={dataTestId}
        >
          Disconnect
        </Button>
      );
    }

    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
        className={className}
        data-testid={dataTestId}
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  // Connected state
  if (isConnected && account) {
    return (
      <div className={containerClasses} data-testid={dataTestId}>
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`font-medium text-gray-900 ${size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-base' : 'text-lg'}`}
          >
            {variant === 'compact' ? 'Connected' : 'Wallet Connected'}
          </h3>
          <Button
            onClick={handleDisconnect}
            disabled={isConnecting}
            variant="destructive"
            size={size === 'lg' ? 'md' : 'sm'}
          >
            Disconnect
          </Button>
        </div>

        <div className="space-y-3">
          {showNetworkSelector && (
            <div className="flex items-center justify-between">
              <span className={`font-medium text-gray-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>Network:</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={getNetworkColorClasses(account.network)}>
                  {account.network}
                </Badge>
                <Button
                  onClick={() => setShowNetworkSwitcher(!showNetworkSwitcher)}
                  disabled={isConnecting}
                  variant="link"
                  size="sm"
                >
                  Switch
                </Button>
              </div>
            </div>
          )}

          {showNetworkSwitcher && showNetworkSelector && (
            <div className="border rounded-md p-3 bg-gray-50">
              <p className={`font-medium text-gray-700 mb-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                Select Network:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {supportedNetworks.map(network => (
                  <Button
                    key={network}
                    onClick={() => handleNetworkSwitch(network)}
                    disabled={isConnecting || network === account.network}
                    variant={network === account.network ? 'secondary' : 'outline'}
                    size="sm"
                  >
                    {network}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className={`font-medium text-gray-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>Address:</span>
            <code className={`bg-gray-100 px-2 py-1 rounded ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
              {formatAddress(account.address)}
            </code>
          </div>

          {showBalance && account.balance && (
            <div className="flex items-center justify-between">
              <span className={`font-medium text-gray-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>Balance:</span>
              <span className={`font-mono ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{account.balance} ETH</span>
            </div>
          )}
        </div>

        {isConnecting && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600" />
            <span className={`ml-2 text-gray-600 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>Processing...</span>
          </div>
        )}
      </div>
    );
  }

  // Disconnected state
  return (
    <div className={containerClasses} data-testid={dataTestId}>
      <h3
        className={`font-medium text-gray-900 mb-4 ${size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-base' : 'text-lg'}`}
      >
        {variant === 'compact' ? 'Connect' : 'Connect Wallet'}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className={`text-red-800 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {showNetworkSelector && (
          <div>
            <label
              htmlFor="network-selector"
              className={`block font-medium text-gray-700 mb-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
            >
              Select Network:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {supportedNetworks.map(network => (
                <Button
                  key={network}
                  onClick={() => setSelectedNetwork(network)}
                  variant={selectedNetwork === network ? 'default' : 'outline'}
                  size="sm"
                >
                  {network}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect to {selectedNetwork}
            </>
          )}
        </Button>

        {variant !== 'compact' && (
          <div className={`text-gray-500 space-y-1 ${size === 'sm' ? 'text-xs' : 'text-xs'}`}>
            <p>• This is a demo implementation</p>
            <p>• Real wallet integration will be added in production</p>
            <p>• Supports multiple blockchain networks</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions for mock data
function generateMockAddress(network: BlockchainNetwork): string {
  const prefixes: Record<string, string> = {
    solana: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    polkadot: '1' + Math.random().toString(36).substring(2, 15),
    polygon: '0x' + Math.random().toString(16).substring(2, 42),
    moonbeam: '0x' + Math.random().toString(16).substring(2, 42),
    base: '0x' + Math.random().toString(16).substring(2, 42),
  };

  return prefixes[network] || '0x' + Math.random().toString(16).substring(2, 42);
}

function generateMockBalance(): string {
  return (Math.random() * 100).toFixed(4);
}

export default WalletConnect;
