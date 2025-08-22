import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const transactionStatusVariants = cva('alert', {
  variants: {
    variant: {
      default: 'alert-info',
      compact: 'alert-info py-2',
      detailed: 'alert-info p-4',
    },
    status: {
      pending: 'alert-warning',
      confirmed: 'alert-success',
      failed: 'alert-error',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    status: 'pending',
    size: 'md',
  },
});

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface TransactionStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof transactionStatusVariants> {
  transactionHash: string;
  network: string;
  onStatusChange?: (status: TransactionStatus) => void;
  showHash?: boolean;
  autoRefresh?: boolean;
}

const TransactionStatus = React.forwardRef<HTMLDivElement, TransactionStatusProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      transactionHash,
      network,
      onStatusChange,
      showHash = true,
      autoRefresh = false,
      status = 'pending',
      ...props
    },
    ref,
  ) => {
    // Component implementation will be added during migration
    const statusText = {
      pending: 'Transaction Pending',
      confirmed: 'Transaction Confirmed',
      failed: 'Transaction Failed',
    };

    return (
      <div ref={ref} className={cn(transactionStatusVariants({ variant, status, size }), className)} {...props}>
        <div className="flex-1">
          <div className="font-medium">{statusText[status]}</div>
          {showHash && (
            <div className="text-sm opacity-70">
              Hash: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
            </div>
          )}
          <div className="text-sm opacity-70">Network: {network}</div>
        </div>
        <div className="placeholder-content p-2 border border-dashed border-gray-300 rounded text-xs text-gray-500">
          TransactionStatus component - Implementation pending migration
        </div>
      </div>
    );
  },
);

TransactionStatus.displayName = 'TransactionStatus';

export { TransactionStatus, transactionStatusVariants };
