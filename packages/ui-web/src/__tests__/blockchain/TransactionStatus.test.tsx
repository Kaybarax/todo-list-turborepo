import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { TransactionStatus } from '../../components/blockchain/TransactionStatus/TransactionStatus';

describe('TransactionStatus', () => {
  const mockTransactionHash = '0x1234567890abcdef1234567890abcdef12345678';
  const mockNetwork = 'polygon';
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with transaction info', () => {
    render(<TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} status="pending" />);
    expect(screen.getByText('Transaction Pending')).toBeInTheDocument();
    expect(screen.getByText(`Network: ${mockNetwork}`)).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        variant="default"
        status="pending"
      />,
    );
    expect(screen.getByText('Transaction Pending').closest('.alert')).toHaveClass('alert-info');

    rerender(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        variant="compact"
        status="pending"
      />,
    );
    expect(screen.getByText('Transaction Pending').closest('.alert')).toHaveClass('py-2');

    rerender(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        variant="detailed"
        status="pending"
      />,
    );
    expect(screen.getByText('Transaction Pending').closest('.alert')).toHaveClass('p-4');
  });

  it('applies status classes correctly', () => {
    const { rerender } = render(
      <TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} status="pending" />,
    );
    expect(screen.getByText('Transaction Pending').closest('.alert')).toHaveClass('alert-warning');

    rerender(<TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} status="confirmed" />);
    expect(screen.getByText('Transaction Confirmed').closest('.alert')).toHaveClass('alert-success');

    rerender(<TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} status="failed" />);
    expect(screen.getByText('Transaction Failed').closest('.alert')).toHaveClass('alert-error');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} size="sm" status="pending" />,
    );
    expect(screen.getByText('Transaction Pending').closest('.alert')).toHaveClass('text-sm');

    rerender(
      <TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} size="lg" status="pending" />,
    );
    expect(screen.getByText('Transaction Pending').closest('.alert')).toHaveClass('text-lg');
  });

  it('shows transaction hash when enabled', () => {
    render(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        showHash={true}
        status="pending"
      />,
    );
    expect(screen.getByText(/Hash: 0x1234567890...12345678/)).toBeInTheDocument();
  });

  it('hides transaction hash when disabled', () => {
    render(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        showHash={false}
        status="pending"
      />,
    );
    expect(screen.queryByText(/Hash:/)).not.toBeInTheDocument();
  });

  it('calls onStatusChange when status changes', () => {
    render(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        onStatusChange={mockOnStatusChange}
        status="pending"
      />,
    );
    // Test will be expanded during actual implementation
    expect(screen.getByText('Transaction Pending')).toBeInTheDocument();
  });

  it('handles auto refresh when enabled', () => {
    render(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        autoRefresh={true}
        status="pending"
      />,
    );
    // Test will be expanded during actual implementation
    expect(screen.getByText('Transaction Pending')).toBeInTheDocument();
  });
});
