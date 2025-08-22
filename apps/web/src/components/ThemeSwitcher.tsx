'use client';

import { Select } from '@todo/ui-web';
import { useTheme } from './ThemeProvider';

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as any);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Theme</span>
      </label>
      <Select value={theme} onChange={handleThemeChange} className="select-sm" variant="bordered">
        {themes.map(themeName => (
          <option key={themeName} value={themeName}>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </option>
        ))}
      </Select>
    </div>
  );
}
