# Implementation Plan

- [x] 1. Refactor directory structure and update references
  - Rename "apps/blockchain-smart-contracts" to "apps/smart-contracts"
  - Update package.json name from "@todo/blockchain-smart-contracts" to "@todo/smart-contracts"
  - Update all file path references throughout the codebase
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Update build and deployment scripts for new directory structure
  - Modify build-contracts.sh to reference "apps/smart-contracts" paths
  - Update deploy.sh and deployment scripts to use new directory structure
  - Update Docker configurations to reference new paths
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 3. Extend blockchain types and enums for new networks
  - Add MOONBEAM, MOONBEAM_TESTNET, BASE, BASE_TESTNET to BlockchainNetwork enum
  - Add network-specific error types for Moonbeam and Base
  - Create network configuration schemas for new networks
  - _Requirements: 2.1, 3.1, 4.1, 4.2_

- [x] 4. Create Moonbeam smart contracts directory and configuration
  - Create "apps/smart-contracts/moonbeam" directory structure
  - Implement Moonbeam-specific Hardhat configuration
  - Copy and adapt TodoList.sol and TodoListFactory.sol contracts for Moonbeam
  - Create deployment scripts for Moonbeam development, testnet, and mainnet
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

- [x] 5. Create Base smart contracts directory and configuration
  - Create "apps/smart-contracts/base" directory structure
  - Implement Base-specific Hardhat configuration
  - Copy and adapt TodoList.sol and TodoListFactory.sol contracts for Base
  - Create deployment scripts for Base development, testnet, and mainnet
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

- [x] 6. Implement MoonbeamBlockchainService
  - Create MoonbeamBlockchainService class implementing BlockchainService interface
  - Implement todo CRUD operations for Moonbeam network
  - Add Moonbeam-specific transaction handling and error management
  - Write unit tests for MoonbeamBlockchainService
  - _Requirements: 4.1, 4.3, 4.4_

- [x] 7. Implement BaseBlockchainService
  - Create BaseBlockchainService class implementing BlockchainService interface
  - Implement todo CRUD operations for Base network
  - Add Base L2-specific transaction handling and error management
  - Write unit tests for BaseBlockchainService
  - _Requirements: 4.2, 4.3, 4.4_

- [ ] 8. Update BlockchainServiceFactory for new networks
  - Add Moonbeam and Base network support to factory configuration
  - Implement service creation logic for new networks
  - Update getSupportedNetworks and getAllServices methods
  - Write unit tests for factory with new networks
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 9. Create smart contract tests for Moonbeam
  - Write comprehensive test suite for Moonbeam TodoList contract
  - Write comprehensive test suite for Moonbeam TodoListFactory contract
  - Implement integration tests for contract deployment and interaction
  - Set up local Moonbeam development node for testing
  - _Requirements: 2.5_

- [ ] 10. Create smart contract tests for Base
  - Write comprehensive test suite for Base TodoList contract
  - Write comprehensive test suite for Base TodoListFactory contract
  - Implement integration tests for contract deployment and interaction
  - Set up local Base development environment for testing
  - _Requirements: 3.5_

- [ ] 11. Update frontend network selection components
  - Add Moonbeam and Base options to network selection UI
  - Update network configuration constants with new networks
  - Implement network-specific wallet connection logic
  - Update network switching functionality for new networks
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 12. Update web application blockchain integration
  - Update blockchainService.ts to support Moonbeam and Base networks
  - Modify wallet connection components to handle new networks
  - Update transaction status components for new network types
  - Test wallet connectivity with Moonbeam and Base networks
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 13. Update mobile application blockchain integration
  - Update mobile blockchainService.ts to support new networks
  - Modify WalletConnect integration for Moonbeam and Base
  - Update mobile UI components for network selection
  - Test mobile wallet connectivity with new networks
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 14. Update build scripts for new networks
  - Extend build-contracts.sh to include Moonbeam and Base compilation
  - Update contract validation logic for new networks
  - Add network-specific build commands to package.json scripts
  - Update CI/CD pipeline configurations for new networks
  - _Requirements: 6.1, 6.2, 6.5, 6.6_

- [ ] 15. Update deployment scripts and infrastructure
  - Modify deployment scripts to deploy contracts to Moonbeam and Base
  - Update Kubernetes manifests to reference new directory structure
  - Add environment variable configurations for new networks
  - Update Docker configurations for new smart contracts structure
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [ ] 16. Update documentation for new structure and networks
  - Update all README files to reflect new "smart-contracts" directory
  - Create setup and deployment guides for Moonbeam network
  - Create setup and deployment guides for Base network
  - Update API documentation to include new network options
  - Update troubleshooting guides with network-specific issues
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 17. Create comprehensive integration tests
  - Write end-to-end tests for todo operations on Moonbeam
  - Write end-to-end tests for todo operations on Base
  - Test network switching functionality across all five networks
  - Test cross-network todo synchronization and data consistency
  - _Requirements: 4.4, 5.5_

- [ ] 18. Update package configurations and dependencies
  - Update package.json scripts throughout monorepo for new directory structure
  - Add network-specific dependencies for Moonbeam and Base development
  - Update workspace configurations and build dependencies
  - Verify all package installations and dependency resolution
  - _Requirements: 6.6_
