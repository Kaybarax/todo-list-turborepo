import React from 'react';

// Custom theme provider wrapper for stories using the existing custom theme
const ThemeProvider = ({ children }) => (
  <div style={styles.container}>
    {children}
  </div>
);

const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f9f9f9',
        },
        {
          name: 'dark',
          value: '#333333',
        },
        {
          name: 'white',
          value: '#ffffff',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Small Mobile',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
        mobile2: {
          name: 'Large Mobile',
          styles: {
            width: '414px',
            height: '896px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
      },
      defaultViewport: 'mobile2',
    },
  },
};

export default preview;
