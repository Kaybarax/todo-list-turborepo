# Implementation Plan

- [x] 1. Set up utils package structure and configuration
  - Create the basic package structure with proper directories
  - Configure package.json with correct dependencies and build scripts
  - Set up TypeScript configuration for proper declaration generation
  - Configure Jest for testing with appropriate test environment
  - _Requirements: 1.2, 4.1, 4.2, 4.4_

- [x] 2. Migrate common utilities
  - [x] 2.1 Migrate environment utilities
    - Move `packages/services/src/utils/env.ts` to `packages/utils/src/common/env.ts`
    - Create comprehensive tests for environment utility functions
    - Update exports in common utilities index file
    - _Requirements: 5.1, 4.2_

  - [x] 2.2 Migrate type guard utilities
    - Move type guards from `packages/ui-web/src/utils/type-guards.ts` to `packages/utils/src/common/type-guards.ts`
    - Add additional common type guards that may be useful across packages
    - Create unit tests for all type guard functions
    - _Requirements: 2.2, 4.2_

- [ ] 3. Migrate blockchain utilities
  - [ ] 3.1 Migrate BlockchainError class
    - Move `packages/services/src/blockchain/utils/BlockchainError.ts` to `packages/utils/src/blockchain/errors.ts`
    - Ensure all static factory methods are preserved
    - Create comprehensive tests for all error scenarios
    - _Requirements: 5.2, 4.2_

  - [ ] 3.2 Migrate TransactionMonitor class
    - Move `packages/services/src/blockchain/utils/TransactionMonitor.ts` to `packages/utils/src/blockchain/monitoring.ts`
    - Preserve all monitoring functionality and options
    - Create tests for transaction monitoring scenarios
    - _Requirements: 5.2, 4.2_

  - [ ] 3.3 Create blockchain utilities index
    - Create `packages/utils/src/blockchain/index.ts` with proper exports
    - Ensure proper TypeScript declarations are generated
    - _Requirements: 2.3, 4.2_

- [ ] 4. Migrate UI utilities
  - [ ] 4.1 Migrate web UI utilities
    - Move all files from `packages/ui-web/src/utils/` to `packages/utils/src/ui/web/`
    - Preserve all utility functions: cn, ariaAttr, mergeRefs, responsive utilities, token utilities
    - Create comprehensive tests for all UI utility functions
    - _Requirements: 5.3, 4.2_

  - [ ] 4.2 Create UI utilities organization
    - Create `packages/utils/src/ui/web/index.ts` with proper exports
    - Create `packages/utils/src/ui/mobile/index.ts` for future mobile utilities
    - Create main `packages/utils/src/ui/index.ts` with organized exports
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 5. Migrate testing utilities
  - [ ] 5.1 Migrate mobile testing utilities
    - Move `packages/ui-mobile/src/test/utils/eva-test-utils.tsx` to `packages/utils/src/testing/mobile.ts`
    - Ensure all Eva Design testing helpers are preserved
    - Create tests for testing utility functions
    - _Requirements: 5.4, 4.2_

  - [ ] 5.2 Migrate API testing utilities
    - Move `apps/web/src/__tests__/test-utils.ts` to `packages/utils/src/testing/api.ts`
    - Preserve mock creation and data transformation utilities
    - Create tests for API testing utilities
    - _Requirements: 5.5, 4.2_

  - [ ] 5.3 Create testing utilities index
    - Create `packages/utils/src/testing/index.ts` with organized exports
    - Ensure proper separation between web, mobile, and API testing utilities
    - _Requirements: 2.1, 2.3_

- [ ] 6. Migrate logging utilities
  - [ ] 6.1 Migrate Winston logger configuration
    - Move `apps/ingestion/src/utils/logger.ts` to `packages/utils/src/logging/winston.ts`
    - Generalize logger configuration for reuse across applications
    - Create tests for logger configuration
    - _Requirements: 5.5, 4.2_

  - [ ] 6.2 Create logging utilities index
    - Create `packages/utils/src/logging/index.ts` with logger exports
    - Document logger usage patterns and configuration options
    - _Requirements: 2.3, 6.2_

- [ ] 7. Create main package exports and documentation
  - [ ] 7.1 Create main package index
    - Create `packages/utils/src/index.ts` with organized exports from all modules
    - Support both named imports and category-based imports
    - Ensure proper tree-shaking support with ESM exports
    - _Requirements: 1.3, 2.3, 4.1_

  - [ ] 7.2 Create comprehensive README
    - Document all available utilities with usage examples
    - Provide migration guide showing old vs new import paths
    - Include contribution guidelines for adding new utilities
    - _Requirements: 6.1, 6.3, 6.4_

- [ ] 8. Update package dependencies and imports
  - [ ] 8.1 Update services package
    - Remove old utils directory from services package
    - Update all imports to use `@todo/utils` instead of local utils
    - Update package.json to depend on `@todo/utils`
    - Run tests to ensure no functionality is broken
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 8.2 Update ui-web package
    - Remove old utils directory from ui-web package
    - Update all imports to use `@todo/utils/ui/web` instead of local utils
    - Update package.json to depend on `@todo/utils`
    - Run tests and Storybook to ensure UI components work correctly
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 8.3 Update ui-mobile package
    - Remove old test utils from ui-mobile package
    - Update test imports to use `@todo/utils/testing/mobile`
    - Update package.json to depend on `@todo/utils`
    - Run tests to ensure mobile testing works correctly
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 8.4 Update web app
    - Remove old test utils from web app
    - Update test imports to use `@todo/utils/testing/api`
    - Update package.json to depend on `@todo/utils`
    - Run all tests to ensure web app functionality is preserved
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 8.5 Update ingestion app
    - Remove old logger utils from ingestion app
    - Update logger imports to use `@todo/utils/logging`
    - Update package.json to depend on `@todo/utils`
    - Test ingestion service to ensure logging works correctly
    - _Requirements: 3.1, 3.2, 3.4_

- [ ] 9. Update monorepo build configuration
  - [ ] 9.1 Update workspace dependencies
    - Add `@todo/utils` to pnpm workspace configuration
    - Update Turborepo configuration to build utils package before dependent packages
    - Ensure proper build order in CI/CD pipeline
    - _Requirements: 4.3, 4.4_

  - [ ] 9.2 Update root package.json and scripts
    - Update any root-level scripts that might reference old utility paths
    - Ensure linting and formatting rules apply to the new utils package
    - Update any documentation that references old utility locations
    - _Requirements: 4.3, 6.4_

- [ ] 10. Comprehensive testing and validation
  - [ ] 10.1 Run full test suite
    - Execute all tests across the monorepo to ensure no regressions
    - Verify that all packages can import from `@todo/utils` correctly
    - Check that TypeScript compilation works without errors
    - _Requirements: 3.4, 4.2, 4.4_

  - [ ] 10.2 Validate build and deployment
    - Build all packages to ensure utils package integrates correctly
    - Test that applications run correctly with migrated utilities
    - Verify that bundle sizes haven't increased significantly
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ] 10.3 Performance and compatibility testing
    - Measure build times to ensure no significant regression
    - Test tree-shaking to ensure unused utilities are eliminated
    - Verify compatibility across different environments (Node.js, browser)
    - _Requirements: 1.3, 4.1_
