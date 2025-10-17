# Design Document: Base Foundry Migration

## Overview

This design document outlines the technical approach for migrating the Base smart contracts from Hardhat to Foundry. The migration will transform the development environment while maintaining all existing functionality, test coverage, and deployment capabilities. The design ensures that only the Base contracts are affected, leaving other blockchain implementations (Polygon, Moonbeam, Solana, Polkadot) unchanged.

## Architecture

### High-Level Architecture

```
apps/smart-contracts/base/
├── foundry.toml              # Foundry configuration
├── remappings.txt            # Dependency remappings for imports
├── package.json              # Updated with Foundry scripts
├── .env.example              # Environment variables (unchanged)
├── src/                      # Contracts (renamed from contracts/)
│   ├── TodoList.sol
│   └── TodoListFactory.sol
├── test/                     # Foundry tests
│   ├── TodoList.t.sol
│   ├── TodoListFactory.t.sol
│   └── helpers/
│       └── TestHelpers.sol
├── script/                   # Foundry deployment scripts
│   ├── Deploy.s.sol
│   ├── CreateTodoList.s.sol
│   └── CreateSampleTodos.s.sol
├── lib/                      # Foundry dependencies (git submodules)
│   ├── forge-std/
│   └── openzeppelin-contracts/
└── out/                      # Foundry build artifacts
```

### Migration Strategy

The migration follows a phased approach:

1. **Setup Phase**: Install Foundry and configure the project structure
2. **Contract Migration Phase**: Move contracts to Foundry's expected structure
3. **Test Migration Phase**: Convert Hardhat tests to Foundry tests
4. **Script Migration Phase**: Convert deployment scripts to Foundry scripts
5. **Integration Phase**: Update build system and documentation
6. **Cleanup Phase**: Remove Hardhat dependencies and artifacts

## Components and Interfaces

### 1. Foundry Configuration (`foundry.toml`)

The Foundry configuration file will define compiler settings, paths, and network configurations.

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.20"
optimizer = true
optimizer_runs = 200
via_ir = false

[profile.default.fuzz]
runs = 256

[profile.ci]
fuzz_runs = 10000

# RPC endpoints
[rpc_endpoints]
base = "${BASE_RPC_URL}"
base_sepolia = "${BASE_SEPOLIA_RPC_URL}"
localhost = "http://localhost:8545"

# Etherscan configuration
[etherscan]
base = { key = "${BASESCAN_API_KEY}", url = "https://api.basescan.org/api" }
base_sepolia = { key = "${BASESCAN_API_KEY}", url = "https://api-sepolia.basescan.org/api" }
```

**Key Design Decisions:**

- Maintain same Solidity version (0.8.20) for compatibility
- Keep optimizer settings identical to Hardhat (200 runs)
- Use environment variables for sensitive data (RPC URLs, API keys)
- Support multiple profiles for different testing scenarios

### 2. Dependency Management

Foundry uses git submodules for dependency management instead of npm packages.

**Remappings (`remappings.txt`):**

```
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
forge-std/=lib/forge-std/src/
```

**Installation Commands:**

```bash
forge install OpenZeppelin/openzeppelin-contracts@v5.4.0 --no-commit
forge install foundry-rs/forge-std --no-commit
```

**Key Design Decisions:**

- Use specific OpenZeppelin version (v5.4.0) matching current Hardhat setup
- Use `--no-commit` flag to avoid automatic git commits
- Remappings maintain compatibility with existing import statements

### 3. Contract Structure

Contracts will be moved from `contracts/` to `src/` directory (Foundry convention).

**No changes to contract code required** - the Solidity files remain identical:

- `src/TodoList.sol`
- `src/TodoListFactory.sol`
- `src/Test.sol` (if needed for testing)

**Key Design Decisions:**

- Preserve all contract logic without modifications
- Maintain OpenZeppelin imports (remappings handle path resolution)
- Keep custom errors, events, and function signatures unchanged

### 4. Test Suite Migration

Hardhat tests (JavaScript/TypeScript) will be converted to Solidity tests using Forge.

**Test Structure:**

```solidity
// test/TodoList.t.sol
pragma solidity ^0.8.20;

import { Test, console2 } from 'forge-std/Test.sol';
import { TodoList } from '../src/TodoList.sol';

contract TodoListTest is Test {
  TodoList public todoList;
  address public user1;
  address public user2;

  function setUp() public {
    todoList = new TodoList();
    user1 = address(0x1);
    user2 = address(0x2);

    vm.deal(user1, 100 ether);
    vm.deal(user2, 100 ether);
  }

  function test_CreateTodo() public {
    vm.startPrank(user1);

    uint256 todoId = todoList.createTodo('Test Todo', 'Test Description', TodoList.Priority.Medium);

    assertEq(todoId, 1);

    TodoList.Todo memory todo = todoList.getTodo(todoId);
    assertEq(todo.title, 'Test Todo');
    assertEq(todo.description, 'Test Description');
    assertFalse(todo.completed);

    vm.stopPrank();
  }

  // Additional test functions...
}
```

**Test Conversion Mapping:**

| Hardhat Pattern                 | Foundry Equivalent               |
| ------------------------------- | -------------------------------- |
| `describe()` blocks             | Contract-level organization      |
| `it()` / `test()`               | `function test_*()`              |
| `beforeEach()`                  | `setUp()` function               |
| `expect().to.be.revertedWith()` | `vm.expectRevert()`              |
| `ethers.getSigners()`           | `vm.prank()` / `vm.startPrank()` |
| `expect(value).to.equal()`      | `assertEq()`                     |
| `expect(condition).to.be.true`  | `assertTrue()`                   |

**Key Design Decisions:**

- Use Foundry's cheatcodes (`vm.*`) for test setup and assertions
- Organize tests by contract (one test contract per source contract)
- Use descriptive test function names with `test_` prefix
- Leverage Foundry's fuzzing capabilities for property-based testing
- Use `console2.log()` for debugging instead of `console.log()`

### 5. Deployment Scripts

Hardhat deployment scripts (JavaScript) will be converted to Foundry scripts (Solidity).

**Script Structure:**

```solidity
// script/Deploy.s.sol
pragma solidity ^0.8.20;

import { Script, console2 } from 'forge-std/Script.sol';
import { TodoListFactory } from '../src/TodoListFactory.sol';

contract DeployScript is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint('BASE_PRIVATE_KEY');

    vm.startBroadcast(deployerPrivateKey);

    TodoListFactory factory = new TodoListFactory();

    console2.log('TodoListFactory deployed to:', address(factory));

    vm.stopBroadcast();

    // Save deployment info
    string memory deploymentInfo = string.concat('{"factory":"', vm.toString(address(factory)), '"}');

    vm.writeFile(string.concat('deployments/', vm.toString(block.chainid), '.json'), deploymentInfo);
  }
}
```

**Deployment Commands:**

```bash
# Deploy to Base Sepolia
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_sepolia \
  --broadcast \
  --verify

# Deploy to Base Mainnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base \
  --broadcast \
  --verify
```

**Key Design Decisions:**

- Use Solidity scripts instead of JavaScript for type safety
- Leverage `vm.envUint()` for secure private key handling
- Use `vm.broadcast()` for transaction broadcasting
- Save deployment addresses to JSON files for application integration
- Combine deployment and verification in single command

### 6. Package.json Scripts

Update npm scripts to use Foundry commands while maintaining familiar interface.

```json
{
  "scripts": {
    "compile": "forge build",
    "build": "forge build",
    "test": "forge test",
    "test:coverage": "forge coverage",
    "test:gas": "forge test --gas-report",
    "test:verbose": "forge test -vvv",
    "deploy:local": "forge script script/Deploy.s.sol:DeployScript --rpc-url localhost --broadcast",
    "deploy:sepolia": "forge script script/Deploy.s.sol:DeployScript --rpc-url base_sepolia --broadcast --verify",
    "deploy:base": "forge script script/Deploy.s.sol:DeployScript --rpc-url base --broadcast --verify",
    "verify:sepolia": "forge verify-contract <ADDRESS> src/TodoListFactory.sol:TodoListFactory --chain base-sepolia",
    "verify:base": "forge verify-contract <ADDRESS> src/TodoListFactory.sol:TodoListFactory --chain base",
    "node": "anvil --chain-id 8453",
    "lint": "solhint --config .solhint.json 'src/**/*.sol'",
    "format": "forge fmt",
    "format:check": "forge fmt --check",
    "clean": "forge clean",
    "snapshot": "forge snapshot",
    "create-todo-list": "forge script script/CreateTodoList.s.sol:CreateTodoListScript --rpc-url base_sepolia --broadcast",
    "create-sample-todos": "forge script script/CreateSampleTodos.s.sol:CreateSampleTodosScript --rpc-url base_sepolia --broadcast"
  }
}
```

**Key Design Decisions:**

- Maintain script names for backward compatibility
- Add Foundry-specific commands (snapshot, format)
- Use Anvil instead of Hardhat node for local development
- Integrate verification into deployment scripts
- Keep linting with solhint (Foundry-agnostic)

### 7. Build System Integration

Update Turborepo and pnpm workspace configuration to work with Foundry.

**Turborepo Configuration (`turbo.json`):**

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["out/**", "cache/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

**Key Design Decisions:**

- Cache Foundry's `out/` directory for faster builds
- Ensure Base contracts build independently of other blockchain implementations
- Maintain parallel execution with other workspace packages

## Data Models

### Deployment Artifacts

Foundry generates different artifact structure than Hardhat:

**Foundry Output (`out/`):**

```
out/
├── TodoList.sol/
│   ├── TodoList.json          # Full artifact with ABI, bytecode, metadata
│   └── TodoList.metadata.json
└── TodoListFactory.sol/
    ├── TodoListFactory.json
    └── TodoListFactory.metadata.json
```

**Deployment Records (`deployments/`):**

```json
{
  "factory": "0x...",
  "timestamp": 1234567890,
  "chainId": 8453,
  "deployer": "0x...",
  "blockNumber": 12345
}
```

**Key Design Decisions:**

- Maintain deployment records in JSON format for application compatibility
- Store artifacts in Foundry's standard output structure
- Ensure ABI format remains compatible with ethers.js/web3.js

## Error Handling

### Compilation Errors

Foundry provides detailed compilation errors with:

- Line numbers and column positions
- Specific error messages
- Suggestions for fixes

**Example:**

```
Error:
   ┌─ src/TodoList.sol:45:5
   │
45 │     revert TitleEmpty();
   │     ^^^^^^^^^^^^^^^^^^^^ Custom error not defined
```

### Test Failures

Foundry test failures include:

- Stack traces with function calls
- Gas usage information
- Assertion failure details
- Cheatcode usage logs

**Example:**

```
[FAIL. Reason: Assertion failed] test_CreateTodo() (gas: 123456)
Logs:
  Error: Assertion failed
  Expected: 1
  Actual: 0
```

### Deployment Errors

Script execution errors provide:

- Transaction revert reasons
- Gas estimation failures
- Network connectivity issues
- Private key/permission errors

**Key Design Decisions:**

- Use Foundry's verbose flags (`-vvv`, `-vvvv`) for detailed debugging
- Implement proper error messages in scripts
- Validate environment variables before execution
- Provide clear error handling in deployment scripts

## Testing Strategy

### Unit Tests

Test individual contract functions in isolation:

- TodoList CRUD operations
- TodoListFactory creation logic
- Access control and ownership
- Custom error conditions
- Event emissions

### Integration Tests

Test contract interactions:

- Factory creating TodoList instances
- Multiple users interacting with their TodoLists
- Ownership transfers
- Cross-contract calls

### Fuzz Testing

Leverage Foundry's built-in fuzzing:

```solidity
function testFuzz_CreateTodo(string calldata title, string calldata description) public {
  vm.assume(bytes(title).length > 0 && bytes(title).length <= 100);
  vm.assume(bytes(description).length <= 500);

  uint256 todoId = todoList.createTodo(title, description, TodoList.Priority.Low);
  assertGt(todoId, 0);
}
```

### Gas Optimization Tests

Use Foundry's gas snapshots:

```bash
forge snapshot
```

Compare gas usage before and after changes:

```bash
forge snapshot --diff
```

### Coverage Analysis

Generate coverage reports:

```bash
forge coverage --report lcov
```

**Coverage Targets:**

- Line coverage: 100%
- Branch coverage: 100%
- Function coverage: 100%

**Key Design Decisions:**

- Maintain or exceed current test coverage
- Add fuzz tests for input validation
- Use gas snapshots to prevent regressions
- Implement property-based tests for invariants
- Test all revert conditions and custom errors

## Migration Checklist

### Phase 1: Setup

- [ ] Install Foundry toolchain
- [ ] Create `foundry.toml` configuration
- [ ] Set up `remappings.txt`
- [ ] Install dependencies via git submodules

### Phase 2: Contract Migration

- [ ] Create `src/` directory
- [ ] Move contracts from `contracts/` to `src/`
- [ ] Verify contracts compile with Forge
- [ ] Update import paths if needed

### Phase 3: Test Migration

- [ ] Create `test/` directory structure
- [ ] Convert TodoList tests to Solidity
- [ ] Convert TodoListFactory tests to Solidity
- [ ] Add helper contracts for testing
- [ ] Verify all tests pass

### Phase 4: Script Migration

- [ ] Create `script/` directory
- [ ] Convert deployment script to Solidity
- [ ] Convert utility scripts (create-todo-list, etc.)
- [ ] Test scripts on local Anvil node
- [ ] Test scripts on Base Sepolia testnet

### Phase 5: Integration

- [ ] Update `package.json` scripts
- [ ] Update README documentation
- [ ] Update `.env.example` if needed
- [ ] Test monorepo build system
- [ ] Verify Turborepo caching

### Phase 6: Cleanup

- [ ] Remove Hardhat dependencies from `package.json`
- [ ] Delete `hardhat.config.js`
- [ ] Remove Hardhat cache and artifacts
- [ ] Delete old JavaScript test files
- [ ] Delete old JavaScript deployment scripts
- [ ] Update `.gitignore` for Foundry artifacts

## Documentation Updates

### README.md

Update with Foundry-specific instructions:

- Installation requirements (Foundry toolchain)
- Compilation commands (`forge build`)
- Testing commands (`forge test`)
- Deployment procedures
- Verification procedures
- Local development with Anvil
- Troubleshooting Foundry-specific issues

### Environment Variables

Document Foundry-specific environment variables:

- `BASE_PRIVATE_KEY`: Private key for deployments
- `BASE_RPC_URL`: Base mainnet RPC endpoint
- `BASE_SEPOLIA_RPC_URL`: Base Sepolia testnet RPC endpoint
- `BASESCAN_API_KEY`: API key for contract verification
- `FOUNDRY_PROFILE`: Profile to use (default, ci, etc.)

### Migration Guide

Create a migration guide for developers:

- Differences between Hardhat and Foundry
- Command equivalents
- Testing pattern changes
- Deployment workflow changes
- Debugging techniques

## Performance Considerations

### Compilation Speed

Foundry's Rust-based compiler is significantly faster than Hardhat:

- Expected improvement: 5-10x faster compilation
- Incremental compilation for unchanged files
- Parallel compilation of multiple contracts

### Test Execution Speed

Foundry tests run in EVM directly:

- Expected improvement: 10-100x faster test execution
- No JavaScript/TypeScript overhead
- Parallel test execution

### Build Caching

Foundry's caching strategy:

- Cache compiled artifacts in `cache/` directory
- Recompile only changed contracts
- Integrate with Turborepo for monorepo caching

**Key Design Decisions:**

- Leverage Foundry's speed for faster development cycles
- Use parallel test execution for large test suites
- Optimize CI/CD pipelines with faster builds
- Monitor gas usage with Foundry's detailed reporting

## Security Considerations

### Private Key Management

- Use environment variables for private keys
- Never commit private keys to version control
- Use hardware wallets for mainnet deployments
- Implement key rotation procedures

### Dependency Security

- Pin OpenZeppelin version to audited release
- Review git submodule updates carefully
- Use Foundry's built-in security checks
- Run static analysis tools (Slither, Mythril)

### Deployment Security

- Test deployments on testnet first
- Verify contract source code on Basescan
- Use multi-sig wallets for ownership
- Implement timelock for critical operations

**Key Design Decisions:**

- Maintain same security practices as Hardhat setup
- Leverage Foundry's security features
- Document security best practices
- Implement deployment checklists

## Rollback Plan

If migration encounters critical issues:

1. **Immediate Rollback**: Revert to Hardhat by restoring from git
2. **Partial Rollback**: Keep Foundry for testing, use Hardhat for deployment
3. **Gradual Migration**: Migrate one component at a time (tests first, then scripts)

**Rollback Triggers:**

- Critical bugs in Foundry toolchain
- Incompatibility with existing infrastructure
- Significant performance degradation
- Team productivity issues

**Key Design Decisions:**

- Maintain git history for easy rollback
- Test migration thoroughly before removing Hardhat
- Document rollback procedures
- Keep Hardhat configuration as backup initially
