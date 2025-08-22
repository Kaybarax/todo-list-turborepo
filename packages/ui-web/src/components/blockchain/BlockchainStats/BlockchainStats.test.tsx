import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlockchainStats } from './BlockchainStats';
import type { BlockchainStatsData } from './BlockchainStats';

// Mock network color function
const mockGetNetworkColor = vi.fn((network: string): string => {
  const networkColors: Record<string, string> = {
    ethereum: '#6366f1',
    polygon: '#9333ea',
    base: '#3b82f6',
    moonbeam: '#14b8a6',
    polkadot: '#ec4899',
  };
  return networkColors[network.toLowerCase()] || '#6366f1';
});

// Sample test data
const sampleData: BlockchainStatsData = {
  total: 25,
  onChain: 18,
  offChain: 7,
  networkBreakdown: {
    ethereum: 8,
    polygon: 5,
    base: 3,
    moonbeam: 2,
  },
  pendingTransactions: 2,
  syncPercentage: 72,
};

const emptyData: BlockchainStatsData = {
  total: 0,
  onChain: 0,
  offChain: 0,
  networkBreakdown: {},
  pendingTransactions: 0,
  syncPercentage: 0,
};

const fullySyncedData: BlockchainStatsData = {
  total: 20,
  onChain: 20,
  offChain: 0,
  networkBreakdown: {
    ethereum: 12,
    polygon: 5,
    base: 3,
  },
  pendingTransactions: 0,
  syncPercentage: 100,
};

describe('BlockchainStats', () => {
  beforeEach(() => {
    mockGetNetworkColor.mockClear();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText('Blockchain Integration')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument(); // onChain
      expect(screen.getByText('7')).toBeInTheDocument(); // offChain
      expect(screen.getByText('72%')).toBeInTheDocument(); // syncPercentage
      expect(screen.getByText('2')).toBeInTheDocument(); // pendingTransactions
    });

    it('should render all stat labels correctly', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText('On-Chain')).toBeInTheDocument();
      expect(screen.getByText('Off-Chain')).toBeInTheDocument();
      expect(screen.getByText('Synced')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should render network breakdown when showNetworkBreakdown is true', () => {
      render(<BlockchainStats data={sampleData} showNetworkBreakdown={true} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText('Network Distribution')).toBeInTheDocument();
      expect(screen.getByText('ethereum: 8')).toBeInTheDocument();
      expect(screen.getByText('polygon: 5')).toBeInTheDocument();
      expect(screen.getByText('base: 3')).toBeInTheDocument();
      expect(screen.getByText('moonbeam: 2')).toBeInTheDocument();
    });

    it('should not render network breakdown when showNetworkBreakdown is false', () => {
      render(<BlockchainStats data={sampleData} showNetworkBreakdown={false} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.queryByText('Network Distribution')).not.toBeInTheDocument();
      expect(screen.queryByText('ethereum: 8')).not.toBeInTheDocument();
    });

    it('should not render sync percentage when showSyncPercentage is false', () => {
      render(<BlockchainStats data={sampleData} showSyncPercentage={false} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.queryByText('72%')).not.toBeInTheDocument();
      expect(screen.queryByText('Synced')).not.toBeInTheDocument();
    });

    it('should render sync info alert when sync percentage is less than 100%', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText(/You have 7 todos that can be synced/)).toBeInTheDocument();
    });

    it('should not render sync info alert when fully synced', () => {
      render(<BlockchainStats data={fullySyncedData} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.queryByText(/can be synced/)).not.toBeInTheDocument();
    });

    it('should return null when total is 0', () => {
      const { container } = render(<BlockchainStats data={emptyData} getNetworkColor={mockGetNetworkColor} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Variants', () => {
    it('should apply default variant classes', () => {
      const { container } = render(
        <BlockchainStats data={sampleData} variant="default" getNetworkColor={mockGetNetworkColor} />,
      );

      expect(container.firstChild).toHaveClass('p-4');
    });

    it('should apply compact variant classes', () => {
      const { container } = render(
        <BlockchainStats data={sampleData} variant="compact" getNetworkColor={mockGetNetworkColor} />,
      );

      expect(container.firstChild).toHaveClass('p-3');
    });

    it('should apply detailed variant classes', () => {
      const { container } = render(
        <BlockchainStats data={sampleData} variant="detailed" getNetworkColor={mockGetNetworkColor} />,
      );

      expect(container.firstChild).toHaveClass('p-6');
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(<BlockchainStats data={sampleData} size="sm" getNetworkColor={mockGetNetworkColor} />);

      const title = screen.getByText('Blockchain Integration');
      expect(title).toHaveClass('text-base');
    });

    it('should apply medium size classes', () => {
      render(<BlockchainStats data={sampleData} size="md" getNetworkColor={mockGetNetworkColor} />);

      const title = screen.getByText('Blockchain Integration');
      expect(title).toHaveClass('text-lg');
    });

    it('should apply large size classes', () => {
      render(<BlockchainStats data={sampleData} size="lg" getNetworkColor={mockGetNetworkColor} />);

      const title = screen.getByText('Blockchain Integration');
      expect(title).toHaveClass('text-lg');
    });
  });

  describe('Network Color Integration', () => {
    it('should call getNetworkColor for each network', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      expect(mockGetNetworkColor).toHaveBeenCalledWith('ethereum');
      expect(mockGetNetworkColor).toHaveBeenCalledWith('polygon');
      expect(mockGetNetworkColor).toHaveBeenCalledWith('base');
      expect(mockGetNetworkColor).toHaveBeenCalledWith('moonbeam');
    });

    it('should apply network color classes correctly', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      const ethereumBadge = screen.getByText('ethereum: 8');
      expect(ethereumBadge).toHaveClass('bg-indigo-100', 'text-indigo-800');
    });

    it('should handle missing getNetworkColor function gracefully', () => {
      render(<BlockchainStats data={sampleData} />);

      const ethereumBadge = screen.getByText('ethereum: 8');
      expect(ethereumBadge).toHaveClass('bg-base-200', 'text-base-content');
    });

    it('should use fallback colors for unknown networks', () => {
      const dataWithUnknownNetwork: BlockchainStatsData = {
        ...sampleData,
        networkBreakdown: { unknown: 5 },
      };

      render(<BlockchainStats data={dataWithUnknownNetwork} getNetworkColor={mockGetNetworkColor} />);

      const unknownBadge = screen.getByText('unknown: 5');
      // Since mockGetNetworkColor returns '#6366f1' for unknown networks, it should get indigo colors
      expect(unknownBadge).toHaveClass('bg-indigo-100', 'text-indigo-800');
    });
  });

  describe('Data Display', () => {
    it('should display correct statistics', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText('18')).toBeInTheDocument(); // onChain
      expect(screen.getByText('7')).toBeInTheDocument(); // offChain
      expect(screen.getByText('72%')).toBeInTheDocument(); // syncPercentage
      expect(screen.getByText('2')).toBeInTheDocument(); // pendingTransactions
    });

    it('should handle singular vs plural in sync message', () => {
      const singleOffChainData: BlockchainStatsData = {
        ...sampleData,
        offChain: 1,
        syncPercentage: 95,
      };

      render(<BlockchainStats data={singleOffChainData} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText(/You have 1 todo that can be synced/)).toBeInTheDocument();
    });

    it('should handle multiple off-chain todos in sync message', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText(/You have 7 todos that can be synced/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('Blockchain Integration');

      const subHeading = screen.getByRole('heading', { level: 4 });
      expect(subHeading).toHaveTextContent('Network Distribution');
    });

    it('should have accessible SVG icon', () => {
      render(<BlockchainStats data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('h-4', 'w-4');
    });

    it('should support custom className', () => {
      const { container } = render(
        <BlockchainStats data={sampleData} className="custom-class" getNetworkColor={mockGetNetworkColor} />,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should support data-testid attribute', () => {
      render(
        <BlockchainStats data={sampleData} data-testid="blockchain-stats" getNetworkColor={mockGetNetworkColor} />,
      );

      expect(screen.getByTestId('blockchain-stats')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty network breakdown', () => {
      const dataWithoutNetworks: BlockchainStatsData = {
        ...sampleData,
        networkBreakdown: {},
      };

      render(<BlockchainStats data={dataWithoutNetworks} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.queryByText('Network Distribution')).not.toBeInTheDocument();
    });

    it('should handle zero pending transactions', () => {
      const dataWithoutPending: BlockchainStatsData = {
        ...sampleData,
        pendingTransactions: 0,
      };

      render(<BlockchainStats data={dataWithoutPending} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText('0')).toBeInTheDocument(); // Should still show 0
    });

    it('should handle 100% sync percentage', () => {
      render(<BlockchainStats data={fullySyncedData} getNetworkColor={mockGetNetworkColor} />);

      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.queryByText(/can be synced/)).not.toBeInTheDocument();
    });
  });

  describe('Component API', () => {
    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<BlockchainStats ref={ref} data={sampleData} getNetworkColor={mockGetNetworkColor} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should spread additional props', () => {
      render(
        <BlockchainStats
          data={sampleData}
          getNetworkColor={mockGetNetworkColor}
          role="region"
          aria-label="Blockchain statistics"
        />,
      );

      const component = screen.getByRole('region');
      expect(component).toHaveAttribute('aria-label', 'Blockchain statistics');
    });
  });
});
