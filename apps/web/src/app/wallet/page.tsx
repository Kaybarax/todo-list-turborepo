export default function WalletPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Wallet Connection
          </h2>
          <p className="text-gray-600 mb-6">
            Wallet connectivity will be implemented in the next task.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>⏳ WalletConnect integration</p>
            <p>⏳ Multi-network support (Solana, Polkadot, Polygon)</p>
            <p>⏳ Wallet authentication</p>
            <p>⏳ Transaction signing</p>
          </div>
        </div>
      </div>
    </div>
  );
}