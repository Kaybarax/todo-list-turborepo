import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BlockchainNetwork } from '@todo/services';

import { WalletConnect, type WalletAccount } from '../lib/components/blockchain/WalletConnect/WalletConnect';

describe('WalletConnect', () => {
  const mockAccount: WalletAccount = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    network: BlockchainNetwork.POLYGON,
    balance: '1.5 MATIC',
  };

  const mockOnConnect = vi.fn();
  const mockOnDisconnect = vi.fn();
  const mockOnNetworkSwitch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders connect button when no account connected', () => {
    render(
      <WalletConnect onConnect={mockOnConnect} onDisconnect={mockOnDisconnect} isConnected={false} account={null} />,
    );
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connect to/ })).toBeInTheDocument();
  });

  it('renders connected account info when account is connected', () => {
    render(
      <WalletConnect
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
        isConnected={true}
        account={mockAccount}
      />,
    );
    expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender, container } = render(
      <WalletConnect onConnect={mockOnConnect} variant="default" isConnected={false} account={null} />,
    );
    expect(container.firstChild).toHaveClass('bg-base-100');

    rerender(<WalletConnect onConnect={mockOnConnect} variant="compact" isConnected={false} account={null} />);
    expect(container.firstChild).toHaveClass('p-3');

    rerender(<WalletConnect onConnect={mockOnConnect} variant="button-only" isConnected={false} account={null} />);
    expect(screen.getByRole('button')).toHaveClass('btn');
  });

  it('applies size classes correctly', () => {
    const { rerender, container } = render(
      <WalletConnect onConnect={mockOnConnect} size="sm" isConnected={false} account={null} />,
    );
    expect(container.firstChild).toHaveClass('text-sm');

    rerender(<WalletConnect onConnect={mockOnConnect} size="lg" isConnected={false} account={null} />);
    expect(container.firstChild).toHaveClass('text-lg');
  });

  it('shows balance when enabled and available', () => {
    render(<WalletConnect onConnect={mockOnConnect} isConnected={true} account={mockAccount} showBalance={true} />);
    expect(screen.getByText(/Balance:/)).toBeInTheDocument();
    expect(screen.getByText(/1\.5/)).toBeInTheDocument();
  });

  it('hides balance when disabled', () => {
    render(<WalletConnect onConnect={mockOnConnect} isConnected={true} account={mockAccount} showBalance={false} />);
    expect(screen.queryByText(/Balance:/)).not.toBeInTheDocument();
  });

  it('shows network selector when enabled', () => {
    render(
      <WalletConnect
        onConnect={mockOnConnect}
        onNetworkSwitch={mockOnNetworkSwitch}
        isConnected={true}
        account={mockAccount}
        showNetworkSelector={true}
        supportedNetworks={[BlockchainNetwork.POLYGON, BlockchainNetwork.SOLANA]}
      />,
    );
    expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
    expect(screen.getByText('Network:')).toBeInTheDocument();
  });

  it('hides network selector when disabled', () => {
    render(
      <WalletConnect onConnect={mockOnConnect} isConnected={true} account={mockAccount} showNetworkSelector={false} />,
    );
    expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
    expect(screen.queryByText('Network:')).not.toBeInTheDocument();
  });

  it('calls onConnect when connect button is clicked', () => {
    render(<WalletConnect onConnect={mockOnConnect} isConnected={false} account={null} />);
    fireEvent.click(screen.getByRole('button', { name: /Connect to/ }));
    expect(mockOnConnect).toHaveBeenCalled();
  });

  it('handles account without balance', () => {
    const accountWithoutBalance = {
      address: mockAccount.address,
      network: mockAccount.network,
    };
    render(
      <WalletConnect onConnect={mockOnConnect} isConnected={true} account={accountWithoutBalance} showBalance={true} />,
    );
    expect(screen.queryByText(/Balance:/)).not.toBeInTheDocument();
  });
});
