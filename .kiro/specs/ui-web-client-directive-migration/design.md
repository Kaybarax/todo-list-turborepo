# Design Document

## Overview

This design outlines the migration of React components containing Next.js-specific "use client" or "use server" directives from the shared ui-web package to the apps/web application. The migration ensures proper separation of concerns between framework-agnostic shared components and Next.js-specific application components.

## Architecture

### Current State

- Shared ui-web package contains both framework-agnostic and Next.js-specific components
- Components with client/server directives are exported from the shared library
- Apps/web imports these components from @todo/ui-web package
- Storybook stories exist for all components in ui-web

### Target State

- Shared ui-web package contains only framework-agnostic components
- Next.js-specific components reside in apps/web/src/components/
- Apps/web uses local components instead of importing from shared library
- Storybook stories for migrated components are removed from ui-web
- Import paths are updated throughout the codebase

## Components and Interfaces

### Component Categories

#### Theme Components

**Location:** `packages/ui-web/src/theme/` and `packages/ui-web/lib/components/theme/`
**Components to migrate:**

- ThemeProvider.tsx
- theme-provider.tsx (duplicate)
- theme-sync.ts
- ThemeToggle/ThemeToggle.tsx
- ThemeSwitcher/ThemeSwitcher.tsx

**Target location:** `apps/web/src/components/theme/`

#### Blockchain Components

**Location:** `packages/ui-web/lib/components/blockchain/`
**Components to migrate:**

- TransactionStatus/TransactionStatus.tsx
- WalletConnect/WalletConnect.tsx

**Target location:** `apps/web/src/components/blockchain/`

#### Todo Components

**Location:** `packages/ui-web/lib/components/todo/`
**Components to migrate:**

- TodoForm/TodoForm.tsx
- TodoItem/TodoItem.tsx
- TodoList/TodoList.tsx

**Target location:** `apps/web/src/components/todo/`

### File Structure Mapping

```
Source → Target Migration Map:

packages/ui-web/src/theme/ThemeProvider.tsx
→ apps/web/src/components/theme/ThemeProvider.tsx

packages/ui-web/src/theme/theme-provider.tsx
→ apps/web/src/components/theme/ThemeProvider.tsx (merge/deduplicate)

packages/ui-web/src/theme/theme-sync.ts
→ apps/web/src/components/theme/theme-sync.ts

packages/ui-web/lib/components/theme/ThemeToggle/ThemeToggle.tsx
→ apps/web/src/components/theme/ThemeToggle.tsx

packages/ui-web/lib/components/theme/ThemeSwitcher/ThemeSwitcher.tsx
→ apps/web/src/components/theme/ThemeSwitcher.tsx

packages/ui-web/lib/components/blockchain/TransactionStatus/TransactionStatus.tsx
→ apps/web/src/components/blockchain/TransactionStatus.tsx

packages/ui-web/lib/components/blockchain/WalletConnect/WalletConnect.tsx
→ apps/web/src/components/blockchain/WalletConnect.tsx

packages/ui-web/lib/components/todo/TodoForm/TodoForm.tsx
→ apps/web/src/components/todo/TodoForm.tsx

packages/ui-web/lib/components/todo/TodoItem/TodoItem.tsx
→ apps/web/src/components/todo/TodoItem.tsx

packages/ui-web/lib/components/todo/TodoList/TodoList.tsx
→ apps/web/src/components/todo/TodoList.tsx
```

### Test File Migration

```
Test Migration Map:

packages/ui-web/__tests__/theme-ThemeSwitcher.test.tsx
→ apps/web/src/components/__tests__/ThemeSwitcher.test.tsx

packages/ui-web/__tests__/theme-ThemeToggle.test.tsx
→ apps/web/src/components/__tests__/ThemeToggle.test.tsx

packages/ui-web/__tests__/TodoForm.test.tsx
→ apps/web/src/components/__tests__/TodoForm.test.tsx

packages/ui-web/__tests__/TodoItem.test.tsx
→ apps/web/src/components/__tests__/TodoItem.test.tsx

packages/ui-web/__tests__/todo-TodoItem.test.tsx
→ apps/web/src/components/__tests__/TodoItem.test.tsx (merge if needed)

packages/ui-web/__tests__/TodoList.test.tsx
→ apps/web/src/components/__tests__/TodoList.test.tsx

packages/ui-web/__tests__/todo-TodoList.test.tsx
→ apps/web/src/components/__tests__/TodoList.test.tsx (merge if needed)

packages/ui-web/__tests__/TransactionStatus.test.tsx
→ apps/web/src/components/__tests__/TransactionStatus.test.tsx

packages/ui-web/__tests__/WalletConnect.test.tsx
→ apps/web/src/components/__tests__/WalletConnect.test.tsx
```

## Data Models

### Import Path Transformations

#### Before Migration

```typescript
// In apps/web files
import { TodoForm, TodoItem, TodoList } from '@todo/ui-web';
import { ThemeProvider, ThemeSwitcher } from '@todo/ui-web';
import { WalletConnect, TransactionStatus } from '@todo/ui-web';
```

#### After Migration

```typescript
// In apps/web files
import { TodoForm } from '../components/todo/TodoForm';
import { TodoItem } from '../components/todo/TodoItem';
import { TodoList } from '../components/todo/TodoList';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { ThemeSwitcher } from '../components/theme/ThemeSwitcher';
import { WalletConnect } from '../components/blockchain/WalletConnect';
import { TransactionStatus } from '../components/blockchain/TransactionStatus';
```

### Export Updates

#### ui-web Package Exports (to be removed)

```typescript
// packages/ui-web/src/index.ts - Remove these exports
export { TodoForm } from './lib/components/todo/TodoForm';
export { TodoItem } from './lib/components/todo/TodoItem';
export { TodoList } from './lib/components/todo/TodoList';
export { ThemeProvider } from './src/theme/ThemeProvider';
export { ThemeSwitcher } from './lib/components/theme/ThemeSwitcher';
export { ThemeToggle } from './lib/components/theme/ThemeToggle';
export { WalletConnect } from './lib/components/blockchain/WalletConnect';
export { TransactionStatus } from './lib/components/blockchain/TransactionStatus';
```

#### apps/web Component Exports (to be added)

```typescript
// apps/web/src/components/index.ts - New file
export { TodoForm } from './todo/TodoForm';
export { TodoItem } from './todo/TodoItem';
export { TodoList } from './todo/TodoList';
export { ThemeProvider } from './theme/ThemeProvider';
export { ThemeSwitcher } from './theme/ThemeSwitcher';
export { ThemeToggle } from './theme/ThemeToggle';
export { WalletConnect } from './blockchain/WalletConnect';
export { TransactionStatus } from './blockchain/TransactionStatus';
```

## Error Handling

### Migration Validation

1. **Duplicate Detection:** Check for existing components in target locations
2. **Import Validation:** Ensure all import paths are updated correctly
3. **Dependency Resolution:** Verify no circular dependencies are created
4. **Build Validation:** Ensure both packages build successfully after migration

### Rollback Strategy

1. **Backup Creation:** Create backup of original files before migration
2. **Incremental Migration:** Migrate components one category at a time
3. **Test Validation:** Run tests after each migration step
4. **Git Commits:** Commit each migration step separately for easy rollback

## Testing Strategy

### Pre-Migration Testing

1. Run full test suite for both ui-web and apps/web packages
2. Verify current build processes work correctly
3. Document current import usage patterns

### Migration Testing

1. **Component Functionality:** Verify migrated components work identically
2. **Import Resolution:** Test that all import paths resolve correctly
3. **Build Process:** Ensure both packages build without errors
4. **Test Coverage:** Maintain or improve test coverage for migrated components

### Post-Migration Validation

1. **Integration Tests:** Run full e2e test suite for apps/web
2. **Package Isolation:** Verify ui-web package works independently
3. **Storybook Validation:** Ensure remaining Storybook stories work
4. **Type Checking:** Verify TypeScript compilation succeeds

### Test Categories

- **Unit Tests:** Component behavior and props
- **Integration Tests:** Component interaction within apps/web
- **Build Tests:** Package compilation and bundling
- **Import Tests:** Verify import path resolution

## Implementation Phases

### Phase 1: Preparation and Analysis

- Scan and catalog all components with client/server directives
- Identify all test files and story files to be migrated/removed
- Create backup of current state
- Analyze current import usage patterns

### Phase 2: Theme Components Migration

- Migrate theme-related components and resolve duplicates
- Update theme component imports in apps/web
- Remove theme component stories from ui-web
- Update ui-web exports

### Phase 3: Blockchain Components Migration

- Migrate blockchain-related components
- Update blockchain component imports in apps/web
- Remove blockchain component stories from ui-web
- Update ui-web exports

### Phase 4: Todo Components Migration

- Migrate todo-related components
- Update todo component imports in apps/web
- Remove todo component stories from ui-web
- Update ui-web exports

### Phase 5: Validation and Cleanup

- Run comprehensive test suite
- Verify build processes
- Clean up any remaining references
- Update documentation

## Dependencies and Constraints

### Technical Dependencies

- Next.js App Router structure in apps/web
- TypeScript configuration compatibility
- Tailwind CSS class resolution
- Jest test configuration
- Storybook configuration in ui-web

### Constraints

- Must maintain component functionality
- Cannot break existing apps/web functionality
- Must preserve test coverage
- Should not affect other packages in monorepo
- Must maintain proper TypeScript types
