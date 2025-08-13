/**
 * Common TypeScript types and interfaces for Storybook stories in ui-web package
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType, ReactNode } from 'react';

/**
 * Base story configuration interface
 */
export interface BaseStoryConfig<T = any> {
  title: string;
  component: ComponentType<T>;
  parameters?: {
    layout?: 'centered' | 'fullscreen' | 'padded';
    docs?: {
      description?: {
        component?: string;
        story?: string;
      };
    };
    backgrounds?: {
      default?: string;
      values?: Array<{
        name: string;
        value: string;
      }>;
    };
    viewport?: {
      defaultViewport?: string;
      viewports?: Record<string, any>;
    };
  };
  tags?: string[];
  argTypes?: Record<string, ArgTypeConfig>;
  args?: Partial<T>;
}

/**
 * ArgType configuration for Storybook controls
 */
export interface ArgTypeConfig {
  control?:
    | { type: 'text' }
    | { type: 'boolean' }
    | { type: 'number'; min?: number; max?: number; step?: number }
    | { type: 'range'; min?: number; max?: number; step?: number }
    | { type: 'color' }
    | { type: 'date' }
    | { type: 'select'; options: string[] | number[] }
    | { type: 'multi-select'; options: string[] | number[] }
    | { type: 'radio'; options: string[] | number[] }
    | { type: 'inline-radio'; options: string[] | number[] }
    | { type: 'check'; options: string[] | number[] }
    | { type: 'inline-check'; options: string[] | number[] }
    | { type: 'object' }
    | { type: 'file'; accept?: string }
    | false;
  description?: string;
  table?: {
    type?: { summary: string };
    defaultValue?: { summary: string };
    category?: string;
  };
  action?: string;
  if?: { arg: string; truthy?: boolean; exists?: boolean };
}

/**
 * Common component prop patterns
 */
export interface CommonProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  'data-testid'?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
}

/**
 * Common variant types
 */
export type CommonVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

/**
 * Common size types
 */
export type CommonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Common state props
 */
export interface StateProps {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  success?: boolean;
}

/**
 * Button-like component props
 */
export interface ButtonLikeProps extends CommonProps, StateProps {
  variant?: CommonVariant;
  size?: CommonSize;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loadingText?: string;
  asChild?: boolean;
}

/**
 * Input-like component props
 */
export interface InputLikeProps extends CommonProps, StateProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
}

/**
 * Form field props
 */
export interface FormFieldProps extends CommonProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  optional?: boolean;
}

/**
 * Layout component props
 */
export interface LayoutProps extends CommonProps {
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

/**
 * Card-like component props
 */
export interface CardLikeProps extends CommonProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Navigation component props
 */
export interface NavigationProps extends CommonProps {
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  active?: boolean;
  disabled?: boolean;
}

/**
 * Utility type for creating story meta with proper typing
 */
export type StoryMeta<T> = Meta<T> & BaseStoryConfig<T>;

/**
 * Utility type for creating story objects with proper typing
 */
export type ComponentStory<T> = StoryObj<StoryMeta<T>>;

/**
 * Common argTypes configurations for reuse
 */
export const commonArgTypes = {
  // Text controls
  children: {
    control: { type: 'text' },
    description: 'Content to display inside the component',
    table: {
      type: { summary: 'ReactNode' },
      defaultValue: { summary: 'undefined' },
    },
  },

  className: {
    control: { type: 'text' },
    description: 'Additional CSS classes to apply',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },

  // Boolean controls
  disabled: {
    control: { type: 'boolean' },
    description: 'Whether the component is disabled',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  loading: {
    control: { type: 'boolean' },
    description: 'Whether the component is in loading state',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  error: {
    control: { type: 'boolean' },
    description: 'Whether the component is in error state',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },

  // Select controls
  variant: {
    control: { type: 'select' },
    options: ['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    description: 'Visual variant of the component',
    table: {
      type: { summary: 'CommonVariant' },
      defaultValue: { summary: 'default' },
    },
  },

  size: {
    control: { type: 'select' },
    options: ['sm', 'md', 'lg', 'xl'],
    description: 'Size of the component',
    table: {
      type: { summary: 'CommonSize' },
      defaultValue: { summary: 'md' },
    },
  },

  // Event handlers
  onClick: {
    action: 'clicked',
    description: 'Function called when component is clicked',
    table: {
      type: { summary: '() => void' },
      defaultValue: { summary: 'undefined' },
    },
  },

  onChange: {
    action: 'changed',
    description: 'Function called when component value changes',
    table: {
      type: { summary: '(value: string) => void' },
      defaultValue: { summary: 'undefined' },
    },
  },

  onSubmit: {
    action: 'submitted',
    description: 'Function called when form is submitted',
    table: {
      type: { summary: '() => void' },
      defaultValue: { summary: 'undefined' },
    },
  },

  // Accessibility
  'aria-label': {
    control: { type: 'text' },
    description: 'Accessibility label for screen readers',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },

  'data-testid': {
    control: { type: 'text' },
    description: 'Test identifier for automated testing',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
} as const satisfies Record<string, ArgTypeConfig>;

/**
 * Common story parameters for reuse
 */
export const commonParameters = {
  centered: {
    layout: 'centered' as const,
  },

  padded: {
    layout: 'padded' as const,
  },

  fullscreen: {
    layout: 'fullscreen' as const,
  },

  darkMode: {
    backgrounds: { default: 'dark' },
  },

  mobileViewport: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },

  tabletViewport: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },

  desktopViewport: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
} as const;

/**
 * Helper function to create consistent story meta
 */
export function createStoryMeta<T>(config: {
  title: string;
  component: ComponentType<T>;
  description?: string;
  layout?: 'centered' | 'fullscreen' | 'padded';
  argTypes?: Record<string, ArgTypeConfig>;
  args?: Partial<T>;
}): StoryMeta<T> {
  return {
    title: config.title,
    component: config.component,
    parameters: {
      layout: config.layout || 'centered',
      docs: {
        description: {
          component: config.description,
        },
      },
    },
    tags: ['autodocs'],
    argTypes: config.argTypes || {},
    args: config.args || {},
  };
}

/**
 * Helper function to create accessibility-focused stories
 */
export function createA11yStory<T>(
  args: Partial<T> & {
    'aria-label'?: string;
    'aria-describedby'?: string;
  },
  description?: string,
): ComponentStory<T> {
  return {
    args,
    parameters: {
      docs: {
        description: {
          story: description || 'Demonstrates proper accessibility attributes and screen reader support.',
        },
      },
    },
  };
}

/**
 * Helper function to create interactive stories
 */
export function createInteractiveStory<T>(renderFunction: () => ReactNode, description?: string): ComponentStory<T> {
  return {
    render: renderFunction,
    parameters: {
      docs: {
        description: {
          story: description || 'Interactive example demonstrating component behavior.',
        },
      },
    },
  };
}

/**
 * Helper function to create visual regression stories
 */
export function createVisualRegressionStory<T>(
  renderFunction: () => ReactNode,
  description?: string,
): ComponentStory<T> {
  return {
    render: renderFunction,
    parameters: {
      docs: {
        description: {
          story: description || 'Visual regression test showing component variants.',
        },
      },
    },
  };
}
