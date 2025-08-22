/**
 * UI Mobile Component Library
 */

// Atomic Components
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Text } from './components/Text';
export type { TextProps, TextVariant, TextColor, TextAlign, FontWeight } from './components/Text';

export { Input } from './components/Input';
export type { InputProps, InputVariant, InputSize, InputStatus } from './components/Input';

export { Icon } from './components/Icon';
export type { IconProps, IconSize } from './components/Icon';

// Molecular Components
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card';
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  CardVariant,
} from './components/Card';

export { FormField } from './components/FormField';
export type { FormFieldProps } from './components/FormField';

export { ListItem } from './components/ListItem';
export type { ListItemProps } from './components/ListItem';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

export { NetworkSelector } from './components/NetworkSelector';
export type { NetworkSelectorProps } from './components/NetworkSelector';
// TODO: Fix NetworkType export issue
// export type { NetworkType } from './components/NetworkSelector';

export { Avatar } from './components/Avatar';
export type { AvatarProps, AvatarSize, AvatarShape } from './components/Avatar';

export { Switch } from './components/Switch';
export type { SwitchProps, SwitchStatus } from './components/Switch';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps, CheckboxStatus } from './components/Checkbox';

// Theme System
export { ThemeProvider, useTheme, lightTheme, darkTheme, themes, getTheme, validateTheme, getSafeTheme } from './theme';
export type { Theme, ThemeName, ThemeContextValue } from './theme';

// Design Tokens
export * from './tokens';

// Legacy theme export for backward compatibility
export { default as theme } from './theme';
export { colors, spacing, fontSizes, fontWeights, borderRadius, shadows } from './theme';
