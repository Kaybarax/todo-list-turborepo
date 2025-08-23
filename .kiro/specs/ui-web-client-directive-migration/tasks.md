# Implementation Plan

- [ ] 1. Preparation and analysis phase
  - Create backup of current state and analyze component dependencies
  - Scan all files with client/server directives and their associated test/story files
  - Document current import patterns in apps/web that reference migrated components
  - _Requirements: 1.1, 1.2_

- [ ] 2. Set up target directory structure in apps/web
  - Create apps/web/src/components/theme/ directory
  - Create apps/web/src/components/blockchain/ directory
  - Create apps/web/src/components/todo/ directory
  - Create apps/web/src/components/**tests**/ directory for migrated tests
  - _Requirements: 2.1, 2.2_

- [ ] 3. Migrate theme components from ui-web to apps/web
  - Copy ThemeProvider.tsx from packages/ui-web/src/theme/ to apps/web/src/components/theme/
  - Copy theme-sync.ts from packages/ui-web/src/theme/ to apps/web/src/components/theme/
  - Copy ThemeToggle.tsx from packages/ui-web/lib/components/theme/ThemeToggle/ to apps/web/src/components/theme/
  - Copy ThemeSwitcher.tsx from packages/ui-web/lib/components/theme/ThemeSwitcher/ to apps/web/src/components/theme/
  - Resolve duplicate theme-provider.tsx by merging with ThemeProvider.tsx if needed
  - _Requirements: 1.2, 2.1, 2.3_

- [ ] 4. Migrate theme component tests
  - Move packages/ui-web/**tests**/theme-ThemeSwitcher.test.tsx to apps/web/src/components/**tests**/ThemeSwitcher.test.tsx
  - Move packages/ui-web/**tests**/theme-ThemeToggle.test.tsx to apps/web/src/components/**tests**/ThemeToggle.test.tsx
  - Update import paths in migrated test files to reference new component locations
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 5. Remove theme component stories from ui-web
  - Delete packages/ui-web/src/stories/theme/ThemeSwitcher/ directory and all contents
  - Delete packages/ui-web/src/stories/theme/ThemeToggle/ directory and all contents
  - Update any story index files that reference deleted theme stories
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6. Migrate blockchain components from ui-web to apps/web
  - Copy TransactionStatus.tsx from packages/ui-web/lib/components/blockchain/TransactionStatus/ to apps/web/src/components/blockchain/
  - Copy WalletConnect.tsx from packages/ui-web/lib/components/blockchain/WalletConnect/ to apps/web/src/components/blockchain/
  - Preserve component functionality and props interfaces
  - _Requirements: 1.2, 2.1, 2.3_

- [ ] 7. Migrate blockchain component tests
  - Move packages/ui-web/**tests**/TransactionStatus.test.tsx to apps/web/src/components/**tests**/TransactionStatus.test.tsx
  - Move packages/ui-web/**tests**/WalletConnect.test.tsx to apps/web/src/components/**tests**/WalletConnect.test.tsx
  - Update import paths in migrated test files to reference new component locations
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8. Remove blockchain component stories from ui-web
  - Delete packages/ui-web/src/stories/blockchain/TransactionStatus/ directory and all contents
  - Delete packages/ui-web/src/stories/blockchain/WalletConnect/ directory and all contents
  - Update any story index files that reference deleted blockchain stories
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 9. Migrate todo components from ui-web to apps/web
  - Copy TodoForm.tsx from packages/ui-web/lib/components/todo/TodoForm/ to apps/web/src/components/todo/
  - Copy TodoItem.tsx from packages/ui-web/lib/components/todo/TodoItem/ to apps/web/src/components/todo/
  - Copy TodoList.tsx from packages/ui-web/lib/components/todo/TodoList/ to apps/web/src/components/todo/
  - Preserve component functionality and props interfaces
  - _Requirements: 1.2, 2.1, 2.3_

- [ ] 10. Migrate todo component tests
  - Move packages/ui-web/**tests**/TodoForm.test.tsx to apps/web/src/components/**tests**/TodoForm.test.tsx
  - Move packages/ui-web/**tests**/TodoItem.test.tsx to apps/web/src/components/**tests**/TodoItem.test.tsx
  - Move packages/ui-web/**tests**/TodoList.test.tsx to apps/web/src/components/**tests**/TodoList.test.tsx
  - Handle duplicate test files (todo-TodoItem.test.tsx, todo-TodoList.test.tsx) by merging or choosing the most comprehensive version
  - Update import paths in migrated test files to reference new component locations
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 11. Remove todo component stories from ui-web
  - Delete packages/ui-web/src/stories/todo/TodoForm/ directory and all contents
  - Delete packages/ui-web/src/stories/todo/TodoItem/ directory and all contents
  - Delete packages/ui-web/src/stories/todo/TodoList/ directory and all contents
  - Update any story index files that reference deleted todo stories
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 12. Update import statements in apps/web
  - Scan all files in apps/web/src/ for imports of migrated components from @todo/ui-web
  - Replace imports like `import { TodoForm } from '@todo/ui-web'` with `import { TodoForm } from '../components/todo/TodoForm'`
  - Update relative paths based on the importing file's location
  - Ensure all component names and functionality are preserved
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 13. Create component index file for apps/web
  - Create apps/web/src/components/index.ts file
  - Export all migrated components from their new locations
  - Provide convenient import path for internal apps/web usage
  - _Requirements: 2.2, 5.3_

- [ ] 14. Update ui-web package exports
  - Remove exports for migrated components from packages/ui-web/src/index.ts
  - Remove exports from packages/ui-web/lib/components/ index files for migrated components
  - Ensure remaining component exports are not affected
  - Maintain proper TypeScript type exports for remaining components
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 15. Delete original component files from ui-web
  - Delete packages/ui-web/src/theme/ThemeProvider.tsx
  - Delete packages/ui-web/src/theme/theme-provider.tsx
  - Delete packages/ui-web/src/theme/theme-sync.ts
  - Delete packages/ui-web/lib/components/theme/ThemeToggle/ directory
  - Delete packages/ui-web/lib/components/theme/ThemeSwitcher/ directory
  - Delete packages/ui-web/lib/components/blockchain/TransactionStatus/ directory
  - Delete packages/ui-web/lib/components/blockchain/WalletConnect/ directory
  - Delete packages/ui-web/lib/components/todo/TodoForm/ directory
  - Delete packages/ui-web/lib/components/todo/TodoItem/ directory
  - Delete packages/ui-web/lib/components/todo/TodoList/ directory
  - _Requirements: 1.2, 6.1_

- [ ] 16. Run comprehensive test validation
  - Execute all tests in apps/web to ensure migrated components work correctly
  - Execute all tests in packages/ui-web to ensure remaining components are unaffected
  - Verify that no test failures are introduced by the migration
  - Check test coverage is maintained or improved for migrated components
  - _Requirements: 7.1, 7.2_

- [ ] 17. Validate build processes
  - Build apps/web package and verify successful compilation
  - Build packages/ui-web package and verify successful compilation
  - Ensure TypeScript type checking passes for both packages
  - Verify no circular dependencies are created
  - _Requirements: 7.3, 7.4_

- [ ] 18. Final verification and cleanup
  - Scan packages/ui-web for any remaining "use client" or "use server" directives
  - Verify all import paths in apps/web resolve correctly
  - Run end-to-end tests for apps/web to ensure full functionality
  - Clean up any temporary files or unused imports
  - _Requirements: 7.5, 5.4_
