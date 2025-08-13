/**
 * UI Mobile Component Library
 */

// Components
export { default as Button } from './components/Button/Button';
export type { ButtonProps } from './components/Button/Button';

export { default as TodoItem } from './components/TodoItem/TodoItem';
export type { TodoItemProps } from './components/TodoItem/TodoItem';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card/Card';
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './components/Card/Card';

export { default as Input } from './components/Input/Input';
export type { InputProps } from './components/Input/Input';

export { default as Badge } from './components/Badge/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge/Badge';

export { default as Avatar } from './components/Avatar/Avatar';
export type { AvatarProps, AvatarSize } from './components/Avatar/Avatar';

export { default as Switch } from './components/Switch/Switch';
export type { SwitchProps } from './components/Switch/Switch';

export { default as Checkbox } from './components/Checkbox/Checkbox';
export type { CheckboxProps } from './components/Checkbox/Checkbox';

// Theme
export { default as theme } from './theme';
export { colors, spacing, fontSizes, fontWeights, borderRadius, shadows } from './theme';
