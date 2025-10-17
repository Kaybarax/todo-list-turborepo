// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {TodoListFactory} from "../src/TodoListFactory.sol";

/**
 * @title DeployScript
 * @dev Deployment script for TodoListFactory contract
 * @notice This script deploys the TodoListFactory contract to the specified network
 *
 * Usage:
 *   forge script script/Deploy.s.sol:DeployScript --rpc-url <network> --broadcast --verify
 *
 * Examples:
 *   # Deploy to local Anvil node
 *   forge script script/Deploy.s.sol:DeployScript --rpc-url localhost --broadcast
 *
 *   # Deploy to Base Sepolia testnet
 *   forge script script/Deploy.s.sol:DeployScript --rpc-url base_sepolia --broadcast --verify
 *
 *   # Deploy to Base mainnet
 *   forge script script/Deploy.s.sol:DeployScript --rpc-url base --broadcast --verify
 */
contract DeployScript is Script {
  function run() external {
    // Get deployer private key from environment
    uint256 deployerPrivateKey = vm.envUint("BASE_PRIVATE_KEY");
    address deployer = vm.addr(deployerPrivateKey);

    console2.log("===========================================");
    console2.log("Deploying TodoListFactory");
    console2.log("===========================================");
    console2.log("Deployer address:", deployer);
    console2.log("Chain ID:", block.chainid);
    console2.log("===========================================");

    // Start broadcasting transactions
    vm.startBroadcast(deployerPrivateKey);

    // Deploy TodoListFactory
    TodoListFactory factory = new TodoListFactory();

    // Stop broadcasting
    vm.stopBroadcast();

    // Log deployment information
    console2.log("");
    console2.log("===========================================");
    console2.log("Deployment Complete!");
    console2.log("===========================================");
    console2.log("TodoListFactory deployed to:", address(factory));
    console2.log("Factory owner:", factory.owner());
    console2.log("Block number:", block.number);
    console2.log("===========================================");

    // Save deployment information to JSON file
    _saveDeploymentInfo(address(factory), deployer);
  }

  /**
   * @dev Save deployment information to a JSON file
   * @param factoryAddress The address of the deployed factory
   * @param deployerAddress The address of the deployer
   */
  function _saveDeploymentInfo(address factoryAddress, address deployerAddress) internal {
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
      '  "factory": "',
      vm.toString(factoryAddress),
      '",\n',
      '  "deployer": "',
      vm.toString(deployerAddress),
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
    string memory filePath = string.concat(deploymentDir, "/TodoListFactory.json");
    vm.writeFile(filePath, json);

    console2.log("");
    console2.log("Deployment info saved to:", filePath);
  }
}
