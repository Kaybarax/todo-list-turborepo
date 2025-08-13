# Requirements Document

## Introduction

The monorepo currently has linting configuration issues that prevent the `pnpm lint` command from running successfully. The main problems are:

1. ESLint configurations in `packages/config-eslint/` are not being properly resolved by applications
2. Solidity linting (solhint) configurations are missing for smart contract packages
3. Some ESLint configuration files have syntax errors (duplicate `extends` declarations)
4. Package dependencies and resolution paths need to be fixed

This feature will resolve all linting configuration issues to ensure code quality standards are enforced across the entire monorepo.

## Requirements

### Requirement 1

**User Story:** As a developer, I want the `pnpm lint` command to run successfully across all packages, so that I can maintain consistent code quality standards.

#### Acceptance Criteria

1. WHEN I run `pnpm lint` from the root directory THEN all packages should lint successfully without configuration errors
2. WHEN I run `pnpm lint:fix` THEN ESLint should automatically fix fixable issues across all TypeScript/JavaScript files
3. WHEN linting fails THEN it should provide clear, actionable error messages for actual code issues, not configuration problems

### Requirement 2

**User Story:** As a developer working on smart contracts, I want Solidity files to be properly linted, so that I can maintain high-quality smart contract code.

#### Acceptance Criteria

1. WHEN I run linting on smart contract packages THEN Solidity files should be linted using solhint
2. WHEN Solidity linting runs THEN it should use appropriate rules for security and best practices
3. WHEN I add new Solidity files THEN they should automatically be included in the linting process

### Requirement 3

**User Story:** As a developer, I want ESLint configurations to be properly shared across packages, so that all applications use consistent linting rules.

#### Acceptance Criteria

1. WHEN applications reference `@todo/config-eslint/*` configurations THEN they should resolve correctly
2. WHEN I modify shared ESLint rules THEN they should apply to all packages that extend those configurations
3. WHEN I add new packages THEN they should be able to easily adopt the appropriate shared ESLint configuration

### Requirement 4

**User Story:** As a developer, I want framework-specific linting rules to be applied correctly, so that each application type (Next.js, NestJS, React Native) follows its respective best practices.

#### Acceptance Criteria

1. WHEN linting Next.js applications THEN Next.js-specific rules should be applied
2. WHEN linting NestJS applications THEN Node.js and NestJS-specific rules should be applied
3. WHEN linting React Native applications THEN React Native-specific rules should be applied
4. WHEN linting shared packages THEN appropriate base TypeScript rules should be applied

### Requirement 5

**User Story:** As a developer, I want the linting configuration to integrate properly with the monorepo structure, so that path resolution and TypeScript project references work correctly.

#### Acceptance Criteria

1. WHEN ESLint runs THEN it should correctly resolve TypeScript project references
2. WHEN ESLint runs THEN it should correctly resolve import paths using the monorepo's path mapping
3. WHEN ESLint runs THEN it should respect the workspace structure and not lint unnecessary files