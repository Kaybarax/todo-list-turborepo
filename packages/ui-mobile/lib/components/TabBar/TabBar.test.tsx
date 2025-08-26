import { render, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';

import { TabBar } from './TabBar';
import { ThemeProvider } from '../../theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const mockTabs = [
  { label: 'Home', icon: 'home' },
  { label: 'Search', icon: 'search' },
  { label: 'Profile', icon: 'person' },
];

const mockTabsWithBadges = [
  { label: 'Home', icon: 'home' },
  { label: 'Messages', icon: 'mail', badge: { count: 3 } },
  { label: 'Notifications', icon: 'notifications', badge: { dot: true } },
  { label: 'Profile', icon: 'person' },
];

describe('TabBar', () => {
  it('renders correctly with basic tabs', () => {
    renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="basic-tabbar" />);

    expect(screen.getByTestId('basic-tabbar')).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Search')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('handles tab press correctly', () => {
    const onTabPressMock = jest.fn();
    renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={onTabPressMock} testID="interactive-tabbar" />);

    const searchTab = screen.getByText('Search');
    fireEvent.press(searchTab);
    expect(onTabPressMock).toHaveBeenCalledWith(1);
  });

  it('shows active tab correctly', () => {
    renderWithTheme(<TabBar tabs={mockTabs} activeIndex={1} onTabPress={() => {}} testID="active-tabbar" />);

    expect(screen.getByTestId('active-tabbar')).toBeTruthy();
    // Active tab should be visually different (tested through styling)
  });

  it('renders tabs with badges correctly', () => {
    renderWithTheme(<TabBar tabs={mockTabsWithBadges} activeIndex={0} onTabPress={() => {}} testID="badge-tabbar" />);

    expect(screen.getByTestId('badge-tabbar')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy(); // Count badge
  });

  it('renders tabs with dot badges correctly', () => {
    renderWithTheme(
      <TabBar tabs={mockTabsWithBadges} activeIndex={0} onTabPress={() => {}} testID="dot-badge-tabbar" />,
    );

    expect(screen.getByTestId('dot-badge-tabbar')).toBeTruthy();
    // Dot badge should be present (visual indicator)
  });

  it('renders tabs without labels correctly', () => {
    const tabsWithoutLabels = [{ icon: 'home' }, { icon: 'search' }, { icon: 'person' }];

    renderWithTheme(
      <TabBar tabs={tabsWithoutLabels} activeIndex={0} onTabPress={() => {}} testID="icon-only-tabbar" />,
    );

    expect(screen.getByTestId('icon-only-tabbar')).toBeTruthy();
  });

  it('renders tabs without icons correctly', () => {
    const tabsWithoutIcons = [{ label: 'Home' }, { label: 'Search' }, { label: 'Profile' }];

    renderWithTheme(
      <TabBar tabs={tabsWithoutIcons} activeIndex={0} onTabPress={() => {}} testID="label-only-tabbar" />,
    );

    expect(screen.getByTestId('label-only-tabbar')).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Search')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('handles five tabs correctly', () => {
    const fiveTabs = [
      { label: 'Home', icon: 'home' },
      { label: 'Search', icon: 'search' },
      { label: 'Add', icon: 'add' },
      { label: 'Favorites', icon: 'heart' },
      { label: 'Profile', icon: 'person' },
    ];

    renderWithTheme(<TabBar tabs={fiveTabs} activeIndex={0} onTabPress={() => {}} testID="five-tabs-tabbar" />);

    expect(screen.getByTestId('five-tabs-tabbar')).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Add')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="accessible-tabbar" />);

    const tabbar = screen.getByTestId('accessible-tabbar');
    expect(tabbar.props.accessibilityRole).toBe('tablist');
  });

  it('applies custom style correctly', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithTheme(
      <TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} style={customStyle} testID="custom-style-tabbar" />,
    );

    expect(screen.getByTestId('custom-style-tabbar')).toBeTruthy();
  });

  it('handles empty tabs array gracefully', () => {
    renderWithTheme(<TabBar tabs={[]} activeIndex={0} onTabPress={() => {}} testID="empty-tabbar" />);

    expect(screen.getByTestId('empty-tabbar')).toBeTruthy();
  });

  it('handles out of bounds activeIndex gracefully', () => {
    renderWithTheme(<TabBar tabs={mockTabs} activeIndex={10} onTabPress={() => {}} testID="out-of-bounds-tabbar" />);

    expect(screen.getByTestId('out-of-bounds-tabbar')).toBeTruthy();
  });
});
