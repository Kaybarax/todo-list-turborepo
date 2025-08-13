# UI Web Showcase Application

A comprehensive showcase application demonstrating all components from the `@todo/ui-web` package. Built with Vite and React, this application serves as both a testing ground and documentation for the component library.

## 🚀 Quick Start

```bash
# From the ui-web package directory
pnpm showcase:dev

# Or from the monorepo root
pnpm showcase:dev --filter=@todo/ui-web
```

The showcase will be available at `http://localhost:5173`

## ✨ Features

- **Interactive Component Gallery**: All components with live examples
- **Responsive Design Testing**: Test components across different screen sizes
- **Dark Mode Toggle**: Switch between light and dark themes
- **Code Examples**: Copy-to-clipboard code snippets for each component
- **Real-time Updates**: Hot reload during development
- **Accessibility Testing**: Built-in accessibility features and testing

## 📱 What's Included

### Component Demonstrations

- **Button Component**: All variants, sizes, states, and icon combinations
- **Card Component**: Different layouts, compositions, and use cases
- **Input Component**: Form inputs with validation, icons, and labels
- **Badge Component**: Status indicators, labels, and custom styling
- **Component Combinations**: Real-world usage patterns and integrations

### Interactive Features

- **Theme Switching**: Toggle between light and dark modes
- **Responsive Preview**: View components at different breakpoints
- **State Management**: Interactive examples with form handling
- **Code Snippets**: Ready-to-use code examples for each component
- **Accessibility Demo**: Screen reader and keyboard navigation examples

## 🏗️ Architecture

### File Structure

```
showcase/
├── src/
│   ├── components/          # Showcase-specific components
│   │   ├── ComponentShowcase.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── Navigation.tsx
│   ├── data/               # Component examples and data
│   │   ├── buttonExamples.ts
│   │   ├── cardExamples.ts
│   │   └── inputExamples.ts
│   ├── App.tsx             # Main application
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Showcase dependencies
```

### Component Structure

Each component demonstration includes:

1. **Live Preview**: Interactive component with all variants
2. **Props Panel**: Dynamic controls for component properties
3. **Code Example**: Copy-to-clipboard code snippets
4. **Documentation**: Usage guidelines and best practices
5. **Accessibility Info**: ARIA attributes and keyboard navigation

## 🎨 Customization

### Adding New Examples

To add a new component example:

1. Create example data in `src/data/componentExamples.ts`:

```typescript
export const newComponentExamples = {
  basic: {
    title: 'Basic Usage',
    description: 'Simple component usage',
    code: `<NewComponent prop="value" />`,
    component: <NewComponent prop="value" />,
  },
  variants: {
    title: 'Variants',
    description: 'Different component variants',
    code: `<NewComponent variant="primary" />`,
    component: <NewComponent variant="primary" />,
  },
};
```

2. Add to the showcase in `src/App.tsx`:

```tsx
import { newComponentExamples } from './data/componentExamples';

// Add to the component list
<ComponentShowcase title="New Component" examples={newComponentExamples} />;
```

### Theming

The showcase uses the same theming system as the component library:

```css
/* Custom theme variables */
:root {
  --showcase-background: #fafafa;
  --showcase-foreground: #333;
  --showcase-border: #e5e5e5;
}

.dark {
  --showcase-background: #1a1a1a;
  --showcase-foreground: #fff;
  --showcase-border: #333;
}
```

## 🧪 Development

### Running in Development

```bash
# Start development server
pnpm showcase:dev

# Build for production
pnpm showcase:build

# Preview production build
pnpm showcase:preview
```

### Testing

The showcase includes its own testing setup:

```bash
# Run showcase tests
pnpm test:showcase

# Run with coverage
pnpm test:showcase --coverage
```

### Building

```bash
# Build the showcase
pnpm showcase:build

# The built files will be in showcase/dist/
```

## 📚 Usage Examples

### Basic Component Usage

```tsx
import { Button, Card, CardContent, Input } from '@todo/ui-web';

function ExampleForm() {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-4">
        <Input label="Email" type="email" placeholder="Enter your email" />
        <Button className="w-full">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Advanced Component Combinations

```tsx
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Badge,
} from '@todo/ui-web';

function AdvancedExample() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Profile</CardTitle>
          <Badge variant="secondary">Pro</Badge>
        </div>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Display Name" placeholder="Enter your name" leftIcon={<UserIcon />} />
        <Input label="Email Address" type="email" placeholder="Enter your email" leftIcon={<MailIcon />} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
```

## 🔧 Configuration

### Vite Configuration

The showcase uses a custom Vite configuration optimized for component development:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@todo/ui-web': resolve(__dirname, '../lib'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', '../lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom showcase styling
    },
  },
  plugins: [],
};
```

## 🚀 Deployment

The showcase can be deployed to any static hosting service:

### Vercel

```bash
# Build and deploy to Vercel
pnpm showcase:build
vercel --prod
```

### Netlify

```bash
# Build for Netlify
pnpm showcase:build

# Deploy the dist/ folder
```

### GitHub Pages

```bash
# Build with correct base path
pnpm showcase:build --base=/repository-name/

# Deploy to GitHub Pages
```

## 📊 Performance

The showcase is optimized for performance:

- **Code Splitting**: Components are loaded on demand
- **Tree Shaking**: Only used components are included in the bundle
- **Asset Optimization**: Images and assets are optimized for web
- **Caching**: Proper caching headers for static assets

## 🤝 Contributing

To contribute to the showcase:

1. **Add new examples** for existing components
2. **Improve documentation** and code examples
3. **Enhance accessibility** features and testing
4. **Add new interactive features** for component testing
5. **Improve responsive design** and mobile experience

## 📄 License

This showcase application is part of the `@todo/ui-web` package and follows the same license terms.
