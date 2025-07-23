# UI Web

React component library for the Todo app web interface, built with React, TypeScript, Vite, and Tailwind CSS.

## Components

The library includes the following components:

- **Button**: Versatile button component with various styles and states
- **Card**: Flexible card component with header, content, and footer sections
- **Input**: Form input component with validation states and icon support
- **Badge**: Label component for displaying status, tags, or notifications

## Installation

```bash
# From the monorepo root
pnpm install @todo/ui-web
```

## Usage

```tsx
import { Button, Card, CardContent, Input, Badge } from '@todo/ui-web';
import '@todo/ui-web/styles.css'; // Import styles

function MyComponent() {
  return (
    <Card>
      <CardContent>
        <h2>Login Form</h2>
        <Input 
          placeholder="Email" 
          type="email" 
          leftIcon={<MailIcon />} 
        />
        <Button>Submit</Button>
        <Badge variant="success">New</Badge>
      </CardContent>
    </Card>
  );
}
```

## Development

### Building

```bash
# From the package directory
pnpm run build

# Or from the monorepo root
pnpm run build --filter=@todo/ui-web
```

### Testing

```bash
# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Run tests in watch mode
pnpm run test:watch
```

### Storybook

This package uses Storybook to develop and test components in isolation.

To start Storybook:

```bash
# From the package directory
pnpm run storybook

# Or from the monorepo root
pnpm run storybook --filter=@todo/ui-web
```

### Chromatic

This package uses Chromatic for visual testing and UI review.

To publish to Chromatic:

```bash
# Set your Chromatic project token
export CHROMATIC_PROJECT_TOKEN=your_project_token

# From the package directory
pnpm run chromatic

# Or from the monorepo root
pnpm run chromatic --filter=@todo/ui-web
```

## Adding Components

To add a new component:

1. Create a new directory in `src/components/ComponentName`
2. Create the component file: `ComponentName.tsx`
3. Create a stories file: `ComponentName.stories.tsx`
4. Create a test file: `__tests__/ComponentName.test.tsx`
5. Create an index file: `index.ts`
6. Export the component from `src/index.ts`

## Adding Stories

To add a story for a component:

1. Create a `ComponentName.stories.tsx` file in the component's directory
2. Define the stories using the Storybook CSF format

Example:

```tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // Add argTypes, etc.
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    // Component props
  },
};
```

## Theming

The component library uses CSS variables for theming. You can customize the theme by overriding these variables in your application:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other variables */
}
```
