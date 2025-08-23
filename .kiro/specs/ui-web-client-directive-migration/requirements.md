# Requirements Document

## Introduction

This feature involves migrating React components that contain "use client" or "use server" directives from the shared ui-web package to the apps/web application. These directives are Next.js-specific and should not be present in a shared component library that needs to work across different frameworks. The migration will ensure proper separation of concerns between framework-agnostic UI components and Next.js-specific application components.

## Requirements

### Requirement 1

**User Story:** As a developer maintaining the monorepo, I want client/server directive components moved from ui-web to apps/web, so that the shared UI library remains framework-agnostic and can be used across different applications.

#### Acceptance Criteria

1. WHEN scanning the ui-web package THEN the system SHALL identify all components containing "use client" or "use server" directives
2. WHEN identifying components THEN the system SHALL locate the following files with client directives:
   - packages/ui-web/src/theme/ThemeProvider.tsx
   - packages/ui-web/src/theme/theme-sync.ts
   - packages/ui-web/src/theme/theme-provider.tsx
   - packages/ui-web/lib/components/theme/ThemeToggle/ThemeToggle.tsx
   - packages/ui-web/lib/components/theme/ThemeSwitcher/ThemeSwitcher.tsx
   - packages/ui-web/lib/components/blockchain/TransactionStatus/TransactionStatus.tsx
   - packages/ui-web/lib/components/blockchain/WalletConnect/WalletConnect.tsx
   - packages/ui-web/lib/components/todo/TodoForm/TodoForm.tsx
   - packages/ui-web/lib/components/todo/TodoItem/TodoItem.tsx
   - packages/ui-web/lib/components/todo/TodoList/TodoList.tsx

### Requirement 2

**User Story:** As a developer, I want the migrated components to be properly organized in apps/web, so that they follow the established project structure and are easily maintainable.

#### Acceptance Criteria

1. WHEN migrating components THEN the system SHALL move them to appropriate directories in apps/web/src/components/
2. WHEN organizing components THEN the system SHALL maintain logical grouping:
   - Theme components to apps/web/src/components/theme/
   - Blockchain components to apps/web/src/components/blockchain/
   - Todo components to apps/web/src/components/todo/
3. WHEN migrating THEN the system SHALL preserve the original component structure and functionality
4. WHEN migrating THEN the system SHALL update import paths to reference the new locations

### Requirement 3

**User Story:** As a developer, I want associated test files to be migrated alongside their components, so that test coverage is maintained and tests remain co-located with their implementations.

#### Acceptance Criteria

1. WHEN migrating components THEN the system SHALL identify and migrate associated test files:
   - packages/ui-web/**tests**/theme-ThemeSwitcher.test.tsx
   - packages/ui-web/**tests**/theme-ThemeToggle.test.tsx
   - packages/ui-web/**tests**/TodoForm.test.tsx
   - packages/ui-web/**tests**/TodoItem.test.tsx
   - packages/ui-web/**tests**/todo-TodoItem.test.tsx
   - packages/ui-web/**tests**/TodoList.test.tsx
   - packages/ui-web/**tests**/todo-TodoList.test.tsx
   - packages/ui-web/**tests**/TransactionStatus.test.tsx
   - packages/ui-web/**tests**/WalletConnect.test.tsx
2. WHEN migrating test files THEN the system SHALL place them in apps/web/src/components/**tests**/ or co-located with components
3. WHEN migrating test files THEN the system SHALL update import paths in tests to reference the new component locations

### Requirement 4

**User Story:** As a developer, I want Storybook stories for migrated components to be removed from ui-web, so that the shared library only contains stories for truly shared components.

#### Acceptance Criteria

1. WHEN migrating components THEN the system SHALL identify and delete associated Storybook story files:
   - packages/ui-web/src/stories/theme/ThemeSwitcher/
   - packages/ui-web/src/stories/theme/ThemeToggle/
   - packages/ui-web/src/stories/blockchain/TransactionStatus/
   - packages/ui-web/src/stories/blockchain/WalletConnect/
   - packages/ui-web/src/stories/todo/TodoForm/
   - packages/ui-web/src/stories/todo/TodoItem/
   - packages/ui-web/src/stories/todo/TodoList/
2. WHEN deleting stories THEN the system SHALL remove entire story directories and their contents
3. WHEN deleting stories THEN the system SHALL update any story index files or exports that reference the deleted stories

### Requirement 5

**User Story:** As a developer, I want import statements updated throughout the codebase, so that applications continue to work after the migration without broken imports.

#### Acceptance Criteria

1. WHEN migrating components THEN the system SHALL scan all files in apps/web for imports from the migrated components
2. WHEN finding imports THEN the system SHALL update import paths from @todo/ui-web to relative paths within apps/web
3. WHEN updating imports THEN the system SHALL preserve the imported component names and functionality
4. WHEN updating imports THEN the system SHALL ensure no circular dependencies are created

### Requirement 6

**User Story:** As a developer, I want the ui-web package exports updated, so that the migrated components are no longer exposed from the shared library.

#### Acceptance Criteria

1. WHEN migrating components THEN the system SHALL remove exports for migrated components from packages/ui-web/src/index.ts
2. WHEN updating exports THEN the system SHALL remove exports from packages/ui-web/lib/components/ index files
3. WHEN updating exports THEN the system SHALL ensure remaining exports are not affected
4. WHEN updating exports THEN the system SHALL maintain proper TypeScript type exports for remaining components

### Requirement 7

**User Story:** As a developer, I want the migration to be validated through testing, so that I can be confident the changes don't break existing functionality.

#### Acceptance Criteria

1. WHEN migration is complete THEN the system SHALL run all tests in apps/web to ensure they pass
2. WHEN migration is complete THEN the system SHALL run all tests in packages/ui-web to ensure remaining components work
3. WHEN migration is complete THEN the system SHALL verify that apps/web builds successfully
4. WHEN migration is complete THEN the system SHALL verify that packages/ui-web builds successfully
5. WHEN migration is complete THEN the system SHALL ensure no "use client" or "use server" directives remain in packages/ui-web
