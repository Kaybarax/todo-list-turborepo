/**
 * UI Mobile Component Library
 */

// Components
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './components/Card';
export type { 
  CardProps, 
  CardHeaderProps, 
  CardTitleProps, 
  CardDescriptionProps, 
  CardContentProps, 
  CardFooterProps 
} from './components/Card';

export { Input } from './components/Input';
export type { InputProps, InputVariant, InputSize, InputStatus } from './components/Input';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

export { Avatar } from './components/Avatar';
export type { AvatarProps, AvatarSize, AvatarShape } from './components/Avatar';

export { Switch } from './components/Switch';
export type { SwitchProps, SwitchStatus } from './components/Switch';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps, CheckboxStatus } from './components/Checkbox';

// Theme
export { default as theme } from './theme';
export {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  borderRadius,
  shadows,
} from './theme';