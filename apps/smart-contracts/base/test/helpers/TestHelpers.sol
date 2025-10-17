// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {TodoList} from "../../src/TodoList.sol";

/**
 * @title TestHelpers
 * @dev Shared test utilities for TodoList and TodoListFactory tests
 */
contract TestHelpers is Test {
  /**
   * @dev Generate a string of specified length filled with 'a' characters
   * @param length The length of the string to generate
   * @return The generated string
   */
  function generateString(uint256 length) internal pure returns (string memory) {
    bytes memory buffer = new bytes(length);
    for (uint256 i = 0; i < length; i++) {
      buffer[i] = "a";
    }
    return string(buffer);
  }

  /**
   * @dev Generate a random string of specified length
   * @param length The length of the string to generate
   * @param seed A seed value for randomization
   * @return The generated string
   */
  function generateRandomString(uint256 length, uint256 seed) internal pure returns (string memory) {
    bytes memory buffer = new bytes(length);
    for (uint256 i = 0; i < length; i++) {
      // Generate pseudo-random character (a-z)
      // Use keccak256 to avoid overflow issues with large seeds
      uint256 charCode = 97 + (uint256(keccak256(abi.encodePacked(seed, i))) % 26);
      buffer[i] = bytes1(uint8(charCode));
    }
    return string(buffer);
  }

  /**
   * @dev Create multiple todos for testing
   * @param todoList The TodoList contract instance
   * @param count The number of todos to create
   */
  function createMultipleTodos(TodoList todoList, uint256 count) internal {
    for (uint256 i = 0; i < count; i++) {
      string memory title = string(abi.encodePacked("Todo ", vm.toString(i + 1)));
      string memory description = string(abi.encodePacked("Description ", vm.toString(i + 1)));
      TodoList.Priority priority = TodoList.Priority(i % 3);
      todoList.createTodo(title, description, priority);
    }
  }

  /**
   * @dev Create todos with specific priorities
   * @param todoList The TodoList contract instance
   * @param lowCount Number of low priority todos
   * @param mediumCount Number of medium priority todos
   * @param highCount Number of high priority todos
   */
  function createTodosWithPriorities(
    TodoList todoList,
    uint256 lowCount,
    uint256 mediumCount,
    uint256 highCount
  ) internal {
    for (uint256 i = 0; i < lowCount; i++) {
      todoList.createTodo(
        string(abi.encodePacked("Low Priority ", vm.toString(i + 1))),
        "Description",
        TodoList.Priority.Low
      );
    }
    for (uint256 i = 0; i < mediumCount; i++) {
      todoList.createTodo(
        string(abi.encodePacked("Medium Priority ", vm.toString(i + 1))),
        "Description",
        TodoList.Priority.Medium
      );
    }
    for (uint256 i = 0; i < highCount; i++) {
      todoList.createTodo(
        string(abi.encodePacked("High Priority ", vm.toString(i + 1))),
        "Description",
        TodoList.Priority.High
      );
    }
  }

  /**
   * @dev Complete specific todos by their IDs
   * @param todoList The TodoList contract instance
   * @param todoIds Array of todo IDs to complete
   */
  function completeTodos(TodoList todoList, uint256[] memory todoIds) internal {
    for (uint256 i = 0; i < todoIds.length; i++) {
      todoList.toggleTodoCompletion(todoIds[i]);
    }
  }

  /**
   * @dev Assert that a todo has expected values
   * @param todo The todo to check
   * @param expectedId Expected ID
   * @param expectedTitle Expected title
   * @param expectedCompleted Expected completion status
   * @param expectedPriority Expected priority
   */
  function assertTodoEquals(
    TodoList.Todo memory todo,
    uint256 expectedId,
    string memory expectedTitle,
    bool expectedCompleted,
    TodoList.Priority expectedPriority
  ) internal pure {
    require(todo.id == expectedId, "Todo ID mismatch");
    require(keccak256(bytes(todo.title)) == keccak256(bytes(expectedTitle)), "Todo title mismatch");
    require(todo.completed == expectedCompleted, "Todo completion status mismatch");
    require(todo.priority == expectedPriority, "Todo priority mismatch");
  }

  /**
   * @dev Assert that todo stats match expected values
   * @param stats The stats to check
   * @param expectedTotal Expected total count
   * @param expectedCompleted Expected completed count
   * @param expectedPending Expected pending count
   * @param expectedHighPriority Expected high priority count
   */
  function assertStatsEquals(
    TodoList.TodoStats memory stats,
    uint256 expectedTotal,
    uint256 expectedCompleted,
    uint256 expectedPending,
    uint256 expectedHighPriority
  ) internal pure {
    require(stats.total == expectedTotal, "Stats total mismatch");
    require(stats.completed == expectedCompleted, "Stats completed mismatch");
    require(stats.pending == expectedPending, "Stats pending mismatch");
    require(stats.highPriority == expectedHighPriority, "Stats highPriority mismatch");
  }

  /**
   * @dev Bound a value to valid priority range (0-2)
   * @param value The value to bound
   * @return The bounded value
   */
  function boundPriority(uint256 value) internal pure returns (uint256) {
    return bound(value, 0, 2);
  }

  /**
   * @dev Bound a string length to valid title range (1-100)
   * @param length The length to bound
   * @return The bounded length
   */
  function boundTitleLength(uint256 length) internal pure returns (uint256) {
    return bound(length, 1, 100);
  }

  /**
   * @dev Bound a string length to valid description range (0-500)
   * @param length The length to bound
   * @return The bounded length
   */
  function boundDescriptionLength(uint256 length) internal pure returns (uint256) {
    return bound(length, 0, 500);
  }
}
