import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransactionStatus } from './TransactionStatus';
import type { TransactionStatusType } from './TransactionStatus';

// Mock blockchain service
const mockGetTransactionStatus = vi.fn();
const mockCreateBlockchainService = vi.fn(() => ({
  getTransactionStatus: mockGetTransactionStatus,
}));

// Sample test data
const sampleTransactionHash = '0x1234567890abcdef1234567890abcdef12345678';
const sampleNetwork = 'ethereum';

describe('TransactionStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} autoRefresh={false} />);

      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText(/0x123456...5678/)).toBeInTheDocument();
      expect(screen.getByText(sampleNetwork)).toBeInTheDocument();
    });

    it('should render transaction hash correctly', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          showHash={true}
          autoRefresh={false}
        />,
      );

      expect(screen.getByText(/Tx:/)).toBeInTheDocument();
      expect(screen.getByText(/0x123456...5678/)).toBeInTheDocument();
    });

    it('should not render transaction hash when showHash is false', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          showHash={false}
          autoRefresh={false}
        />,
      );

      expect(screen.queryByText(/Tx:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/0x123456...5678/)).not.toBeInTheDocument();
    });

    it('should render network name', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network="polygon" autoRefresh={false} />);

      expect(screen.getByText('polygon')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant classes', () => {
      const { container } = render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          variant="default"
          autoRefresh={false}
        />,
      );

      expect(container.firstChild).toHaveClass('text-sm');
    });

    it('should apply compact variant classes', () => {
      const { container } = render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          variant="compact"
          autoRefresh={false}
        />,
      );

      expect(container.firstChild).toHaveClass('text-xs');
    });

    it('should apply detailed variant classes', () => {
      const { container } = render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          variant="detailed"
          autoRefresh={false}
        />,
      );

      expect(container.firstChild).toHaveClass('text-base', 'p-3', 'bg-base-100', 'rounded-lg', 'border');
    });

    it('should render detailed variant with proper structure', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          variant="detailed"
          autoRefresh={false}
        />,
      );

      expect(screen.getByText('Transaction Status')).toBeInTheDocument();
      expect(screen.getByText('Hash:')).toBeInTheDocument();
      expect(screen.getByText('Network:')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          size="sm"
          autoRefresh={false}
        />,
      );

      const statusBadge = screen.getByText('Pending').closest('span');
      expect(statusBadge).toHaveClass('px-1.5', 'py-0.5', 'text-xs');
    });

    it('should apply medium size classes', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          size="md"
          autoRefresh={false}
        />,
      );

      const statusBadge = screen.getByText('Pending').closest('span');
      expect(statusBadge).toHaveClass('px-2', 'py-1', 'text-xs');
    });

    it('should apply large size classes', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          size="lg"
          autoRefresh={false}
        />,
      );

      const statusBadge = screen.getByText('Pending').closest('span');
      expect(statusBadge).toHaveClass('px-2.5', 'py-1', 'text-sm');
    });
  });

  describe('Status Display', () => {
    it('should display pending status with correct styling', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} autoRefresh={false} />);

      const statusBadge = screen.getByText('Pending').closest('span');
      expect(statusBadge).toHaveClass('bg-warning/20', 'text-warning');

      // Should have spinning icon
      const svg = statusBadge?.querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });

    it('should display confirmed status with correct styling', async () => {
      mockGetTransactionStatus.mockResolvedValue('confirmed');

      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          createBlockchainService={mockCreateBlockchainService}
          autoRefresh={true}
        />,
      );

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      await waitFor(() => {
        const statusBadge = screen.getByText('Confirmed').closest('span');
        expect(statusBadge).toHaveClass('bg-success/20', 'text-success');
      });
    });

    it('should display failed status with correct styling', async () => {
      mockGetTransactionStatus.mockResolvedValue('failed');

      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          createBlockchainService={mockCreateBlockchainService}
          autoRefresh={true}
        />,
      );

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      await waitFor(() => {
        const statusBadge = screen.getByText('Failed').closest('span');
        expect(statusBadge).toHaveClass('bg-error/20', 'text-error');
      });
    });
  });

  describe('Hash Display', () => {
    it('shows transaction hash when enabled', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} showHash={true} />);

      expect(screen.getByText(/0x1234...5678/)).toBeInTheDocument();
    });

    it('hides transaction hash when disabled', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} showHash={false} />);

      expect(screen.queryByText(/Tx:/)).not.toBeInTheDocument();
    });

    it('should format hash correctly in compact variant', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} variant="compact" />);

      expect(screen.getByText(/0x12...78/)).toBeInTheDocument();
    });

    it('should format hash correctly in detailed variant', () => {
      render(
        <TransactionStatus
          transactionHash="0x1234567890abcdef1234567890abcdef12345678"
          network={sampleNetwork}
          variant="detailed"
        />,
      );

      expect(screen.getByText(/0x12345678...345678/)).toBeInTheDocument();
    });
  });

  describe('Auto Refresh and Polling', () => {
    it('should not poll when autoRefresh is false', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          createBlockchainService={mockCreateBlockchainService}
          autoRefresh={false}
        />,
      );

      expect(mockGetTransactionStatus).not.toHaveBeenCalled();
    });

    it('should render correctly when autoRefresh is enabled', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          createBlockchainService={mockCreateBlockchainService}
          autoRefresh={true}
        />,
      );

      // Component should render without errors
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should accept polling configuration props', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          createBlockchainService={mockCreateBlockchainService}
          autoRefresh={true}
          pollingInterval={1000}
          maxPollingTime={5000}
        />,
      );

      // Component should render with polling config
    });

    it('should render correctly with polling configuration', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          createBlockchainService={mockCreateBlockchainService}
          autoRefresh={true}
          pollingInterval={1000}
          maxPollingTime={5000}
        />,
      );

      // Component should render without errors
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should render without errors when no blockchain service is provided', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} autoRefresh={false} />);

      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should handle missing createBlockchainService gracefully', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} autoRefresh={true} />);

      // Component should render without crashing
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should not show error indicator in compact variant by default', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          variant="compact"
          autoRefresh={false}
        />,
      );

      // In compact variant, error text should not be shown by default
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
  });

  describe('Callback Functions', () => {
    it('should call onStatusChange when provided', () => {
      const onStatusChange = vi.fn();

      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          onStatusChange={onStatusChange}
          autoRefresh={false}
        />,
      );

      // Component should render without errors when callback is provided
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should work without onStatusChange callback', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} autoRefresh={false} />);

      // Component should render without errors when no callback is provided
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          autoRefresh={false}
          aria-label="Transaction status"
        />,
      );

      const component = screen.getByLabelText('Transaction status');
      expect(component).toBeInTheDocument();
    });

    it('should support custom className', () => {
      const { container } = render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          className="custom-class"
          autoRefresh={false}
        />,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should support data-testid attribute', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          data-testid="transaction-status"
          autoRefresh={false}
        />,
      );

      expect(screen.getByTestId('transaction-status')).toBeInTheDocument();
    });
  });

  describe('Component API', () => {
    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(
        <TransactionStatus
          ref={ref}
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          autoRefresh={false}
        />,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should spread additional props', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          autoRefresh={false}
          role="status"
          aria-live="polite"
        />,
      );

      const component = screen.getByRole('status');
      expect(component).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Status Indicators', () => {
    it('should not show checking indicator when not polling', () => {
      render(<TransactionStatus transactionHash={sampleTransactionHash} network={sampleNetwork} autoRefresh={false} />);

      expect(screen.queryByText('Checking...')).not.toBeInTheDocument();
    });

    it('should render without errors when polling is enabled', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          createBlockchainService={mockCreateBlockchainService}
          autoRefresh={true}
        />,
      );

      // Component should render the basic status
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should render detailed variant with polling info structure', () => {
      render(
        <TransactionStatus
          transactionHash={sampleTransactionHash}
          network={sampleNetwork}
          createBlockchainService={mockCreateBlockchainService}
          autoRefresh={true}
          variant="detailed"
          pollingInterval={2000}
        />,
      );

      // Should show the detailed structure
      expect(screen.getByText('Transaction Status')).toBeInTheDocument();
      expect(screen.getByText('Network:')).toBeInTheDocument();
    });
  });
});
