// Components
export * from '../lib/components/Button';
export * from '../lib/components/Card';
export * from '../lib/components/Input';
export * from '../lib/components/Badge';
export * from '../lib/components/Dialog';
export * from '../lib/components/Select';
export * from '../lib/components/Checkbox';
export * from '../lib/components/Textarea';
export * from '../lib/components/Label';
export * from '../lib/components/IconButton';
export * from '../lib/components/Radio';
export * from '../lib/components/Combobox';
export * from '../lib/components/FormField';
export * from '../lib/components/Link';
export * from '../lib/components/Toggle';
export * from '../lib/components/Switch';
export * from '../lib/components/Container';
export * from '../lib/components/Stack';
export * from '../lib/components/Grid';
export * from '../lib/components/Flex';
export * from '../lib/components/Divider';
export * from '../lib/components/Spacer';
export * from '../lib/components/Alert';
export * from '../lib/components/Toast';
export * from '../lib/components/Loading';
export * from '../lib/components/Progress';
export * from '../lib/components/Breadcrumb';
export * from '../lib/components/Tabs';
export * from '../lib/components/Pagination';
export * from '../lib/components/Tooltip';
export * from '../lib/components/Popover';
export * from '../lib/components/Dropdown';
export * from '../lib/components/Table';
export * from '../lib/components/List';
export * from '../lib/components/Avatar';
export * from '../lib/components/Image';

// Todo Components
export * from '../lib/components/todo';

// Blockchain Components
export * from '../lib/components/blockchain';

// Theme Components
export * from '../lib/components/theme';

// Core utilities
export { cn, type VariantProps } from '@todo/utils/ui/web';

// Components
export { Button, type ButtonProps } from '../lib/components/Button';
export { Input, type InputProps } from '../lib/components/Input';
export { Textarea, type TextareaProps } from '../lib/components/Textarea';
export { Select, type SelectProps } from '../lib/components/Select';
export { Card, type CardProps } from '../lib/components/Card';
export { Badge, type BadgeProps } from '../lib/components/Badge';
export { Breadcrumb, type BreadcrumbProps } from '../lib/components/Breadcrumb';
export { Tabs, type TabsProps } from '../lib/components/Tabs';
export { Pagination, type PaginationProps } from '../lib/components/Pagination';
export { Dialog, type DialogProps } from '../lib/components/Dialog';
export { Tooltip, type TooltipProps } from '../lib/components/Tooltip';
export { Popover, type PopoverProps } from '../lib/components/Popover';
export { Dropdown, type DropdownProps } from '../lib/components/Dropdown';
export { Avatar, type AvatarProps } from '../lib/components/Avatar';
export { Image, type ImageProps } from '../lib/components/Image';

// Todo Components
export { TodoForm, type TodoFormProps, type TodoFormData } from '../lib/components/todo/TodoForm';
export { TodoItem, type TodoItemProps, type TodoData } from '../lib/components/todo/TodoItem';
export { TodoList, type TodoListProps } from '../lib/components/todo/TodoList';

// Blockchain Components
export {
  BlockchainStats,
  type BlockchainStatsProps,
  type BlockchainStatsData,
} from '../lib/components/blockchain/BlockchainStats';
export {
  TransactionStatus,
  type TransactionStatusProps,
  type TransactionStatus as TransactionStatusType,
} from '../lib/components/blockchain/TransactionStatus';
export { WalletConnect, type WalletConnectProps, type WalletAccount } from '../lib/components/blockchain/WalletConnect';

// Theme System (DaisyUI + Style Dictionary)
export * from './theme';

// TypeScript Types (explicit re-exports to avoid conflicts)
export type {
  DesignTokens,
  ColorTokens,
  SpacingTokens,
  TypographyTokens,
  BorderTokens,
  ShadowTokens,
  SemanticTokens,
  ThemeTokens,
  ComponentTokens,
  DaisyUIColor,
  DaisyUISize,
  DaisyUIButtonVariants,
  DaisyUIInputVariants,
  DaisyUICardVariants,
  ValidationResult,
  TokenValidationResult,
  ComponentValidationResult,
} from './types';

export {
  isDaisyUIColor,
  isDaisyUISize,
  isDaisyUIButtonVariant,
  validateButtonProps,
  validateInputProps,
  validateCardProps,
  validateComponentProps,
  createTypeSafeProps,
  generateDaisyUIClasses,
  DAISYUI_COLORS,
  DAISYUI_SIZES,
} from './types';

// Token Utilities are already exported via '@todo/utils/ui/web'

// Styles
import './styles.css';
