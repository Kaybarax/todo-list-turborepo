// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {TodoList} from "../src/TodoList.sol";
import {TestHelpers} from "./helpers/TestHelpers.sol";

/**
 * @title TodoListFuzzTest
 * @dev Fuzz tests and property-based tests for TodoList contract
 */
contract TodoListFuzzTest is TestHelpers {
  TodoList public todoList;
  address public user;

  function setUp() public {
    user = address(0x1);
    vm.deal(user, 100 ether);

    vm.prank(user);
    todoList = new TodoList();
  }

  // ============ Fuzz Tests for Input Validation ============

  /**
   * @dev Fuzz test: Creating todos with valid title lengths should always succeed
   */
  function testFuzz_CreateTodo_ValidTitleLength(uint256 titleLength, uint256 seed) public {
    // Bound title length to valid range (1-100)
    titleLength = boundTitleLength(titleLength);

    string memory title = generateRandomString(titleLength, seed);
    string memory description = "Test Description";

    vm.prank(user);
    uint256 todoId = todoList.createTodo(title, description, TodoList.Priority.Medium);

    // Verify todo was created
    assertGt(todoId, 0);

    vm.prank(user);
    TodoList.Todo memory todo = todoList.getTodo(todoId);
    assertEq(keccak256(bytes(todo.title)), keccak256(bytes(title)));
  }

  /**
   * @dev Fuzz test: Creating todos with valid description lengths should always succeed
   */
  function testFuzz_CreateTodo_ValidDescriptionLength(uint256 descriptionLength, uint256 seed) public {
    // Bound description length to valid range (0-500)
    descriptionLength = boundDescriptionLength(descriptionLength);

    string memory title = "Test Title";
    string memory description = generateRandomString(descriptionLength, seed);

    vm.prank(user);
    uint256 todoId = todoList.createTodo(title, description, TodoList.Priority.Medium);

    // Verify todo was created
    assertGt(todoId, 0);

    vm.prank(user);
    TodoList.Todo memory todo = todoList.getTodo(todoId);
    assertEq(keccak256(bytes(todo.description)), keccak256(bytes(description)));
  }

  /**
   * @dev Fuzz test: Creating todos with any valid priority should succeed
   */
  function testFuzz_CreateTodo_ValidPriority(uint256 priorityValue) public {
    // Bound priority to valid range (0-2)
    priorityValue = boundPriority(priorityValue);

    vm.prank(user);
    uint256 todoId = todoList.createTodo("Test Title", "Test Description", TodoList.Priority(priorityValue));

    // Verify todo was created with correct priority
    vm.prank(user);
    TodoList.Todo memory todo = todoList.getTodo(todoId);
    assertEq(uint256(todo.priority), priorityValue);
  }

  /**
   * @dev Fuzz test: Creating todos with title length > 100 should always revert
   */
  function testFuzz_CreateTodo_TitleTooLong(uint256 titleLength, uint256 seed) public {
    // Ensure title length is > 100
    titleLength = bound(titleLength, 101, 1000);

    string memory title = generateRandomString(titleLength, seed);

    vm.prank(user);
    vm.expectRevert(TodoList.TitleTooLong.selector);
    todoList.createTodo(title, "Description", TodoList.Priority.Medium);
  }

  /**
   * @dev Fuzz test: Creating todos with description length > 500 should always revert
   */
  function testFuzz_CreateTodo_DescriptionTooLong(uint256 descriptionLength, uint256 seed) public {
    // Ensure description length is > 500
    descriptionLength = bound(descriptionLength, 501, 2000);

    string memory description = generateRandomString(descriptionLength, seed);

    vm.prank(user);
    vm.expectRevert(TodoList.DescriptionTooLong.selector);
    todoList.createTodo("Title", description, TodoList.Priority.Medium);
  }

  /**
   * @dev Fuzz test: Updating todos with valid title lengths should always succeed
   */
  function testFuzz_UpdateTodo_ValidTitleLength(uint256 titleLength, uint256 seed) public {
    // Create initial todo
    vm.prank(user);
    uint256 todoId = todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    // Bound title length to valid range (1-100)
    titleLength = boundTitleLength(titleLength);
    string memory newTitle = generateRandomString(titleLength, seed);

    vm.prank(user);
    todoList.updateTodo(todoId, newTitle, "", type(uint256).max);

    // Verify update
    vm.prank(user);
    TodoList.Todo memory todo = todoList.getTodo(todoId);
    assertEq(keccak256(bytes(todo.title)), keccak256(bytes(newTitle)));
  }

  /**
   * @dev Fuzz test: Updating todos with valid description lengths should always succeed
   */
  function testFuzz_UpdateTodo_ValidDescriptionLength(uint256 descriptionLength, uint256 seed) public {
    // Create initial todo
    vm.prank(user);
    uint256 todoId = todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    // Bound description length to valid range (1-500)
    descriptionLength = bound(descriptionLength, 1, 500);
    string memory newDescription = generateRandomString(descriptionLength, seed);

    vm.prank(user);
    todoList.updateTodo(todoId, "", newDescription, type(uint256).max);

    // Verify update
    vm.prank(user);
    TodoList.Todo memory todo = todoList.getTodo(todoId);
    assertEq(keccak256(bytes(todo.description)), keccak256(bytes(newDescription)));
  }

  // ============ Property-Based Tests for Invariants ============

  /**
   * @dev Invariant: Total todos should always equal completed + pending
   */
  function testFuzz_Invariant_TotalEqualsCompletedPlusPending(uint8 todoCount, uint8 completedCount) public {
    // Bound counts to reasonable ranges
    todoCount = uint8(bound(todoCount, 1, 20));
    completedCount = uint8(bound(completedCount, 0, todoCount));

    // Create todos
    vm.startPrank(user);
    for (uint256 i = 0; i < todoCount; i++) {
      todoList.createTodo(string(abi.encodePacked("Todo ", vm.toString(i))), "Description", TodoList.Priority.Medium);
    }

    // Complete some todos
    for (uint256 i = 0; i < completedCount; i++) {
      todoList.toggleTodoCompletion(i + 1);
    }

    // Check invariant
    TodoList.TodoStats memory stats = todoList.getTodoStats();
    assertEq(stats.total, stats.completed + stats.pending);
    assertEq(stats.total, todoCount);
    assertEq(stats.completed, completedCount);
    vm.stopPrank();
  }

  /**
   * @dev Invariant: Todo IDs should always be sequential and start from 1
   */
  function testFuzz_Invariant_TodoIDsAreSequential(uint8 todoCount) public {
    // Bound count to reasonable range
    todoCount = uint8(bound(todoCount, 1, 30));

    vm.startPrank(user);
    for (uint256 i = 0; i < todoCount; i++) {
      uint256 todoId = todoList.createTodo(
        string(abi.encodePacked("Todo ", vm.toString(i))),
        "Description",
        TodoList.Priority.Medium
      );
      // Verify ID is sequential
      assertEq(todoId, i + 1);
    }
    vm.stopPrank();
  }

  /**
   * @dev Invariant: Completed todos should have non-zero completedAt timestamp
   */
  function testFuzz_Invariant_CompletedTodosHaveTimestamp(uint8 todoCount) public {
    // Bound count to reasonable range
    todoCount = uint8(bound(todoCount, 1, 20));

    vm.startPrank(user);
    // Create todos
    for (uint256 i = 0; i < todoCount; i++) {
      todoList.createTodo(string(abi.encodePacked("Todo ", vm.toString(i))), "Description", TodoList.Priority.Medium);
    }

    // Complete all todos and verify timestamps
    for (uint256 i = 0; i < todoCount; i++) {
      todoList.toggleTodoCompletion(i + 1);
      TodoList.Todo memory todo = todoList.getTodo(i + 1);
      assertTrue(todo.completed);
      assertGt(todo.completedAt, 0);
    }
    vm.stopPrank();
  }

  /**
   * @dev Invariant: Uncompleted todos should have zero completedAt timestamp
   */
  function testFuzz_Invariant_UncompletedTodosHaveZeroTimestamp(uint8 todoCount, uint8 completedCount) public {
    // Bound counts
    todoCount = uint8(bound(todoCount, 2, 20));
    completedCount = uint8(bound(completedCount, 1, todoCount - 1));

    vm.startPrank(user);
    // Create todos
    for (uint256 i = 0; i < todoCount; i++) {
      todoList.createTodo(string(abi.encodePacked("Todo ", vm.toString(i))), "Description", TodoList.Priority.Medium);
    }

    // Complete some todos
    for (uint256 i = 0; i < completedCount; i++) {
      todoList.toggleTodoCompletion(i + 1);
    }

    // Verify uncompleted todos have zero timestamp
    for (uint256 i = completedCount; i < todoCount; i++) {
      TodoList.Todo memory todo = todoList.getTodo(i + 1);
      assertFalse(todo.completed);
      assertEq(todo.completedAt, 0);
    }
    vm.stopPrank();
  }

  /**
   * @dev Invariant: High priority count should only include uncompleted high priority todos
   */
  function testFuzz_Invariant_HighPriorityCountOnlyUncompleted(
    uint8 highCount,
    uint8 mediumCount,
    uint8 completedHighCount
  ) public {
    // Bound counts
    highCount = uint8(bound(highCount, 1, 15));
    mediumCount = uint8(bound(mediumCount, 0, 15));
    completedHighCount = uint8(bound(completedHighCount, 0, highCount));

    vm.startPrank(user);

    // Create high priority todos
    for (uint256 i = 0; i < highCount; i++) {
      todoList.createTodo(
        string(abi.encodePacked("High Priority ", vm.toString(i))),
        "Description",
        TodoList.Priority.High
      );
    }

    // Create medium priority todos
    for (uint256 i = 0; i < mediumCount; i++) {
      todoList.createTodo(
        string(abi.encodePacked("Medium Priority ", vm.toString(i))),
        "Description",
        TodoList.Priority.Medium
      );
    }

    // Complete some high priority todos
    for (uint256 i = 0; i < completedHighCount; i++) {
      todoList.toggleTodoCompletion(i + 1);
    }

    // Check invariant
    TodoList.TodoStats memory stats = todoList.getTodoStats();
    assertEq(stats.highPriority, highCount - completedHighCount);
    vm.stopPrank();
  }

  /**
   * @dev Invariant: UpdatedAt timestamp should always be >= createdAt timestamp
   */
  function testFuzz_Invariant_UpdatedAtGreaterThanCreatedAt(uint8 todoCount, uint8 updateCount) public {
    // Bound counts
    todoCount = uint8(bound(todoCount, 1, 20));
    updateCount = uint8(bound(updateCount, 0, todoCount));

    vm.startPrank(user);

    // Create todos
    for (uint256 i = 0; i < todoCount; i++) {
      todoList.createTodo(string(abi.encodePacked("Todo ", vm.toString(i))), "Description", TodoList.Priority.Medium);
    }

    // Advance time
    vm.warp(block.timestamp + 1000);

    // Update some todos
    for (uint256 i = 0; i < updateCount; i++) {
      todoList.updateTodo(i + 1, string(abi.encodePacked("Updated ", vm.toString(i))), "", type(uint256).max);
    }

    // Verify invariant for all todos
    for (uint256 i = 0; i < todoCount; i++) {
      TodoList.Todo memory todo = todoList.getTodo(i + 1);
      assertGe(todo.updatedAt, todo.createdAt);
    }
    vm.stopPrank();
  }

  /**
   * @dev Invariant: Deleting todos should maintain array integrity
   */
  function testFuzz_Invariant_DeleteMaintainsArrayIntegrity(uint8 todoCount, uint8 deleteIndex) public {
    // Bound counts
    todoCount = uint8(bound(todoCount, 2, 20));
    deleteIndex = uint8(bound(deleteIndex, 0, todoCount - 1));

    vm.startPrank(user);

    // Create todos
    uint256[] memory todoIds = new uint256[](todoCount);
    for (uint256 i = 0; i < todoCount; i++) {
      todoIds[i] = todoList.createTodo(
        string(abi.encodePacked("Todo ", vm.toString(i))),
        "Description",
        TodoList.Priority.Medium
      );
    }

    // Delete a todo
    todoList.deleteTodo(todoIds[deleteIndex]);

    // Verify remaining todos are still accessible
    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(todos.length, todoCount - 1);

    // Verify we can still access all remaining todos by their IDs
    for (uint256 i = 0; i < todoCount; i++) {
      if (i != deleteIndex) {
        TodoList.Todo memory todo = todoList.getTodo(todoIds[i]);
        assertEq(todo.id, todoIds[i]);
      }
    }
    vm.stopPrank();
  }

  /**
   * @dev Invariant: Toggle completion twice should return to original state
   */
  function testFuzz_Invariant_DoubleToggleReturnsToOriginalState(uint8 todoCount) public {
    // Bound count
    todoCount = uint8(bound(todoCount, 1, 20));

    vm.startPrank(user);

    // Create todos
    for (uint256 i = 0; i < todoCount; i++) {
      todoList.createTodo(string(abi.encodePacked("Todo ", vm.toString(i))), "Description", TodoList.Priority.Medium);
    }

    // Toggle all todos twice
    for (uint256 i = 0; i < todoCount; i++) {
      uint256 todoId = i + 1;

      // Get original state
      TodoList.Todo memory originalTodo = todoList.getTodo(todoId);
      bool originalCompleted = originalTodo.completed;
      uint256 originalCompletedAt = originalTodo.completedAt;

      // Toggle twice
      todoList.toggleTodoCompletion(todoId);
      todoList.toggleTodoCompletion(todoId);

      // Verify back to original state
      TodoList.Todo memory finalTodo = todoList.getTodo(todoId);
      assertEq(finalTodo.completed, originalCompleted);
      assertEq(finalTodo.completedAt, originalCompletedAt);
    }
    vm.stopPrank();
  }

  /**
   * @dev Invariant: Cannot create more than MAX_TODOS_PER_USER todos
   */
  function testFuzz_Invariant_CannotExceedMaxTodos(uint8 extraTodos) public {
    // Bound extra todos to reasonable range
    extraTodos = uint8(bound(extraTodos, 1, 10));

    vm.startPrank(user);

    // Create maximum number of todos
    for (uint256 i = 0; i < 50; i++) {
      todoList.createTodo(string(abi.encodePacked("Todo ", vm.toString(i))), "Description", TodoList.Priority.Medium);
    }

    // Try to create more - should always fail
    for (uint256 i = 0; i < extraTodos; i++) {
      vm.expectRevert(TodoList.TodoListFull.selector);
      todoList.createTodo("Extra Todo", "Description", TodoList.Priority.Medium);
    }

    vm.stopPrank();
  }
}
