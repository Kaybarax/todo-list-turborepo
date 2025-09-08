import React, { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';

jest.mock('@todo/services', () => ({
  getSupportedWalletNetworks: jest.fn(),
  getNetworkColor: jest.fn(),
}));

// Acquire mock references AFTER jest.mock so we can set per-test implementations.
const services = require('@todo/services');

beforeEach(() => {
  (services.getSupportedWalletNetworks as jest.Mock).mockReturnValue(['solana', 'polkadot']);
  (services.getNetworkColor as jest.Mock).mockImplementation((network: string) =>
    network === 'solana' ? '#9945FF' : '#E6007A',
  );
});

const { NetworkSelector } = require('../lib/components/NetworkSelector/NetworkSelector');

// Helper to ascend from a child text node to its touchable container with accessibility props
const findTouchableAncestor = (node: any) => {
  let current: any = node;
  while (current && !(current.props && current.props.accessibilityState)) {
    current = current.parent;
  }
  return current;
};

describe('NetworkSelector selection state', () => {
  it('updates accessibilityState.selected when a different network is pressed (grid variant)', () => {
    const Wrapper: React.FC = () => {
      const [selected, setSelected] = useState<'solana' | 'polkadot'>('solana');
      return <NetworkSelector selectedNetwork={selected} onNetworkSelect={setSelected} variant="grid" />;
    };

    renderWithProvider(<Wrapper />);

    const solanaText = screen.getByText('Solana');
    const polkadotText = screen.getByText('Polkadot');
    const solanaButton = findTouchableAncestor(solanaText);
    const polkadotButton = findTouchableAncestor(polkadotText);

    expect(solanaButton?.props?.accessibilityState?.selected).toBe(true);
    expect(polkadotButton?.props?.accessibilityState?.selected).toBe(false);

    fireEvent.press(polkadotButton);

    // After state update, re-query nodes
    const updatedPolkadot = findTouchableAncestor(screen.getByText('Polkadot'));
    const updatedSolana = findTouchableAncestor(screen.getByText('Solana'));
    expect(updatedPolkadot?.props?.accessibilityState?.selected).toBe(true);
    expect(updatedSolana?.props?.accessibilityState?.selected).toBe(false);
  });

  it('updates selection state in list variant', () => {
    const Wrapper: React.FC = () => {
      const [selected, setSelected] = useState<'solana' | 'polkadot'>('polkadot');
      return <NetworkSelector selectedNetwork={selected} onNetworkSelect={setSelected} variant="list" />;
    };

    renderWithProvider(<Wrapper />);

    const solanaText = screen.getByText('Solana');
    const polkadotText = screen.getByText('Polkadot');
    const solanaButton = findTouchableAncestor(solanaText);
    const polkadotButton = findTouchableAncestor(polkadotText);
    expect(polkadotButton?.props?.accessibilityState?.selected).toBe(true);
    expect(solanaButton?.props?.accessibilityState?.selected).toBe(false);

    fireEvent.press(solanaButton);
    const updatedSolana = findTouchableAncestor(screen.getByText('Solana'));
    const updatedPolkadot = findTouchableAncestor(screen.getByText('Polkadot'));
    expect(updatedSolana?.props?.accessibilityState?.selected).toBe(true);
    expect(updatedPolkadot?.props?.accessibilityState?.selected).toBe(false);
  });
});
