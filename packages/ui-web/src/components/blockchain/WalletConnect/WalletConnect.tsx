import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const walletConnectVariants = cva('card bg-base-100 shadow-sm', {
  variants: {
    variant: {
      default: 'card-normal',
      compact: 'card-compact',
      'button-only': 'card-compact p-0',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface WalletAccount {
  address: string;
  network: string;
  balance?: string;
}

export interface WalletConnectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof walletConnectVariants> {
  onConnect?: (account: WalletAccount) => void;
  onDisconnect?: () => void;
  onNetworkSwitch?: (network: string) => void;
  supportedNetworks?: string[];
  showBalance?: boolean;
  showNetworkSelector?: boolean;
  connectedAccount?: WalletAccount | null;
}

const WalletConnect = React.forwardRef<HTMLDivElement, WalletConnectProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      onConnect,
      onDisconnect,
      onNetworkSwitch,
      supportedNetworks = ['polygon', 'ethereum'],
      showBalance = true,
      showNetworkSelector = true,
      connectedAccount = null,
      ...props
    },
    ref,
  ) => {
    // Component implementation will be added during migration
    return (
      <div ref={ref} className={cn(walletConnectVariants({ variant, size }), className)} {...props}>
        <div className="card-body">
          {connectedAccount ? (
            <div className="space-y-2">
              <div className="font-medium">Connected Wallet</div>
              <div className="text-sm opacity-70">
                {connectedAccount.address.slice(0, 6)}...{connectedAccount.address.slice(-4)}
              </div>
              <div className="text-sm opacity-70">Network: {connectedAccount.network}</div>
              {showBalance && connectedAccount.balance && (
                <div className="text-sm opacity-70">Balance: {connectedAccount.balance}</div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="font-medium mb-2">Connect Wallet</div>
              <button className="btn btn-primary btn-sm">Connect</button>
            </div>
          )}
          <div className="placeholder-content p-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 mt-2">
            WalletConnect component - Implementation pending migration
          </div>
        </div>
      </div>
    );
  },
);

WalletConnect.displayName = 'WalletConnect';

export { WalletConnect, walletConnectVariants };
