'use client';

import { WalletCard } from '@/components/blockchain/WalletCard';
import { useWallet } from '@/components/WalletProvider';
import { useToast } from '@todo/ui-web';
import { Button } from '@todo/ui-web';

const WalletPage = () => {
  const { isConnected, account, signMessage, sendTransaction } = useWallet();
  const { toast } = useToast();

  const handleSignMessage = async () => {
    try {
      const message = 'Hello from Todo App!';
      const signature = await signMessage(message);
      toast({ variant: 'success', title: 'Message signed!', description: `Signature: ${signature.slice(0, 20)}...` });
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Failed to sign message',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleSendTransaction = async () => {
    try {
      const txHash = await sendTransaction(
        '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Df8',
        '0.001',
        'Todo app transaction',
      );
      toast({ variant: 'success', title: 'Transaction sent!', description: `Hash: ${txHash.slice(0, 20)}...` });
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Failed to send transaction',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wallet Connection</h1>
        <p className="mt-1 text-sm text-gray-600">Connect your wallet to enable blockchain features for your todos.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WalletCard />
        <div className="space-y-4">
          {isConnected && account ? (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Actions</h3>
              <div className="space-y-3">
                <Button onClick={() => void handleSignMessage()} className="w-full">
                  Sign Message
                </Button>
                <Button onClick={() => void handleSendTransaction()} className="w-full">
                  Send Test Transaction
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
