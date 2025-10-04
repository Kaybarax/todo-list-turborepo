'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, NetworkSelector } from '@todo/ui-web';
import { BlockchainNetwork } from '@todo/services';
import { useWallet } from '../WalletProvider';

export const WalletCard: React.FC = () => {
  const { isConnected, isConnecting, account, connect, disconnect, switchNetwork, supportedNetworks } = useWallet();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected && account ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Network</p>
              <p className="text-sm text-muted-foreground">{account.network}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{account.address}</p>
            </div>
            {account.balance && (
              <div>
                <p className="text-sm font-medium">Balance</p>
                <p className="text-sm text-muted-foreground">{account.balance}</p>
              </div>
            )}
            <Button variant="outline" onClick={disconnect} disabled={isConnecting}>
              Disconnect
            </Button>
            <div className="space-y-2">
              <p className="text-sm font-medium">Switch Network</p>
              <NetworkSelector
                networks={supportedNetworks}
                selectedNetwork={account.network as string}
                onSelect={network => switchNetwork(network as any)}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select a network to connect</p>
            <div className="flex flex-wrap gap-2">
              {supportedNetworks.map(network => (
                <Button key={network} onClick={() => connect(network as any)} disabled={isConnecting}>
                  Connect {network}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
