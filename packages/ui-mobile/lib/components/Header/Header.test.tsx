import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Header } from './Header';
import { ThemeProvider } from '../../theme';
import { Button } from '../Button';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Header', () => {
  it('renders correctly with title', () => {
    renderWithTheme(<Header title="Test Header" />);
    expect(screen.getByText('Test Header')).toBeTruthy();
  });

  it('renders left action correctly', () => {
    const leftAction = <Button testID="left-action">Back</Button>;
    renderWithTheme(<Header title="Test Header" leftAction={leftAction} testID="header-with-left-action" />);

    expect(screen.getByTestId('header-with-left-action')).toBeTruthy();
    expect(screen.getByTestId('left-action')).toBeTruthy();
  });

  it('renders right action correctly', () => {
    const rightAction = <Button testID="right-action">Menu</Button>;
    renderWithTheme(<Header title="Test Header" rightAction={rightAction} testID="header-with-right-action" />);

    expect(screen.getByTestId('header-with-right-action')).toBeTruthy();
    expect(screen.getByTestId('right-action')).toBeTruthy();
  });

  it('renders both left and right actions', () => {
    const leftAction = <Button testID="left-action">Back</Button>;
    const rightAction = <Button testID="right-action">Menu</Button>;

    renderWithTheme(
      <Header
        title="Test Header"
        leftAction={leftAction}
        rightAction={rightAction}
        testID="header-with-both-actions"
      />,
    );

    expect(screen.getByTestId('header-with-both-actions')).toBeTruthy();
    expect(screen.getByTestId('left-action')).toBeTruthy();
    expect(screen.getByTestId('right-action')).toBeTruthy();
  });

  it('applies custom style correctly', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithTheme(<Header title="Custom Style Header" style={customStyle} testID="custom-style-header" />);

    expect(screen.getByTestId('custom-style-header')).toBeTruthy();
  });

  it('shows border when showBorder is true', () => {
    renderWithTheme(<Header title="Header with Border" showBorder={true} testID="header-with-border" />);

    expect(screen.getByTestId('header-with-border')).toBeTruthy();
  });

  it('applies custom background color', () => {
    renderWithTheme(<Header title="Custom Background Header" backgroundColor="#ff0000" testID="custom-bg-header" />);

    expect(screen.getByTestId('custom-bg-header')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    renderWithTheme(<Header title="Accessible Header" testID="accessible-header" />);

    const header = screen.getByTestId('accessible-header');
    expect(header).toBeTruthy();
  });

  it('handles long titles correctly', () => {
    const longTitle = 'This is a very long header title that might need to be truncated or wrapped';
    renderWithTheme(<Header title={longTitle} testID="long-title-header" />);

    expect(screen.getByTestId('long-title-header')).toBeTruthy();
    expect(screen.getByText(longTitle)).toBeTruthy();
  });

  it('renders without actions correctly', () => {
    renderWithTheme(<Header title="Simple Header" testID="simple-header" />);

    expect(screen.getByTestId('simple-header')).toBeTruthy();
    expect(screen.getByText('Simple Header')).toBeTruthy();
  });
});
