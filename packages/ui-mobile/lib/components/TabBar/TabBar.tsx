/**
 * TabBar Component
 * Enhanced bottom navigation with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import React from 'react';
import { View, type ViewStyle, TouchableOpacity, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';

export interface TabItem {
  key?: string;
  label?: string;
  icon?: React.ReactNode;
  badge?: number | string | { count: number; dot?: boolean } | { dot: boolean; count?: number };
  accessibilityLabel?: string;
  testID?: string;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab?: string;
  activeIndex?: number;
  onTabPress: (tabKey: string) => void;
  showLabels?: boolean;
  showIndicator?: boolean;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  indicatorColor?: string;
  testID?: string;
  style?: ViewStyle;
}

// Not needed currently

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  activeIndex: activeIndexProp,
  onTabPress,
  showLabels = true,
  showIndicator = true,
  backgroundColor,
  activeColor,
  inactiveColor,
  indicatorColor,
  testID,
  style,
}) => {
  const { theme, evaTheme } = useEnhancedTheme();
  const insets = useSafeAreaInsets();

  // Animation values
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Find active tab index
  const activeIndex =
    activeIndexProp ?? tabs.findIndex(tab => (tab.key ?? tab.label) === (activeTab ?? tabs[0]?.key ?? tabs[0]?.label));

  // Update indicator position when active tab changes
  React.useEffect(() => {
    const tabWidth = 100 / tabs.length;
    indicatorPosition.value = withSpring(activeIndex * tabWidth, {
      damping: 20,
      stiffness: 300,
    });
    indicatorWidth.value = withSpring(tabWidth, {
      damping: 20,
      stiffness: 300,
    });
  }, [activeIndex, tabs.length, indicatorPosition, indicatorWidth]);

  const containerStyles: ViewStyle = {
    backgroundColor: backgroundColor || evaTheme['background-basic-color-1'] || theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: evaTheme['border-basic-color-3'] || theme.colors.border.default,
    paddingBottom: Platform.OS === 'ios' ? insets.bottom : theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    elevation: 4,
    shadowColor: evaTheme['color-basic-800'] || '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  };

  const tabContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
  };

  const getTabStyles = (): ViewStyle => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    minHeight: 48, // Minimum touch target
  });

  const getIconContainerStyles = (): ViewStyle => ({
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: showLabels ? theme.spacing.xs / 2 : 0,
    position: 'relative',
  });

  const getLabelStyles = (isActive: boolean) => ({
    fontSize: 12,
    fontWeight: isActive ? ('600' as const) : ('400' as const),
    color: isActive
      ? activeColor || evaTheme['color-primary-default'] || theme.colors.primary[500]
      : inactiveColor || evaTheme['text-hint-color'] || theme.colors.text.secondary,
  });

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: 0,
    left: `${indicatorPosition.value}%`,
    width: `${indicatorWidth.value}%`,
    height: 3,
    backgroundColor: indicatorColor || evaTheme['color-primary-default'] || theme.colors.primary[500],
    borderRadius: theme.borders.radius.sm,
  }));

  const renderTabIcon = (tab: TabItem, isActive: boolean) => {
    if (!tab.icon) return null;

    return (
      <View style={getIconContainerStyles()}>
        {React.isValidElement(tab.icon) ? (
          tab.icon
        ) : (
          <Icon
            size="sm"
            color={
              isActive
                ? activeColor || evaTheme['color-primary-default'] || theme.colors.primary[500]
                : inactiveColor || evaTheme['text-hint-color'] || theme.colors.text.secondary
            }
          >
            {tab.icon}
          </Icon>
        )}

        {/* Badge */}
        {tab.badge && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -8,
            }}
          >
            <Badge
              text={typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : String(tab.badge)}
              variant="danger"
              size="small"
            />
          </View>
        )}
      </View>
    );
  };

  const renderTabLabel = (tab: TabItem, isActive: boolean) => {
    if (!showLabels) return null;

    return (
      <Text variant="caption" style={getLabelStyles(isActive)} numberOfLines={1}>
        {tab.label}
      </Text>
    );
  };

  const handleTabPress = (tab: TabItem) => {
    onTabPress(tab.key ?? tab.label ?? '');
  };

  return (
    <View style={[containerStyles, style]} testID={testID}>
      {/* Indicator */}
      {showIndicator && <Animated.View style={indicatorAnimatedStyle} />}

      {/* Tab Container */}
      <View style={tabContainerStyles}>
        {tabs.map((tab, idx) => {
          const tabKey = tab.key ?? tab.label ?? String(idx);
          const isActive = tabKey === (activeTab ?? tabs[0]?.key ?? tabs[0]?.label);

          return (
            <TouchableOpacity
              key={tabKey}
              style={getTabStyles()}
              onPress={() => handleTabPress({ ...tab, key: tabKey })}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.accessibilityLabel || tab.label}
              testID={tab.testID}
            >
              {renderTabIcon(tab, isActive)}
              {tab.label ? renderTabLabel(tab, isActive) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

TabBar.displayName = 'TabBar';

export default TabBar;
