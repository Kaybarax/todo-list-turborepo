import React, { useEffect, useState } from 'react';

const storageKey = 'ui-web-theme';

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem(storageKey, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(storageKey, 'light');
    }
  }, [dark]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={dark ? 'true' : 'false'}
      className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
      onClick={() => setDark(prev => !prev)}
    >
      <span aria-hidden="true" role="img">
        {dark ? '🌙' : '☀️'}
      </span>
      {dark ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeToggle;
