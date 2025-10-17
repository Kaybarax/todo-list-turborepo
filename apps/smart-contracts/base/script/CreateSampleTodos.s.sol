// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {TodoListFactory} from "../src/TodoListFactory.sol";
import {TodoList} from "../src/TodoList.sol";

/**
 * @title CreateSampleTodosScript
 * @dev Script for creating sample todo items in a user's TodoList
 * @notice This script creates sample todos for testing and demonstration purposes
 *
 * Usage:
 *   forge script script/CreateSampleTodos.s.sol:CreateSampleTodosScript \
 *     --rpc-url <network> \
 *     --broadcast \
 *     --sig "run(address)" <factory_address>
 *
 * Examples:
 *   # Create sample todos on local Anvil node
 *   forge script script/CreateSampleTodos.s.sol:CreateSampleTodosScript \
 *     --rpc-url localhost \
 *     --broadcast \
 *     --sig "run(address)" 0x5FbDB2315678afecb367f032d93F642f64180aa3
 *
 *   # Create sample todos on Base Sepolia
 *   forge script script/CreateSampleTodos.s.sol:CreateSampleTodosScript \
 *     --rpc-url base_sepolia \
 *     --broadcast \
 *     --sig "run(address)" 0x...
 */
contract CreateSampleTodosScript is Script {
  /**
   * @dev Run the script with factory address from deployment file
   */
  function run() external {
    // Load factory address from deployment file
    string memory chainId = vm.toString(block.chainid);
    string memory filePath = string.concat("deployments/", chainId, "/TodoListFactory.json");

    string memory json = vm.readFile(filePath);
    address factoryAddress = vm.parseJsonAddress(json, ".factory");

    console2.log("Loaded factory address from:", filePath);
    _createSampleTodos(factoryAddress);
  }

  /**
   * @dev Internal function to create sample todos
   * @param factoryAddress The address of the TodoListFactory contract
   */
  function _createSampleTodos(address factoryAddress) internal {
    // Get user private key from environment
    uint256 userPrivateKey = vm.envUint("BASE_PRIVATE_KEY");
    address user = vm.addr(userPrivateKey);

    console2.log("===========================================");
    console2.log("Creating Sample Todos");
    console2.log("===========================================");
    console2.log("Factory address:", factoryAddress);
    console2.log("User address:", user);
    console2.log("Chain ID:", block.chainid);
    console2.log("===========================================");

    // Get factory contract
    TodoListFactory factory = TodoListFactory(factoryAddress);

    // Start broadcasting transactions
    vm.startBroadcast(userPrivateKey);

    // Get user's TodoList
    address todoListAddress = factory.getTodoList();
    if (todoListAddress == address(0)) {
      vm.stopBroadcast();
      console2.log("");
      console2.log("ERROR: User does not have a TodoList.");
      console2.log("Please run CreateTodoList.s.sol first.");
      revert("TodoList not found");
    }

    console2.log("TodoList address:", todoListAddress);

    // Get the TodoList contract
    TodoList todoList = TodoList(todoListAddress);

    // Create sample todos
    uint256[] memory todoIds = new uint256[](5);

    console2.log("");
    console2.log("Creating sample todos...");

    // Todo 1: High priority
    todoIds[0] = todoList.createTodo(
      "Deploy smart contracts to Base mainnet",
      "Complete the deployment of TodoList contracts to Base mainnet with proper verification",
      TodoList.Priority.High
    );
    console2.log("Created todo #", todoIds[0], "- High priority");

    // Todo 2: Medium priority
    todoIds[1] = todoList.createTodo(
      "Write comprehensive documentation",
      "Document all contract functions, deployment procedures, and usage examples",
      TodoList.Priority.Medium
    );
    console2.log("Created todo #", todoIds[1], "- Medium priority");

    // Todo 3: Low priority
    todoIds[2] = todoList.createTodo(
      "Set up monitoring and alerts",
      "Configure monitoring for contract events and set up alerts for critical operations",
      TodoList.Priority.Low
    );
    console2.log("Created todo #", todoIds[2], "- Low priority");

    // Todo 4: High priority
    todoIds[3] = todoList.createTodo(
      "Conduct security audit",
      "Engage a professional security firm to audit the smart contracts before mainnet launch",
      TodoList.Priority.High
    );
    console2.log("Created todo #", todoIds[3], "- High priority");

    // Todo 5: Medium priority (completed)
    todoIds[4] = todoList.createTodo(
      "Migrate from Hardhat to Foundry",
      "Complete the migration of Base contracts from Hardhat to Foundry framework",
      TodoList.Priority.Medium
    );
    console2.log("Created todo #", todoIds[4], "- Medium priority");

    // Mark the last todo as completed
    todoList.toggleTodoCompletion(todoIds[4]);
    console2.log("Marked todo #", todoIds[4], "as completed");

    // Get and display statistics (before stopping broadcast)
    TodoList.TodoStats memory stats = todoList.getTodoStats();

    // Stop broadcasting
    vm.stopBroadcast();

    console2.log("");
    console2.log("===========================================");
    console2.log("Sample Todos Created!");
    console2.log("===========================================");
    console2.log("Total todos:", stats.total);
    console2.log("Completed:", stats.completed);
    console2.log("Pending:", stats.pending);
    console2.log("High priority pending:", stats.highPriority);
    console2.log("Block number:", block.number);
    console2.log("===========================================");

    // Save sample todos information
    _saveSampleTodosInfo(user, todoListAddress, todoIds);
  }

  /**
   * @dev Save sample todos information to a JSON file
   * @param userAddress The address of the user
   * @param todoListAddress The address of the TodoList
   * @param todoIds Array of created todo IDs
   */
  function _saveSampleTodosInfo(address userAddress, address todoListAddress, uint256[] memory todoIds) internal {
    string memory chainId = vm.toString(block.chainid);
    string memory deploymentDir = string.concat("deployments/", chainId);

    // Create deployment directory if it doesn't exist
    string[] memory mkdirCmd = new string[](3);
    mkdirCmd[0] = "mkdir";
    mkdirCmd[1] = "-p";
    mkdirCmd[2] = deploymentDir;
    vm.ffi(mkdirCmd);

    // Build todo IDs array string
    string memory todoIdsStr = "[";
    for (uint256 i = 0; i < todoIds.length; i++) {
      todoIdsStr = string.concat(todoIdsStr, vm.toString(todoIds[i]));
      if (i < todoIds.length - 1) {
        todoIdsStr = string.concat(todoIdsStr, ", ");
      }
    }
    todoIdsStr = string.concat(todoIdsStr, "]");

    // Build JSON content
    string memory json = string.concat(
      "{\n",
      '  "user": "',
      vm.toString(userAddress),
      '",\n',
      '  "todoList": "',
      vm.toString(todoListAddress),
      '",\n',
      '  "todoIds": ',
      todoIdsStr,
      ",\n",
      '  "chainId": ',
      chainId,
      ",\n",
      '  "blockNumber": ',
      vm.toString(block.number),
      ",\n",
      '  "timestamp": ',
      vm.toString(block.timestamp),
      "\n",
      "}"
    );

    // Write to file
    string memory fileName = string.concat("SampleTodos-", vm.toString(userAddress), ".json");
    string memory filePath = string.concat(deploymentDir, "/", fileName);
    vm.writeFile(filePath, json);

    console2.log("");
    console2.log("Sample todos info saved to:", filePath);
  }
}
