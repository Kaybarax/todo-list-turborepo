import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TransactionStatus } from '../blockchain/TransactionStatus';

describe('TransactionStatus', () => {
  const mockTransactionHash = '0x1234567890abcdef1234567890abcdef12345678';
  const mockNetwork = 'polygon';
  const mockOnStatusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
    const component = screen.getByText('Transaction Pending').closest('div');
    expect(component).toHaveClass('text-sm');

    rerender(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        variant="compact"
        status="pending"
      />,
    );
    expect(screen.getByText('Transaction Pending').closest('div')).toHaveClass('text-xs');

    rerender(
      <TransactionStatus
        transactionHash={mockTransactionHash}
        network={mockNetwork}
        variant="detailed"
        status="pending"
      />,
    );
    expect(screen.getByText('Transaction Pending').closest('div')).toHaveClass('text-base');
  });

  it('applies status classes correctly', () => {
    const { rerender } = render(
      <TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} status="pending" />,
    );
    expect(screen.getByText('Transaction Pending')).toBeInTheDocument();

    rerender(<TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} status="confirmed" />);
    expect(screen.getByText('Transaction Confirmed')).toBeInTheDocument();

    rerender(<TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} status="failed" />);
    expect(screen.getByText('Transaction Failed')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} size="sm" status="pending" />,
    );
    expect(screen.getByText('Transaction Pending').closest('div')).toHaveClass('text-xs');

    rerender(
      <TransactionStatus transactionHash={mockTransactionHash} network={mockNetwork} size="lg" status="pending" />,
    );
    expect(screen.getByText('Transaction Pending').closest('div')).toHaveClass('text-base');
  });

  it('shows transaction hash when enabled', () => {
    render(
      <TransactionStatus
        transactionHash="0x1234567890abcdef1234567890abcdef12345678"
        network={mockNetwork}
        showHash={true}
        status="pending"
      />,
    );
    expect(screen.getByText(/0x1234...5678/)).toBeInTheDocument();
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
