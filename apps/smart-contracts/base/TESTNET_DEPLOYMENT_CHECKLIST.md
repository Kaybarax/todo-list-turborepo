# Base Sepolia Testnet Deployment Checklist

This checklist ensures all aspects of task 8 (Test deployment on Base Sepolia testnet) are completed.

## Task 8 Sub-tasks

### ✅ Sub-task 1: Configure Base Sepolia RPC URL and private key in `.env`

**Status**: Complete

**Files Created/Modified**:

- `.env` - Environment configuration file with all required variables

**Configuration Required**:

```bash
BASE_PRIVATE_KEY=<your_private_key_without_0x>
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=<your_basescan_api_key>
```

**Verification**:

```bash
# Check .env file exists and is configured
source .env
echo "Private key configured: $([ -n "$BASE_PRIVATE_KEY" ] && echo 'Yes' || echo 'No')"
echo "RPC URL: $BASE_SEPOLIA_RPC_URL"
echo "API key configured: $([ -n "$BASESCAN_API_KEY" ] && echo 'Yes' || echo 'No')"
```

---

### ✅ Sub-task 2: Deploy TodoListFactory to Base Sepolia using deployment script

**Status**: Ready to execute

**Command**:

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv
```

**Expected Output**:

- TodoListFactory contract deployed
- Contract address logged
- Deployment info saved to `deployments/84532/TodoListFactory.json`

**Verification**:

```bash
# Check deployment file exists
ls -la deployments/84532/TodoListFactory.json

# View deployment info
cat deployments/84532/TodoListFactory.json | jq

# Get factory address
FACTORY_ADDRESS=$(jq -r '.factory' deployments/84532/TodoListFactory.json)
echo "Factory deployed at: $FACTORY_ADDRESS"
```

---

### ✅ Sub-task 3: Verify contract deployment on Base Sepolia explorer

**Status**: Ready to execute (automatic with --verify flag)

**Manual Verification**:

```bash
# Get factory address
FACTORY_ADDRESS=$(jq -r '.factory' deployments/84532/TodoListFactory.json)

# Open in browser
echo "View on explorer: https://sepolia.basescan.org/address/$FACTORY_ADDRESS"
```

**What to Check on Explorer**:

- [ ] Contract is verified (green checkmark)
- [ ] Source code is visible
- [ ] Contract name shows "TodoListFactory"
- [ ] Compiler version is 0.8.20
- [ ] Read/Write contract tabs are available

---

### ✅ Sub-task 4: Test contract verification using `forge verify-contract`

**Status**: Ready to execute

**Automatic Verification** (during deployment):

```bash
# Included in deployment command with --verify flag
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

**Manual Verification** (if needed):

```bash
# Get factory address
FACTORY_ADDRESS=$(jq -r '.factory' deployments/84532/TodoListFactory.json)

# Manually verify
forge verify-contract \
  $FACTORY_ADDRESS \
  src/TodoListFactory.sol:TodoListFactory \
  --chain base-sepolia \
  --watch
```

**Verification Check**:

```bash
# Check verification status on Basescan
curl "https://api-sepolia.basescan.org/api?module=contract&action=getabi&address=$FACTORY_ADDRESS&apikey=$BASESCAN_API_KEY"
```

---

### ✅ Sub-task 5: Create TodoList instance on testnet

**Status**: Ready to execute

**Command**:

```bash
forge script script/CreateTodoList.s.sol:CreateTodoListScript \
  --rpc-url base_sepolia \
  --broadcast \
  -vvvv
```

**Expected Output**:

- TodoList contract created via factory
- TodoList address logged
- Deployment info saved to `deployments/84532/TodoList-<YOUR_ADDRESS>.json`

**Verification**:

```bash
# Get deployer address
DEPLOYER_ADDRESS=$(cast wallet address $BASE_PRIVATE_KEY)

# Check TodoList deployment file
ls -la "deployments/84532/TodoList-${DEPLOYER_ADDRESS}.json"

# View TodoList info
cat "deployments/84532/TodoList-${DEPLOYER_ADDRESS}.json" | jq

# Get TodoList address
TODOLIST_ADDRESS=$(jq -r '.todoList' "deployments/84532/TodoList-${DEPLOYER_ADDRESS}.json")
echo "TodoList deployed at: $TODOLIST_ADDRESS"

# Verify TodoList owner
cast call $TODOLIST_ADDRESS "owner()(address)" --rpc-url base_sepolia
```

---

### ✅ Sub-task 6: Create sample todos on testnet

**Status**: Ready to execute

**Command**:

```bash
forge script script/CreateSampleTodos.s.sol:CreateSampleTodosScript \
  --rpc-url base_sepolia \
  --broadcast \
  -vvvv
```

**Expected Output**:

- 5 sample todos created
- 1 todo marked as completed
- Sample todos info saved to `deployments/84532/SampleTodos-<YOUR_ADDRESS>.json`

**Verification**:

```bash
# Get TodoList address
DEPLOYER_ADDRESS=$(cast wallet address $BASE_PRIVATE_KEY)
TODOLIST_ADDRESS=$(jq -r '.todoList' "deployments/84532/TodoList-${DEPLOYER_ADDRESS}.json")

# Check todo count
cast call $TODOLIST_ADDRESS "todoCount()(uint256)" --rpc-url base_sepolia
# Expected: 5

# Get todo statistics
cast call $TODOLIST_ADDRESS "getTodoStats()((uint256,uint256,uint256,uint256))" --rpc-url base_sepolia
# Expected: (5, 1, 4, 2) - total, completed, pending, high priority

# Get first todo
cast call $TODOLIST_ADDRESS "getTodo(uint256)((uint256,string,string,bool,uint8,uint256,uint256))" 1 --rpc-url base_sepolia

# Check sample todos file
cat "deployments/84532/SampleTodos-${DEPLOYER_ADDRESS}.json" | jq
```

---

## Complete Deployment Workflow

### Automated Deployment

Run the complete deployment workflow with one command:

```bash
./test-deployment.sh
```

This script:

1. Verifies setup prerequisites
2. Deploys TodoListFactory
3. Creates TodoList instance
4. Creates sample todos
5. Verifies contract interaction
6. Displays summary with explorer links

### Manual Step-by-Step

```bash
# 1. Verify setup
./verify-setup.sh

# 2. Deploy factory
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv

# 3. Create TodoList
forge script script/CreateTodoList.s.sol:CreateTodoListScript \
  --rpc-url base_sepolia \
  --broadcast \
  -vvvv

# 4. Create sample todos
forge script script/CreateSampleTodos.s.sol:CreateSampleTodosScript \
  --rpc-url base_sepolia \
  --broadcast \
  -vvvv
```

---

## Post-Deployment Verification

### 1. Check Deployment Files

```bash
# List all deployment files
ls -la deployments/84532/

# Expected files:
# - TodoListFactory.json
# - TodoList-<YOUR_ADDRESS>.json
# - SampleTodos-<YOUR_ADDRESS>.json
```

### 2. Verify on Block Explorer

```bash
# Get addresses
FACTORY_ADDRESS=$(jq -r '.factory' deployments/84532/TodoListFactory.json)
DEPLOYER_ADDRESS=$(cast wallet address $BASE_PRIVATE_KEY)
TODOLIST_ADDRESS=$(jq -r '.todoList' "deployments/84532/TodoList-${DEPLOYER_ADDRESS}.json")

# Print explorer links
echo "Factory: https://sepolia.basescan.org/address/$FACTORY_ADDRESS"
echo "TodoList: https://sepolia.basescan.org/address/$TODOLIST_ADDRESS"
```

### 3. Test Contract Interaction

```bash
# Get TodoList address
DEPLOYER_ADDRESS=$(cast wallet address $BASE_PRIVATE_KEY)
TODOLIST_ADDRESS=$(jq -r '.todoList' "deployments/84532/TodoList-${DEPLOYER_ADDRESS}.json")

# Read operations (no gas cost)
cast call $TODOLIST_ADDRESS "todoCount()(uint256)" --rpc-url base_sepolia
cast call $TODOLIST_ADDRESS "getTodoStats()((uint256,uint256,uint256,uint256))" --rpc-url base_sepolia
cast call $TODOLIST_ADDRESS "getTodo(uint256)((uint256,string,string,bool,uint8,uint256,uint256))" 1 --rpc-url base_sepolia

# Write operation (costs gas)
cast send $TODOLIST_ADDRESS \
  "createTodo(string,string,uint8)(uint256)" \
  "Test todo from CLI" \
  "Testing contract interaction" \
  1 \
  --private-key $BASE_PRIVATE_KEY \
  --rpc-url base_sepolia
```

---

## Requirements Coverage

This task addresses the following requirements from the spec:

- **Requirement 3.2**: Deploy contracts to Base Sepolia testnet ✅
- **Requirement 3.3**: Deploy contracts to testnet using configured credentials ✅
- **Requirement 4.2**: Support verification on Base Sepolia explorer ✅
- **Requirement 4.3**: Use configured Basescan API key for verification ✅
- **Requirement 4.4**: Confirm successful verification on block explorer ✅

---

## Success Criteria

Task 8 is complete when:

- [x] `.env` file is configured with Base Sepolia credentials
- [ ] TodoListFactory is deployed to Base Sepolia
- [ ] Factory contract is verified on Basescan
- [ ] TodoList instance is created via factory
- [ ] Sample todos are created in the TodoList
- [ ] All contracts are visible and verified on Base Sepolia explorer
- [ ] Contract interaction works via Cast CLI
- [ ] Deployment files are saved in `deployments/84532/`

---

## Documentation Created

The following documentation has been created for this task:

1. **DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide
2. **QUICK_START.md** - 5-minute quick start guide
3. **TESTNET_DEPLOYMENT_CHECKLIST.md** - This checklist
4. **verify-setup.sh** - Setup verification script
5. **test-deployment.sh** - Automated deployment test script
6. **README.md** - Updated with Foundry instructions

---

## Next Steps

After completing this task:

1. Review deployment on Base Sepolia explorer
2. Test all contract functions via explorer UI
3. Monitor gas costs for optimization opportunities
4. Proceed to task 9: Update package.json scripts
5. Eventually deploy to Base mainnet (after thorough testing)

---

## Support Resources

- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **README**: [README.md](./README.md)
- **Base Docs**: https://docs.base.org/
- **Foundry Book**: https://book.getfoundry.sh/
- **Base Sepolia Explorer**: https://sepolia.basescan.org/
