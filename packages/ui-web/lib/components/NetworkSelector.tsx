import { Badge } from './Badge';
import { getNetworkColor, getSupportedWalletNetworks } from '@todo/services';

export interface NetworkSelectorProps {
  selectedNetwork: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base';
  onNetworkSelect: (network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => void;
  disabled?: boolean;
  variant?: 'grid' | 'dropdown';
  showTestnets?: boolean;
  className?: string;
}

const NETWORK_INFO = {
  solana: {
    name: 'Solana',
    description: 'High-performance blockchain',
    icon: '◎',
  },
  polkadot: {
    name: 'Polkadot',
    description: 'Interoperable blockchain',
    icon: '●',
  },
  polygon: {
    name: 'Polygon',
    description: 'Ethereum scaling solution',
    icon: '⬟',
  },
  moonbeam: {
    name: 'Moonbeam',
    description: 'Ethereum on Polkadot',
    icon: '🌙',
  },
  base: {
    name: 'Base',
    description: 'Coinbase L2 solution',
    icon: '🔵',
  },
};

export function NetworkSelector({
  selectedNetwork,
  onNetworkSelect,
  disabled = false,
  variant = 'grid',
  className = '',
}: NetworkSelectorProps) {
  const supportedNetworks = getSupportedWalletNetworks();

  const getNetworkColorClasses = (network: string) => {
    const baseColor = getNetworkColor(network);
    // Convert hex color to Tailwind classes
    const colorMap: Record<string, string> = {
      '#9333ea': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
      '#ec4899': 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
      '#6366f1': 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
      '#14b8a6': 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
      '#3b82f6': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    };
    return colorMap[baseColor] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={selectedNetwork}
          onChange={e => onNetworkSelect(e.target.value as any)}
          disabled={disabled}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        >
          {supportedNetworks.map((network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => (
            <option key={network} value={network}>
              {NETWORK_INFO[network].icon} {NETWORK_INFO[network].name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {supportedNetworks.map((network: 'solana' | 'polkadot' | 'polygon' | 'moonbeam' | 'base') => {
          const isSelected = selectedNetwork === network;
          const networkInfo = NETWORK_INFO[network];

          return (
            <button
              key={network}
              onClick={() => onNetworkSelect(network)}
              disabled={disabled}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200
                ${
                  isSelected
                    ? `${getNetworkColorClasses(network)} border-current shadow-md`
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">{networkInfo.icon}</span>
                <span className="text-sm font-medium">{networkInfo.name}</span>
                <span className="text-xs text-gray-500 text-center leading-tight">{networkInfo.description}</span>
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="secondary" size="sm" className="bg-green-100 text-green-800">
                    ✓
                  </Badge>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 text-center">Select a blockchain network to connect your wallet</div>
    </div>
  );
}

// Already exported as named export via function declaration
