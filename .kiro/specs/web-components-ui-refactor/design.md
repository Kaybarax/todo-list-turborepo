# Design Document

## Overview

This design outlines the refactoring of web application components to establish a proper design system architecture. The refactoring will move reusable UI components from `apps/web` to `packages/ui-web`, ensuring consistency, reusability, and maintainability across the monorepo. The design focuses on creating a clear separation between business logic components (which remain in the web app) and presentation components (which move to the design system).

## Architecture

### Component Classification System

Components will be classified into three categories:

1. **Business Logic Components** (Remain in `apps/web`)
   - Components tightly coupled to specific business domains
   - Components that manage application state
   - Components with complex business logic

2. **Reusable UI Components** (Move to `packages/ui-web`)
   - Pure presentation components
   - Components that can be used across multiple contexts
   - Components with minimal business logic

3. **Infrastructure Components** (Move to `packages/ui-web`)
   - Theme providers and utilities
   - Layout components
   - System-level UI components

### Migration Strategy

The migration will follow a phased approach:

**Phase 1: Theme System Consolidation**

- Merge theme providers and utilities
- Establish unified theming architecture

**Phase 2: Core UI Component Migration**

- Move reusable form and display components
- Update import paths and dependencies

**Phase 3: Domain-Specific Component Migration**

- Move todo-related UI components
- Move blockchain-related UI components

**Phase 4: Validation and Optimization**

- Run comprehensive tests
- Optimize bundle size and performance

## Components and Interfaces

### Components to Migrate

#### 1. Todo Components

**TodoForm Component**

```typescript
// Location: packages/ui-web/src/components/todo/TodoForm/
interface TodoFormProps {
  onSubmit: (todoData: TodoFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TodoFormData>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'compact' | 'inline';
}

interface TodoFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
}
```

**TodoItem Component**

```typescript
// Location: packages/ui-web/src/components/todo/TodoItem/
interface TodoItemProps {
  todo: TodoData;
  onToggle: (todoId: string) => void;
  onEdit: (todo: TodoData) => void;
  onDelete: (todoId: string) => void;
  onBlockchainSync?: (todoId: string, network: BlockchainNetwork) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  showBlockchainInfo?: boolean;
}

interface TodoData {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  blockchainNetwork?: BlockchainNetwork;
  transactionHash?: string;
  blockchainAddress?: string;
}
```

**TodoList Component**

```typescript
// Location: packages/ui-web/src/components/todo/TodoList/
interface TodoListProps {
  todos: TodoData[];
  onToggle: (todoId: string) => void;
  onEdit: (todo: TodoData) => void;
  onDelete: (todoId: string) => void;
  onBlockchainSync?: (todoId: string, network: BlockchainNetwork) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  showStats?: boolean;
  showFilters?: boolean;
  variant?: 'default' | 'compact' | 'grid';
}
```

#### 2. Blockchain Components

**BlockchainStats Component**

```typescript
// Location: packages/ui-web/src/components/blockchain/BlockchainStats/
interface BlockchainStatsProps {
  data: BlockchainStatsData;
  variant?: 'default' | 'compact' | 'detailed';
  showNetworkBreakdown?: boolean;
  showSyncPercentage?: boolean;
}

interface BlockchainStatsData {
  total: number;
  onChain: number;
  offChain: number;
  networkBreakdown: Record<string, number>;
  pendingTransactions: number;
  syncPercentage: number;
}
```

**TransactionStatus Component**

```typescript
// Location: packages/ui-web/src/components/blockchain/TransactionStatus/
interface TransactionStatusProps {
  transactionHash: string;
  network: BlockchainNetwork;
  onStatusChange?: (status: TransactionStatus) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showHash?: boolean;
  autoRefresh?: boolean;
}

type TransactionStatus = 'pending' | 'confirmed' | 'failed';
```

**WalletConnect Component**

```typescript
// Location: packages/ui-web/src/components/blockchain/WalletConnect/
interface WalletConnectProps {
  onConnect?: (account: WalletAccount) => void;
  onDisconnect?: () => void;
  onNetworkSwitch?: (network: BlockchainNetwork) => void;
  supportedNetworks?: BlockchainNetwork[];
  variant?: 'default' | 'compact' | 'button-only';
  showBalance?: boolean;
  showNetworkSelector?: boolean;
}

interface WalletAccount {
  address: string;
  network: BlockchainNetwork;
  balance?: string;
}
```

#### 3. Theme Components

**Unified ThemeProvider**

```typescript
// Location: packages/ui-web/src/components/theme/ThemeProvider/
interface ThemeProviderProps {
  children: React.ReactNode;
  themes?: ThemeConfig[];
  defaultMode?: ThemeMode;
  defaultThemeName?: string;
  storage?: Storage | null;
  rootElement?: HTMLElement;
  // DaisyUI compatibility
  daisyUIThemes?: DaisyUITheme[];
  enableDaisyUI?: boolean;
}

type ThemeMode = 'system' | 'light' | 'dark';
type DaisyUITheme = 'light' | 'dark' | 'cupcake' | /* ... other DaisyUI themes */;
```

**Enhanced ThemeSwitcher**

```typescript
// Location: packages/ui-web/src/components/theme/ThemeSwitcher/
interface ThemeSwitcherProps {
  variant?: 'dropdown' | 'toggle' | 'buttons' | 'select';
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  groupThemes?: boolean;
  customThemes?: ThemeConfig[];
}
```

### Components to Keep in Web App

The following components will remain in `apps/web` as they contain business logic:

1. **WalletProvider** - Contains wallet connection logic and state management
2. **Page Components** - App-specific routing and layout logic
3. **API Integration Components** - Components that directly interact with backend services

## Data Models

### Theme Configuration Model

```typescript
interface ThemeConfig {
  name: string;
  displayName: string;
  type: 'light' | 'dark';
  cssVars?: Record<string, string>;
  daisyUITheme?: DaisyUITheme;
  customProperties?: Record<string, any>;
}

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedType: 'light' | 'dark';
  theme: ThemeConfig;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: ThemeConfig) => void;
  // DaisyUI compatibility
  daisyUITheme?: DaisyUITheme;
  setDaisyUITheme?: (theme: DaisyUITheme) => void;
}
```

### Component Props Standardization

All migrated components will follow consistent prop patterns:

```typescript
interface BaseComponentProps {
  className?: string;
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  'data-testid'?: string;
}

interface CallbackProps<T> {
  onChange?: (value: T) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onError?: (error: Error) => void;
}
```

## Error Handling

### Component Error Boundaries

Each component category will have error boundaries:

```typescript
// packages/ui-web/src/components/ErrorBoundary/
interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: React.ReactNode;
}
```

### Validation and Type Safety

- All components will use strict TypeScript types
- Props will be validated using runtime type checking where appropriate
- Error states will be handled gracefully with fallback UI

### Blockchain Service Integration

Components will integrate with existing blockchain services:

```typescript
// Error handling for blockchain operations
interface BlockchainErrorHandler {
  onNetworkError?: (error: NetworkError) => void;
  onTransactionError?: (error: TransactionError) => void;
  onWalletError?: (error: WalletError) => void;
}
```

## Testing Strategy

### Unit Testing

Each component will have comprehensive unit tests:

```typescript
// Example test structure
describe('TodoForm', () => {
  describe('Rendering', () => {
    it('should render with default props');
    it('should render with initial data');
    it('should render in different variants');
  });

  describe('User Interactions', () => {
    it('should handle form submission');
    it('should handle tag addition/removal');
    it('should validate required fields');
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes');
    it('should support keyboard navigation');
    it('should work with screen readers');
  });
});
```

### Integration Testing

Components will be tested in realistic scenarios:

```typescript
// Example integration test
describe('TodoList Integration', () => {
  it('should work with TodoItem and TodoForm components');
  it('should handle blockchain sync operations');
  it('should maintain state consistency');
});
```

### Visual Regression Testing

All components will have Storybook stories for visual testing:

```typescript
// Example story structure
export default {
  title: 'Todo/TodoForm',
  component: TodoForm,
  parameters: {
    docs: { description: { component: 'A reusable form for creating and editing todos' } },
  },
};

export const Default = {};
export const WithInitialData = { args: { initialData: mockTodo } };
export const Loading = { args: { loading: true } };
export const Compact = { args: { variant: 'compact' } };
```

### Accessibility Testing

- Automated accessibility testing with @storybook/addon-a11y
- Manual testing with screen readers
- Keyboard navigation testing
- Color contrast validation

## Performance Considerations

### Bundle Optimization

- Tree-shaking support through proper ES module exports
- Lazy loading for complex components
- Minimal external dependencies

### Component Optimization

```typescript
// Example optimized component structure
const TodoForm = React.memo(({ onSubmit, ...props }: TodoFormProps) => {
  const memoizedCallbacks = useMemo(() => ({
    handleSubmit: (data: TodoFormData) => onSubmit(data),
  }), [onSubmit]);

  return <FormImplementation {...props} {...memoizedCallbacks} />;
});
```

### Rendering Performance

- Use React.memo for pure components
- Implement proper key props for list items
- Optimize re-renders with useMemo and useCallback

## Migration Implementation Plan

### Phase 1: Infrastructure Setup

1. Create component directory structure in ui-web
2. Set up testing and story templates
3. Configure build and export systems

### Phase 2: Theme System Migration

1. Merge existing theme providers
2. Create unified theme context
3. Update theme switcher components
4. Test theme compatibility

### Phase 3: Core Component Migration

1. Migrate todo components with full test coverage
2. Migrate blockchain components with service integration
3. Update import paths in web app
4. Validate functionality

### Phase 4: Optimization and Documentation

1. Optimize bundle size and performance
2. Complete Storybook documentation
3. Run comprehensive test suite
4. Update package dependencies

## Backward Compatibility

### API Compatibility

- Maintain existing prop interfaces during migration
- Provide deprecation warnings for changed APIs
- Support gradual migration path

### Theme Compatibility

- Support both old and new theme systems during transition
- Provide migration guide for custom themes
- Maintain DaisyUI theme compatibility

## Documentation Strategy

### Component Documentation

Each component will include:

- Comprehensive prop documentation
- Usage examples and best practices
- Accessibility guidelines
- Performance considerations

### Migration Guide

- Step-by-step migration instructions
- Breaking changes documentation
- Code transformation examples
- Troubleshooting guide

This design ensures a systematic approach to component migration while maintaining functionality, performance, and developer experience throughout the refactoring process.
