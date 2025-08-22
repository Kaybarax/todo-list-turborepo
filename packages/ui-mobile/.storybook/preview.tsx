import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../lib/theme';

// Theme decorator with theme switching support
const withTheme = (Story: any, context: any) => {
  const themeName = context.globals.theme === 'dark' ? 'dark' : 'light';

  return (
    <ThemeProvider initialTheme={themeName} followSystemTheme={false}>
      <div style={styles.container}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

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
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
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
      disable: true, // Use theme switching instead
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-visible',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      extractComponentDescription: (component: any, { notes }: any) => {
        if (notes) {
          return typeof notes === 'string' ? notes : notes.markdown || notes.text;
        }
        return null;
      },
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
