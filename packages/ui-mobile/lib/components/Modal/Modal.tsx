/**
 * Modal Component
 * Modal dialog with backdrop, animations, focus management, and accessibility
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  ViewStyle,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';
export type ModalType = 'default' | 'alert' | 'confirmation';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  type?: ModalType;
  children: React.ReactNode;
  testID?: string;
  closeOnBackdropPress?: boolean;
  showCloseButton?: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
  keyboardAvoidingBehavior?: 'height' | 'position' | 'padding';
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  size = 'md',
  type = 'default',
  children,
  testID,
  closeOnBackdropPress = true,
  showCloseButton = true,
  animationType = 'slide',
  keyboardAvoidingBehavior = 'padding',
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Animation values
  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalTranslateY = useSharedValue(50);

  // Refs for focus management
  const modalRef = useRef<View>(null);
  const firstFocusableRef = useRef<View>(null);

  useEffect(() => {
    if (visible) {
      // Show modal with animation
      backdropOpacity.value = withTiming(1, { duration: 200 });

      if (animationType === 'scale') {
        modalScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      } else if (animationType === 'slide') {
        modalTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      } else {
        modalScale.value = withTiming(1, { duration: 200 });
        modalTranslateY.value = withTiming(0, { duration: 200 });
      }

      // Focus management
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 300);
    } else {
      // Hide modal with animation
      backdropOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.8, { duration: 200 });
      modalTranslateY.value = withTiming(50, { duration: 200 });
    }
  }, [visible, animationType, backdropOpacity, modalScale, modalTranslateY]);

  const getModalSize = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borders.radius.lg,
      ...theme.shadows.lg,
    };

    switch (size) {
      case 'sm':
        return {
          ...baseStyles,
          width: Math.min(screenWidth * 0.8, 320),
          maxHeight: screenHeight * 0.6,
        };
      case 'md':
        return {
          ...baseStyles,
          width: Math.min(screenWidth * 0.9, 400),
          maxHeight: screenHeight * 0.7,
        };
      case 'lg':
        return {
          ...baseStyles,
          width: Math.min(screenWidth * 0.95, 500),
          maxHeight: screenHeight * 0.8,
        };
      case 'fullscreen':
        return {
          ...baseStyles,
          width: screenWidth,
          height: screenHeight,
          borderRadius: 0,
          marginTop: insets.top,
          marginBottom: insets.bottom,
        };
      default:
        return baseStyles;
    }
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }, { translateY: modalTranslateY.value }],
  }));

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const handleClose = () => {
    runOnJS(onClose)();
  };

  const containerStyles: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  };

  const backdropStyles: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: theme.borders.width.thin,
    borderBottomColor: theme.colors.border.default,
  };

  const contentStyles: ViewStyle = {
    flex: 1,
    padding: theme.spacing.lg,
  };

  const footerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderTopWidth: theme.borders.width.thin,
    borderTopColor: theme.colors.border.default,
    gap: theme.spacing.sm,
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      testID={testID}
      accessibilityViewIsModal
      accessibilityLabel={title ? `${title} modal` : 'Modal dialog'}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingBehavior}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <View style={containerStyles}>
          {/* Backdrop */}
          <AnimatedTouchableOpacity
            style={[backdropStyles, backdropAnimatedStyle]}
            onPress={handleBackdropPress}
            activeOpacity={1}
            accessibilityLabel="Close modal"
            accessibilityRole="button"
          />

          {/* Modal Content */}
          <Animated.View ref={modalRef} style={[getModalSize(), modalAnimatedStyle]} accessibilityRole="none">
            {/* Header */}
            {(title || showCloseButton) && (
              <View style={headerStyles}>
                <View style={{ flex: 1 }}>
                  {title && (
                    <Text variant="h3" color="primary" weight="semibold" accessibilityRole="header">
                      {title}
                    </Text>
                  )}
                </View>

                {showCloseButton && (
                  <TouchableOpacity
                    ref={firstFocusableRef}
                    onPress={handleClose}
                    style={{
                      padding: theme.spacing.xs,
                      borderRadius: theme.borders.radius.sm,
                    }}
                    accessibilityLabel="Close modal"
                    accessibilityRole="button"
                    accessibilityHint="Closes the modal dialog"
                  >
                    <Icon size="md" color={theme.colors.text.secondary}>
                      ✕
                    </Icon>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Content */}
            <ScrollView style={contentStyles} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>

            {/* Footer for confirmation/alert types */}
            {type !== 'default' && (
              <View style={footerStyles}>
                {type === 'confirmation' && (
                  <>
                    <Button variant="outline" size="md" onPress={onClose} accessibilityLabel="Cancel">
                      Cancel
                    </Button>
                    <Button variant="primary" size="md" onPress={onClose} accessibilityLabel="Confirm">
                      Confirm
                    </Button>
                  </>
                )}

                {type === 'alert' && (
                  <Button variant="primary" size="md" onPress={onClose} accessibilityLabel="OK">
                    OK
                  </Button>
                )}
              </View>
            )}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

Modal.displayName = 'Modal';

export default Modal;
