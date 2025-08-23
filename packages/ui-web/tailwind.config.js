const tokens = require('./dist/tokens/tailwind-tokens.cjs');
const daisyuiThemes = require('./dist/tokens/daisyui-themes.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Extend Tailwind with Style Dictionary tokens
      colors: tokens.color || {},
      spacing: tokens.space || {},
      fontFamily: tokens.fontFamily || {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontSize: tokens.fontSize || {},
      fontWeight: tokens.fontWeight || {},
      borderRadius: tokens.borderRadius || {},
      boxShadow: tokens.boxShadow || {},
      // Keep existing custom styles for compatibility
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      // Include generated custom themes
      ...(daisyuiThemes
        ? Object.keys(daisyuiThemes).map(themeName => ({
            [themeName]: daisyuiThemes[themeName],
          }))
        : []),
      // Include default DaisyUI themes
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
    ],
    darkTheme: 'todo-dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
};
