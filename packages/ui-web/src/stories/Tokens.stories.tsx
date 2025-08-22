import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { defaultTokens, type DesignTokens } from '../tokens';

const meta: Meta = {
  title: 'Foundation/Tokens',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded border" style={{ backgroundColor: value }} />
      <div className="text-sm">
        <div className="font-medium">{name}</div>
        <div className="opacity-70">{value}</div>
      </div>
    </div>
  );
}

export const Colors: Story = {
  render: () => {
    const t = defaultTokens;
    const entries: Array<[string, string]> = [];

    const pushScale = (prefix: string, scale: any) => {
      Object.entries(scale).forEach(([k, v]) => entries.push([`${prefix}.${k}`, String(v)]));
    };

    pushScale('colors.primary', t.colors.primary);
    pushScale('colors.secondary', t.colors.secondary);
    pushScale('colors.neutral', t.colors.neutral);
    pushScale('colors.success', t.colors.success);
    pushScale('colors.warning', t.colors.warning);
    pushScale('colors.error', t.colors.error);

    const s = t.colors.semantic;
    entries.push(['colors.semantic.background', s.background]);
    entries.push(['colors.semantic.foreground', s.foreground]);
    entries.push(['colors.semantic.muted', s.muted]);
    entries.push(['colors.semantic.mutedForeground', s.mutedForeground]);
    entries.push(['colors.semantic.border', s.border]);
    entries.push(['colors.semantic.input', s.input]);
    entries.push(['colors.semantic.ring', s.ring]);
    entries.push(['colors.semantic.card', s.card]);
    entries.push(['colors.semantic.cardForeground', s.cardForeground]);
    entries.push(['colors.semantic.popover', s.popover]);
    entries.push(['colors.semantic.popoverForeground', s.popoverForeground]);

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entries.map(([name, val]) => (
          <ColorSwatch key={name} name={name} value={val} />
        ))}
      </div>
    );
  },
};

export const Typography: Story = {
  render: () => {
    const t = defaultTokens;
    const fonts = t.typography.fontFamily;
    return (
      <div className="space-y-6">
        <div>
          <div className="text-sm opacity-70">Sans</div>
          <div style={{ fontFamily: fonts.sans.join(',') }} className="text-xl">
            The quick brown fox jumps over the lazy dog.
          </div>
        </div>
        <div>
          <div className="text-sm opacity-70">Serif</div>
          <div style={{ fontFamily: fonts.serif.join(',') }} className="text-xl">
            The quick brown fox jumps over the lazy dog.
          </div>
        </div>
        <div>
          <div className="text-sm opacity-70">Mono</div>
          <div style={{ fontFamily: fonts.mono.join(',') }} className="text-xl">
            The quick brown fox jumps over the lazy dog.
          </div>
        </div>
        <div>
          <div className="text-sm opacity-70">Font Sizes</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {Object.entries(t.typography.fontSize).map(([k, [size, opts]]) => (
              <div key={k} className="flex items-baseline gap-3">
                <div className="w-24 text-sm opacity-70">{k}</div>
                <div style={{ fontSize: size, lineHeight: opts.lineHeight }}>{`Aa (${size} / ${opts.lineHeight})`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

export const SpacingRadiusShadows: Story = {
  render: () => {
    const t = defaultTokens;
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h4 className="mb-2 font-semibold">Spacing</h4>
          <div className="space-y-2">
            {Object.entries(t.spacing).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <div className="w-24 text-sm opacity-70">{k}</div>
                <div className="h-2 bg-base-300" style={{ width: v }} />
                <div className="text-xs opacity-70">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">Border Radius</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(t.borderRadius).map(([k, v]) => (
              <div key={k} className="flex flex-col items-center gap-2">
                <div className="h-12 w-20 bg-base-300" style={{ borderRadius: v }} />
                <div className="text-sm">{k}</div>
                <div className="text-xs opacity-70">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">Shadows</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(t.shadows).map(([k, v]) => (
              <div key={k} className="flex flex-col items-center gap-2">
                <div className="h-12 w-20 bg-base-300" style={{ boxShadow: v }} />
                <div className="text-sm">{k}</div>
                <div className="text-xs opacity-70">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

export const TokenExplorer: Story = {
  render: () => {
    const t = defaultTokens as DesignTokens;
    const [copied, setCopied] = React.useState<string | null>(null);

    const copyToClipboard = async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    };

    const flatten = (obj: any, prefix = ''): Array<{ key: string; value: string }> => {
      const out: Array<{ key: string; value: string }> = [];
      Object.entries(obj).forEach(([k, v]) => {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          out.push(...flatten(v, key));
        } else {
          out.push({ key, value: String(v) });
        }
      });
      return out;
    };

    const items = flatten(t);

    return (
      <div className="space-y-4">
        <div className="text-sm opacity-70">
          Click any token value to copy it to clipboard. Use these tokens in your components for consistent styling.
        </div>
        <div className="grid grid-cols-1 gap-2">
          {items.map(it => (
            <div key={it.key} className="flex items-center gap-4 hover:bg-base-200 p-2 rounded">
              <div className="w-80 truncate text-sm font-mono">{it.key}</div>
              <button
                className="text-sm opacity-70 hover:opacity-100 cursor-pointer"
                onClick={() => copyToClipboard(it.value)}
                title="Click to copy"
              >
                {copied === it.value ? '✓ Copied!' : it.value}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
