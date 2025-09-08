import type { BadgeVariant, BadgeSize } from '../components/Badge';

export interface BadgeVisualMapping {
  background: string;
  text: string;
}

export type BadgeVariantMap = Record<BadgeVariant, (tokens: Record<string, string>) => BadgeVisualMapping>;

export const createBadgeVariantMap = (tokens: Record<string, string>): BadgeVariantMap => ({
  default: t => ({
    background: t['background-basic-color-2'] || '#F7F9FC',
    text: t['text-hint-color'] || '#8F9BB3',
  }),
  primary: t => ({
    background: t['color-primary-default'] || '#3366FF',
    text: t['text-control-color'] || '#FFFFFF',
  }),
  secondary: t => ({
    background: t['text-hint-color'] || '#8F9BB3',
    text: t['text-control-color'] || '#FFFFFF',
  }),
  success: t => ({
    background: t['color-success-default'] || '#00E096',
    text: t['text-control-color'] || '#FFFFFF',
  }),
  warning: t => ({
    background: t['color-warning-default'] || '#FFAA00',
    text: t['text-control-color'] || '#FFFFFF',
  }),
  danger: t => ({
    background: t['color-danger-default'] || '#FF3D71',
    text: t['text-control-color'] || '#FFFFFF',
  }),
});

export const getBadgeTextCategory = (size: BadgeSize): string => {
  switch (size) {
    case 'small':
      return 'c2';
    case 'large':
      return 'p2';
    case 'medium':
    default:
      return 'c1';
  }
};

export const sizeStyleKey = (size: BadgeSize): 'smallBadge' | 'mediumBadge' | 'largeBadge' => {
  switch (size) {
    case 'small':
      return 'smallBadge';
    case 'large':
      return 'largeBadge';
    case 'medium':
    default:
      return 'mediumBadge';
  }
};
