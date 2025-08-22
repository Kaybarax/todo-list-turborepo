import React, { useState, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const transactionStatusVariants = cva('flex items-center space-x-2', {
  variants: {
    variant: {
      default: 'text-sm',
      compact: 'text-xs',
      detailed: 'text-base p-3 bg-base-100 rounded-lg border',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const statusBadgeVariants = cva('inline-flex items-center px-2 py-1 rounded-full font-medium', {
  variants: {
    status: {
      pending: 'bg-warning/20 text-warning',
      confirmed: 'bg-success/20 text-success',
      failed: 'bg-error/20 text-error',
    },
    size: {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-1 text-xs',
      lg: 'px-2.5 py-1 text-sm',
    },
  },
  defaultVariants: {
    status: 'pending',
    size: 'md',
  },
});

export type TransactionStatusType = 'pending' | 'confirmed' | 'failed';

export interface TransactionStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof transactionStatusVariants> {
  transactionHash: string;
  network: string;
  onStatusChange?: (status: TransactionStatusType) => void;
  showHash?: boolean;
  autoRefresh?: boolean;
  pollingInterval?: number;
  maxPollingTime?: number;
  createBlockchainService?: (network: string) => {
    getTransactionStatus: (hash: string) => Promise<TransactionStatusType>;
  };
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
      autoRefresh = true,
      pollingInterval = 3000,
      maxPollingTime = 300000, // 5 minutes
      createBlockchainService,
      ...props
    },
    ref,
  ) => {
    const [status, setStatus] = useState<TransactionStatusType>('pending');
    const [isChecking, setIsChecking] = useState(autoRefresh);
    const [error, setError] = useState<string | null>(null);

    const formatHash = useCallback(
      (hash: string) => {
        if (variant === 'compact') {
          return `${hash.slice(0, 4)}...${hash.slice(-2)}`;
        }
        if (variant === 'detailed') {
          return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
        }
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
      },
      [variant],
    );

    const checkTransactionStatus = useCallback(async () => {
      if (!createBlockchainService) {
        return;
      }

      try {
        setError(null);
        const blockchainService = createBlockchainService(network);
        const currentStatus = await blockchainService.getTransactionStatus(transactionHash);

        setStatus(currentStatus);
        onStatusChange?.(currentStatus);

        if (currentStatus === 'confirmed' || currentStatus === 'failed') {
          setIsChecking(false);
        }
      } catch (err) {
        console.error('Failed to check transaction status:', err);
        setError(err instanceof Error ? err.message : 'Failed to check status');
        setStatus('failed');
        setIsChecking(false);
        onStatusChange?.('failed');
      }
    }, [createBlockchainService, network, transactionHash, onStatusChange]);

    useEffect(() => {
      if (!autoRefresh || !createBlockchainService) {
        return;
      }

      // Check status immediately
      void checkTransactionStatus();

      if (!isChecking) {
        return;
      }

      // Set up polling
      const intervalId = setInterval(() => {
        void checkTransactionStatus();
      }, pollingInterval);

      // Set timeout to stop checking after maxPollingTime
      const timeoutId = setTimeout(() => {
        setIsChecking(false);
        clearInterval(intervalId);
      }, maxPollingTime);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }, [autoRefresh, createBlockchainService, isChecking, checkTransactionStatus, pollingInterval, maxPollingTime]);

    const getStatusIcon = () => {
      const iconClass = cn('h-3 w-3', {
        'h-2 w-2': size === 'sm',
        'h-4 w-4': size === 'lg',
      });

      switch (status) {
        case 'pending':
          return (
            <svg className={cn(iconClass, 'animate-spin')} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          );
        case 'confirmed':
          return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case 'failed':
          return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          );
        default:
          return null;
      }
    };

    const statusText: Record<TransactionStatusType, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      failed: 'Failed',
    };

    if (variant === 'detailed') {
      return (
        <div ref={ref} className={cn(transactionStatusVariants({ variant, size }), className)} {...props}>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Transaction Status</span>
              <span className={cn(statusBadgeVariants({ status, size }))}>
                {getStatusIcon()}
                <span className="ml-1">{statusText[status]}</span>
              </span>
            </div>

            {showHash && (
              <div className="text-sm text-base-content/70">
                <span className="font-medium">Hash:</span>{' '}
                <code className="bg-base-200 px-1 py-0.5 rounded text-xs">{formatHash(transactionHash)}</code>
              </div>
            )}

            <div className="text-sm text-base-content/70">
              <span className="font-medium">Network:</span> {network}
            </div>

            {error && <div className="text-sm text-error">Error: {error}</div>}

            {isChecking && status === 'pending' && (
              <div className="text-xs text-base-content/50">Checking status every {pollingInterval / 1000}s...</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(transactionStatusVariants({ variant, size }), className)} {...props}>
        <span className={cn(statusBadgeVariants({ status, size }))}>
          {getStatusIcon()}
          <span className="ml-1">{statusText[status]}</span>
        </span>

        {showHash && (
          <span className="text-base-content/60">
            Tx: <code className="bg-base-200 px-1 py-0.5 rounded">{formatHash(transactionHash)}</code>
          </span>
        )}

        {variant === 'default' && <span className="text-base-content/50 text-xs">{network}</span>}

        {isChecking && status === 'pending' && <span className="text-base-content/40 text-xs">Checking...</span>}

        {error && variant !== 'compact' && <span className="text-error text-xs">Error</span>}
      </div>
    );
  },
);

TransactionStatus.displayName = 'TransactionStatus';

export { TransactionStatus, transactionStatusVariants };
