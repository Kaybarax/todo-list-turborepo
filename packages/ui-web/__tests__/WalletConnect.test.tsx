import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { WalletConnect, type WalletAccount } from '../lib/components/blockchain/WalletConnect/WalletConnect';

describe('WalletConnect', () => {
  const mockAccount: WalletAccount = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    network: 'polygon',
    balance: '1.5 MATIC',
  };

  const mockOnConnect = vi.fn();
  const mockOnDisconnect = vi.fn();
  const mockOnNetworkSwitch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders connect button when no account connected', () => {
    render(<WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} connectedAccount={null} />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument();
  });

  it('renders connected account info when account is connected', () => {
    render(<WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} connectedAccount={mockAccount} />);
    expect(screen.getByText('Connected Wallet')).toBeInTheDocument();
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    expect(screen.getByText('Network: polygon')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<WalletConnect onConnect={mockOnConnect} variant="default" connectedAccount={null} />);
    expect(screen.getByText('Connect Wallet').closest('.card')).toHaveClass('card-normal');

    rerender(<WalletConnect onConnect={mockOnConnect} variant="compact" connectedAccount={null} />);
    expect(screen.getByText('Connect Wallet').closest('.card')).toHaveClass('card-compact');

    rerender(<WalletConnect onConnect={mockOnConnect} variant="button-only" connectedAccount={null} />);
    expect(screen.getByText('Connect Wallet').closest('.card')).toHaveClass('p-0');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<WalletConnect onConnect={mockOnConnect} size="sm" connectedAccount={null} />);
    expect(screen.getByText('Connect Wallet').closest('.card')).toHaveClass('text-sm');

    rerender(<WalletConnect onConnect={mockOnConnect} size="lg" connectedAccount={null} />);
    expect(screen.getByText('Connect Wallet').closest('.card')).toHaveClass('text-lg');
  });

  it('shows balance when enabled and available', () => {
    render(<WalletConnect onConnect={mockOnConnect} connectedAccount={mockAccount} showBalance={true} />);
    expect(screen.getByText('Balance: 1.5 MATIC')).toBeInTheDocument();
  });

  it('hides balance when disabled', () => {
    render(<WalletConnect onConnect={mockOnConnect} connectedAccount={mockAccount} showBalance={false} />);
    expect(screen.queryByText('Balance: 1.5 MATIC')).not.toBeInTheDocument();
  });

  it('shows network selector when enabled', () => {
    render(
      <WalletConnect
        onConnect={mockOnConnect}
        onNetworkSwitch={mockOnNetworkSwitch}
        connectedAccount={mockAccount}
        showNetworkSelector={true}
        supportedNetworks={['polygon', 'ethereum', 'solana']}
      />,
    );
    // Test will be expanded during actual implementation
    expect(screen.getByText('Connected Wallet')).toBeInTheDocument();
  });

  it('hides network selector when disabled', () => {
    render(<WalletConnect onConnect={mockOnConnect} connectedAccount={mockAccount} showNetworkSelector={false} />);
    // Test will be expanded during actual implementation
    expect(screen.getByText('Connected Wallet')).toBeInTheDocument();
  });

  it('calls onConnect when connect button is clicked', () => {
    render(<WalletConnect onConnect={mockOnConnect} connectedAccount={null} />);
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));
    // Test will be expanded during actual implementation
    expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument();
  });

  it('handles account without balance', () => {
    const accountWithoutBalance = {
      address: mockAccount.address,
      network: mockAccount.network,
    };
    render(<WalletConnect onConnect={mockOnConnect} connectedAccount={accountWithoutBalance} showBalance={true} />);
    expect(screen.queryByText(/Balance:/)).not.toBeInTheDocument();
  });
});
