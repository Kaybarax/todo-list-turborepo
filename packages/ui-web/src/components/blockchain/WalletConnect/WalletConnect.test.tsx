import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WalletConnect, type WalletConnectProps, type WalletAccount } from './WalletConnect';
import type { BlockchainNetwork } from '@todo/services';

// Mock the services
jest.mock('@todo/services', () => ({
  getNetworkColor: jest.fn((network: string) => {
    const colorMap: Record<string, string> = {
      polygon: '#6366f1',
      solana: '#9333ea',
      polkadot: '#ec4899',
      moonbeam: '#14b8a6',
      base: '#3b82f6',
    };
    return colorMap[network] || '#6b7280';
  }),
  getNetworkDisplayInfo: jest.fn((network: BlockchainNetwork) => {
    const infoMap: Record<string, any> = {
      polygon: { displayName: 'Polygon', chainId: 137, color: '#6366f1', name: 'Polygon' },
      solana: { displayName: 'Solana', chainId: 101, color: '#9333ea', name: 'Solana' },
      polkadot: { displayName: 'Polkadot', chainId: 0, color: '#ec4899', name: 'Polkadot' },
      moonbeam: { displayName: 'Moonbeam', chainId: 1284, color: '#14b8a6', name: 'Moonbeam' },
      base: { displayName: 'Base', chainId: 8453, color: '#3b82f6', name: 'Base' },
    };
    return infoMap[network] || { displayName: network, chainId: 0, color: '#6b7280', name: network };
  }),
  getSupportedWalletNetworks: jest.fn(() => ['solana', 'polkadot', 'polygon', 'moonbeam', 'base']),
  mapWalletNetworkToBlockchainNetwork: jest.fn((network: string) => network as BlockchainNetwork),
  mapBlockchainNetworkToWalletNetwork: jest.fn((network: BlockchainNetwork) => network as string),
  generateMockAddress: jest.fn((network: string) => {
    const prefixes: Record<string, string> = {
      solana: '1A1z',
      polkadot: '5G',
      polygon: '0x',
      moonbeam: '0x',
      base: '0x',
    };
    const prefix = prefixes[network] || '0x';
    return `${prefix}1234567890abcdef1234567890abcdef12345678`;
  }),
}));

const mockAccount: WalletAccount = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  network: 'polygon' as BlockchainNetwork,
  balance: '1.2345',
  chainId: '137',
};

const supportedNetworks: BlockchainNetwork[] = [
  'solana' as BlockchainNetwork,
  'polkadot' as BlockchainNetwork,
  'polygon' as BlockchainNetwork,
  'moonbeam' as BlockchainNetwork,
  'base' as BlockchainNetwork,
];

const defaultProps: Partial<WalletConnectProps> = {
  supportedNetworks,
  showBalance: true,
  showNetworkSelector: true,
  isConnected: false,
  isConnecting: false,
  account: null,
  error: null,
};

describe('WalletConnect', () => {
  const mockOnConnect = jest.fn();
  const mockOnDisconnect = jest.fn();
  const mockOnNetworkSwitch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Disconnected State', () => {
    it('should render connect form when not connected', () => {
      render(
        <WalletConnect
          {...defaultProps}
          onConnect={mockOnConnect}
          onDisconnect={mockOnDisconnect}
          onNetworkSwitch={mockOnNetworkSwitch}
        />,
      );

      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
      expect(screen.getByText('Select Network:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Connect to/ })).toBeInTheDocument();
    });

    it('should show network selection buttons', () => {
      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      // Check for network display names
      expect(screen.getByRole('button', { name: 'Solana' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Polygon' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Polkadot' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Moonbeam' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Base' })).toBeInTheDocument();
    });

    it('should call onConnect when connect button is clicked', async () => {
      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      const connectButton = screen.getByRole('button', { name: /Connect to/ });
      fireEvent.click(connectButton);

      await waitFor(() => {
        expect(mockOnConnect).toHaveBeenCalledWith(
          expect.objectContaining({
            network: 'solana', // default network
            address: expect.any(String),
            balance: expect.any(String),
            chainId: expect.any(String),
          }),
        );
      });
    });

    it('should update selected network when network button is clicked', () => {
      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      const polygonButton = screen.getByRole('button', { name: 'Polygon' });
      fireEvent.click(polygonButton);

      const connectButton = screen.getByRole('button', { name: /Connect to Polygon/ });
      expect(connectButton).toBeInTheDocument();
    });

    it('should show error message when error prop is provided', () => {
      const errorMessage = 'Failed to connect wallet';
      render(<WalletConnect {...defaultProps} error={errorMessage} onConnect={mockOnConnect} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should show connecting state', () => {
      render(<WalletConnect {...defaultProps} isConnecting={true} onConnect={mockOnConnect} />);

      expect(screen.getByText('Connecting...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Connecting/ })).toBeDisabled();
    });
  });

  describe('Connected State', () => {
    const connectedProps = {
      ...defaultProps,
      isConnected: true,
      account: mockAccount,
    };

    it('should render wallet info when connected', () => {
      render(
        <WalletConnect {...connectedProps} onDisconnect={mockOnDisconnect} onNetworkSwitch={mockOnNetworkSwitch} />,
      );

      expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
      expect(screen.getByText('Polygon')).toBeInTheDocument();
      expect(screen.getByText('1.2345 ETH')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Disconnect' })).toBeInTheDocument();
    });

    it('should call onDisconnect when disconnect button is clicked', () => {
      render(<WalletConnect {...connectedProps} onDisconnect={mockOnDisconnect} />);

      const disconnectButton = screen.getByRole('button', { name: 'Disconnect' });
      fireEvent.click(disconnectButton);

      expect(mockOnDisconnect).toHaveBeenCalled();
    });

    it('should show network switcher when switch button is clicked', () => {
      render(<WalletConnect {...connectedProps} onNetworkSwitch={mockOnNetworkSwitch} />);

      const switchButton = screen.getByRole('button', { name: 'Switch' });
      fireEvent.click(switchButton);

      expect(screen.getByText('Select Network:')).toBeInTheDocument();
      // Should show all network options in the switcher
      const networkButtons = screen.getAllByRole('button');
      const switcherNetworkButtons = networkButtons.filter(button =>
        ['Solana', 'Polygon', 'Polkadot', 'Moonbeam', 'Base'].includes(button.textContent || ''),
      );
      expect(switcherNetworkButtons.length).toBeGreaterThan(5); // Original + switcher buttons
    });

    it('should call onNetworkSwitch when network is selected', () => {
      render(<WalletConnect {...connectedProps} onNetworkSwitch={mockOnNetworkSwitch} />);

      // Open network switcher
      const switchButton = screen.getByRole('button', { name: 'Switch' });
      fireEvent.click(switchButton);

      // Find and click on a different network in the switcher
      const allButtons = screen.getAllByRole('button');
      const solanaButton = allButtons.find(
        button =>
          button.textContent === 'Solana' && button.closest('.border.border-base-300.rounded-md.p-3.bg-base-200'),
      );

      if (solanaButton) {
        fireEvent.click(solanaButton);
        expect(mockOnNetworkSwitch).toHaveBeenCalledWith('solana');
      }
    });

    it('should not show balance when showBalance is false', () => {
      render(<WalletConnect {...connectedProps} showBalance={false} />);

      expect(screen.queryByText('1.2345 ETH')).not.toBeInTheDocument();
      expect(screen.queryByText('Balance:')).not.toBeInTheDocument();
    });

    it('should not show network selector when showNetworkSelector is false', () => {
      render(<WalletConnect {...connectedProps} showNetworkSelector={false} />);

      expect(screen.queryByText('Network:')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Switch' })).not.toBeInTheDocument();
    });

    it('should show full address when showHash is true', () => {
      render(<WalletConnect {...connectedProps} showHash={true} />);

      expect(screen.getByText(mockAccount.address)).toBeInTheDocument();
      expect(screen.queryByText('0x1234...5678')).not.toBeInTheDocument();
    });

    it('should show SOL for Solana network balance', () => {
      const solanaAccount = {
        ...mockAccount,
        network: 'solana' as BlockchainNetwork,
      };

      render(<WalletConnect {...connectedProps} account={solanaAccount} />);

      expect(screen.getByText('1.2345 SOL')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render compact variant correctly', () => {
      render(<WalletConnect {...defaultProps} variant="compact" onConnect={mockOnConnect} />);

      expect(screen.getByText('Connect')).toBeInTheDocument();
      expect(screen.queryByText('• This is a demo implementation')).not.toBeInTheDocument();
    });

    it('should render compact connected variant correctly', () => {
      render(
        <WalletConnect
          {...defaultProps}
          variant="compact"
          isConnected={true}
          account={mockAccount}
          onDisconnect={mockOnDisconnect}
        />,
      );

      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    it('should render button-only variant when disconnected', () => {
      render(<WalletConnect {...defaultProps} variant="button-only" onConnect={mockOnConnect} />);

      expect(screen.getByRole('button', { name: 'Connect Wallet' })).toBeInTheDocument();
      expect(screen.queryByText('Select Network:')).not.toBeInTheDocument();
    });

    it('should render button-only variant when connected', () => {
      render(
        <WalletConnect
          {...defaultProps}
          variant="button-only"
          isConnected={true}
          account={mockAccount}
          onDisconnect={mockOnDisconnect}
        />,
      );

      expect(screen.getByRole('button', { name: 'Disconnect' })).toBeInTheDocument();
      expect(screen.queryByText('Wallet Connected')).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(<WalletConnect {...defaultProps} size="sm" isConnected={true} account={mockAccount} />);

      const heading = screen.getByText('Wallet Connected');
      expect(heading).toHaveClass('text-sm');
    });

    it('should apply large size classes', () => {
      render(<WalletConnect {...defaultProps} size="lg" isConnected={true} account={mockAccount} />);

      const heading = screen.getByText('Wallet Connected');
      expect(heading).toHaveClass('text-lg');
    });
  });

  describe('Accessibility', () => {
    it('should have proper data-testid when provided', () => {
      render(<WalletConnect {...defaultProps} data-testid="wallet-connect" onConnect={mockOnConnect} />);

      expect(screen.getByTestId('wallet-connect')).toBeInTheDocument();
    });

    it('should have proper label for network selector', () => {
      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      expect(screen.getByLabelText('Select Network:')).toBeInTheDocument();
    });

    it('should disable buttons when connecting', () => {
      render(
        <WalletConnect
          {...defaultProps}
          isConnecting={true}
          isConnected={true}
          account={mockAccount}
          onDisconnect={mockOnDisconnect}
          onNetworkSwitch={mockOnNetworkSwitch}
        />,
      );

      expect(screen.getByRole('button', { name: 'Disconnect' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Switch' })).toBeDisabled();
    });
  });

  describe('Network Integration', () => {
    it('should use network display names from service', () => {
      render(<WalletConnect {...defaultProps} isConnected={true} account={mockAccount} />);

      // Should show "Polygon" instead of "polygon"
      expect(screen.getByText('Polygon')).toBeInTheDocument();
    });

    it('should handle network display info errors gracefully', () => {
      // Mock getNetworkDisplayInfo to throw an error
      const mockGetNetworkDisplayInfo = require('@todo/services').getNetworkDisplayInfo;
      mockGetNetworkDisplayInfo.mockImplementationOnce(() => {
        throw new Error('Network not found');
      });

      render(<WalletConnect {...defaultProps} isConnected={true} account={mockAccount} />);

      // Should still render the component without crashing
      expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
    });

    it('should use service mock address generator', () => {
      const mockGenerateMockAddress = require('@todo/services').generateMockAddress;
      mockGenerateMockAddress.mockReturnValue('0xmockedaddress123');

      render(<WalletConnect {...defaultProps} onConnect={mockOnConnect} />);

      const connectButton = screen.getByRole('button', { name: /Connect to/ });
      fireEvent.click(connectButton);

      expect(mockGenerateMockAddress).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onConnect gracefully', () => {
      render(<WalletConnect {...defaultProps} />);

      const connectButton = screen.getByRole('button', { name: /Connect to/ });
      expect(() => fireEvent.click(connectButton)).not.toThrow();
    });

    it('should handle missing onDisconnect gracefully', () => {
      render(<WalletConnect {...defaultProps} isConnected={true} account={mockAccount} />);

      const disconnectButton = screen.getByRole('button', { name: 'Disconnect' });
      expect(() => fireEvent.click(disconnectButton)).not.toThrow();
    });

    it('should handle missing onNetworkSwitch gracefully', () => {
      render(<WalletConnect {...defaultProps} isConnected={true} account={mockAccount} />);

      const switchButton = screen.getByRole('button', { name: 'Switch' });
      fireEvent.click(switchButton);

      const allButtons = screen.getAllByRole('button');
      const solanaButton = allButtons.find(
        button =>
          button.textContent === 'Solana' && button.closest('.border.border-base-300.rounded-md.p-3.bg-base-200'),
      );

      if (solanaButton) {
        expect(() => fireEvent.click(solanaButton)).not.toThrow();
      }
    });
  });
});
