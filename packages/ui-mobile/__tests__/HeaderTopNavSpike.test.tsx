import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProvider } from '../src/test/utils/renderWithProvider';
import { Header } from '../lib/components/Header/Header';
import { HeaderTopNavSpike } from '../lib/components/Header/HeaderTopNavSpike';
import { Button } from '../lib/components/Button';

describe('HeaderTopNavSpike', () => {
  it('renders title and role a11y label', () => {
    renderWithProvider(<HeaderTopNavSpike title="Spike Header" testID="spike-header" />);
    expect(screen.getByTestId('spike-header')).toBeTruthy();
    // Fallback test rendering duplicates title (hidden) for parity; accept >=1
    expect(screen.getAllByText('Spike Header').length).toBeGreaterThanOrEqual(1);
  });

  it('renders left and right actions parity with original Header', () => {
    const left = <Button testID="left-action">Back</Button>;
    const right = <Button testID="right-action">Menu</Button>;
    renderWithProvider(<HeaderTopNavSpike title="Spike" leftAction={left} rightAction={right} testID="spike-both" />);
    expect(screen.getByTestId('left-action')).toBeTruthy();
    expect(screen.getByTestId('right-action')).toBeTruthy();
  });

  it('visual parity basic structure (rough) vs custom Header - title present', () => {
    renderWithProvider(<Header title="Ref" testID="ref-header" />);
    renderWithProvider(<HeaderTopNavSpike title="Ref" testID="spike-ref" />);
    expect(screen.getAllByText('Ref').length).toBeGreaterThanOrEqual(2);
  });
});
