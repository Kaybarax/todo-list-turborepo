'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Select } from '../../Select';
import { Button } from '../../Button';
import { Dropdown, type DropdownItem } from '../../Dropdown';
import { useThemeContext, type DaisyUITheme } from '@/theme';
import { cn } from '@/utils';

const themeSwitcherVariants = cva('theme-switcher', {
  variants: {
    variant: {
      dropdown: 'dropdown',
      select: 'form-control',
      buttons: 'btn-group',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'select',
    size: 'md',
  },
});

export interface ThemeSwitcherProps extends VariantProps<typeof themeSwitcherVariants> {
  className?: string;
  showLabel?: boolean;
  groupThemes?: boolean;
  customThemes?: string[];
  'data-testid'?: string;
}

export function ThemeSwitcher({
  variant = 'select',
  size = 'md',
  className,
  showLabel = true,
  groupThemes = true,
  customThemes,
  'data-testid': testId,
}: ThemeSwitcherProps) {
  const { theme, themes, daisyUITheme, setTheme, setDaisyUITheme } = useThemeContext();

  // Convert themes to theme names for consistent handling
  const availableThemeNames = customThemes || (themes.map(t => t.daisyUITheme || t.name).filter(Boolean) as string[]);
  const currentTheme = daisyUITheme || theme.name;

  const handleThemeChange = (newTheme: string) => {
    if (setDaisyUITheme && themes.find(t => t.daisyUITheme === newTheme)) {
      setDaisyUITheme(newTheme as DaisyUITheme);
    } else {
      const themeConfig = themes.find(t => t.name === newTheme);
      if (themeConfig) {
        setTheme(themeConfig);
      }
    }
  };

  const formatThemeName = (themeName: string) => {
    return themeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const groupedThemes = groupThemes
    ? {
        light: availableThemeNames.filter((t: string) => {
          const themeConfig = themes.find(tc => tc.name === t || tc.daisyUITheme === t);
          return themeConfig?.type === 'light';
        }),
        dark: availableThemeNames.filter((t: string) => {
          const themeConfig = themes.find(tc => tc.name === t || tc.daisyUITheme === t);
          return themeConfig?.type === 'dark';
        }),
      }
    : null;

  if (variant === 'select') {
    return (
      <div className={cn(themeSwitcherVariants({ variant, size }), className)} data-testid={testId}>
        {showLabel && (
          <label className="label">
            <span className="label-text">Theme</span>
          </label>
        )}
        <Select
          value={currentTheme}
          onChange={e => handleThemeChange(e.target.value)}
          className={cn('select-bordered', {
            'select-sm': size === 'sm',
            'select-lg': size === 'lg',
          })}
        >
          {groupedThemes ? (
            <>
              <optgroup label="Light Themes">
                {groupedThemes.light.map((themeName: string) => (
                  <option key={themeName} value={themeName}>
                    {formatThemeName(themeName)}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Dark Themes">
                {groupedThemes.dark.map((themeName: string) => (
                  <option key={themeName} value={themeName}>
                    {formatThemeName(themeName)}
                  </option>
                ))}
              </optgroup>
            </>
          ) : (
            availableThemeNames.map((themeName: string) => (
              <option key={themeName} value={themeName}>
                {formatThemeName(themeName)}
              </option>
            ))
          )}
        </Select>
      </div>
    );
  }

  if (variant === 'dropdown') {
    // Create dropdown items for the current Dropdown API
    const createDropdownItems = (): DropdownItem[] => {
      if (groupedThemes) {
        return [
          ...groupedThemes.light.map((themeName: string) => ({
            id: `light-${themeName}`,
            label: formatThemeName(themeName),
            onSelect: () => handleThemeChange(themeName),
          })),
          ...groupedThemes.dark.map((themeName: string) => ({
            id: `dark-${themeName}`,
            label: formatThemeName(themeName),
            onSelect: () => handleThemeChange(themeName),
          })),
        ];
      }
      return availableThemeNames.map((themeName: string) => ({
        id: themeName,
        label: formatThemeName(themeName),
        onSelect: () => handleThemeChange(themeName),
      }));
    };

    return (
      <div className={cn(themeSwitcherVariants({ variant, size }), className)} data-testid={testId}>
        <Dropdown items={createDropdownItems()} label={formatThemeName(currentTheme)} />
      </div>
    );
  }

  if (variant === 'buttons') {
    const displayThemes =
      groupThemes && groupedThemes ? [...groupedThemes.light, ...groupedThemes.dark] : availableThemeNames;

    return (
      <div className={cn(themeSwitcherVariants({ variant, size }), className)} data-testid={testId}>
        {showLabel && (
          <div className="label">
            <span className="label-text">Theme</span>
          </div>
        )}
        <div className="btn-group flex-wrap gap-1">
          {displayThemes.slice(0, 6).map((themeName: string) => (
            <Button
              key={themeName}
              variant={themeName === currentTheme ? 'primary' : 'ghost'}
              size={size}
              onClick={() => handleThemeChange(themeName)}
              className="btn-sm"
            >
              {formatThemeName(themeName)}
            </Button>
          ))}
          {displayThemes.length > 6 && (
            <Dropdown
              items={displayThemes.slice(6).map((themeName: string) => ({
                id: themeName,
                label: formatThemeName(themeName),
                onSelect: () => handleThemeChange(themeName),
              }))}
              label="More..."
            />
          )}
        </div>
      </div>
    );
  }

  // Default fallback to select variant
  return (
    <div className={cn(themeSwitcherVariants({ variant: 'select', size }), className)} data-testid={testId}>
      {showLabel && (
        <label className="label">
          <span className="label-text">Theme</span>
        </label>
      )}
      <Select value={currentTheme} onChange={e => handleThemeChange(e.target.value)} className="select-bordered">
        {availableThemeNames.map((themeName: string) => (
          <option key={themeName} value={themeName}>
            {formatThemeName(themeName)}
          </option>
        ))}
      </Select>
    </div>
  );
}
