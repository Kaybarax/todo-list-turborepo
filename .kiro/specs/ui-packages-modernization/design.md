# Design Document

## Overview

This design modernizes the UI component architecture by establishing proper foundation libraries and showcase applications for both web and mobile UI packages. The web package will be rebuilt on Radix UI primitives with a React Vite showcase, while the mobile package will use UI Kitten components with an Expo React Native drawer showcase.

## Architecture

### Package Structure

```
packages/
├── ui-web/
│   ├── lib/
│   │   ├── components/          # Radix UI-based components
│   │   ├── utils/              # Utility functions
│   │   ├── styles.css          # Global styles
│   │   └── index.ts            # Main exports
│   ├── __tests__/              # Component tests and mocks
│   │   ├── components/         # Component-specific tests
│   │   └── __mocks__/          # Test mocks
│   ├── showcase/               # React Vite showcase app
│   │   ├── src/
│   │   │   ├── App.tsx         # Main showcase app
│   │   │   ├── components/     # Showcase-specific components
│   │   │   └── main.tsx        # Entry point
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── package.json
└── ui-mobile/
    ├── lib/
    │   ├── components/          # UI Kitten-based components
    │   ├── theme/              # Theme configuration
    │   └── index.ts            # Main exports
    ├── __tests__/              # Component tests and mocks
    │   ├── components/         # Component-specific tests
    │   └── __mocks__/          # Test mocks
    ├── showcase/               # Expo React Native showcase
    │   ├── App.tsx             # Main drawer app
    │   ├── screens/            # Component demonstration screens
    │   ├── navigation/         # Drawer navigation setup
    │   └── app.json            # Expo configuration
    └── package.json
```

### Foundation Libraries

#### Web Package (Radix UI)

- **Primary Library**: @radix-ui/react-\* primitives
- **Styling**: Tailwind CSS with class-variance-authority
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

#### Mobile Package (UI Kitten)

- **Primary Library**: @ui-kitten/components
- **Theme**: Eva Design System
- **Icons**: React Native Vector Icons
- **Navigation**: React Navigation (for showcase)

## Components and Interfaces

### Web Components Architecture

Each web component will follow this pattern:

```typescript
// Component using Radix primitive
import * as RadixPrimitive from '@radix-ui/react-primitive';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        sm: "small-classes",
        md: "medium-classes",
        lg: "large-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ComponentProps
  extends React.ComponentPropsWithoutRef<typeof RadixPrimitive.Root>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<
  React.ElementRef<typeof RadixPrimitive.Root>,
  ComponentProps
>(({ className, variant, size, ...props }, ref) => (
  <RadixPrimitive.Root
    ref={ref}
    className={cn(componentVariants({ variant, size, className }))}
    {...props}
  />
));
```

### Mobile Components Architecture

Each mobile component will follow this pattern:

```typescript
// Component using UI Kitten
import React from 'react';
import { Button as KittenButton, ButtonProps as KittenButtonProps } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

interface ComponentProps extends Omit<KittenButtonProps, 'status'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

const Component: React.FC<ComponentProps> = ({
  variant = 'primary',
  size = 'medium',
  style,
  ...props
}) => {
  const getStatus = () => {
    switch (variant) {
      case 'secondary': return 'basic';
      case 'outline': return 'outline';
      default: return 'primary';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small': return 'small';
      case 'large': return 'large';
      default: return 'medium';
    }
  };

  return (
    <KittenButton
      status={getStatus()}
      size={getSize()}
      style={[styles.component, style]}
      {...props}
    />
  );
};
```

### Showcase Applications

#### Web Showcase (React Vite)

```typescript
// App.tsx structure
import React from 'react';
import { ComponentShowcase } from './components/ComponentShowcase';
import * as UIComponents from '@todo/ui-web';

const App: React.FC = () => {
  const components = [
    { name: 'Button', component: UIComponents.Button },
    { name: 'Card', component: UIComponents.Card },
    { name: 'Input', component: UIComponents.Input },
    // ... other components
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <h1 className="text-2xl font-bold p-6">UI Web Components</h1>
      </header>
      <main className="container mx-auto p-6">
        {components.map(({ name, component }) => (
          <ComponentShowcase
            key={name}
            name={name}
            component={component}
          />
        ))}
      </main>
    </div>
  );
};
```

#### Mobile Showcase (Expo React Native)

```typescript
// App.tsx structure with drawer navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

const Drawer = createDrawerNavigator();

const App: React.FC = () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Button" component={ButtonScreen} />
        <Drawer.Screen name="Card" component={CardScreen} />
        <Drawer.Screen name="Input" component={InputScreen} />
        {/* ... other component screens */}
      </Drawer.Navigator>
    </NavigationContainer>
  </ApplicationProvider>
);
```

## Data Models

### Component Registry

```typescript
interface ComponentInfo {
  name: string;
  description: string;
  variants: string[];
  props: Record<string, any>;
  examples: ComponentExample[];
}

interface ComponentExample {
  title: string;
  description: string;
  code: string;
  props: Record<string, any>;
}
```

### Theme Configuration

```typescript
// Web theme (Tailwind-based)
interface WebTheme {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  borderRadius: Record<string, string>;
}

// Mobile theme (Eva-based)
interface MobileTheme {
  colors: Record<string, string>;
  spacing: Record<string, number>;
  typography: Record<string, any>;
  borderRadius: Record<string, number>;
}
```

## Error Handling

### Component Error Boundaries

```typescript
// Web error boundary
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-50 text-red-700">Component failed to render</div>;
    }
    return this.props.children;
  }
}
```

### Fallback Components

```typescript
// Fallback for missing components
const ComponentFallback: React.FC<{ name: string }> = ({ name }) => (
  <div className="p-4 border-2 border-dashed border-gray-300 text-gray-500">
    Component "{name}" not found
  </div>
);
```

## Testing Strategy

### Component Testing

All components must have comprehensive tests located in the `__tests__` directory structure.

```typescript
// Web component test example (__tests__/components/Button.test.tsx)
import { render, screen } from '@testing-library/react';
import { Button } from '../../lib/components/Button';

describe('Button', () => {
  it('renders with correct variant classes', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary-classes');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('handles all variant props correctly', () => {
    const variants = ['default', 'secondary', 'outline'];
    variants.forEach(variant => {
      const { rerender } = render(<Button variant={variant}>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      rerender(<></>);
    });
  });
});
```

```typescript
// Mobile component test example (__tests__/components/Button.test.tsx)
import { render } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Button } from '../../lib/components/Button';

const TestWrapper = ({ children }) => (
  <ApplicationProvider {...eva} theme={eva.light}>
    {children}
  </ApplicationProvider>
);

describe('Button', () => {
  it('renders with correct variant', () => {
    const { getByText } = render(
      <Button variant="secondary">Test</Button>,
      { wrapper: TestWrapper }
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles all size props correctly', () => {
    const sizes = ['small', 'medium', 'large'];
    sizes.forEach(size => {
      const { getByText, unmount } = render(
        <Button size={size}>Test {size}</Button>,
        { wrapper: TestWrapper }
      );
      expect(getByText(`Test ${size}`)).toBeTruthy();
      unmount();
    });
  });

  it('handles press events correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Test</Button>,
      { wrapper: TestWrapper }
    );
    // Test press functionality
  });
});
```

### Integration Testing

- Test component integration with foundation libraries
- Test showcase applications functionality
- Test component exports and imports
- Test theme consistency across components
- Ensure 100% test coverage for all components in `lib/components`
- Test mocks located in `__tests__/__mocks__` for external dependencies

### Visual Regression Testing

- Storybook visual testing for both packages
- Chromatic integration for automated visual testing
- Cross-platform consistency validation

## Implementation Phases

### Phase 1: Foundation Setup

1. Update package dependencies
2. Configure Radix UI for web package
3. Configure UI Kitten for mobile package
4. Set up build configurations

### Phase 2: Component Migration

1. Migrate existing web components to Radix UI
2. Migrate existing mobile components to UI Kitten
3. Update component APIs for consistency
4. Add comprehensive TypeScript types

### Phase 3: Showcase Development

1. Create React Vite showcase for web
2. Create Expo React Native showcase for mobile
3. Implement component demonstration screens
4. Add interactive examples

### Phase 4: Integration and Testing

1. Update main applications to use package components
2. Remove duplicate components from apps
3. Add comprehensive test coverage
4. Update documentation

### Phase 5: Documentation and Finalization

1. Update README files
2. Create component usage guides
3. Add development guidelines
4. Finalize build and deployment processes
