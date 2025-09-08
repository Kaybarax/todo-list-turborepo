/**
 * Header Component
 * Enhanced navigation header with Eva Design and UI Kitten integration
 * Maintains backward compatibility while using Eva Design theming
 */

import React from 'react';
import { View, type ViewStyle, Platform, StatusBar, StyleSheet, type StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { getShadow } from '../../utils/shadows';
import { Text } from '../Text/Text';

export interface HeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  backgroundColor?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  showBorder?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  accessibilityLabel?: string; // allow explicit override of header label
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
  accessibilityLabel,
}) => {
  const { theme, evaTheme } = useEnhancedTheme();
  const insets = useSafeAreaInsets();

  // Dynamic section (spacing, colors) layered atop static base + shadow token (HDR-2)
  const headerDynamic: ViewStyle = {
    backgroundColor: backgroundColor || evaTheme['background-basic-color-1'] || theme.colors.surface,
    paddingTop: insets.top,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: showBorder ? 1 : 0,
    borderBottomColor: evaTheme['border-basic-color-3'] || theme.colors.border.default,
  };

  // Apply shared shadow util (HDR-2 / replaces inline spread)
  const elevationShadow = getShadow('md', evaTheme['color-basic-800'] || '#000');

  const finalHeaderStyles: StyleProp<ViewStyle> = [styles.headerBase, elevationShadow, headerDynamic, style];

  const actionHitSlop = styles.actionBase; // static min size

  const leftActionContainerStyles: StyleProp<ViewStyle> = [actionHitSlop, styles.actionLeft];
  const rightActionContainerStyles: StyleProp<ViewStyle> = [actionHitSlop, styles.actionRight];

  return (
    <>
      {Platform.OS === 'ios' && <StatusBar barStyle={statusBarStyle} backgroundColor="transparent" />}
      <View
        style={finalHeaderStyles}
        testID={testID}
        // HDR-1: explicit landmark semantics
        accessibilityRole="header"
        accessibilityLabel={accessibilityLabel || title}
      >
        <View style={styles.contentRow}>
          {/* Left Action */}
          <View style={leftActionContainerStyles}>{leftAction}</View>

          {/* Title */}
          <View style={[styles.titleContainer, { paddingHorizontal: theme.spacing.sm }]}>
            {' '}
            {/* dynamic spacing */}
            <Text variant="h4" color="primary" weight="semibold" align="center" numberOfLines={1}>
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

// HDR-2: Extract static styles for structural layout & min target sizing
const styles = StyleSheet.create({
  headerBase: {
    // color & spacing applied dynamically
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  actionBase: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLeft: {
    alignItems: 'flex-start',
  },
  actionRight: {
    alignItems: 'flex-end',
  },
});
