'use client';

import { useState } from 'react';
import { Button, Badge } from '@todo/ui-web';
// import { NetworkSelector } from '@todo/ui-web';
import { useWallet } from './WalletProvider';
import { getNetworkColor } from '@todo/services';

export const WalletConnect = () => {
  const { isConnected, isConnecting, account, error, supportedNetworks, connect, disconnect, switchNetwork } =
    useWallet();

  const [selectedNetwork, setSelectedNetwork] = useState<'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base'>(
    'solana',
  );
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  const handleConnect = async () => {
    try {
      await connect(selectedNetwork);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Disconnection failed:', err);
    }
  };

  const handleNetworkSwitch = async (network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => {
    try {
      await switchNetwork(network);
      setShowNetworkSelector(false);
    } catch (err) {
      console.error('Network switch failed:', err);
    }
  };

  const getNetworkColorClasses = (network: string) => {
    const baseColor = getNetworkColor(network);
    // Convert hex color to Tailwind classes - this is a simplified mapping
    const colorMap: Record<string, string> = {
      '#9333ea': 'bg-purple-100 text-purple-800 border-purple-200',
      '#ec4899': 'bg-pink-100 text-pink-800 border-pink-200',
      '#6366f1': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '#14b8a6': 'bg-teal-100 text-teal-800 border-teal-200',
      '#3b82f6': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colorMap[baseColor] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Wallet Connected</h3>
          <Button onClick={() => void handleDisconnect()} disabled={isConnecting} variant="destructive" size="sm">
            Disconnect
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Network:</span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getNetworkColorClasses(account.network)}>
                {account.network}
              </Badge>
              <Button
                onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                disabled={isConnecting}
                variant="link"
                size="sm"
              >
                Switch
              </Button>
            </div>
          </div>

          {showNetworkSelector && (
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">Select Network:</p>
              <div className="grid grid-cols-3 gap-2">
                {supportedNetworks.map(network => (
                  <Button
                    key={network}
                    onClick={() => void handleNetworkSwitch(network)}
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
            <span className="text-sm font-medium text-gray-700">Address:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{formatAddress(account.address)}</code>
          </div>

          {account.balance && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Balance:</span>
              <span className="text-sm font-mono">{account.balance} ETH</span>
            </div>
          )}
        </div>

        {isConnecting && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600" />
            <span className="ml-2 text-sm text-gray-600">Processing...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Connect Wallet</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="network-selector" className="block text-sm font-medium text-gray-700 mb-2">
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

        <Button onClick={() => void handleConnect()} disabled={isConnecting} className="w-full">
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

        <div className="text-xs text-gray-500 space-y-1">
          <p>• This is a demo implementation</p>
          <p>• Real wallet integration will be added in production</p>
          <p>• Supports Solana, Polkadot, Polygon, Moonbeam, and Base networks</p>
        </div>
      </div>
    </div>
  );
};
