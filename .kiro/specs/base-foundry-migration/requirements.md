# Requirements Document

## Introduction

This document outlines the requirements for migrating the Base smart contracts from Hardhat to Foundry. The Base blockchain contracts currently use Hardhat as the development framework, but we want to migrate to Foundry for improved performance, better testing capabilities, and a more modern Solidity development experience. This migration should only affect the Base contracts while keeping all other blockchain implementations (Polygon, Moonbeam, Solana, Polkadot) on their current frameworks.

## Glossary

- **Base_Contracts**: The smart contracts located in `apps/smart-contracts/base/` that manage todo items on the Base blockchain
- **Foundry**: A blazing fast, portable and modular toolkit for Ethereum application development written in Rust
- **Hardhat**: A JavaScript-based Ethereum development environment currently used by Base contracts
- **Forge**: Foundry's testing framework and build tool for Solidity
- **Cast**: Foundry's command-line tool for interacting with smart contracts
- **Anvil**: Foundry's local Ethereum node for testing
- **Migration_System**: The process and tooling to convert Hardhat-based contracts to Foundry
- **Test_Suite**: The collection of tests that verify contract functionality
- **Deployment_Scripts**: Scripts that deploy contracts to various networks
- **Build_System**: The monorepo build orchestration using pnpm and Turborepo

## Requirements

### Requirement 1

**User Story:** As a blockchain developer, I want the Base contracts to use Foundry instead of Hardhat, so that I can benefit from faster compilation, better testing tools, and improved developer experience.

#### Acceptance Criteria

1. WHEN THE Base_Contracts ARE compiled, THE Build_System SHALL use Forge instead of Hardhat
2. WHEN THE developer runs build commands, THE Build_System SHALL complete compilation in less time than the previous Hardhat setup
3. WHEN THE Base_Contracts ARE built, THE Build_System SHALL generate artifacts compatible with the existing deployment infrastructure
4. WHEN THE developer installs dependencies, THE Build_System SHALL install Foundry toolchain without affecting other blockchain implementations
5. WHERE THE developer uses other blockchain contracts (Polygon, Moonbeam), THE Build_System SHALL continue using Hardhat for those implementations

### Requirement 2

**User Story:** As a blockchain developer, I want all existing tests to be migrated to Foundry's testing framework, so that I can maintain test coverage while gaining access to Foundry's advanced testing features.

#### Acceptance Criteria

1. WHEN THE Test_Suite runs, THE Migration_System SHALL execute all tests using Forge test runner
2. WHEN THE tests complete, THE Test_Suite SHALL maintain 100% of the original test coverage
3. WHEN THE developer writes new tests, THE Test_Suite SHALL support Foundry's cheatcodes and advanced testing features
4. WHEN THE tests run, THE Test_Suite SHALL provide gas reporting equivalent to or better than Hardhat's gas reporter
5. IF THE tests fail, THEN THE Test_Suite SHALL provide clear error messages and stack traces

### Requirement 3

**User Story:** As a blockchain developer, I want deployment scripts to be converted to Foundry's scripting system, so that I can deploy contracts using Forge's deployment tools while maintaining compatibility with existing deployment workflows.

#### Acceptance Criteria

1. WHEN THE Deployment_Scripts execute, THE Migration_System SHALL deploy contracts using Forge script
2. WHEN THE contracts are deployed to Base mainnet, THE Deployment_Scripts SHALL use the configured private key and RPC URL
3. WHEN THE contracts are deployed to Base Sepolia testnet, THE Deployment_Scripts SHALL use the testnet configuration
4. WHEN THE contracts are deployed locally, THE Deployment_Scripts SHALL use Anvil as the local node
5. WHEN THE deployment completes, THE Deployment_Scripts SHALL save contract addresses in a format compatible with the existing application

### Requirement 4

**User Story:** As a blockchain developer, I want contract verification to work with Basescan using Foundry, so that I can verify deployed contracts without changing the verification workflow.

#### Acceptance Criteria

1. WHEN THE contracts are deployed to Base mainnet, THE Migration_System SHALL support verification using Forge verify-contract
2. WHEN THE contracts are deployed to Base Sepolia, THE Migration_System SHALL support verification using the testnet explorer
3. WHEN THE verification command runs, THE Migration_System SHALL use the configured Basescan API key
4. WHEN THE verification completes, THE Migration_System SHALL confirm successful verification on the block explorer
5. WHERE THE developer needs to verify contracts, THE Migration_System SHALL provide npm scripts equivalent to the existing Hardhat verification commands

### Requirement 5

**User Story:** As a blockchain developer, I want the Foundry configuration to integrate seamlessly with the monorepo build system, so that I can use existing pnpm and Turborepo commands without disruption.

#### Acceptance Criteria

1. WHEN THE developer runs `pnpm build`, THE Build_System SHALL compile Base contracts using Foundry
2. WHEN THE developer runs `pnpm test`, THE Build_System SHALL execute Base contract tests using Forge
3. WHEN THE developer runs `pnpm lint`, THE Build_System SHALL lint Solidity files using the existing solhint configuration
4. WHEN THE Turborepo cache is used, THE Build_System SHALL cache Foundry build artifacts appropriately
5. WHERE THE developer runs workspace-level commands, THE Build_System SHALL execute Base-specific Foundry commands without affecting other packages

### Requirement 6

**User Story:** As a blockchain developer, I want all OpenZeppelin contract dependencies to work with Foundry, so that I can maintain the same security-audited contract implementations.

#### Acceptance Criteria

1. WHEN THE Base_Contracts import OpenZeppelin contracts, THE Migration_System SHALL resolve dependencies using Foundry's remappings
2. WHEN THE contracts compile, THE Migration_System SHALL use the same OpenZeppelin contract versions as the Hardhat setup
3. WHEN THE developer updates dependencies, THE Migration_System SHALL manage OpenZeppelin contracts through Foundry's dependency system
4. WHEN THE contracts are tested, THE Test_Suite SHALL correctly import and use OpenZeppelin test utilities
5. WHERE THE contracts use upgradeable patterns, THE Migration_System SHALL support OpenZeppelin's upgradeable contracts

### Requirement 7

**User Story:** As a blockchain developer, I want comprehensive documentation for the Foundry migration, so that I can understand how to use the new tooling and maintain the contracts.

#### Acceptance Criteria

1. WHEN THE developer reads the README, THE Migration_System SHALL provide clear instructions for using Foundry commands
2. WHEN THE developer needs to deploy contracts, THE Migration_System SHALL document all deployment commands for each network
3. WHEN THE developer needs to run tests, THE Migration_System SHALL document testing commands and options
4. WHEN THE developer needs environment configuration, THE Migration_System SHALL document all required environment variables
5. WHERE THE developer encounters issues, THE Migration_System SHALL provide troubleshooting guidance specific to Foundry

### Requirement 8

**User Story:** As a blockchain developer, I want to remove all Hardhat dependencies from the Base contracts, so that I can reduce package size and eliminate unused tooling.

#### Acceptance Criteria

1. WHEN THE migration completes, THE Migration_System SHALL remove all Hardhat-related npm packages from Base package.json
2. WHEN THE migration completes, THE Migration_System SHALL remove the hardhat.config.js file
3. WHEN THE migration completes, THE Migration_System SHALL remove Hardhat cache and artifacts directories
4. WHEN THE developer installs dependencies, THE Build_System SHALL not install any Hardhat packages for Base contracts
5. WHERE THE Hardhat tooling is removed, THE Migration_System SHALL ensure no broken references remain in scripts or configuration files
