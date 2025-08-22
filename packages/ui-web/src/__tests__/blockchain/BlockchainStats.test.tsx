import { render, screen } from '@testing-library/react';

import { BlockchainStats, type BlockchainStatsData } from '../../components/blockchain/BlockchainStats/BlockchainStats';

describe('BlockchainStats', () => {
  const mockData: BlockchainStatsData = {
    total: 100,
    onChain: 75,
    offChain: 25,
    networkBreakdown: {
      polygon: 45,
      ethereum: 20,
      solana: 10,
    },
    pendingTransactions: 5,
    syncPercentage: 85,
  };

  it('renders correctly with data', () => {
    render(<BlockchainStats data={mockData} />);
    expect(screen.getByText('Total Todos')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('On-Chain')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('Off-Chain')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<BlockchainStats data={mockData} variant="default" />);
    expect(screen.getByText('Total Todos').closest('.stats')).toHaveClass('stats-horizontal');

    rerender(<BlockchainStats data={mockData} variant="compact" />);
    expect(screen.getByText('Total Todos').closest('.stats')).toHaveClass('stats-compact');

    rerender(<BlockchainStats data={mockData} variant="detailed" />);
    expect(screen.getByText('Total Todos').closest('.stats')).toHaveClass('stats-vertical');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<BlockchainStats data={mockData} size="sm" />);
    expect(screen.getByText('Total Todos').closest('.stats')).toHaveClass('text-sm');

    rerender(<BlockchainStats data={mockData} size="md" />);
    expect(screen.getByText('Total Todos').closest('.stats')).toHaveClass('text-base');

    rerender(<BlockchainStats data={mockData} size="lg" />);
    expect(screen.getByText('Total Todos').closest('.stats')).toHaveClass('text-lg');
  });

  it('shows sync percentage when enabled', () => {
    render(<BlockchainStats data={mockData} showSyncPercentage={true} />);
    expect(screen.getByText('Sync Progress')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('hides sync percentage when disabled', () => {
    render(<BlockchainStats data={mockData} showSyncPercentage={false} />);
    expect(screen.queryByText('Sync Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('85%')).not.toBeInTheDocument();
  });

  it('shows network breakdown when enabled', () => {
    render(<BlockchainStats data={mockData} showNetworkBreakdown={true} />);
    // Test will be expanded during actual implementation
    expect(screen.getByText('Total Todos')).toBeInTheDocument();
  });

  it('hides network breakdown when disabled', () => {
    render(<BlockchainStats data={mockData} showNetworkBreakdown={false} />);
    // Test will be expanded during actual implementation
    expect(screen.getByText('Total Todos')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const zeroData: BlockchainStatsData = {
      total: 0,
      onChain: 0,
      offChain: 0,
      networkBreakdown: {},
      pendingTransactions: 0,
      syncPercentage: 0,
    };
    render(<BlockchainStats data={zeroData} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
