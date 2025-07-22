'use client';

import { useState } from 'react';
import { useWallet } from './WalletProvider';

export function WalletConnect() {
  const {
    isConnected,
    isConnecting,
    account,
    error,
    supportedNetworks,
    connect,
    disconnect,
    switchNetwork,
  } = useWallet();

  const [selectedNetwork, setSelectedNetwork] = useState<'solana' | 'polkadot' | 'polygon'>('solana');
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

  const handleNetworkSwitch = async (network: 'solana' | 'polkadot' | 'polygon') => {
    try {
      await switchNetwork(network);
      setShowNetworkSelector(false);
    } catch (err) {
      console.error('Network switch failed:', err);
    }
  };

  const getNetworkColor = (network: string) => {
    const colors = {
      solana: 'bg-purple-100 text-purple-800 border-purple-200',
      polkadot: 'bg-pink-100 text-pink-800 border-pink-200',
      polygon: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[network as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Wallet Connected</h3>
          <button
            onClick={handleDisconnect}
            disabled={isConnecting}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Network:</span>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getNetworkColor(
                  account.network
                )}`}
              >
                {account.network}
              </span>
              <button
                onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                disabled={isConnecting}
                className="text-sm text-primary-600 hover:text-primary-800 disabled:opacity-50"
              >
                Switch
              </button>
            </div>
          </div>

          {showNetworkSelector && (
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">Select Network:</p>
              <div className="grid grid-cols-3 gap-2">
                {supportedNetworks.map((network) => (
                  <button
                    key={network}
                    onClick={() => handleNetworkSwitch(network)}
                    disabled={isConnecting || network === account.network}
                    className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors ${
                      network === account.network
                        ? `${getNetworkColor(network)} opacity-50 cursor-not-allowed`
                        : `${getNetworkColor(network)} hover:opacity-80`
                    }`}
                  >
                    {network}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Address:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {formatAddress(account.address)}
            </code>
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
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Network:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {supportedNetworks.map((network) => (
              <button
                key={network}
                onClick={() => setSelectedNetwork(network)}
                className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                  selectedNetwork === network
                    ? `${getNetworkColor(network)} ring-2 ring-primary-500`
                    : `${getNetworkColor(network)} hover:opacity-80`
                }`}
              >
                {network}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
        </button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• This is a demo implementation</p>
          <p>• Real wallet integration will be added in production</p>
          <p>• Supports Solana, Polkadot, and Polygon networks</p>
        </div>
      </div>
    </div>
  );
}