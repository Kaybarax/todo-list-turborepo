# Design Document

## Overview

This design document outlines the technical approach for revising the `packages/ui-web` design system to be built strictly on top of DaisyUI with Style Dictionary integration. The design system will leverage DaisyUI as the foundational UI framework while using Style Dictionary to manage design tokens that seamlessly integrate with DaisyUI's theming system.

The architecture ensures that all components are built using DaisyUI's component classes and patterns, while Style Dictionary provides a robust token management system that generates multiple output formats (CSS custom properties, JavaScript/TypeScript exports, Tailwind configuration) that work harmoniously with DaisyUI's theming capabilities.

## Architecture

### Design Token Management with Style Dictionary

Style Dictionary will serve as the central design token management system, generating tokens that align with and extend DaisyUI's theming structure.

**Token Architecture:**

```
tokens/
├── core/                    # Base design tokens
│   ├── colors.json         # Color palette definitions
│   ├── typography.json     # Font and text tokens
│   ├── spacing.json        # Spacing scale tokens
│   ├── borders.json        # Border and radius tokens
│   └── shadows.json        # Shadow system tokens
├── semantic/               # Semantic token mappings
│   ├── components.json     # Component-specific tokens
│   └── themes.json         # Theme-specific overrides
└── platforms/              # Platform-specific configurations
    ├── web.json           # Web/CSS output configuration
    ├── js.json            # JavaScript/TypeScript exports
    └── tailwind.json      # Tailwind CSS configuration
```

**Style Dictionary Configuration Structure:**

```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'tailwind-tokens.js',
          format: 'javascript/object',
          filter: 'tailwind-compatible',
        },
      ],
    },
  },
};
```

### DaisyUI Integration Strategy

The design system will be built as a layer on top of DaisyUI, ensuring strict compliance with DaisyUI's component patterns and theming system.

**Component Architecture:**

```typescript
// Base component structure using DaisyUI
interface DaisyUIComponentProps {
  // DaisyUI size variants
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // DaisyUI color variants
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  // DaisyUI state modifiers
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
  ghost?: boolean;
}

// Example Button component built on DaisyUI
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = 'md', color = 'primary', loading, disabled, outline, ghost, className, children, ...props }, ref) => {
    const daisyClasses = cn(
      'btn',                                    // Base DaisyUI button class
      `btn-${size}`,                           // DaisyUI size modifier
      color && `btn-${color}`,                 // DaisyUI color variant
      outline && 'btn-outline',                // DaisyUI outline modifier
      ghost && 'btn-ghost',                    // DaisyUI ghost modifier
      loading && 'loading',                    // DaisyUI loading state
      className                                // Additional custom classes
    );

    return (
      <button
        ref={ref}
        className={daisyClasses}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </button>
    );
  }
);
```

### Theme System Integration

The theme system will leverage DaisyUI's built-in theming capabilities while extending them with Style Dictionary generated tokens.

**Theme Configuration Structure:**

```javascript
// tailwind.config.js - DaisyUI + Style Dictionary integration
const tokens = require('./dist/tokens/tailwind-tokens.js');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Extend Tailwind with Style Dictionary tokens
      colors: tokens.colors,
      spacing: tokens.spacing,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.shadows,
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        // Custom theme using Style Dictionary tokens
        'todo-light': {
          primary: tokens.colors.primary[500],
          secondary: tokens.colors.secondary[500],
          accent: tokens.colors.accent[500],
          neutral: tokens.colors.neutral[500],
          'base-100': tokens.colors.neutral[50],
          'base-200': tokens.colors.neutral[100],
          'base-300': tokens.colors.neutral[200],
          info: tokens.colors.info[500],
          success: tokens.colors.success[500],
          warning: tokens.colors.warning[500],
          error: tokens.colors.error[500],
        },
        'todo-dark': {
          primary: tokens.colors.primary[400],
          secondary: tokens.colors.secondary[400],
          accent: tokens.colors.accent[400],
          neutral: tokens.colors.neutral[400],
          'base-100': tokens.colors.neutral[900],
          'base-200': tokens.colors.neutral[800],
          'base-300': tokens.colors.neutral[700],
          info: tokens.colors.info[400],
          success: tokens.colors.success[400],
          warning: tokens.colors.warning[400],
          error: tokens.colors.error[400],
        },
      },
    ],
    darkTheme: 'todo-dark',
    base: true,
    styled: true,
    utils: true,
  },
};
```

### Build System Integration

The build system will integrate Style Dictionary token generation with the existing Vite build process.

**Build Process Flow:**

1. **Token Generation**: Style Dictionary processes token files and generates outputs
2. **DaisyUI Configuration**: Generated tokens are injected into Tailwind/DaisyUI configuration
3. **Component Compilation**: Vite builds components with access to generated tokens
4. **CSS Generation**: Tailwind generates CSS with DaisyUI components and custom tokens
5. **Bundle Optimization**: Final bundle includes optimized CSS and JavaScript exports

**Build Scripts Integration:**

```json
{
  "scripts": {
    "tokens:build": "style-dictionary build",
    "tokens:watch": "style-dictionary build --watch",
    "prebuild": "npm run tokens:build",
    "build": "vite build",
    "dev": "concurrently \"npm run tokens:watch\" \"vite build --watch\"",
    "storybook": "npm run tokens:build && storybook dev -p 6006"
  }
}
```

## Components and Interfaces

### Core Component Library Structure

All components will be built as extensions of DaisyUI components, maintaining strict compliance with DaisyUI patterns.

**Form Components:**

```typescript
// Input component built on DaisyUI
interface InputProps extends DaisyUIComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  placeholder?: string;
  error?: boolean;
  bordered?: boolean;
  ghost?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', color, error, bordered = true, ghost, className, ...props }, ref) => {
    const inputClasses = cn(
      'input',                                 // Base DaisyUI input class
      `input-${size}`,                        // DaisyUI size variant
      color && `input-${color}`,              // DaisyUI color variant
      bordered && 'input-bordered',           // DaisyUI bordered variant
      ghost && 'input-ghost',                 // DaisyUI ghost variant
      error && 'input-error',                 // DaisyUI error state
      className
    );

    return <input ref={ref} className={inputClasses} {...props} />;
  }
);
```

**Interactive Components:**

```typescript
// Card component built on DaisyUI
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  bordered?: boolean;
  imageFull?: boolean;
  side?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ compact, bordered, imageFull, side, className, children, ...props }, ref) => {
    const cardClasses = cn(
      'card',                                 // Base DaisyUI card class
      compact && 'card-compact',              // DaisyUI compact variant
      bordered && 'card-bordered',            // DaisyUI bordered variant
      imageFull && 'image-full',              // DaisyUI image-full modifier
      side && 'card-side',                    // DaisyUI side layout
      'bg-base-100 shadow-xl',                // DaisyUI semantic colors
      className
    );

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);
```

### TypeScript Integration

Comprehensive TypeScript support will be provided for both DaisyUI variants and Style Dictionary tokens.

**Token Type Definitions:**

```typescript
// Generated by Style Dictionary
export interface DesignTokens {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    info: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
  };
  spacing: SpacingScale;
  typography: TypographyTokens;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
}

// DaisyUI component variant types
export type DaisyUISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DaisyUIColor = 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
export type DaisyUITheme =
  | 'light'
  | 'dark'
  | 'cupcake'
  | 'bumblebee'
  | 'emerald'
  | 'corporate'
  | 'synthwave'
  | 'retro'
  | 'cyberpunk'
  | 'valentine'
  | 'halloween'
  | 'garden'
  | 'forest'
  | 'aqua'
  | 'lofi'
  | 'pastel'
  | 'fantasy'
  | 'wireframe'
  | 'black'
  | 'luxury'
  | 'dracula'
  | 'cmyk'
  | 'autumn'
  | 'business'
  | 'acid'
  | 'lemonade'
  | 'night'
  | 'coffee'
  | 'winter'
  | 'dim'
  | 'nord'
  | 'sunset'
  | 'todo-light'
  | 'todo-dark';
```

## Data Models

### Style Dictionary Token Structure

```json
{
  "color": {
    "primary": {
      "50": { "value": "#eff6ff" },
      "100": { "value": "#dbeafe" },
      "200": { "value": "#bfdbfe" },
      "300": { "value": "#93c5fd" },
      "400": { "value": "#60a5fa" },
      "500": { "value": "#3b82f6" },
      "600": { "value": "#2563eb" },
      "700": { "value": "#1d4ed8" },
      "800": { "value": "#1e40af" },
      "900": { "value": "#1e3a8a" },
      "950": { "value": "#172554" }
    }
  },
  "spacing": {
    "0": { "value": "0px" },
    "1": { "value": "0.25rem" },
    "2": { "value": "0.5rem" },
    "3": { "value": "0.75rem" },
    "4": { "value": "1rem" },
    "5": { "value": "1.25rem" },
    "6": { "value": "1.5rem" },
    "8": { "value": "2rem" },
    "10": { "value": "2.5rem" },
    "12": { "value": "3rem" },
    "16": { "value": "4rem" },
    "20": { "value": "5rem" },
    "24": { "value": "6rem" },
    "32": { "value": "8rem" },
    "40": { "value": "10rem" },
    "48": { "value": "12rem" },
    "56": { "value": "14rem" },
    "64": { "value": "16rem" }
  },
  "typography": {
    "fontFamily": {
      "sans": { "value": ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      "serif": { "value": ["ui-serif", "Georgia", "Cambria", "serif"] },
      "mono": { "value": ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"] }
    },
    "fontSize": {
      "xs": { "value": "0.75rem", "lineHeight": "1rem" },
      "sm": { "value": "0.875rem", "lineHeight": "1.25rem" },
      "base": { "value": "1rem", "lineHeight": "1.5rem" },
      "lg": { "value": "1.125rem", "lineHeight": "1.75rem" },
      "xl": { "value": "1.25rem", "lineHeight": "1.75rem" },
      "2xl": { "value": "1.5rem", "lineHeight": "2rem" },
      "3xl": { "value": "1.875rem", "lineHeight": "2.25rem" },
      "4xl": { "value": "2.25rem", "lineHeight": "2.5rem" }
    }
  }
}
```

### DaisyUI Theme Configuration Model

```typescript
interface DaisyUIThemeConfig {
  [themeName: string]: {
    primary: string;
    'primary-focus'?: string;
    'primary-content'?: string;
    secondary: string;
    'secondary-focus'?: string;
    'secondary-content'?: string;
    accent: string;
    'accent-focus'?: string;
    'accent-content'?: string;
    neutral: string;
    'neutral-focus'?: string;
    'neutral-content'?: string;
    'base-100': string;
    'base-200': string;
    'base-300': string;
    'base-content': string;
    info: string;
    'info-content'?: string;
    success: string;
    'success-content'?: string;
    warning: string;
    'warning-content'?: string;
    error: string;
    'error-content'?: string;
  };
}
```

## Error Handling

### Style Dictionary Build Errors

```javascript
// Custom Style Dictionary error handling
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  matcher: token => token.attributes.category === 'size',
  transformer: token => {
    try {
      return parseFloat(token.original.value) + 'px';
    } catch (error) {
      console.error(`Error transforming token ${token.name}:`, error);
      throw new Error(`Invalid size token value: ${token.original.value}`);
    }
  },
});

// Build error handling
try {
  StyleDictionary.buildAllPlatforms();
  console.log('✅ Style Dictionary build completed successfully');
} catch (error) {
  console.error('❌ Style Dictionary build failed:', error.message);
  process.exit(1);
}
```

### Component Error Boundaries

```typescript
interface DaisyUIErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

class DaisyUIErrorBoundary extends React.Component<DaisyUIErrorBoundaryProps> {
  constructor(props: DaisyUIErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback using DaisyUI classes
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => (
  <div className="alert alert-error">
    <div>
      <h3 className="font-bold">Component Error</h3>
      <div className="text-xs">{error.message}</div>
    </div>
    <div className="flex-none">
      <button className="btn btn-sm btn-outline" onClick={resetError}>
        Retry
      </button>
    </div>
  </div>
);
```

## Testing Strategy

### Style Dictionary Token Testing

```javascript
// Token validation tests
describe('Style Dictionary Tokens', () => {
  const tokens = require('../dist/tokens/tokens.js');

  test('should generate valid color tokens', () => {
    expect(tokens.colors.primary).toBeDefined();
    expect(tokens.colors.primary[500]).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test('should generate DaisyUI compatible theme tokens', () => {
    const tailwindTokens = require('../dist/tokens/tailwind-tokens.js');
    expect(tailwindTokens.colors.primary).toBeDefined();
    expect(tailwindTokens.colors.secondary).toBeDefined();
  });

  test('should maintain token consistency across formats', () => {
    const cssTokens = fs.readFileSync('../dist/tokens/variables.css', 'utf8');
    expect(cssTokens).toContain('--color-primary-500');
    expect(tokens.colors.primary[500]).toBe(extractCSSVariable(cssTokens, '--color-primary-500'));
  });
});
```

### DaisyUI Component Integration Testing

```typescript
// Component integration with DaisyUI testing
describe('DaisyUI Component Integration', () => {
  test('Button should use DaisyUI classes', () => {
    render(<Button size="lg" color="primary">Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn-lg');
    expect(button).toHaveClass('btn-primary');
  });

  test('Input should support DaisyUI variants', () => {
    render(<Input size="sm" bordered error />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveClass('input');
    expect(input).toHaveClass('input-sm');
    expect(input).toHaveClass('input-bordered');
    expect(input).toHaveClass('input-error');
  });

  test('Theme switching should work with DaisyUI', () => {
    render(
      <div data-theme="todo-dark">
        <Button color="primary">Test</Button>
      </div>
    );

    const container = screen.getByText('Test').closest('[data-theme]');
    expect(container).toHaveAttribute('data-theme', 'todo-dark');
  });
});
```

### Visual Regression Testing

```javascript
// Storybook stories for visual testing
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    chromatic: {
      // Test all DaisyUI themes
      modes: {
        light: { theme: 'todo-light' },
        dark: { theme: 'todo-dark' },
        cupcake: { theme: 'cupcake' },
        corporate: { theme: 'corporate' },
      },
    },
  },
};

export const AllVariants = () => (
  <div className="space-y-4">
    {['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'].map(color => (
      <div key={color} className="space-x-2">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
          <Button key={size} color={color} size={size}>
            {color} {size}
          </Button>
        ))}
      </div>
    ))}
  </div>
);
```

This design provides a comprehensive approach to integrating Style Dictionary with DaisyUI while maintaining strict compliance with DaisyUI's component patterns and theming system. The architecture ensures that design tokens are managed centrally while leveraging DaisyUI's robust component library and accessibility features.
