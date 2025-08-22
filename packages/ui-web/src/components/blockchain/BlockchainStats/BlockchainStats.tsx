import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';

const blockchainStatsVariants = cva('stats shadow', {
  variants: {
    variant: {
      default: 'stats-horizontal',
      compact: 'stats-horizontal stats-compact',
      detailed: 'stats-vertical lg:stats-horizontal',
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
      ...props
    },
    ref,
  ) => {
    // Component implementation will be added during migration
    return (
      <div ref={ref} className={cn(blockchainStatsVariants({ variant, size }), className)} {...props}>
        <div className="stat">
          <div className="stat-title">Total Todos</div>
          <div className="stat-value">{data.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">On-Chain</div>
          <div className="stat-value text-primary">{data.onChain}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Off-Chain</div>
          <div className="stat-value text-secondary">{data.offChain}</div>
        </div>
        {showSyncPercentage && (
          <div className="stat">
            <div className="stat-title">Sync Progress</div>
            <div className="stat-value text-accent">{data.syncPercentage}%</div>
          </div>
        )}
        <div className="placeholder-content p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 col-span-full">
          BlockchainStats component - Implementation pending migration
        </div>
      </div>
    );
  },
);

BlockchainStats.displayName = 'BlockchainStats';

export { BlockchainStats, blockchainStatsVariants };
