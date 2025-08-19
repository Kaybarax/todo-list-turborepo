// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TodoList.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TodoListFactory
 * @dev A factory contract for deploying TodoList contracts on Base
 * @notice This contract is deployed on Base, an Ethereum L2 optimistic rollup
 */
contract TodoListFactory is Ownable {
  // Mapping from user address to their TodoList contract
  mapping(address => TodoList) public userTodoLists;

  // Array of all users who have created TodoLists
  address[] public users;

  // Events
  event TodoListCreated(address indexed user, address todoList);

  /**
   * @dev Constructor that sets the contract owner
   */
  constructor() {
    _transferOwnership(msg.sender);
  }

  /**
   * @dev Create a new TodoList contract for the caller
   * @return The address of the created TodoList contract
   */
  function createTodoList() external returns (address) {
    require(address(userTodoLists[msg.sender]) == address(0), "TodoList already exists for this user");

    // Create new TodoList contract
    TodoList todoList = new TodoList();

    // Transfer ownership to the user
    todoList.transferOwnership(msg.sender);

    // Store the TodoList contract
    userTodoLists[msg.sender] = todoList;
    users.push(msg.sender);

    // Emit event
    emit TodoListCreated(msg.sender, address(todoList));

    return address(todoList);
  }

  /**
   * @dev Get the TodoList contract for the caller
   * @return The address of the caller's TodoList contract
   */
  function getTodoList() external view returns (address) {
    return address(userTodoLists[msg.sender]);
  }

  /**
   * @dev Get the TodoList contract for a specific user
   * @param user The address of the user
   * @return The address of the user's TodoList contract
   */
  function getTodoListForUser(address user) external view returns (address) {
    return address(userTodoLists[user]);
  }

  /**
   * @dev Get the number of users who have created TodoLists
   * @return The number of users
   */
  function getUserCount() external view returns (uint256) {
    return users.length;
  }

  /**
   * @dev Get a list of users who have created TodoLists
   * @param offset The starting index
   * @param limit The maximum number of users to return
   * @return Array of user addresses
   */
  function getUsers(uint256 offset, uint256 limit) external view returns (address[] memory) {
    uint256 totalUsers = users.length;

    if (offset >= totalUsers) {
      return new address[](0);
    }

    uint256 count = (offset + limit > totalUsers) ? totalUsers - offset : limit;
    address[] memory result = new address[](count);

    for (uint256 i = 0; i < count; i++) {
      result[i] = users[offset + i];
    }

    return result;
  }
}
