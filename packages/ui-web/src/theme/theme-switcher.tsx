import React from 'react';
import { useTheme, DaisyUITheme } from './theme-provider';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'dropdown' | 'toggle' | 'buttons';
}

const THEME_GROUPS = {
  'Custom Themes': ['todo-light', 'todo-dark'] as DaisyUITheme[],
  'Light Themes': [
    'light',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'valentine',
    'garden',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'cmyk',
    'autumn',
    'acid',
    'lemonade',
  ] as DaisyUITheme[],
  'Dark Themes': [
    'dark',
    'synthwave',
    'retro',
    'cyberpunk',
    'halloween',
    'forest',
    'aqua',
    'black',
    'luxury',
    'dracula',
    'business',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
  ] as DaisyUITheme[],
};

export function ThemeSwitcher({ className = '', showLabel = true, variant = 'dropdown' }: ThemeSwitcherProps) {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === 'toggle') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && <span className="text-sm font-medium">Theme</span>}
        <button onClick={toggleTheme} className="btn btn-ghost btn-sm" aria-label="Toggle theme">
          {theme.includes('dark') || theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {showLabel && <span className="text-sm font-medium w-full">Themes</span>}
        {Object.entries(THEME_GROUPS).map(([groupName, themes]) => (
          <div key={groupName} className="flex flex-col gap-1">
            <span className="text-xs opacity-70">{groupName}</span>
            <div className="flex flex-wrap gap-1">
              {themes.map(themeName => (
                <button
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  className={`btn btn-xs ${theme === themeName ? 'btn-primary' : 'btn-outline'}`}
                  data-theme={themeName}
                >
                  {formatThemeName(themeName)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
        {showLabel && <span className="hidden sm:inline">Theme:</span>}
        <span className="capitalize">{formatThemeName(theme)}</span>
        <svg
          width="12px"
          height="12px"
          className="ml-1 opacity-60 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow-2xl bg-base-300 rounded-box w-52 max-h-96 overflow-y-auto"
      >
        {Object.entries(THEME_GROUPS).map(([groupName, themes]) => (
          <li key={groupName}>
            <h2 className="menu-title">{groupName}</h2>
            <ul>
              {themes.map(themeName => (
                <li key={themeName}>
                  <button
                    onClick={() => setTheme(themeName)}
                    className={theme === themeName ? 'active' : ''}
                    data-theme={themeName}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="capitalize">{formatThemeName(themeName)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatThemeName(theme: string): string {
  return theme
    .replace('todo-', '')
    .replace('-', ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
