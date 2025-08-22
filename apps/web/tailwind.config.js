/** @type {import('tailwindcss').Config} */
const path = require('path');
const fs = require('fs');

// Try to import Style Dictionary generated tokens
let tokens = {};
let daisyuiThemes = {};
const tokensPath = path.resolve(__dirname, '../../packages/ui-web/dist/tokens/tailwind-tokens.js');
const themesPath = path.resolve(__dirname, '../../packages/ui-web/dist/tokens/daisyui-themes.js');

if (fs.existsSync(tokensPath)) {
  try {
    tokens = require(tokensPath);
  } catch (error) {
    console.warn('Failed to load Style Dictionary tokens:', error.message);
  }
}

if (fs.existsSync(themesPath)) {
  try {
    daisyuiThemes = require(themesPath);
  } catch (error) {
    console.warn('Failed to load DaisyUI themes:', error.message);
  }
}

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-web/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Extend with Style Dictionary generated tokens if available
      colors: tokens.colors || {},
      spacing: tokens.spacing || {},
      fontFamily: tokens.typography?.fontFamily || {},
      fontSize: tokens.typography?.fontSize || {},
      borderRadius: tokens.borderRadius || {},
      boxShadow: tokens.shadows || {},
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      // Include Style Dictionary generated themes if available
      ...(daisyuiThemes.themes || []),
      // Standard DaisyUI themes
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
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
  },
};
