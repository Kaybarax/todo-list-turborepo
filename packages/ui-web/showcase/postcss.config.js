// Ensure Tailwind uses the showcase-local config (not the parent package config)
export default {
  plugins: {
    // Explicitly point to this folder's config so running vite from parent works
    tailwindcss: { config: new URL('./tailwind.config.js', import.meta.url).pathname },
    autoprefixer: {},
  },
};
