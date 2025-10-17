// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {TodoListFactory} from "../src/TodoListFactory.sol";
import {TodoList} from "../src/TodoList.sol";

/**
 * @title CreateTodoListScript
 * @dev Script for creating a TodoList instance via the factory
 * @notice This script creates a new TodoList for the caller using the deployed factory
 *
 * Usage:
 *   forge script script/CreateTodoList.s.sol:CreateTodoListScript \
 *     --rpc-url <network> \
 *     --broadcast \
 *     --sig "run(address)" <factory_address>
 *
 * Examples:
 *   # Create TodoList on local Anvil node
 *   forge script script/CreateTodoList.s.sol:CreateTodoListScript \
 *     --rpc-url localhost \
 *     --broadcast \
 *     --sig "run(address)" 0x5FbDB2315678afecb367f032d93F642f64180aa3
 *
 *   # Create TodoList on Base Sepolia
 *   forge script script/CreateTodoList.s.sol:CreateTodoListScript \
 *     --rpc-url base_sepolia \
 *     --broadcast \
 *     --sig "run(address)" 0x...
 */
contract CreateTodoListScript is Script {
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
    _createTodoList(factoryAddress);
  }

  /**
   * @dev Internal function to create a TodoList
   * @param factoryAddress The address of the TodoListFactory contract
   */
  function _createTodoList(address factoryAddress) internal {
    // Get user private key from environment
    uint256 userPrivateKey = vm.envUint("BASE_PRIVATE_KEY");
    address user = vm.addr(userPrivateKey);

    console2.log("===========================================");
    console2.log("Creating TodoList");
    console2.log("===========================================");
    console2.log("Factory address:", factoryAddress);
    console2.log("User address:", user);
    console2.log("Chain ID:", block.chainid);
    console2.log("===========================================");

    // Get factory contract
    TodoListFactory factory = TodoListFactory(factoryAddress);

    // Start broadcasting transactions
    vm.startBroadcast(userPrivateKey);

    // Check if user already has a TodoList
    address existingTodoList = factory.getTodoList();
    if (existingTodoList != address(0)) {
      vm.stopBroadcast();
      console2.log("");
      console2.log("User already has a TodoList at:", existingTodoList);
      console2.log("Skipping creation.");
      return;
    }

    // Create TodoList
    address todoListAddress = factory.createTodoList();

    // Stop broadcasting
    vm.stopBroadcast();

    // Get the TodoList contract
    TodoList todoList = TodoList(todoListAddress);

    // Log creation information
    console2.log("");
    console2.log("===========================================");
    console2.log("TodoList Created!");
    console2.log("===========================================");
    console2.log("TodoList address:", todoListAddress);
    console2.log("TodoList owner:", todoList.owner());
    console2.log("Block number:", block.number);
    console2.log("===========================================");

    // Save TodoList information
    _saveTodoListInfo(user, todoListAddress);
  }

  /**
   * @dev Save TodoList information to a JSON file
   * @param userAddress The address of the user
   * @param todoListAddress The address of the created TodoList
   */
  function _saveTodoListInfo(address userAddress, address todoListAddress) internal {
    string memory chainId = vm.toString(block.chainid);
    string memory deploymentDir = string.concat("deployments/", chainId);

    // Create deployment directory if it doesn't exist
    string[] memory mkdirCmd = new string[](3);
    mkdirCmd[0] = "mkdir";
    mkdirCmd[1] = "-p";
    mkdirCmd[2] = deploymentDir;
    vm.ffi(mkdirCmd);

    // Build JSON content
    string memory json = string.concat(
      "{\n",
      '  "user": "',
      vm.toString(userAddress),
      '",\n',
      '  "todoList": "',
      vm.toString(todoListAddress),
      '",\n',
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
    string memory fileName = string.concat("TodoList-", vm.toString(userAddress), ".json");
    string memory filePath = string.concat(deploymentDir, "/", fileName);
    vm.writeFile(filePath, json);

    console2.log("");
    console2.log("TodoList info saved to:", filePath);
  }
}
