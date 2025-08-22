import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Import core token files directly
import coreColors from '../../tokens/core/colors.json';
import coreSpacing from '../../tokens/core/spacing.json';
import coreTypography from '../../tokens/core/typography.json';
import coreBorders from '../../tokens/core/borders.json';
import coreShadows from '../../tokens/core/shadows.json';

const meta: Meta = {
  title: 'Foundation/Design Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive design token explorer showcasing Style Dictionary generated tokens that integrate with DaisyUI themes. These tokens provide the foundation for consistent styling across all components.',
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

function ColorSwatch({ name, value }: { name: string; value: string }) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-base-200 cursor-pointer" onClick={copyToClipboard}>
      <div className="h-8 w-8 rounded border border-base-300" style={{ backgroundColor: value }} />
      <div className="text-sm flex-1">
        <div className="font-medium">{name}</div>
        <div className="opacity-70 font-mono text-xs">{copied ? '✓ Copied!' : value}</div>
      </div>
    </div>
  );
}

export const DaisyUIColors: Story = {
  name: 'DaisyUI Color System',
  render: () => {
    return (
      <div className="space-y-6">
        <div className="prose prose-sm">
          <p>
            Color tokens aligned with DaisyUI's semantic color system. These tokens automatically adapt to theme changes
            and provide consistent color usage across components.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {Object.entries(coreColors.color).map(([colorName, colorScale]) => (
            <div key={colorName} className="space-y-2">
              <h4 className="font-semibold text-lg capitalize">{colorName}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(colorScale).map(([shade, shadeData]) => (
                  <ColorSwatch
                    key={`${colorName}-${shade}`}
                    name={`${colorName}-${shade}`}
                    value={(shadeData as { value: string }).value}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const Typography: Story = {
  name: 'Typography System',
  render: () => {
    return (
      <div className="space-y-6">
        <div className="prose prose-sm">
          <p>Typography tokens that work seamlessly with DaisyUI's text utilities and Tailwind's typography system.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Font Families</h4>
            <div className="space-y-4">
              {Object.entries(coreTypography.fontFamily).map(([name, tokenData]) => {
                const fontValue = (tokenData as { value: string[] }).value;
                return (
                  <div key={name} className="space-y-1">
                    <div className="text-sm opacity-70 font-mono">{name}</div>
                    <div
                      style={{ fontFamily: Array.isArray(fontValue) ? fontValue.join(',') : fontValue }}
                      className="text-xl"
                    >
                      The quick brown fox jumps over the lazy dog.
                    </div>
                    <div className="text-xs opacity-50 font-mono">
                      {Array.isArray(fontValue) ? fontValue.join(', ') : fontValue}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Font Sizes</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(coreTypography.fontSize).map(([name, tokenData]) => {
                const sizeValue = (tokenData as { value: string }).value;
                return (
                  <div key={name} className="flex items-baseline gap-3">
                    <div className="w-24 text-sm opacity-70 font-mono">{name}</div>
                    <div style={{ fontSize: sizeValue }}>Sample Text ({sizeValue})</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Font Weights</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(coreTypography.fontWeight).map(([name, tokenData]) => {
                const weightValue = (tokenData as { value: string | number }).value;
                return (
                  <div key={name} className="flex items-baseline gap-3">
                    <div className="w-24 text-sm opacity-70 font-mono">{name}</div>
                    <div style={{ fontWeight: weightValue }}>Sample Text ({weightValue})</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const SpacingRadiusShadows: Story = {
  name: 'Spacing, Borders & Shadows',
  render: () => {
    return (
      <div className="space-y-8">
        <div className="prose prose-sm">
          <p>Spacing, border, and shadow tokens that provide consistent visual rhythm and depth.</p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Spacing Scale</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(coreSpacing.space).map(([name, tokenData]) => {
              const spaceValue = (tokenData as { value: string }).value;
              return (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div className="text-sm opacity-70 font-mono">{name}</div>
                  <div className="bg-primary" style={{ width: spaceValue, height: spaceValue }} />
                  <div className="text-xs opacity-50 font-mono">{spaceValue}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Border Radius</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(coreBorders.borderRadius).map(([name, tokenData]) => {
              const radiusValue = (tokenData as { value: string }).value;
              return (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div className="text-sm opacity-70 font-mono">{name}</div>
                  <div className="w-16 h-16 bg-primary" style={{ borderRadius: radiusValue }} />
                  <div className="text-xs opacity-50 font-mono">{radiusValue}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Box Shadows</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(coreShadows.boxShadow).map(([name, tokenData]) => {
              const shadowValue = (tokenData as { value: string }).value;
              return (
                <div key={name} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-base-100 border border-base-300" style={{ boxShadow: shadowValue }} />
                  <div>
                    <div className="text-sm font-medium font-mono">{name}</div>
                    <div className="text-xs opacity-50 font-mono">{shadowValue}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
};

export const TokenExplorer: Story = {
  name: 'Token Explorer',
  render: () => {
    const [selectedCategory, setSelectedCategory] = React.useState('colors');

    const tokenCategories = {
      colors: coreColors,
      spacing: coreSpacing,
      typography: coreTypography,
      borders: coreBorders,
      shadows: coreShadows,
    };

    return (
      <div className="space-y-4">
        <div className="prose prose-sm">
          <p>
            Explore the raw token structure. These JSON files are processed by Style Dictionary to generate CSS
            variables, TypeScript definitions, and theme configurations.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {Object.keys(tokenCategories).map(category => (
            <button
              key={category}
              className={`px-3 py-1 rounded text-sm capitalize ${
                selectedCategory === category ? 'bg-primary text-primary-content' : 'bg-base-200 hover:bg-base-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="bg-base-100 p-4 rounded border border-base-300">
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(tokenCategories[selectedCategory as keyof typeof tokenCategories], null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};
