# Requirements Document

## Introduction

This feature involves creating a centralized utils package (`@todo/utils`) and migrating all utility functions from other packages into it. The goal is to eliminate code duplication, improve maintainability, and provide a single source of truth for common utility functions across the monorepo. The utilities will be organized by their purpose and the packages they serve, with common utilities grouped together.

## Requirements

### Requirement 1

**User Story:** As a developer, I want a centralized utils package so that I can access all utility functions from a single location and avoid code duplication across packages.

#### Acceptance Criteria

1. WHEN I need to use a utility function THEN I SHALL import it from `@todo/utils` package
2. WHEN I install the utils package THEN it SHALL be available as `@todo/utils` in the monorepo
3. WHEN I import from the utils package THEN it SHALL provide TypeScript types and proper tree-shaking support

### Requirement 2

**User Story:** As a developer, I want utilities organized by their purpose so that I can easily find and import the specific utilities I need.

#### Acceptance Criteria

1. WHEN utilities are specific to certain packages THEN they SHALL be clustered by the packages they serve
2. WHEN utilities are common across multiple packages THEN they SHALL be grouped in common utility modules
3. WHEN I import utilities THEN I SHALL be able to import them using named imports from specific modules
4. WHEN I browse the utils package THEN I SHALL find utilities organized in logical directories (common, blockchain, ui, api, testing, etc.)

### Requirement 3

**User Story:** As a developer, I want existing packages to use the centralized utils package so that there is no code duplication and all packages benefit from shared utilities.

#### Acceptance Criteria

1. WHEN packages previously had their own utils THEN they SHALL import from `@todo/utils` instead
2. WHEN I update a utility function THEN all packages using it SHALL benefit from the update
3. WHEN packages import utilities THEN they SHALL use the same import paths consistently
4. WHEN I remove old utility files THEN the packages SHALL continue to work with imports from `@todo/utils`

### Requirement 4

**User Story:** As a developer, I want proper package configuration so that the utils package integrates seamlessly with the existing monorepo infrastructure.

#### Acceptance Criteria

1. WHEN the utils package is built THEN it SHALL generate proper TypeScript declarations
2. WHEN other packages depend on utils THEN they SHALL be able to import with full type safety
3. WHEN the monorepo builds THEN the utils package SHALL be built before dependent packages
4. WHEN I run tests THEN the utils package SHALL have its own test suite and coverage reporting

### Requirement 5

**User Story:** As a developer, I want comprehensive migration of existing utilities so that no functionality is lost and all utilities are properly categorized.

#### Acceptance Criteria

1. WHEN migrating from `packages/services/src/utils/env.ts` THEN it SHALL be moved to `@todo/utils/common/env`
2. WHEN migrating blockchain utilities THEN they SHALL be moved to `@todo/utils/blockchain/` with proper organization
3. WHEN migrating UI utilities THEN they SHALL be moved to `@todo/utils/ui/` with web and mobile specific utilities
4. WHEN migrating test utilities THEN they SHALL be moved to `@todo/utils/testing/` with proper test helper organization
5. WHEN migrating app-specific utilities THEN they SHALL be moved to appropriate categories or remain app-specific if truly unique

### Requirement 6

**User Story:** As a developer, I want proper documentation and examples so that I can understand how to use the centralized utils package effectively.

#### Acceptance Criteria

1. WHEN I look at the utils package THEN it SHALL have a comprehensive README with usage examples
2. WHEN I need to understand a utility function THEN it SHALL have proper JSDoc documentation
3. WHEN I want to see available utilities THEN there SHALL be an index file that exports all utilities with clear organization
4. WHEN I migrate existing code THEN there SHALL be migration guides showing old vs new import paths
