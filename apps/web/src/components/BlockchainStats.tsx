'use client';

import { useMemo } from 'react';
import type { Todo } from './TodoItem';

interface BlockchainStatsProps {
  todos: Todo[];
}

export function BlockchainStats({ todos }: BlockchainStatsProps) {
  const stats = useMemo(() => {
    const total = todos.length;
    const onChain = todos.filter(todo => todo.blockchainNetwork).length;
    const offChain = total - onChain;
    
    const networkBreakdown = todos.reduce((acc, todo) => {
      if (todo.blockchainNetwork) {
        acc[todo.blockchainNetwork] = (acc[todo.blockchainNetwork] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const pendingTransactions = todos.filter(
      todo => todo.transactionHash && !todo.blockchainAddress
    ).length;

    return {
      total,
      onChain,
      offChain,
      networkBreakdown,
      pendingTransactions,
      syncPercentage: total > 0 ? Math.round((onChain / total) * 100) : 0,
    };
  }, [todos]);

  const getNetworkColor = (network: string) => {
    const colors = {
      solana: 'bg-purple-100 text-purple-800',
      polkadot: 'bg-pink-100 text-pink-800',
      polygon: 'bg-indigo-100 text-indigo-800',
    };
    return colors[network as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Blockchain Integration</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.onChain}</div>
          <div className="text-sm text-gray-600">On-Chain</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.offChain}</div>
          <div className="text-sm text-gray-600">Off-Chain</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.syncPercentage}%</div>
          <div className="text-sm text-gray-600">Synced</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      {Object.keys(stats.networkBreakdown).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Network Distribution</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.networkBreakdown).map(([network, count]) => (
              <span
                key={network}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNetworkColor(network)}`}
              >
                {network}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.syncPercentage < 100 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <svg className="h-4 w-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              You have {stats.offChain} todo{stats.offChain !== 1 ? 's' : ''} that can be synced to blockchain networks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}