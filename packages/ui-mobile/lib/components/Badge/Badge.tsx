import { Text } from '@ui-kitten/components';
import React, { useMemo } from 'react';
import { View, StyleSheet, type ViewStyle, type TextStyle, type StyleProp } from 'react-native';

import { useEnhancedTheme } from '../../theme/useEnhancedTheme';
import { createBadgeVariantMap, getBadgeTextCategory, sizeStyleKey } from '../../utils/badgeMapping';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'small' | 'medium' | 'large';

export interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', size = 'medium', style, textStyle, testID }) => {
  const { evaTheme } = useEnhancedTheme();

  const variantMap = useMemo(() => createBadgeVariantMap(), []);
  const visual = variantMap[variant](evaTheme);
  const sizeKey = sizeStyleKey(size);

  const badgeStyles = [styles.badge, styles[sizeKey], { backgroundColor: visual.background }, style];
  const combinedTextStyle = [styles.text, { color: visual.text }, textStyle];
  const textCategory = getBadgeTextCategory(size);
  const accessibilityLabel = `${text} badge, ${variant} variant`;

  return (
    <View style={badgeStyles} testID={testID} accessibilityRole="text" accessibilityLabel={accessibilityLabel}>
      <Text category={textCategory} style={combinedTextStyle as any} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Size styles
  smallBadge: {
    minHeight: 16,
    paddingVertical: 2,
  },
  mediumBadge: {
    minHeight: 20,
    paddingVertical: 4,
  },
  largeBadge: {
    minHeight: 24,
    paddingVertical: 6,
  },
});

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
