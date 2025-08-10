import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import theme from '../../theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  source?: ImageSourcePropType;
  initials?: string;
  size?: AvatarSize;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'md',
  backgroundColor,
  textColor,
  style,
  textStyle,
  testID,
}) => {
  const sizeValue = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  }[size];

  const fontSize = {
    xs: theme.fontSizes.xs,
    sm: theme.fontSizes.sm,
    md: theme.fontSizes.md,
    lg: theme.fontSizes.lg,
    xl: theme.fontSizes.xl,
  }[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: backgroundColor || theme.colors.primary,
        },
        style,
      ]}
      testID={testID}
    >
      {source ? (
        <Image
          source={source}
          style={styles.image}
          resizeMode="cover"
          testID={`${testID}-image`}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize,
              color: textColor || theme.colors.white,
            },
            textStyle,
          ]}
          testID={`${testID}-text`}
        >
          {initials || ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontWeight: theme.fontWeights.medium as '500',
  },
});

export default Avatar;