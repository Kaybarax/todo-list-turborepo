import React from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { getShadow } from '../../utils/shadows';
import { Text } from '../Text/Text';
import type { HeaderProps } from './Header';

/**
 * HeaderTopNavSpike
 * Experimental wrapper using UI Kitten TopNavigation to evaluate replacing custom Header (P6-3).
 * Mirrors HeaderProps API while enforcing accessibility role and safe-area spacing.
 */
export const HeaderTopNavSpike: React.FC<HeaderProps> = ({
  title,
  leftAction,
  rightAction,
  backgroundColor,
  testID,
  showBorder = true,
  statusBarStyle = 'dark-content',
  accessibilityLabel,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { theme, evaTheme } = useEnhancedTheme();

  const bg = backgroundColor || evaTheme['background-basic-color-1'] || theme.colors.surface;
  const borderColor = evaTheme['border-basic-color-3'] || theme.colors.border.default;
  const elevationShadow = getShadow('md', evaTheme['color-basic-800'] || '#000');

  const containerStyle = [
    styles.base,
    elevationShadow,
    {
      paddingTop: insets.top,
      backgroundColor: bg,
      borderBottomWidth: showBorder ? 1 : 0,
      borderBottomColor: borderColor,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    style,
  ];

  const renderAccessory = (node?: React.ReactNode) =>
    node ? <View style={styles.actionWrapper}>{node}</View> : <View style={styles.actionWrapper} />;

  return (
    <>
      {Platform.OS === 'ios' && <StatusBar barStyle={statusBarStyle} backgroundColor="transparent" />}
      <View
        testID={testID}
        accessibilityRole="header"
        accessibilityLabel={accessibilityLabel || title}
        style={containerStyle}
      >
        <TopNavigation
          style={styles.transparent}
          alignment="center"
          title={() => (
            <Text variant="h4" color="primary" weight="semibold" align="center" numberOfLines={1}>
              {title}
            </Text>
          )}
          accessoryLeft={() => renderAccessory(leftAction)}
          accessoryRight={() => renderAccessory(rightAction)}
        />
      </View>
    </>
  );
};

HeaderTopNavSpike.displayName = 'HeaderTopNavSpike';

const styles = StyleSheet.create({
  base: {
    // dynamic padding & colors applied inline
  },
  transparent: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  actionWrapper: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderTopNavSpike;
