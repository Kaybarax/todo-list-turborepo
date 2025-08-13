# @todo/ui-web

A modern, accessible React component library built on **Radix UI** primitives with **Tailwind CSS** styling. Designed for the Todo app web interface with comprehensive TypeScript support, visual regression testing, and Storybook documentation.

## ✨ Features

- 🎨 **Built on Radix UI**: Accessible, unstyled primitives as foundation
- 🎯 **TypeScript First**: Full TypeScript support with comprehensive type definitions
- 🌈 **Tailwind CSS**: Utility-first styling with customizable design tokens
- 📱 **Responsive Design**: Mobile-first approach with responsive variants
- 🌙 **Dark Mode**: Built-in dark mode support with CSS variables
- ♿ **Accessibility**: WCAG compliant with proper ARIA attributes
- 🧪 **Comprehensive Testing**: Unit tests, integration tests, and visual regression testing
- 📚 **Storybook**: Interactive component documentation and development environment
- 🔄 **Visual Regression**: Automated visual testing with Chromatic integration

## 📦 Installation

```bash
# From the monorepo root
pnpm install @todo/ui-web

# Or with npm
npm install @todo/ui-web

# Or with yarn
yarn add @todo/ui-web
```

## 🚀 Quick Start

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@todo/ui-web';
import '@todo/ui-web/styles.css'; // Import styles

function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="email" placeholder="Enter your email" leftIcon={<MailIcon />} label="Email Address" />
        <Input type="password" placeholder="Enter your password" label="Password" />
        <Button className="w-full" size="lg">
          Sign In
        </Button>
        <Badge variant="secondary">New User?</Badge>
      </CardContent>
    </Card>
  );
}
```

## 🧩 Components

### Core Components

| Component  | Description                                         | Radix Primitive        |
| ---------- | --------------------------------------------------- | ---------------------- |
| **Button** | Versatile button with variants, sizes, and states   | `@radix-ui/react-slot` |
| **Card**   | Flexible container with header, content, and footer | Custom implementation  |
| **Input**  | Form input with validation, icons, and labels       | Custom implementation  |
| **Badge**  | Status indicators and labels                        | Custom implementation  |

### Button Component

```tsx
import { Button } from '@todo/ui-web';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// States
<Button disabled>Disabled</Button>
<Button isLoading>Loading...</Button>
<Button isLoading loadingText="Please wait...">Submit</Button>

// With icons
<Button leftIcon={<ArrowLeft />}>Back</Button>
<Button rightIcon={<ArrowRight />}>Next</Button>
```

### Card Component

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@todo/ui-web';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Input Component

```tsx
import { Input } from '@todo/ui-web';

// Basic input
<Input placeholder="Enter text..." />

// With label and helper text
<Input
  label="Email Address"
  placeholder="Enter your email"
  helperText="We'll never share your email"
  type="email"
/>

// With icons
<Input
  leftIcon={<SearchIcon />}
  rightIcon={<CheckIcon />}
  placeholder="Search..."
/>

// Error state
<Input
  error
  label="Password"
  helperText="Password must be at least 8 characters"
  type="password"
/>
```

### Badge Component

```tsx
import { Badge } from '@todo/ui-web';

// Variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>

// With content
<Badge>
  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
  Online
</Badge>
```

## 🎨 Theming and Customization

### CSS Variables

The library uses CSS variables for theming. Customize by overriding these variables:

```css
:root {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  /* Border radius */
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  /* ... other dark mode variables */
}
```

### Tailwind CSS Integration

The library is built with Tailwind CSS. Extend your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  content: [
    './node_modules/@todo/ui-web/dist/**/*.{js,ts,jsx,tsx}',
    // ... your content paths
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other color definitions
      },
    },
  },
};
```

## 🧪 Development

### Building

```bash
# Build the library
pnpm build

# Build in watch mode
pnpm dev

# From monorepo root
pnpm build --filter=@todo/ui-web
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run visual regression tests
pnpm test:visual

# Run specific test suites
pnpm vitest run __tests__/components/Button.test.tsx
```

### Storybook Development

```bash
# Start Storybook development server
pnpm storybook

# Build Storybook for production
pnpm build-storybook

# From monorepo root
pnpm storybook --filter=@todo/ui-web
```

### Visual Regression Testing

```bash
# Run Chromatic visual tests
pnpm chromatic

# Run Chromatic in CI mode
pnpm chromatic:ci

# Full visual test pipeline
pnpm visual-test
```

## 📚 Storybook

Interactive component documentation is available in Storybook. Each component includes:

- **All variants and states** documented with interactive controls
- **Accessibility testing** with built-in a11y addon
- **Responsive testing** across different viewport sizes
- **Dark mode testing** with theme switching
- **Code examples** with copy-to-clipboard functionality

### Running Showcase Application

```bash
# Start the showcase application
pnpm showcase:dev

# Build the showcase for production
pnpm showcase:build
```

## 🔍 Visual Regression Testing

The library includes comprehensive visual regression testing:

- **Chromatic Integration**: Automated visual testing on every PR
- **Screenshot Comparison**: Pixel-perfect component rendering validation
- **Cross-browser Testing**: Consistent rendering across browsers
- **Responsive Testing**: Visual validation across viewport sizes

See [Visual Testing Guide](./__tests__/visual/VISUAL_TESTING.md) for detailed information.

## 🏗️ Architecture

### Directory Structure

```
packages/ui-web/
├── lib/                        # Source code (new structure)
│   ├── components/            # Component implementations
│   │   ├── Button/
│   │   │   ├── Button.tsx     # Component implementation
│   │   │   ├── Button.stories.tsx # Storybook stories
│   │   │   └── index.ts       # Exports
│   │   └── ...
│   ├── utils/                 # Utility functions
│   ├── styles.css            # Global styles
│   └── index.ts              # Main exports
├── __tests__/                 # Test files (new structure)
│   ├── components/           # Component tests
│   ├── integration/          # Integration tests
│   ├── visual/              # Visual regression tests
│   └── __mocks__/           # Test mocks
├── .storybook/              # Storybook configuration
├── showcase/                # Showcase application
└── dist/                   # Built output
```

### Component Architecture

Components are built using:

1. **Radix UI Primitives**: Accessible, unstyled foundation components
2. **Class Variance Authority (CVA)**: Type-safe variant generation
3. **Tailwind Merge**: Intelligent class merging for customization
4. **TypeScript**: Full type safety with proper prop interfaces

### Example Component Structure

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      // ... other variants
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      // ... other sizes
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

## 🤝 Contributing

### Adding New Components

1. **Create component directory**: `lib/components/ComponentName/`
2. **Implement component**: `ComponentName.tsx` with proper TypeScript types
3. **Create stories**: `ComponentName.stories.tsx` with comprehensive examples
4. **Write tests**: Add to `__tests__/components/ComponentName.test.tsx`
5. **Add exports**: Update `lib/index.ts` and component `index.ts`
6. **Update documentation**: Add to this README and Storybook docs

### Component Guidelines

- **Use Radix UI primitives** when available for accessibility
- **Implement proper TypeScript types** with VariantProps
- **Follow naming conventions** (PascalCase for components)
- **Include comprehensive tests** (unit, integration, visual)
- **Document all props** in Storybook stories
- **Support dark mode** with CSS variables
- **Ensure accessibility** with proper ARIA attributes

### Testing Guidelines

- **Unit tests**: Test component logic and props
- **Integration tests**: Test component interactions
- **Visual tests**: Test component appearance and responsive behavior
- **Accessibility tests**: Test keyboard navigation and screen readers

## 📄 License

This package is part of the Todo monorepo and follows the same license terms.

## 🔗 Related Packages

- [`@todo/ui-mobile`](../ui-mobile/README.md) - React Native component library
- [`@todo/config-eslint`](../config-eslint/README.md) - Shared ESLint configuration
- [`@todo/config-ts`](../config-ts/README.md) - Shared TypeScript configuration

## 📞 Support

For questions, issues, or contributions, please refer to the main repository documentation or create an issue in the monorepo.
