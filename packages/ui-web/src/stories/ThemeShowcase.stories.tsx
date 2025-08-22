import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { Badge } from '../components/Badge/Badge';
import { Alert } from '../components/Alert/Alert';
import { Progress } from '../components/Progress/Progress';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { Radio } from '../components/Radio/Radio';
import { Select } from '../components/Select/Select';
import { Textarea } from '../components/Textarea/Textarea';

const meta: Meta = {
  title: 'Foundation/DaisyUI Theme Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive showcase of DaisyUI themes with ui-web components. Switch between themes to see how Style Dictionary tokens and DaisyUI work together to provide consistent theming across all components.',
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

const DAISY_THEMES = [
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
];

function ThemeProvider({ theme, children }: { theme: string; children: React.ReactNode }) {
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content">
      {children}
    </div>
  );
}

function ComponentShowcase() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">DaisyUI Theme Showcase</h1>
        <p className="text-lg opacity-70">See how ui-web components adapt to different DaisyUI themes</p>
      </div>

      {/* Color Palette */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Theme Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { name: 'Primary', class: 'bg-primary text-primary-content' },
            { name: 'Secondary', class: 'bg-secondary text-secondary-content' },
            { name: 'Accent', class: 'bg-accent text-accent-content' },
            { name: 'Neutral', class: 'bg-neutral text-neutral-content' },
            { name: 'Base 100', class: 'bg-base-100 text-base-content border border-base-300' },
            { name: 'Base 200', class: 'bg-base-200 text-base-content' },
            { name: 'Base 300', class: 'bg-base-300 text-base-content' },
            { name: 'Info', class: 'bg-info text-info-content' },
            { name: 'Success', class: 'bg-success text-success-content' },
            { name: 'Warning', class: 'bg-warning text-warning-content' },
            { name: 'Error', class: 'bg-error text-error-content' },
          ].map(color => (
            <div key={color.name} className={`p-3 rounded text-center text-sm font-medium ${color.class}`}>
              {color.name}
            </div>
          ))}
        </div>
      </Card>

      {/* Buttons */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="info">Info</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="error">Error</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Card>

      {/* Alerts */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
        <div className="space-y-3">
          <Alert variant="info">
            <span>Info alert with theme colors</span>
          </Alert>
          <Alert variant="success">
            <span>Success alert adapts to theme</span>
          </Alert>
          <Alert variant="warning">
            <span>Warning alert uses theme palette</span>
          </Alert>
          <Alert variant="error">
            <span>Error alert follows theme styling</span>
          </Alert>
        </div>
      </Card>

      {/* Progress Bars */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Progress Indicators</h2>
        <div className="space-y-3">
          <Progress value={25} variant="primary" />
          <Progress value={50} variant="secondary" />
          <Progress value={75} variant="success" />
          <Progress value={90} variant="warning" />
        </div>
      </Card>

      {/* Form Controls */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Form Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Checkboxes</h3>
            <div className="space-y-2">
              <Checkbox variant="primary" label="Primary checkbox" />
              <Checkbox variant="secondary" label="Secondary checkbox" />
              <Checkbox variant="accent" label="Accent checkbox" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Radio Buttons</h3>
            <div className="space-y-2">
              <Radio name="theme-radio" variant="primary" label="Primary radio" />
              <Radio name="theme-radio" variant="secondary" label="Secondary radio" />
              <Radio name="theme-radio" variant="accent" label="Accent radio" />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Select & Textarea</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select state="primary" aria-label="Theme select">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select>
            <Textarea placeholder="Theme-aware textarea" variant="bordered" />
          </div>
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-semibold">Heading 2</h2>
          <h3 className="text-2xl font-medium">Heading 3</h3>
          <p className="text-base">
            Regular paragraph text that adapts to the theme's base content color. This demonstrates how typography
            tokens work with DaisyUI themes.
          </p>
          <p className="text-sm opacity-70">Secondary text with reduced opacity for hierarchy.</p>
        </div>
      </Card>
    </div>
  );
}

export const InteractiveThemeShowcase: Story = {
  name: 'Interactive Theme Showcase',
  render: () => {
    const [selectedTheme, setSelectedTheme] = React.useState('light');

    return (
      <div className="min-h-screen">
        {/* Theme Selector */}
        <div className="sticky top-0 z-50 bg-base-100 border-b border-base-300 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4">
              <label className="font-semibold">Theme:</label>
              <select
                className="select select-bordered select-sm"
                value={selectedTheme}
                onChange={e => setSelectedTheme(e.target.value)}
              >
                {DAISY_THEMES.map(theme => (
                  <option key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </option>
                ))}
              </select>
              <span className="text-sm opacity-70">
                Current: <strong>{selectedTheme}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Theme Content */}
        <ThemeProvider theme={selectedTheme}>
          <ComponentShowcase />
        </ThemeProvider>
      </div>
    );
  },
};

export const ThemeComparison: Story = {
  name: 'Theme Comparison',
  render: () => {
    const compareThemes = ['light', 'dark', 'cupcake', 'synthwave'];

    return (
      <div className="space-y-8 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Theme Comparison</h1>
          <p className="opacity-70">See how the same components look across different themes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {compareThemes.map(theme => (
            <ThemeProvider key={theme} theme={theme}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 capitalize">{theme} Theme</h2>

                <div className="space-y-4">
                  {/* Color swatches */}
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-primary"></div>
                    <div className="w-8 h-8 rounded bg-secondary"></div>
                    <div className="w-8 h-8 rounded bg-accent"></div>
                    <div className="w-8 h-8 rounded bg-neutral"></div>
                  </div>

                  {/* Sample components */}
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">
                      Primary
                    </Button>
                    <Button variant="secondary" size="sm">
                      Secondary
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                  </div>

                  <Progress value={60} variant="accent" />

                  <Alert variant="info">
                    <span>Sample alert in {theme} theme</span>
                  </Alert>
                </div>
              </Card>
            </ThemeProvider>
          ))}
        </div>
      </div>
    );
  },
};

export const TokenIntegration: Story = {
  name: 'Style Dictionary + DaisyUI Integration',
  render: () => {
    return (
      <ThemeProvider theme="light">
        <div className="p-6 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">Token Integration</h1>
            <p className="text-lg opacity-70">How Style Dictionary tokens work with DaisyUI themes</p>
          </div>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Integration Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">Style Dictionary Provides:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Centralized token management</li>
                  <li>• Multiple output formats (CSS, JS, TS)</li>
                  <li>• Build-time token generation</li>
                  <li>• Type-safe token access</li>
                  <li>• Cross-platform consistency</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-secondary mb-2">DaisyUI Provides:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Semantic color system</li>
                  <li>• 30+ built-in themes</li>
                  <li>• CSS custom properties</li>
                  <li>• Component-ready classes</li>
                  <li>• Theme switching capability</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Technical Implementation</h2>
            <div className="space-y-4">
              <div className="bg-base-200 p-4 rounded">
                <h4 className="font-semibold mb-2">Token Generation Flow:</h4>
                <div className="text-sm font-mono space-y-1">
                  <div>1. Core tokens (JSON) → Style Dictionary</div>
                  <div>2. Style Dictionary → CSS variables + TypeScript types</div>
                  <div>3. DaisyUI themes → CSS custom properties</div>
                  <div>4. Components → Use both token systems</div>
                </div>
              </div>

              <div className="bg-base-200 p-4 rounded">
                <h4 className="font-semibold mb-2">Component Integration:</h4>
                <div className="text-sm font-mono space-y-1">
                  <div>
                    • DaisyUI classes for theming: <code>btn-primary</code>
                  </div>
                  <div>
                    • Style Dictionary for spacing: <code>var(--space-4)</code>
                  </div>
                  <div>
                    • Combined approach: <code>className="btn btn-primary p-4"</code>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
            <div className="space-y-4">
              <Alert variant="info">
                <span>
                  <strong>Tip:</strong> Use DaisyUI semantic colors (primary, secondary, etc.) for theme-aware
                  components, and Style Dictionary tokens for consistent spacing, typography, and custom styling.
                </span>
              </Alert>

              <div className="bg-base-200 p-4 rounded">
                <h4 className="font-semibold mb-2">Best Practices:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Use DaisyUI component classes as base styles</li>
                  <li>• Apply Style Dictionary spacing tokens for layout</li>
                  <li>• Leverage both systems for maximum flexibility</li>
                  <li>• Test components across multiple themes</li>
                  <li>• Use TypeScript for token type safety</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </ThemeProvider>
    );
  },
};
