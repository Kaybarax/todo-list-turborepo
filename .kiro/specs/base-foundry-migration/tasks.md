# Implementation Plan: Base Foundry Migration

- [x] 1. Install and configure Foundry toolchain
  - Install Foundry (forge, cast, anvil) in the Base contracts directory
  - Create `foundry.toml` configuration file with compiler settings, paths, and network configurations
  - Create `remappings.txt` for dependency path resolution
  - Update `.gitignore` to include Foundry-specific directories (out/, cache/, lib/)
  - _Requirements: 1.1, 1.4, 5.1_

- [x] 2. Set up Foundry dependencies
  - Install OpenZeppelin contracts v5.4.0 as git submodule using `forge install`
  - Install forge-std as git submodule for testing utilities
  - Configure remappings for `@openzeppelin/contracts/` imports
  - Verify contracts can resolve OpenZeppelin imports correctly
  - _Requirements: 1.1, 6.1, 6.2, 6.3_

- [x] 3. Migrate contract source files
  - Create `src/` directory in Base contracts
  - Move `TodoList.sol` from `contracts/` to `src/`
  - Move `TodoListFactory.sol` from `contracts/` to `src/`
  - Compile contracts using `forge build` to verify successful migration
  - Verify generated artifacts in `out/` directory
  - _Requirements: 1.1, 1.3, 3.1_

- [x] 4. Convert TodoList tests to Foundry
  - Create `test/TodoList.t.sol` test contract
  - Implement `setUp()` function to initialize test environment
  - Convert all TodoList creation tests from JavaScript to Solidity
  - Convert all TodoList update tests from JavaScript to Solidity
  - Convert all TodoList deletion tests from JavaScript to Solidity
  - Convert all TodoList query tests from JavaScript to Solidity
  - Convert all TodoList error/revert tests using `vm.expectRevert()`
  - Add event emission tests using `vm.expectEmit()`
  - Run tests with `forge test` and verify all pass
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 5. Convert TodoListFactory tests to Foundry
  - Create `test/TodoListFactory.t.sol` test contract
  - Implement `setUp()` function for factory tests
  - Convert factory creation tests from JavaScript to Solidity
  - Convert user TodoList retrieval tests from JavaScript to Solidity
  - Convert multi-user scenario tests from JavaScript to Solidity
  - Test factory access control and ownership
  - Run tests with `forge test` and verify all pass
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 6. Add advanced Foundry testing features
  - Create `test/helpers/TestHelpers.sol` for shared test utilities
  - Implement fuzz tests for TodoList input validation
  - Add property-based tests for TodoList invariants
  - Generate gas snapshot using `forge snapshot`
  - Generate coverage report using `forge coverage`
  - Verify coverage meets or exceeds 100% of original test coverage
  - _Requirements: 2.2, 2.3, 2.4_

- [ ] 7. Create Foundry deployment scripts
  - Create `script/Deploy.s.sol` for main deployment
  - Implement deployment logic for TodoListFactory
  - Add deployment address logging and JSON output
  - Create `script/CreateTodoList.s.sol` for creating user TodoLists
  - Create `script/CreateSampleTodos.s.sol` for sample data
  - Test deployment scripts on local Anvil node
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ] 8. Test deployment on Base Sepolia testnet
  - Configure Base Sepolia RPC URL and private key in `.env`
  - Deploy TodoListFactory to Base Sepolia using deployment script
  - Verify contract deployment on Base Sepolia explorer
  - Test contract verification using `forge verify-contract`
  - Create TodoList instance on testnet
  - Create sample todos on testnet
  - _Requirements: 3.2, 3.3, 4.2, 4.3, 4.4_

- [ ] 9. Update package.json scripts
  - Replace Hardhat compile script with `forge build`
  - Replace Hardhat test script with `forge test`
  - Add Foundry-specific scripts (coverage, gas-report, snapshot, format)
  - Update deployment scripts to use Foundry script commands
  - Update verification scripts to use `forge verify-contract`
  - Replace `hardhat node` with `anvil` for local development
  - Test all npm scripts to ensure they work correctly
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [ ] 10. Integrate with monorepo build system
  - Update Turborepo configuration to cache Foundry artifacts (`out/`, `cache/`)
  - Test `pnpm build` from workspace root to ensure Base contracts compile
  - Test `pnpm test` from workspace root to ensure Base tests run
  - Verify Turborepo caching works correctly for Foundry builds
  - Ensure Base Foundry migration doesn't affect other blockchain implementations
  - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [ ] 11. Update documentation
  - Update `apps/smart-contracts/base/README.md` with Foundry instructions
  - Document Foundry installation requirements
  - Document all Foundry commands (build, test, deploy, verify)
  - Update network configuration documentation
  - Add troubleshooting section for Foundry-specific issues
  - Document differences between Hardhat and Foundry workflows
  - Update environment variable documentation
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12. Clean up Hardhat dependencies and files
  - Remove all Hardhat-related packages from `package.json`
  - Remove `@nomicfoundation/*` packages
  - Remove `@typechain/*` packages
  - Remove `hardhat` and `hardhat-*` packages
  - Delete `hardhat.config.js` file
  - Delete `node_modules/` and run `pnpm install` to clean dependencies
  - Delete old `contracts/` directory (after verifying `src/` works)
  - Delete old JavaScript test files in `test/` directory
  - Delete old JavaScript deployment scripts in `scripts/` directory
  - Remove Hardhat cache and artifacts directories
  - Update `.gitignore` to remove Hardhat-specific entries
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 13. Verify complete migration
  - Run full build from workspace root: `pnpm build`
  - Run all tests from workspace root: `pnpm test`
  - Verify no Hardhat references remain in Base contracts
  - Verify other blockchain implementations (Polygon, Moonbeam) still work
  - Test local development workflow with Anvil
  - Deploy to Base Sepolia testnet and verify functionality
  - Generate final gas snapshot and coverage report
  - _Requirements: 1.1, 1.5, 2.1, 2.2, 5.1, 5.2, 5.5_
