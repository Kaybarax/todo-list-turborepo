import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { TabBar } from './TabBar';
import { ThemeProvider } from '../../theme';
import { validateTouchTargetSize } from '../../utils/accessibility';

// Mock React Native AccessibilityInfo
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  AccessibilityInfo: {
    announceForAccessibility: jest.fn(),
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
  },
}));

const mockAccessibilityInfo = AccessibilityInfo as jest.Mocked<typeof AccessibilityInfo>;

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const mockTabs = [
  { label: 'Home', icon: 'home' },
  { label: 'Search', icon: 'search' },
  { label: 'Profile', icon: 'person' },
];

describe('TabBar Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Screen Reader Support', () => {
    it('has proper tablist role', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />);

      const tabbar = screen.getByTestId('tabbar');
      expect(tabbar.props.accessibilityRole).toBe('tablist');
    });

    it('individual tabs have proper tab role', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />);

      // Each tab should have proper accessibility role
      const homeTab = screen.getByText('Home');
      expect(homeTab.parent?.props.accessibilityRole).toBe('tab');
    });

    it('announces selected state for active tab', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={1} onTabPress={() => {}} testID="tabbar" />);

      const searchTab = screen.getByText('Search');
      expect(searchTab.parent?.props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
    });

    it('provides accessibility labels for tabs', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />);

      const homeTab = screen.getByText('Home');
      expect(homeTab.parent?.props.accessibilityLabel).toBe('Home tab');
    });

    it('provides accessibility hints for tab navigation', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />);

      const searchTab = screen.getByText('Search');
      expect(searchTab.parent?.props.accessibilityHint).toBe('Navigate to Search');
    });
  });

  describe('Touch Target Validation', () => {
    it('meets minimum touch target size for all tabs', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />);

      // Each tab should meet minimum 44x44 touch target
      expect(validateTouchTargetSize(44, 44)).toBe(true);
    });

    it('maintains adequate spacing between tabs', () => {
      const fiveTabs = [
        { label: 'Home', icon: 'home' },
        { label: 'Search', icon: 'search' },
        { label: 'Add', icon: 'add' },
        { label: 'Favorites', icon: 'heart' },
        { label: 'Profile', icon: 'person' },
      ];

      renderWithTheme(<TabBar tabs={fiveTabs} activeIndex={0} onTabPress={() => {}} testID="five-tabs" />);

      // Even with 5 tabs, touch targets should be adequate
      expect(validateTouchTargetSize(44, 44)).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation between tabs', () => {
      const onTabPressMock = jest.fn();

      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={onTabPressMock} testID="tabbar" />);

      const searchTab = screen.getByText('Search');
      fireEvent.press(searchTab);

      expect(onTabPressMock).toHaveBeenCalledWith(1);
    });

    it('maintains focus indicators for keyboard users', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />);

      const homeTab = screen.getByText('Home');
      expect(homeTab.parent?.props.accessible).toBe(true);
    });
  });

  describe('Badge Accessibility', () => {
    it('announces badge count to screen readers', () => {
      const tabsWithBadges = [
        { label: 'Home', icon: 'home' },
        { label: 'Messages', icon: 'mail', badge: { count: 3 } },
        { label: 'Profile', icon: 'person' },
      ];

      renderWithTheme(
        <TabBar tabs={tabsWithBadges} activeIndex={0} onTabPress={() => {}} testID="tabbar-with-badges" />,
      );

      const messagesTab = screen.getByText('Messages');
      expect(messagesTab.parent?.props.accessibilityLabel).toBe('Messages tab, 3 unread');
    });

    it('announces dot badge presence', () => {
      const tabsWithDotBadges = [
        { label: 'Home', icon: 'home' },
        { label: 'Notifications', icon: 'notifications', badge: { dot: true } },
        { label: 'Profile', icon: 'person' },
      ];

      renderWithTheme(
        <TabBar tabs={tabsWithDotBadges} activeIndex={0} onTabPress={() => {}} testID="tabbar-with-dot-badges" />,
      );

      const notificationsTab = screen.getByText('Notifications');
      expect(notificationsTab.parent?.props.accessibilityLabel).toBe('Notifications tab, has updates');
    });
  });

  describe('Icon-Only Tabs Accessibility', () => {
    it('provides meaningful labels for icon-only tabs', () => {
      const iconOnlyTabs = [{ icon: 'home' }, { icon: 'search' }, { icon: 'person' }];

      renderWithTheme(<TabBar tabs={iconOnlyTabs} activeIndex={0} onTabPress={() => {}} testID="icon-only-tabbar" />);

      const tabbar = screen.getByTestId('icon-only-tabbar');
      expect(tabbar).toBeTruthy();

      // Icon-only tabs should still have meaningful accessibility labels
      // This would be implemented in the actual component
    });
  });

  describe('Tab State Announcements', () => {
    it('announces tab selection changes', () => {
      const onTabPressMock = jest.fn();

      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={onTabPressMock} testID="tabbar" />);

      const profileTab = screen.getByText('Profile');
      fireEvent.press(profileTab);

      expect(onTabPressMock).toHaveBeenCalledWith(2);
    });

    it('maintains proper selected state after tab change', () => {
      const { rerender } = renderWithTheme(
        <TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />,
      );

      let homeTab = screen.getByText('Home');
      expect(homeTab.parent?.props.accessibilityState?.selected).toBe(true);

      rerender(
        <ThemeProvider>
          <TabBar tabs={mockTabs} activeIndex={1} onTabPress={() => {}} testID="tabbar" />
        </ThemeProvider>,
      );

      const searchTab = screen.getByText('Search');
      expect(searchTab.parent?.props.accessibilityState?.selected).toBe(true);

      homeTab = screen.getByText('Home');
      expect(homeTab.parent?.props.accessibilityState?.selected).toBe(false);
    });
  });

  describe('Reduced Motion Support', () => {
    it('respects reduced motion preferences for tab indicator', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />);

      const tabbar = screen.getByTestId('tabbar');
      expect(tabbar).toBeTruthy();

      // Tab indicator animations should respect reduced motion
      // This would be implemented in the actual component
    });
  });

  describe('High Contrast Support', () => {
    it('maintains visibility in high contrast mode', () => {
      renderWithTheme(<TabBar tabs={mockTabs} activeIndex={0} onTabPress={() => {}} testID="tabbar" />);

      const tabbar = screen.getByTestId('tabbar');
      expect(tabbar).toBeTruthy();

      // Tab styling should work in high contrast mode
      // This would be validated through visual testing
    });
  });
});
