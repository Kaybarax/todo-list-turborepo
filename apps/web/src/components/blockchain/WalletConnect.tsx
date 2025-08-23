'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@todo/ui-web';
import {
  getNetworkDisplayInfo,
  mapBlockchainNetworkToWalletNetwork,
  generateMockAddress as generateServiceMockAddress,
  type BlockchainNetwork,
} from '@todo/services';

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

const walletConnectVariants = cva('bg-base-100 rounded-lg shadow-sm border border-base-300 p-4', {
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
        // Use the service's mock address generator for better network compatibility
        const mockAccount: WalletAccount = {
          address: generateServiceMockAddress(mapBlockchainNetworkToWalletNetwork(selectedNetwork) || 'polygon'),
          network: selectedNetwork,
          balance: generateMockBalance(),
          chainId: getNetworkDisplayInfo(selectedNetwork).chainId.toString(),
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

  const getNetworkBadgeClasses = useCallback((network: BlockchainNetwork) => {
    try {
      const networkInfo = getNetworkDisplayInfo(network);
      const baseColor = networkInfo.color;

      // Convert hex color to DaisyUI badge classes
      const colorMap: Record<string, string> = {
        '#9333ea': 'badge-primary',
        '#ec4899': 'badge-secondary',
        '#6366f1': 'badge-accent',
        '#14b8a6': 'badge-info',
        '#3b82f6': 'badge-info',
        '#a855f7': 'badge-primary',
        '#f472b6': 'badge-secondary',
        '#818cf8': 'badge-accent',
        '#5eead4': 'badge-info',
        '#93c5fd': 'badge-info',
      };

      return `badge ${colorMap[baseColor] || 'badge-neutral'}`;
    } catch {
      return 'badge badge-neutral';
    }
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

  const getNetworkDisplayName = useCallback((network: BlockchainNetwork) => {
    try {
      return getNetworkDisplayInfo(network).displayName;
    } catch {
      return network;
    }
  }, []);

  const containerClasses = useMemo(
    () => walletConnectVariants({ variant, size, className }),
    [variant, size, className],
  );

  const buttonSizeClass = size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : 'btn-md';

  // Button-only variant renders just the connect/disconnect button
  if (variant === 'button-only') {
    if (isConnected && account) {
      return (
        <button
          type="button"
          onClick={handleDisconnect}
          disabled={isConnecting}
          className={cn('btn btn-error', buttonSizeClass, className)}
          data-testid={dataTestId}
        >
          Disconnect
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleConnect}
        disabled={isConnecting}
        className={cn('btn btn-primary', buttonSizeClass, className)}
        data-testid={dataTestId}
      >
        {isConnecting ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  // Connected state
  if (isConnected && account) {
    return (
      <div className={containerClasses} data-testid={dataTestId}>
        <div className="flex items-center justify-between mb-4">
          <h3
            className={cn('font-semibold text-base-content', {
              'text-lg': size === 'lg',
              'text-base': size === 'md',
              'text-sm': size === 'sm',
            })}
          >
            {variant === 'compact' ? 'Connected' : 'Wallet Connected'}
          </h3>
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={isConnecting}
            className={cn('btn btn-error', size === 'lg' ? 'btn-md' : 'btn-sm')}
          >
            Disconnect
          </button>
        </div>

        <div className="space-y-3">
          {showNetworkSelector && (
            <div className="flex items-center justify-between">
              <span
                className={cn('font-medium text-base-content', {
                  'text-sm': size === 'md',
                  'text-xs': size === 'sm',
                })}
              >
                Network:
              </span>
              <div className="flex items-center space-x-2">
                <span className={getNetworkBadgeClasses(account.network)}>
                  {getNetworkDisplayName(account.network)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowNetworkSwitcher(!showNetworkSwitcher)}
                  disabled={isConnecting}
                  className="btn btn-ghost btn-sm"
                >
                  Switch
                </button>
              </div>
            </div>
          )}

          {showNetworkSwitcher && showNetworkSelector && (
            <div className="border border-base-300 rounded-md p-3 bg-base-200">
              <p
                className={cn('font-medium text-base-content mb-2', {
                  'text-sm': size === 'md',
                  'text-xs': size === 'sm',
                })}
              >
                Select Network:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {supportedNetworks.map(network => (
                  <button
                    key={network}
                    type="button"
                    onClick={() => handleNetworkSwitch(network)}
                    disabled={isConnecting || network === account.network}
                    className={cn('btn btn-sm', {
                      'btn-primary': network === account.network,
                      'btn-outline': network !== account.network,
                    })}
                  >
                    {getNetworkDisplayName(network)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span
              className={cn('font-medium text-base-content', {
                'text-sm': size === 'md',
                'text-xs': size === 'sm',
              })}
            >
              Address:
            </span>
            <code
              className={cn('bg-base-200 px-2 py-1 rounded text-base-content', {
                'text-sm': size === 'md',
                'text-xs': size === 'sm',
              })}
            >
              {formatAddress(account.address)}
            </code>
          </div>

          {showBalance && account.balance && (
            <div className="flex items-center justify-between">
              <span
                className={cn('font-medium text-base-content', {
                  'text-sm': size === 'md',
                  'text-xs': size === 'sm',
                })}
              >
                Balance:
              </span>
              <span
                className={cn('font-mono text-base-content', {
                  'text-sm': size === 'md',
                  'text-xs': size === 'sm',
                })}
              >
                {account.balance} {getNetworkDisplayInfo(account.network).name === 'Solana' ? 'SOL' : 'ETH'}
              </span>
            </div>
          )}
        </div>

        {isConnecting && (
          <div className="mt-4 flex items-center justify-center">
            <span className="loading loading-spinner loading-sm"></span>
            <span
              className={cn('ml-2 text-base-content/70', {
                'text-sm': size === 'md',
                'text-xs': size === 'sm',
              })}
            >
              Processing...
            </span>
          </div>
        )}
      </div>
    );
  }

  // Disconnected state
  return (
    <div className={containerClasses} data-testid={dataTestId}>
      <h3
        className={cn('font-semibold text-base-content mb-4', {
          'text-lg': size === 'lg',
          'text-base': size === 'md',
          'text-sm': size === 'sm',
        })}
      >
        {variant === 'compact' ? 'Connect' : 'Connect Wallet'}
      </h3>

      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            className={cn({
              'text-sm': size === 'md',
              'text-xs': size === 'sm',
            })}
          >
            {error}
          </span>
        </div>
      )}

      <div className="space-y-4">
        {showNetworkSelector && (
          <div>
            <label
              htmlFor="network-selector"
              className={cn('block font-medium text-base-content mb-2', {
                'text-sm': size === 'md',
                'text-xs': size === 'sm',
              })}
            >
              Select Network:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {supportedNetworks.map(network => (
                <button
                  key={network}
                  type="button"
                  onClick={() => setSelectedNetwork(network)}
                  className={cn('btn btn-sm', {
                    'btn-primary': selectedNetwork === network,
                    'btn-outline': selectedNetwork !== network,
                  })}
                >
                  {getNetworkDisplayName(network)}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleConnect}
          disabled={isConnecting}
          className={cn('btn btn-primary w-full', buttonSizeClass)}
        >
          {isConnecting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect to {getNetworkDisplayName(selectedNetwork)}
            </>
          )}
        </button>

        {variant !== 'compact' && (
          <div
            className={cn('text-base-content/60 space-y-1', {
              'text-sm': size === 'md',
              'text-xs': size === 'sm',
            })}
          >
            <p>• This is a demo implementation</p>
            <p>• Real wallet integration will be added in production</p>
            <p>• Supports multiple blockchain networks</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for mock data
function generateMockBalance(): string {
  return (Math.random() * 100).toFixed(4);
}

export default WalletConnect;
