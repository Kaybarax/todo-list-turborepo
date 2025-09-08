import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';

jest.mock('@todo/services', () => ({
  getSupportedWalletNetworks: jest.fn(),
  getNetworkColor: jest.fn(),
}));

const services = require('@todo/services');
const { NetworkSelector } = require('../lib/components/NetworkSelector/NetworkSelector');

describe('NetworkSelector Accessibility', () => {
  const commonProps = {
    selectedNetwork: 'solana' as const,
    onNetworkSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (services.getSupportedWalletNetworks as jest.Mock).mockReturnValue([
      'solana',
      'polkadot',
      'polygon',
      'moonbeam',
      'base',
    ]);
    (services.getNetworkColor as jest.Mock).mockImplementation((network: string) => {
      const colors: Record<string, string> = {
        solana: '#9945FF',
        polkadot: '#E6007A',
        polygon: '#8247E5',
        moonbeam: '#53CBC8',
        base: '#0052FF',
      };
      return colors[network] || '#000000';
    });
  });

  it('applies composite accessibility labels in grid variant', () => {
    renderWithProvider(<NetworkSelector {...commonProps} variant="grid" />);
    const solanaText = screen.getByText('Solana');
    // ascend until accessibilityLabel present or no parent
    let node: any = solanaText;
    while (node && !node.props?.accessibilityLabel) {
      node = node.parent;
    }
    expect(node?.props?.accessibilityLabel).toBe('Solana. High-performance blockchain');
    expect(node?.props?.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
  });

  it('applies composite accessibility labels in list variant', () => {
    renderWithProvider(<NetworkSelector {...commonProps} variant="list" selectedNetwork="polkadot" />);
    const polkadotText = screen.getByText('Polkadot');
    let node: any = polkadotText;
    while (node && !node.props?.accessibilityLabel) {
      node = node.parent;
    }
    expect(node?.props?.accessibilityLabel).toBe('Polkadot. Interoperable blockchain');
  });

  it('marks disabled state in accessibilityState', () => {
    renderWithProvider(<NetworkSelector {...commonProps} disabled variant="grid" />);
    const solanaText = screen.getByText('Solana');
    let node: any = solanaText;
    while (node && !node.props?.accessibilityLabel) {
      node = node.parent;
    }
    expect(node?.props?.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
  });

  it('provides labels for all supported networks', () => {
    renderWithProvider(<NetworkSelector {...commonProps} variant="grid" />);
    const expectations: Record<string, string> = {
      Solana: 'Solana. High-performance blockchain',
      Polkadot: 'Polkadot. Interoperable blockchain',
      Polygon: 'Polygon. Ethereum scaling solution',
      Moonbeam: 'Moonbeam. Ethereum on Polkadot',
      Base: 'Base. Coinbase L2 solution',
    };
    Object.entries(expectations).forEach(([text, label]) => {
      const nameNode = screen.getByText(text);
      let node: any = nameNode;
      while (node && !node.props?.accessibilityLabel) {
        node = node.parent;
      }
      expect(node?.props?.accessibilityLabel).toBe(label);
    });
  });
});
