'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '../../Button';
import { useThemeContext } from '@/theme';
import { cn } from '@/utils';

const themeToggleVariants = cva('theme-toggle transition-all duration-200', {
  variants: {
    variant: {
      button: 'btn',
      icon: 'btn btn-ghost btn-circle',
      switch: 'toggle',
      compact: 'btn btn-sm btn-ghost',
    },
    size: {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    },
  },
  defaultVariants: {
    variant: 'icon',
    size: 'md',
  },
});

export interface ThemeToggleProps extends VariantProps<typeof themeToggleVariants> {
  className?: string;
  showLabel?: boolean;
  cycleThrough?: 'mode' | 'themes' | 'lightDark';
  customIcons?: {
    light?: React.ReactNode;
    dark?: React.ReactNode;
    system?: React.ReactNode;
  };
  'data-testid'?: string;
}

export function ThemeToggle({
  variant = 'icon',
  size = 'md',
  className,
  showLabel = false,
  cycleThrough = 'mode',
  customIcons,
  'data-testid': testId,
}: ThemeToggleProps) {
  const { mode, resolvedType, theme, themes, setMode, setTheme } = useThemeContext();

  const getThemeIcon = (type: 'light' | 'dark' | 'system') => {
    if (customIcons) {
      return customIcons[type];
    }

    switch (type) {
      case 'light':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm0 11v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1H4zm2-9v5h12V8H6z" />
          </svg>
        );
      default:
        return '☀️';
    }
  };

  const getThemeLabel = (type: 'light' | 'dark' | 'system') => {
    switch (type) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  const handleToggle = () => {
    if (cycleThrough === 'mode') {
      // Cycle through light -> dark -> system
      const modes = ['light', 'dark', 'system'] as const;
      const currentIndex = modes.indexOf(mode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      setMode(nextMode);
    } else if (cycleThrough === 'lightDark') {
      // Simple light/dark toggle
      const newMode = resolvedType === 'light' ? 'dark' : 'light';
      setMode(newMode);
    } else if (cycleThrough === 'themes') {
      // Cycle through available themes
      const currentIndex = themes.findIndex(t => t.name === theme.name);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      setTheme(nextTheme);
    }
  };

  const getAriaLabel = () => {
    if (cycleThrough === 'mode') {
      const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
      return `Switch to ${getThemeLabel(nextMode)} theme`;
    } else if (cycleThrough === 'lightDark') {
      const nextType = resolvedType === 'light' ? 'dark' : 'light';
      return `Switch to ${getThemeLabel(nextType)} theme`;
    } else {
      return 'Switch theme';
    }
  };

  const getCurrentIcon = () => {
    if (cycleThrough === 'themes') {
      return getThemeIcon(theme.type);
    }
    return getThemeIcon(mode === 'system' ? 'system' : resolvedType);
  };

  const getCurrentLabel = () => {
    if (cycleThrough === 'themes') {
      return theme.displayName || theme.name;
    }
    return getThemeLabel(mode === 'system' ? 'system' : resolvedType);
  };

  if (variant === 'switch') {
    return (
      <div className={cn('form-control', className)} data-testid={testId}>
        {showLabel && (
          <label className="label cursor-pointer">
            <span className="label-text">{getCurrentLabel()}</span>
          </label>
        )}
        <input
          type="checkbox"
          className={cn(themeToggleVariants({ variant, size }))}
          checked={resolvedType === 'dark'}
          onChange={handleToggle}
          aria-label={getAriaLabel()}
        />
      </div>
    );
  }

  return (
    <Button
      variant={variant === 'icon' ? 'ghost' : 'outline'}
      size={size}
      onClick={handleToggle}
      className={cn(themeToggleVariants({ variant, size }), variant === 'icon' && 'w-10 h-10 p-0', className)}
      aria-label={getAriaLabel()}
      data-testid={testId}
    >
      <span className="flex items-center gap-2">
        {getCurrentIcon()}
        {showLabel && <span className={cn(variant === 'compact' && 'text-xs')}>{getCurrentLabel()}</span>}
      </span>
    </Button>
  );
}
