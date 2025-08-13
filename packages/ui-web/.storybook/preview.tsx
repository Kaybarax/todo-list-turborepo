import type { Preview } from '@storybook/react';
import '../lib/styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Visual regression testing configuration
    chromatic: {
      // Pause animation for consistent screenshots
      pauseAnimationAtEnd: true,
      // Delay before taking screenshot
      delay: 300,
      // Disable animations
      disableSnapshot: false,
      // Force re-snapshot on changes
      forcedColors: 'none',
    },
    // Viewport configuration for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
        wide: {
          name: 'Wide Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    // Background configuration for dark mode testing
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'gray',
          value: '#f1f5f9',
        },
      ],
    },
    // Layout configuration
    layout: 'centered',
    // Accessibility testing
    a11y: {
      element: '#storybook-root',
      config: {},
      options: {},
      manual: true,
    },
  },
  // Global decorators for consistent styling
  decorators: [
    Story => (
      <div className="font-sans antialiased">
        <Story />
      </div>
    ),
  ],
  // Tags for organizing stories - moved to individual stories
};

export default preview;
