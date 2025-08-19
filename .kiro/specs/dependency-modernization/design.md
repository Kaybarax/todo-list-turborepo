# Design Document

## Overview

This design outlines a systematic approach to modernizing all dependencies in the monorepo by replacing deprecated packages with their modern alternatives and updating all related code. The solution will handle both deprecated packages and outdated versions while ensuring compatibility and functionality.

## Architecture

The dependency modernization will follow a phased approach:

1. **Analysis Phase**: Identify all deprecated and outdated dependencies
2. **Replacement Planning Phase**: Map deprecated packages to their modern alternatives
3. **Update Phase**: Update package.json files and install new dependencies
4. **Code Migration Phase**: Update all code that uses the deprecated APIs
5. **Validation Phase**: Ensure all builds, tests, and tools continue to work

## Components and Interfaces

### Deprecated Package Mappings

Based on the audit results, the following deprecated packages need replacement:

#### Testing Libraries

- `@testing-library/jest-native` → `@testing-library/react-native` (already available, just need to remove the deprecated one)
- `react-native-testing-library` → `@testing-library/react-native` (already available, just need to remove the deprecated one)

#### UI Components

- `react-native-vector-icons` → `@expo/vector-icons` (already available in mobile app) or `react-native-vector-icons` latest version if not actually deprecated

### Major Version Updates Required

#### Core Framework Updates

- **NestJS**: v10 → v11 (major version update)
  - `@nestjs/common`: 10.4.20 → 11.1.6
  - `@nestjs/core`: 10.4.20 → 11.1.6
  - `@nestjs/platform-express`: 10.4.20 → 11.1.6
  - All other NestJS packages to v11

#### Frontend Framework Updates

- **Next.js**: 14.2.30 → 15.4.6 (major version update)
- **React**: 18.2.0 → 19.1.1 (major version update)
- **React DOM**: 18.3.1 → 19.1.1 (major version update)

#### Development Tools Updates

- **TypeScript**: 5.1.6/5.8.3 → 5.9.2
- **ESLint**: 8.x → 9.x (major version update)
- **Storybook**: 7.6.x → 9.1.2 (major version update)
- **Vite**: 5.4.19 → 7.1.2 (major version update)
- **Jest**: 29.7.0 → 30.0.5 (major version update)

#### Blockchain Dependencies

- **Hardhat**: 2.x → 3.0.0 (major version update)
- **OpenZeppelin Contracts**: 4.9.x → 5.4.0 (major version update)
- **Polkadot API**: 10.x → 16.4.4 (major version update)

## Data Models

### Dependency Update Strategy

```typescript
interface DependencyUpdate {
  packageName: string;
  currentVersion: string;
  targetVersion: string;
  updateType: 'patch' | 'minor' | 'major' | 'deprecated-replacement';
  breakingChanges: string[];
  codeChangesRequired: boolean;
  configChangesRequired: boolean;
}

interface DeprecatedPackageReplacement {
  deprecatedPackage: string;
  replacementPackage: string;
  migrationSteps: string[];
  affectedFiles: string[];
}
```

## Error Handling

### Breaking Changes Management

1. **NestJS v11 Breaking Changes**:
   - Update import paths for changed modules
   - Update configuration syntax changes
   - Handle deprecated decorators and methods

2. **React 19 Breaking Changes**:
   - Update to new JSX transform if needed
   - Handle changes in React.FC and component prop types
   - Update testing utilities for new React features

3. **Next.js 15 Breaking Changes**:
   - Update App Router configurations
   - Handle changes in middleware and API routes
   - Update build and deployment configurations

4. **ESLint 9 Breaking Changes**:
   - Update configuration format (flat config)
   - Update plugin configurations
   - Handle removed or changed rules

### Rollback Strategy

1. **Git-based rollback**: Each major update will be committed separately
2. **Package lock preservation**: Keep backup of pnpm-lock.yaml
3. **Configuration backups**: Backup all configuration files before changes

## Testing Strategy

### Pre-Update Testing

1. Run full test suite to establish baseline
2. Document any existing test failures
3. Run build process to ensure current state is working

### Post-Update Testing

1. **Unit Tests**: Ensure all unit tests pass with new dependencies
2. **Integration Tests**: Verify integration tests work with updated packages
3. **E2E Tests**: Run end-to-end tests to ensure full application functionality
4. **Build Tests**: Verify all build processes (web, mobile, API, contracts) work
5. **Storybook Tests**: Ensure Storybook builds and displays correctly
6. **Linting Tests**: Verify ESLint and Prettier work with new configurations

### Security Testing

1. Run `pnpm audit` after updates to verify security improvements
2. Check for any new vulnerabilities introduced
3. Validate that high-priority vulnerabilities are resolved

## Implementation Phases

### Phase 1: Deprecated Package Replacement

- Remove `@testing-library/jest-native` and `react-native-testing-library`
- Update all test files to use `@testing-library/react-native`
- Update Jest configuration to remove deprecated package references

### Phase 2: Core Framework Updates

- Update NestJS to v11 across all API packages
- Update React and React DOM to v19
- Update Next.js to v15
- Handle breaking changes for each framework

### Phase 3: Development Tools Updates

- Update TypeScript to latest version
- Update ESLint to v9 with new flat config
- Update Jest to v30
- Update Storybook to v9

### Phase 4: Build Tools and Bundlers

- Update Vite to v7
- Update Turbo to latest version
- Update all build-related dependencies

### Phase 5: Blockchain Dependencies

- Update Hardhat to v3
- Update OpenZeppelin contracts to v5
- Update Polkadot API to v16
- Handle breaking changes in smart contract tooling

### Phase 6: Final Cleanup and Optimization

- Remove any unused dependencies
- Consolidate duplicate dependencies
- Optimize package.json files
- Update documentation
