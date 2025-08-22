/**
 * Header Component
 * Navigation header with title, left/right actions, and safe area handling
 */

import React from 'react';
import { View, ViewStyle, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';

export interface HeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  backgroundColor?: string;
  testID?: string;
  style?: ViewStyle;
  showBorder?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftAction,
  rightAction,
  backgroundColor,
  testID,
  style,
  showBorder = true,
  statusBarStyle = 'dark-content',
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const headerStyles: ViewStyle = {
    backgroundColor: backgroundColor || theme.colors.surface,
    paddingTop: insets.top,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: showBorder ? theme.borders.width.thin : 0,
    borderBottomColor: theme.colors.border.default,
    ...theme.shadows.sm,
  };

  const contentStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44, // Minimum touch target size
  };

  const titleContainerStyles: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  };

  const actionContainerStyles: ViewStyle = {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const leftActionContainerStyles: ViewStyle = {
    ...actionContainerStyles,
    alignItems: 'flex-start',
  };

  const rightActionContainerStyles: ViewStyle = {
    ...actionContainerStyles,
    alignItems: 'flex-end',
  };

  return (
    <>
      {Platform.OS === 'ios' && <StatusBar barStyle={statusBarStyle} backgroundColor="transparent" />}
      <View style={[headerStyles, style]} testID={testID}>
        <View style={contentStyles}>
          {/* Left Action */}
          <View style={leftActionContainerStyles}>{leftAction}</View>

          {/* Title */}
          <View style={titleContainerStyles}>
            <Text
              variant="h4"
              color="primary"
              weight="semibold"
              align="center"
              numberOfLines={1}
              ellipsizeMode="tail"
              accessibilityRole="header"
            >
              {title}
            </Text>
          </View>

          {/* Right Action */}
          <View style={rightActionContainerStyles}>{rightAction}</View>
        </View>
      </View>
    </>
  );
};

Header.displayName = 'Header';

export default Header;
