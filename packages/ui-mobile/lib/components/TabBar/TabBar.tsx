/**
 * TabBar Component
 * Bottom navigation tab bar with indicators, icons, and badge support
 */

import React from 'react';
import { View, ViewStyle, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';
import { Badge } from '../Badge/Badge';

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  accessibilityLabel?: string;
  testID?: string;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
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

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
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
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Animation values
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Find active tab index
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab);

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
    backgroundColor: backgroundColor || theme.colors.surface,
    borderTopWidth: theme.borders.width.thin,
    borderTopColor: theme.colors.border.default,
    paddingBottom: Platform.OS === 'ios' ? insets.bottom : theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    ...theme.shadows.sm,
  };

  const tabContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
  };

  const getTabStyles = (isActive: boolean): ViewStyle => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    minHeight: 48, // Minimum touch target
  });

  const getIconContainerStyles = (isActive: boolean): ViewStyle => ({
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: showLabels ? theme.spacing.xs / 2 : 0,
    position: 'relative',
  });

  const getLabelStyles = (isActive: boolean) => ({
    fontSize: 12,
    fontWeight: isActive ? ('600' as const) : ('400' as const),
    color: isActive ? activeColor || theme.colors.primary[500] : inactiveColor || theme.colors.text.secondary,
  });

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: 0,
    left: `${indicatorPosition.value}%`,
    width: `${indicatorWidth.value}%`,
    height: 3,
    backgroundColor: indicatorColor || theme.colors.primary[500],
    borderRadius: theme.borders.radius.sm,
  }));

  const renderTabIcon = (tab: TabItem, isActive: boolean) => {
    if (!tab.icon) return null;

    return (
      <View style={getIconContainerStyles(isActive)}>
        {React.isValidElement(tab.icon) ? (
          tab.icon
        ) : (
          <Icon
            size="sm"
            color={isActive ? activeColor || theme.colors.primary[500] : inactiveColor || theme.colors.text.secondary}
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
      <Text variant="caption" style={getLabelStyles(isActive)} numberOfLines={1} ellipsizeMode="tail">
        {tab.label}
      </Text>
    );
  };

  const handleTabPress = (tab: TabItem) => {
    onTabPress(tab.key);
  };

  return (
    <View style={[containerStyles, style]} testID={testID}>
      {/* Indicator */}
      {showIndicator && <Animated.View style={indicatorAnimatedStyle} />}

      {/* Tab Container */}
      <View style={tabContainerStyles}>
        {tabs.map(tab => {
          const isActive = tab.key === activeTab;

          return (
            <TouchableOpacity
              key={tab.key}
              style={getTabStyles(isActive)}
              onPress={() => handleTabPress(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.accessibilityLabel || tab.label}
              testID={tab.testID}
            >
              {renderTabIcon(tab, isActive)}
              {renderTabLabel(tab, isActive)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

TabBar.displayName = 'TabBar';

export default TabBar;
