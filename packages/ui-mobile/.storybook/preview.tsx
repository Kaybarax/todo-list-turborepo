import React from 'react';
import type { Preview } from '@storybook/react';

// Custom theme provider wrapper for stories using the existing custom theme
const ThemeProvider = ({ children }: { children: React.ReactNode }) => <div style={styles.container}>{children}</div>;

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

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
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
