/**
 * UI Mobile Component Library
 */

// Components
export { default as Button } from '../lib/components/Button';
export type { ButtonProps } from '../lib/components/Button';

export { default as Avatar } from '../lib/components/Avatar';
export type { AvatarProps, AvatarSize } from '../lib/components/Avatar';

export { default as Badge } from '../lib/components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from '../lib/components/Badge';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../lib/components/Card';
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from '../lib/components/Card';

export { default as Checkbox } from '../lib/components/Checkbox';
export type { CheckboxProps } from '../lib/components/Checkbox';

export { default as Input } from '../lib/components/Input';
export type { InputProps } from '../lib/components/Input';

export { NetworkSelector } from '../lib/components/NetworkSelector';
export type { NetworkSelectorProps } from '../lib/components/NetworkSelector';

export { default as Switch } from '../lib/components/Switch';
export type { SwitchProps } from '../lib/components/Switch';

// Theme
export { default as theme } from '../lib/theme';
export { colors, spacing, fontSizes, fontWeights, borderRadius, shadows } from '../lib/theme';
