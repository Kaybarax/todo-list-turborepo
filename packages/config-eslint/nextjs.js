module.exports = {
  extends: ['./react.js', 'next/core-web-vitals'],
  rules: {
    // Next.js specific rules
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn', // Prefer next/image
    '@next/next/no-page-custom-font': 'warn',
    '@next/next/no-unwanted-polyfillio': 'error',

    // Override React rules for Next.js
    'jsx-a11y/anchor-is-valid': 'off', // Next.js handles this differently
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js 13+

    // Additional rules for Next.js
    'import/no-anonymous-default-export': 'warn',

    // App Router specific rules
    'import/no-default-export': 'off', // Next.js requires default exports for pages
  },
  settings: {
    next: {
      rootDir: ['apps/web/'],
    },
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
};
