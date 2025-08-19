'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { useWallet } from '@/components/WalletProvider';

const WalletPage = () => {
  const { isConnected, account, signMessage, sendTransaction } = useWallet();

  const handleSignMessage = async () => {
    try {
      const message = 'Hello from Todo App!';
      const signature = await signMessage(message);
      alert(`Message signed!\nSignature: ${signature.slice(0, 20)}...`);
    } catch (error) {
      alert('Failed to sign message: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSendTransaction = async () => {
    try {
      const txHash = await sendTransaction(
        '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Df8',
        '0.001',
        'Todo app transaction',
      );
      alert(`Transaction sent!\nHash: ${txHash.slice(0, 20)}...`);
    } catch (error) {
      alert('Failed to send transaction: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wallet Connection</h1>
        <p className="mt-1 text-sm text-gray-600">Connect your wallet to enable blockchain features for your todos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <WalletConnect />
        </div>

        <div className="space-y-4">
          {isConnected && account ? (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={() => void handleSignMessage()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign Message
                </button>

                <button
                  onClick={() => void handleSendTransaction()}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Send Test Transaction
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Blockchain Features</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Store todos on blockchain networks</li>
                  <li>• Immutable and decentralized storage</li>
                  <li>• Cross-network compatibility</li>
                  <li>• Cryptographic verification</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No wallet connected</h3>
                <p className="mt-1 text-sm text-gray-500">Connect your wallet to access blockchain features.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Supported Networks</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Solana</p>
                  <p className="text-xs text-gray-500">Fast and low-cost transactions</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Polkadot</p>
                  <p className="text-xs text-gray-500">Interoperable blockchain network</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Polygon</p>
                  <p className="text-xs text-gray-500">Ethereum-compatible scaling solution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
