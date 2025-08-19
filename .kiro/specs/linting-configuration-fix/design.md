# Design Document

## Overview

This design addresses the linting configuration issues in the monorepo by fixing ESLint configuration resolution, adding missing Solidity linting configurations, correcting syntax errors, and ensuring proper integration with the monorepo structure.

The solution involves:

1. Fixing the ESLint configuration package structure and exports
2. Adding comprehensive Solidity linting configurations
3. Correcting syntax errors in existing configurations
4. Ensuring proper package dependencies and resolution
5. Updating Turbo configuration for optimal linting performance

## Architecture

### ESLint Configuration Package Structure

```
packages/config-eslint/
├── package.json          # Proper exports and dependencies
├── index.js             # Main entry point with all configs
├── base.js              # Base TypeScript/JavaScript rules
├── react.js             # React-specific rules
├── nextjs.js            # Next.js-specific rules (extends react.js)
├── nestjs.js            # NestJS-specific rules (extends base.js)
├── react-native.js      # React Native rules (extends react.js)
└── solidity.js          # Solidity-specific rules (new)
```

### Solidity Linting Configuration

```
apps/smart-contracts/
├── .solhint.json        # Root solhint configuration
├── polygon/
│   └── .solhint.json    # Polygon-specific overrides
├── moonbeam/
│   └── .solhint.json    # Moonbeam-specific overrides
├── base/
│   └── .solhint.json    # Base-specific overrides
└── solana/
    └── .eslintrc.js     # TypeScript linting for Solana tests
```

## Components and Interfaces

### 1. ESLint Configuration Package

**Purpose**: Provide shared, consistent ESLint configurations for all package types

**Key Components**:

- `package.json`: Defines proper exports, dependencies, and peer dependencies
- Configuration files: Each framework-specific configuration extends appropriate base configs
- Index file: Exports all configurations for easy consumption

**Dependencies**:

- All necessary ESLint plugins and parsers
- TypeScript ESLint parser and plugins
- Framework-specific plugins (React, Next.js, React Native, Node.js)
- Security and accessibility plugins

### 2. Solidity Linting System

**Purpose**: Provide comprehensive Solidity code quality checking

**Key Components**:

- Root `.solhint.json`: Base Solidity linting rules
- Network-specific configurations: Override rules for specific blockchain requirements
- Integration with package.json scripts

**Rules Categories**:

- Security rules (prevent common vulnerabilities)
- Best practices (gas optimization, naming conventions)
- Code style (formatting, structure)

### 3. Application-Level Configurations

**Purpose**: Apply appropriate linting rules to each application type

**Components**:

- `.eslintrc.js` files in each app directory
- Proper TypeScript project references
- Framework-specific rule overrides

## Data Models

### ESLint Configuration Schema

```typescript
interface ESLintConfig {
  extends: string[];
  plugins: string[];
  parser: string;
  parserOptions: {
    ecmaVersion: number;
    sourceType: 'module';
    project: string;
    tsconfigRootDir?: string;
  };
  rules: Record<string, any>;
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: boolean;
        project: string;
      };
    };
  };
  env: Record<string, boolean>;
}
```

### Solhint Configuration Schema

```typescript
interface SolhintConfig {
  extends: string[];
  plugins: string[];
  rules: Record<string, any>;
  excludedFiles: string[];
}
```

## Error Handling

### ESLint Configuration Resolution

1. **Missing Configuration Error**: When apps can't find `@todo/config-eslint/*` configs
   - **Solution**: Fix package.json exports and ensure proper installation
   - **Fallback**: Provide clear error messages with resolution steps

2. **TypeScript Project Resolution Error**: When ESLint can't find tsconfig.json
   - **Solution**: Use `tsconfigRootDir: __dirname` in parserOptions
   - **Fallback**: Provide relative path resolution

3. **Plugin Resolution Error**: When ESLint plugins are not found
   - **Solution**: Ensure all plugins are listed as dependencies in config package
   - **Fallback**: Use peer dependencies with clear installation instructions

### Solidity Linting Errors

1. **Missing Solhint Configuration**: When solhint can't find config files
   - **Solution**: Create `.solhint.json` files in appropriate directories
   - **Fallback**: Use default solhint rules with warnings

2. **Solidity File Resolution**: When solhint can't find Solidity files
   - **Solution**: Update glob patterns in package.json scripts
   - **Fallback**: Skip linting with warning message

## Testing Strategy

### Unit Testing

1. **Configuration Validation**: Test that each ESLint configuration loads without errors
2. **Rule Application**: Test that specific rules are applied correctly to sample code
3. **Plugin Resolution**: Test that all required plugins are available

### Integration Testing

1. **Cross-Package Linting**: Test that shared configurations work across different applications
2. **Monorepo Path Resolution**: Test that import resolution works correctly
3. **TypeScript Integration**: Test that TypeScript project references resolve correctly

### End-to-End Testing

1. **Full Lint Run**: Test that `pnpm lint` completes successfully across all packages
2. **Fix Application**: Test that `pnpm lint:fix` applies fixes correctly
3. **Error Reporting**: Test that actual code issues are reported clearly

### Performance Testing

1. **Lint Speed**: Measure linting performance across the monorepo
2. **Cache Effectiveness**: Test that Turbo caching works effectively for linting
3. **Incremental Linting**: Test that only changed files are linted when appropriate

## Implementation Phases

### Phase 1: Fix ESLint Configuration Package

- Fix package.json exports and dependencies
- Correct syntax errors in configuration files
- Ensure proper plugin dependencies

### Phase 2: Add Solidity Linting

- Create solhint configuration files
- Update package.json scripts for Solidity linting
- Add solhint dependencies

### Phase 3: Update Application Configurations

- Fix application-level .eslintrc.js files
- Ensure proper TypeScript project references
- Test configuration resolution

### Phase 4: Integration and Testing

- Run comprehensive linting tests
- Fix any remaining configuration issues
- Update documentation and scripts
