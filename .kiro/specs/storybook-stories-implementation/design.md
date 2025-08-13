# Design Document

## Overview

This design outlines the implementation of comprehensive Storybook stories for all components in both ui-web and ui-mobile packages. The solution will provide dedicated Storybook instances running on separate ports (6006 for mobile, 6007 for web) with proper configuration, story templates, and integration with the existing monorepo structure.

## Architecture

### Current State Analysis

**ui-web Package:**

- Has existing Storybook configuration with Storybook 7.6.4
- Currently configured to run on port 6006 (needs to change to 6007)
- Has some existing stories in the `lib/` directory (Button, Card, Input, Badge)
- Uses React + Vite with Tailwind CSS
- Stories are located in `lib/components/*/` directories

**ui-mobile Package:**

- Has basic Storybook configuration but appears incomplete
- Configured for React Native with Storybook 7.6.10
- Currently set to run on port 6006 (correct)
- No existing stories found in the codebase
- Uses React Native with UI Kitten components

### Target Architecture

```
packages/
├── ui-web/
│   ├── .storybook/
│   │   ├── main.ts (updated port configuration)
│   │   └── preview.tsx (enhanced with better defaults)
│   ├── src/components/
│   │   ├── Badge/
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   └── Input/
│   │       ├── Input.tsx
│   │       └── index.ts
│   ├── stories/
│   │   ├── Badge.stories.tsx ✓ (exists, needs to move)
│   │   ├── Button.stories.tsx ✓ (exists, needs to move)
│   │   ├── Card.stories.tsx ✓ (exists, needs to move)
│   │   └── Input.stories.tsx ✓ (exists, needs to move)
│   └── package.json (storybook script updated to port 6007)
└── ui-mobile/
    ├── .storybook/
    │   ├── main.js (enhanced configuration)
    │   └── preview.js (enhanced with React Native context)
    ├── src/components/
    │   ├── Avatar/
    │   │   ├── Avatar.tsx
    │   │   └── index.ts
    │   ├── Badge/
    │   │   ├── Badge.tsx
    │   │   └── index.ts
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   └── index.ts
    │   ├── Card/
    │   │   ├── Card.tsx
    │   │   └── index.ts
    │   ├── Checkbox/
    │   │   ├── Checkbox.tsx
    │   │   └── index.ts
    │   ├── Input/
    │   │   ├── Input.tsx
    │   │   └── index.ts
    │   ├── Switch/
    │   │   ├── Switch.tsx
    │   │   └── index.ts
    │   └── TodoItem/
    │       ├── TodoItem.tsx
    │       └── index.ts
    ├── stories/
    │   ├── Avatar.stories.tsx ✗ (needs creation)
    │   ├── Badge.stories.tsx ✗ (needs creation)
    │   ├── Button.stories.tsx ✗ (needs creation)
    │   ├── Card.stories.tsx ✗ (needs creation)
    │   ├── Checkbox.stories.tsx ✗ (needs creation)
    │   ├── Input.stories.tsx ✗ (needs creation)
    │   ├── Switch.stories.tsx ✗ (needs creation)
    │   └── TodoItem.stories.tsx ✗ (needs creation)
    └── package.json (storybook script confirmed at port 6006)
```

## Components and Interfaces

### Storybook Configuration Updates

#### ui-web Storybook Configuration

- **Port Change**: Update from 6006 to 6007 in package.json
- **Story Path**: Update to look for stories in dedicated `stories/` directory instead of component directories
- **Story Migration**: Move existing stories from `lib/components/*/` to `stories/` directory
- **Enhanced Preview**: Better Tailwind CSS integration and responsive viewports

#### ui-mobile Storybook Configuration

- **React Native Setup**: Proper React Native Storybook configuration
- **Story Path**: Configure to look for stories in dedicated `stories/` directory
- **UI Kitten Integration**: Ensure UI Kitten theme provider is available
- **Mobile Viewports**: Configure appropriate mobile device viewports

### Story Template Standards

#### Web Component Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Variant: Story = {
  args: {
    // Variant props
  },
};
```

#### Mobile Component Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react-native';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: 'Mobile component description here',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const MobileVariant: Story = {
  args: {
    // Mobile-specific variant props
  },
};
```

### Root Package.json Script Integration

Add convenient scripts to run Storybook instances from the monorepo root:

```json
{
  "scripts": {
    "storybook:web": "pnpm --filter @todo/ui-web storybook",
    "storybook:mobile": "pnpm --filter @todo/ui-mobile storybook",
    "storybook:build:web": "pnpm --filter @todo/ui-web build-storybook",
    "storybook:build:mobile": "pnpm --filter @todo/ui-mobile build-storybook"
  }
}
```

## Data Models

### Story Configuration Interface

```typescript
interface StoryConfig {
  title: string;
  component: React.ComponentType;
  parameters: {
    layout?: 'centered' | 'fullscreen' | 'padded';
    docs?: {
      description?: {
        component: string;
      };
    };
    viewport?: {
      defaultViewport: string;
    };
  };
  tags: string[];
  argTypes: Record<string, any>;
}
```

### Component Story Requirements

Each component story must include:

- **Default Story**: Basic component with default props
- **Variant Stories**: Different states, sizes, or configurations
- **Interactive Stories**: Stories demonstrating user interactions
- **Accessibility Stories**: Stories highlighting accessibility features
- **Documentation**: Clear descriptions and usage examples

## Error Handling

### Story Loading Errors

- Implement error boundaries in Storybook preview
- Provide fallback components for failed story renders
- Clear error messages for missing dependencies

### Configuration Validation

- Validate Storybook configurations on startup
- Check for required dependencies and peer dependencies
- Provide helpful error messages for common configuration issues

### Port Conflicts

- Implement port conflict detection
- Provide clear instructions when ports are already in use
- Fallback port suggestions for development

## Testing Strategy

### Story Validation

- Automated tests to ensure all components have stories
- Lint rules to enforce story naming conventions
- CI checks to validate story compilation

### Visual Regression Testing

- Integration with existing Chromatic setup for ui-web
- Screenshot comparison tests for story consistency
- Cross-browser compatibility testing

### Accessibility Testing

- Automated a11y testing in Storybook
- Keyboard navigation testing
- Screen reader compatibility validation

### Story Template Validation

- Template compliance checking
- Required story variants validation
- Documentation completeness checks

## Implementation Phases

### Phase 1: Configuration Updates

1. Update ui-web Storybook to run on port 6007
2. Update ui-web Storybook configuration to look for stories in `stories/` directory
3. Move existing ui-web stories from `lib/components/*/` to `stories/` directory
4. Enhance ui-mobile Storybook configuration to use `stories/` directory
5. Add root package.json scripts
6. Verify existing ui-web stories work correctly after migration

### Phase 2: Missing Story Creation

1. Create stories for all ui-mobile components (8 components)
2. Verify story quality and completeness
3. Add proper TypeScript types and controls
4. Implement story templates and documentation

### Phase 3: Enhancement and Standardization

1. Enhance existing ui-web stories if needed
2. Standardize story formats across both packages
3. Add comprehensive documentation
4. Implement automated validation

### Phase 4: Integration and Testing

1. Test both Storybook instances running simultaneously
2. Validate hot-reload functionality
3. Test root-level script execution
4. Perform end-to-end validation

## Technical Considerations

### Dependency Management

- Ensure Storybook versions are compatible across packages
- Manage React Native specific Storybook dependencies
- Handle peer dependency requirements

### Build Performance

- Optimize Storybook build times
- Implement efficient hot-reload for development
- Consider story lazy loading for large component libraries

### Cross-Platform Compatibility

- Ensure stories work across different operating systems
- Handle React Native specific rendering requirements
- Manage different styling approaches (Tailwind vs StyleSheet)

### Monorepo Integration

- Leverage existing Turborepo configuration
- Ensure proper workspace dependency resolution
- Maintain consistency with existing development workflows
