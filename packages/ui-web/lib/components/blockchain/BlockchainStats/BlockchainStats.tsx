import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@todo/utils/ui/web';

const blockchainStatsVariants = cva('bg-base-100 rounded-lg shadow-sm border', {
  variants: {
    variant: {
      default: 'p-4',
      compact: 'p-3',
      detailed: 'p-6',
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

const statGridVariants = cva('grid gap-4 mb-4', {
  variants: {
    variant: {
      default: 'grid-cols-2 sm:grid-cols-4',
      compact: 'grid-cols-4',
      detailed: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BlockchainStatsData {
  total: number;
  onChain: number;
  offChain: number;
  networkBreakdown: Record<string, number>;
  pendingTransactions: number;
  syncPercentage: number;
}

export interface BlockchainStatsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof blockchainStatsVariants> {
  data: BlockchainStatsData;
  showNetworkBreakdown?: boolean;
  showSyncPercentage?: boolean;
  getNetworkColor?: (network: string) => string;
}

const BlockchainStats = React.forwardRef<HTMLDivElement, BlockchainStatsProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      data,
      showNetworkBreakdown = true,
      showSyncPercentage = true,
      getNetworkColor,
      ...props
    },
    ref,
  ) => {
    const getNetworkColorClasses = (network: string) => {
      if (!getNetworkColor) {
        return 'bg-base-200 text-base-content';
      }

      const baseColor = getNetworkColor(network);
      // Convert hex color to DaisyUI classes - simplified mapping
      const colorMap: Record<string, string> = {
        '#9333ea': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        '#ec4899': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        '#6366f1': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        '#14b8a6': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
        '#3b82f6': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      };
      return colorMap[baseColor] || 'bg-base-200 text-base-content';
    };

    if (data.total === 0) {
      return null;
    }

    return (
      <div ref={ref} className={cn(blockchainStatsVariants({ variant, size }), className)} {...props}>
        <h3
          className={cn('font-medium text-base-content mb-4', {
            'text-lg': size === 'md' || size === 'lg',
            'text-base': size === 'sm',
            'text-xl': size === 'lg' && variant === 'detailed',
          })}
        >
          Blockchain Integration
        </h3>

        <div className={cn(statGridVariants({ variant }))}>
          <div className="text-center">
            <div
              className={cn('font-bold text-primary', {
                'text-xl': size === 'sm',
                'text-2xl': size === 'md',
                'text-3xl': size === 'lg',
              })}
            >
              {data.onChain}
            </div>
            <div className="text-sm text-base-content/70">On-Chain</div>
          </div>
          <div className="text-center">
            <div
              className={cn('font-bold text-base-content/70', {
                'text-xl': size === 'sm',
                'text-2xl': size === 'md',
                'text-3xl': size === 'lg',
              })}
            >
              {data.offChain}
            </div>
            <div className="text-sm text-base-content/70">Off-Chain</div>
          </div>
          {showSyncPercentage && (
            <div className="text-center">
              <div
                className={cn('font-bold text-success', {
                  'text-xl': size === 'sm',
                  'text-2xl': size === 'md',
                  'text-3xl': size === 'lg',
                })}
              >
                {data.syncPercentage}%
              </div>
              <div className="text-sm text-base-content/70">Synced</div>
            </div>
          )}
          <div className="text-center">
            <div
              className={cn('font-bold text-warning', {
                'text-xl': size === 'sm',
                'text-2xl': size === 'md',
                'text-3xl': size === 'lg',
              })}
            >
              {data.pendingTransactions}
            </div>
            <div className="text-sm text-base-content/70">Pending</div>
          </div>
        </div>

        {showNetworkBreakdown && Object.keys(data.networkBreakdown).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-base-content/80 mb-2">Network Distribution</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.networkBreakdown).map(([network, count]) => (
                <span
                  key={network}
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getNetworkColorClasses(network),
                  )}
                >
                  {network}: {count}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.syncPercentage < 100 && (
          <div className="alert alert-info">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">
              You have {data.offChain} todo{data.offChain !== 1 ? 's' : ''} that can be synced to blockchain networks.
            </span>
          </div>
        )}
      </div>
    );
  },
);

BlockchainStats.displayName = 'BlockchainStats';

export { BlockchainStats, blockchainStatsVariants };
