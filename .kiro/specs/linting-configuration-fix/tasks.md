# Implementation Plan

- [x] 1. Fix ESLint configuration package structure and dependencies
  - Update packages/config-eslint/package.json with proper exports, dependencies, and peer dependencies
  - Fix syntax error in packages/config-eslint/nestjs.js (duplicate extends declaration)
  - Ensure all ESLint plugins are properly declared as dependencies
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3, 4.4_

- [x] 2. Create comprehensive Solidity linting configuration
  - Create root .solhint.json configuration file for smart contracts
  - Create network-specific .solhint.json files for polygon, moonbeam, and base directories
  - Add solhint dependency to smart contract package.json files
  - Update package.json lint scripts to use proper solhint configuration paths
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3. Fix application-level ESLint configurations
  - Update apps/api/.eslintrc.js to properly resolve @todo/config-eslint/nestjs
  - Update apps/web/.eslintrc.js to properly resolve @todo/config-eslint/nextjs
  - Update apps/mobile/.eslintrc.js to properly resolve @todo/config-eslint/react-native
  - Add tsconfigRootDir: \_\_dirname to all application ESLint configurations
  - _Requirements: 3.1, 5.1, 5.2_

- [ ] 4. Update shared package ESLint configurations
  - Update packages/ui-web/.eslintrc.js to use proper configuration resolution
  - Update packages/ui-mobile/.eslintrc.js to use proper configuration resolution
  - Update packages/services/.eslintrc.js to use proper configuration resolution
  - Ensure all shared packages have consistent linting setup
  - _Requirements: 3.1, 3.2, 4.4_

- [ ] 5. Install missing dependencies and fix package resolution
  - Install missing ESLint plugins and dependencies in config-eslint package
  - Update pnpm workspace to ensure proper package linking
  - Run pnpm install to resolve all dependency issues
  - _Requirements: 3.1, 5.3_

- [ ] 6. Test and validate linting configuration
  - Run pnpm lint on individual packages to verify configuration resolution
  - Run full pnpm lint command to ensure all packages lint successfully
  - Test pnpm lint:fix to ensure automatic fixing works correctly
  - Verify that actual code issues are properly reported while configuration errors are resolved
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 7. Update Turbo configuration for optimal linting performance
  - Review and update turbo.json lint task configuration
  - Ensure proper caching and dependency tracking for lint tasks
  - Optimize lint task execution order and parallelization
  - _Requirements: 1.1, 5.3_
