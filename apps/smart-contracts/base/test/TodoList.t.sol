// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {TodoList} from "../src/TodoList.sol";

contract TodoListTest is Test {
  TodoList public todoList;
  address public owner;
  address public user1;
  address public user2;

  // Events to test
  event TodoCreated(address indexed user, uint256 indexed id, string title, TodoList.Priority priority);
  event TodoUpdated(address indexed user, uint256 indexed id, string title, TodoList.Priority priority);
  event TodoCompletionToggled(address indexed user, uint256 indexed id, bool completed);
  event TodoDeleted(address indexed user, uint256 indexed id);
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  // Custom errors to test
  error TitleEmpty();
  error TitleTooLong();
  error DescriptionTooLong();
  error TodoListFull();
  error TodoNotFound();
  error InvalidPriority();
  error OwnableInvalidOwner(address owner);

  function setUp() public {
    owner = address(this);
    user1 = address(0x1);
    user2 = address(0x2);

    vm.deal(user1, 100 ether);
    vm.deal(user2, 100 ether);

    todoList = new TodoList();
  }

  // ============ Deployment Tests ============

  function test_Deployment_ShouldSetRightOwner() public view {
    assertEq(todoList.owner(), owner);
  }

  function test_Deployment_ShouldInitializeWithEmptyTodoList() public view {
    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(todos.length, 0);
  }

  function test_Deployment_ShouldHaveCorrectConstants() public view {
    assertEq(todoList.MAX_TITLE_LENGTH(), 100);
    assertEq(todoList.MAX_DESCRIPTION_LENGTH(), 500);
    assertEq(todoList.MAX_TODOS_PER_USER(), 50);
  }

  // ============ Todo Creation Tests ============

  function test_CreateTodo_ShouldCreateSuccessfully() public {
    vm.expectEmit(true, true, false, true);
    emit TodoCreated(owner, 1, "Test Todo", TodoList.Priority.Medium);

    uint256 todoId = todoList.createTodo("Test Todo", "Test Description", TodoList.Priority.Medium);

    assertEq(todoId, 1);

    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(todos.length, 1);

    TodoList.Todo memory todo = todos[0];
    assertEq(todo.id, 1);
    assertEq(todo.title, "Test Todo");
    assertEq(todo.description, "Test Description");
    assertEq(uint256(todo.priority), uint256(TodoList.Priority.Medium));
    assertFalse(todo.completed);
    assertGt(todo.createdAt, 0);
    assertGt(todo.updatedAt, 0);
    assertEq(todo.completedAt, 0);
  }

  function test_CreateTodo_ShouldFailWithEmptyTitle() public {
    vm.expectRevert(TitleEmpty.selector);
    todoList.createTodo("", "Test Description", TodoList.Priority.Medium);
  }

  function test_CreateTodo_ShouldFailWithTitleTooLong() public {
    string memory longTitle = _generateString(101);

    vm.expectRevert(TitleTooLong.selector);
    todoList.createTodo(longTitle, "Test Description", TodoList.Priority.Medium);
  }

  function test_CreateTodo_ShouldFailWithDescriptionTooLong() public {
    string memory longDescription = _generateString(501);

    vm.expectRevert(DescriptionTooLong.selector);
    todoList.createTodo("Test Todo", longDescription, TodoList.Priority.Medium);
  }

  function test_CreateTodo_ShouldAllowEmptyDescription() public {
    todoList.createTodo("Test Todo", "", TodoList.Priority.Medium);

    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(todos[0].description, "");
  }

  function test_CreateTodo_ShouldHandleDifferentPriorityLevels() public {
    todoList.createTodo("Low Priority", "Description", TodoList.Priority.Low);
    todoList.createTodo("Medium Priority", "Description", TodoList.Priority.Medium);
    todoList.createTodo("High Priority", "Description", TodoList.Priority.High);

    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(uint256(todos[0].priority), uint256(TodoList.Priority.Low));
    assertEq(uint256(todos[1].priority), uint256(TodoList.Priority.Medium));
    assertEq(uint256(todos[2].priority), uint256(TodoList.Priority.High));
  }

  function test_CreateTodo_ShouldFailWhenTodoListIsFull() public {
    // Create maximum number of todos
    for (uint256 i = 0; i < 50; i++) {
      todoList.createTodo(string(abi.encodePacked("Todo ", vm.toString(i))), "Description", TodoList.Priority.Medium);
    }

    // Try to create one more
    vm.expectRevert(TodoListFull.selector);
    todoList.createTodo("Overflow Todo", "Description", TodoList.Priority.Medium);
  }

  function test_CreateTodo_ShouldIncrementTodoIDsCorrectly() public {
    todoList.createTodo("Todo 1", "Description", TodoList.Priority.Medium);
    todoList.createTodo("Todo 2", "Description", TodoList.Priority.Medium);
    todoList.createTodo("Todo 3", "Description", TodoList.Priority.Medium);

    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(todos[0].id, 1);
    assertEq(todos[1].id, 2);
    assertEq(todos[2].id, 3);
  }

  function test_CreateTodo_ShouldAllowDifferentUsersToCreateIndependently() public {
    vm.prank(user1);
    todoList.createTodo("User1 Todo", "Description", TodoList.Priority.Medium);

    vm.prank(user2);
    todoList.createTodo("User2 Todo", "Description", TodoList.Priority.High);

    vm.prank(user1);
    TodoList.Todo[] memory user1Todos = todoList.getTodos();

    vm.prank(user2);
    TodoList.Todo[] memory user2Todos = todoList.getTodos();

    assertEq(user1Todos.length, 1);
    assertEq(user2Todos.length, 1);
    assertEq(user1Todos[0].title, "User1 Todo");
    assertEq(user2Todos[0].title, "User2 Todo");
  }

  // ============ Todo Retrieval Tests ============

  function test_GetTodos_ShouldGetAllTodosForUser() public {
    todoList.createTodo("Todo 1", "Description 1", TodoList.Priority.Low);
    todoList.createTodo("Todo 2", "Description 2", TodoList.Priority.Medium);
    todoList.createTodo("Todo 3", "Description 3", TodoList.Priority.High);

    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(todos.length, 3);
    assertEq(todos[0].title, "Todo 1");
    assertEq(todos[1].title, "Todo 2");
    assertEq(todos[2].title, "Todo 3");
  }

  function test_GetTodo_ShouldGetSpecificTodoByID() public {
    todoList.createTodo("Todo 1", "Description 1", TodoList.Priority.Low);
    todoList.createTodo("Todo 2", "Description 2", TodoList.Priority.Medium);
    todoList.createTodo("Todo 3", "Description 3", TodoList.Priority.High);

    TodoList.Todo memory todo = todoList.getTodo(2);
    assertEq(todo.title, "Todo 2");
    assertEq(todo.description, "Description 2");
    assertEq(uint256(todo.priority), uint256(TodoList.Priority.Medium));
  }

  function test_GetTodo_ShouldFailToGetNonExistentTodo() public {
    vm.expectRevert(TodoNotFound.selector);
    todoList.getTodo(999);
  }

  function test_GetTodos_ShouldReturnEmptyArrayForUserWithNoTodos() public {
    vm.prank(user1);
    TodoList.Todo[] memory user1Todos = todoList.getTodos();
    assertEq(user1Todos.length, 0);
  }

  function test_GetTodoStats_ShouldGetCorrectStatistics() public {
    todoList.createTodo("Todo 1", "Description 1", TodoList.Priority.Low);
    todoList.createTodo("Todo 2", "Description 2", TodoList.Priority.Medium);
    todoList.createTodo("Todo 3", "Description 3", TodoList.Priority.High);

    // Complete one todo
    todoList.toggleTodoCompletion(2);

    TodoList.TodoStats memory stats = todoList.getTodoStats();
    assertEq(stats.total, 3);
    assertEq(stats.completed, 1);
    assertEq(stats.pending, 2);
    assertEq(stats.highPriority, 1); // Only uncompleted high priority todos
  }

  // ============ Todo Update Tests ============

  function test_UpdateTodo_ShouldUpdateTitleSuccessfully() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    vm.expectEmit(true, true, false, true);
    emit TodoUpdated(owner, 1, "Updated Title", TodoList.Priority.Medium);

    todoList.updateTodo(1, "Updated Title", "", type(uint256).max);

    TodoList.Todo memory todo = todoList.getTodo(1);
    assertEq(todo.title, "Updated Title");
    assertEq(todo.description, "Original Description");
    assertEq(uint256(todo.priority), uint256(TodoList.Priority.Medium));
  }

  function test_UpdateTodo_ShouldUpdateDescriptionSuccessfully() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    todoList.updateTodo(1, "", "Updated Description", type(uint256).max);

    TodoList.Todo memory todo = todoList.getTodo(1);
    assertEq(todo.title, "Original Title");
    assertEq(todo.description, "Updated Description");
    assertEq(uint256(todo.priority), uint256(TodoList.Priority.Medium));
  }

  function test_UpdateTodo_ShouldUpdatePrioritySuccessfully() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    todoList.updateTodo(1, "", "", uint256(TodoList.Priority.High));

    TodoList.Todo memory todo = todoList.getTodo(1);
    assertEq(todo.title, "Original Title");
    assertEq(todo.description, "Original Description");
    assertEq(uint256(todo.priority), uint256(TodoList.Priority.High));
  }

  function test_UpdateTodo_ShouldUpdateAllFieldsSimultaneously() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    todoList.updateTodo(1, "Updated Title", "Updated Description", uint256(TodoList.Priority.High));

    TodoList.Todo memory todo = todoList.getTodo(1);
    assertEq(todo.title, "Updated Title");
    assertEq(todo.description, "Updated Description");
    assertEq(uint256(todo.priority), uint256(TodoList.Priority.High));
  }

  function test_UpdateTodo_ShouldFailToUpdateNonExistentTodo() public {
    vm.expectRevert(TodoNotFound.selector);
    todoList.updateTodo(999, "Title", "Description", uint256(TodoList.Priority.Medium));
  }

  function test_UpdateTodo_ShouldFailToUpdateWithTitleTooLong() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    string memory longTitle = _generateString(101);
    vm.expectRevert(TitleTooLong.selector);
    todoList.updateTodo(1, longTitle, "", type(uint256).max);
  }

  function test_UpdateTodo_ShouldFailToUpdateWithDescriptionTooLong() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    string memory longDescription = _generateString(501);
    vm.expectRevert(DescriptionTooLong.selector);
    todoList.updateTodo(1, "", longDescription, type(uint256).max);
  }

  function test_UpdateTodo_ShouldFailToUpdateWithInvalidPriority() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    vm.expectRevert(InvalidPriority.selector);
    todoList.updateTodo(1, "", "", 3);
  }

  function test_UpdateTodo_ShouldUpdateTimestampOnUpdate() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    TodoList.Todo memory originalTodo = todoList.getTodo(1);
    uint256 originalUpdatedAt = originalTodo.updatedAt;

    // Advance time
    vm.warp(block.timestamp + 1000);

    todoList.updateTodo(1, "Updated Title", "", type(uint256).max);

    TodoList.Todo memory updatedTodo = todoList.getTodo(1);
    assertGt(updatedTodo.updatedAt, originalUpdatedAt);
    assertEq(updatedTodo.createdAt, originalTodo.createdAt);
  }

  function test_UpdateTodo_ShouldAllowOnlyTodoOwnerToUpdate() public {
    todoList.createTodo("Original Title", "Original Description", TodoList.Priority.Medium);

    vm.prank(user1);
    vm.expectRevert(TodoNotFound.selector);
    todoList.updateTodo(1, "Hacked", "", type(uint256).max);
  }

  // ============ Todo Completion Toggle Tests ============

  function test_ToggleTodoCompletion_ShouldToggleCompletion() public {
    todoList.createTodo("Test Todo", "Test Description", TodoList.Priority.Medium);

    // Initially not completed
    TodoList.Todo memory todo = todoList.getTodo(1);
    assertFalse(todo.completed);
    assertEq(todo.completedAt, 0);

    // Toggle to completed
    vm.expectEmit(true, true, false, true);
    emit TodoCompletionToggled(owner, 1, true);

    todoList.toggleTodoCompletion(1);

    todo = todoList.getTodo(1);
    assertTrue(todo.completed);
    assertGt(todo.completedAt, 0);

    // Toggle back to not completed
    vm.expectEmit(true, true, false, true);
    emit TodoCompletionToggled(owner, 1, false);

    todoList.toggleTodoCompletion(1);

    todo = todoList.getTodo(1);
    assertFalse(todo.completed);
    assertEq(todo.completedAt, 0);
  }

  function test_ToggleTodoCompletion_ShouldFailToToggleNonExistentTodo() public {
    vm.expectRevert(TodoNotFound.selector);
    todoList.toggleTodoCompletion(999);
  }

  function test_ToggleTodoCompletion_ShouldUpdateTimestampsOnToggle() public {
    todoList.createTodo("Test Todo", "Test Description", TodoList.Priority.Medium);

    TodoList.Todo memory originalTodo = todoList.getTodo(1);
    uint256 originalUpdatedAt = originalTodo.updatedAt;

    // Advance time to ensure timestamp difference
    vm.warp(block.timestamp + 1);

    todoList.toggleTodoCompletion(1);

    TodoList.Todo memory updatedTodo = todoList.getTodo(1);
    assertGt(updatedTodo.updatedAt, originalUpdatedAt);
    assertGt(updatedTodo.completedAt, 0);
  }

  function test_ToggleTodoCompletion_ShouldAllowOnlyTodoOwnerToToggle() public {
    todoList.createTodo("Test Todo", "Test Description", TodoList.Priority.Medium);

    vm.prank(user1);
    vm.expectRevert(TodoNotFound.selector);
    todoList.toggleTodoCompletion(1);
  }

  // ============ Todo Deletion Tests ============

  function test_DeleteTodo_ShouldDeleteSuccessfully() public {
    todoList.createTodo("Todo 1", "Description 1", TodoList.Priority.Medium);
    todoList.createTodo("Todo 2", "Description 2", TodoList.Priority.Medium);
    todoList.createTodo("Todo 3", "Description 3", TodoList.Priority.Medium);

    vm.expectEmit(true, true, false, true);
    emit TodoDeleted(owner, 2);

    todoList.deleteTodo(2);

    // Verify todo is deleted
    vm.expectRevert(TodoNotFound.selector);
    todoList.getTodo(2);

    // Verify remaining todos
    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(todos.length, 2);
  }

  function test_DeleteTodo_ShouldFailToDeleteNonExistentTodo() public {
    vm.expectRevert(TodoNotFound.selector);
    todoList.deleteTodo(999);
  }

  function test_DeleteTodo_ShouldMaintainArrayIntegrityAfterDeletion() public {
    todoList.createTodo("Todo 1", "Description 1", TodoList.Priority.Medium);
    todoList.createTodo("Todo 2", "Description 2", TodoList.Priority.Medium);
    todoList.createTodo("Todo 3", "Description 3", TodoList.Priority.Medium);

    // Delete middle todo
    todoList.deleteTodo(2);

    // Verify remaining todos
    TodoList.Todo[] memory todos = todoList.getTodos();
    assertEq(todos.length, 2);

    // Check that we can still access remaining todos by their IDs
    TodoList.Todo memory todo1 = todoList.getTodo(1);
    TodoList.Todo memory todo3 = todoList.getTodo(3);

    assertEq(todo1.title, "Todo 1");
    assertEq(todo3.title, "Todo 3");
  }

  function test_DeleteTodo_ShouldAllowOnlyTodoOwnerToDelete() public {
    todoList.createTodo("Test Todo", "Test Description", TodoList.Priority.Medium);

    vm.prank(user1);
    vm.expectRevert(TodoNotFound.selector);
    todoList.deleteTodo(1);
  }

  function test_DeleteTodo_ShouldUpdateStatisticsAfterDeletion() public {
    todoList.createTodo("Todo 1", "Description 1", TodoList.Priority.Medium);
    todoList.createTodo("Todo 2", "Description 2", TodoList.Priority.Medium);
    todoList.createTodo("Todo 3", "Description 3", TodoList.Priority.Medium);

    // Complete one todo before deletion
    todoList.toggleTodoCompletion(2);

    TodoList.TodoStats memory stats = todoList.getTodoStats();
    assertEq(stats.total, 3);
    assertEq(stats.completed, 1);

    // Delete the completed todo
    todoList.deleteTodo(2);

    stats = todoList.getTodoStats();
    assertEq(stats.total, 2);
    assertEq(stats.completed, 0);
  }

  // ============ Statistics and Analytics Tests ============

  function test_GetTodoStats_ShouldReturnCorrectBasicStatistics() public {
    // Create todos with different priorities and completion status
    todoList.createTodo("High Priority Todo 1", "Description", TodoList.Priority.High);
    todoList.createTodo("Medium Priority Todo", "Description", TodoList.Priority.Medium);
    todoList.createTodo("Low Priority Todo", "Description", TodoList.Priority.Low);
    todoList.createTodo("High Priority Todo 2", "Description", TodoList.Priority.High);

    // Complete some todos
    todoList.toggleTodoCompletion(1);
    todoList.toggleTodoCompletion(3);

    TodoList.TodoStats memory stats = todoList.getTodoStats();

    assertEq(stats.total, 4);
    assertEq(stats.completed, 2);
    assertEq(stats.pending, 2);
    assertEq(stats.highPriority, 1); // Only uncompleted high priority todos
  }

  function test_GetTodoStats_ShouldReturnEmptyStatsForEmptyTodoList() public {
    TodoList emptyTodoList = new TodoList();

    TodoList.TodoStats memory stats = emptyTodoList.getTodoStats();
    assertEq(stats.total, 0);
    assertEq(stats.completed, 0);
    assertEq(stats.pending, 0);
    assertEq(stats.highPriority, 0);
  }

  function test_GetTodoStats_ShouldCountHighPriorityCorrectly() public {
    // Create todos with different priorities
    todoList.createTodo("High Priority Todo 1", "Description", TodoList.Priority.High);
    todoList.createTodo("Medium Priority Todo", "Description", TodoList.Priority.Medium);
    todoList.createTodo("High Priority Todo 2", "Description", TodoList.Priority.High);
    todoList.createTodo("High Priority Todo 3", "Description", TodoList.Priority.High);

    // Complete one high priority todo
    todoList.toggleTodoCompletion(1);

    TodoList.TodoStats memory stats = todoList.getTodoStats();
    assertEq(stats.highPriority, 2); // 2 uncompleted high priority todos
  }

  // ============ Access Control and Security Tests ============

  function test_AccessControl_ShouldAllowUsersToManageOnlyTheirOwnTodos() public {
    // Create todo for owner
    todoList.createTodo("Owner Todo", "Description", TodoList.Priority.Medium);

    // Create todo for user1
    vm.prank(user1);
    todoList.createTodo("User1 Todo", "Description", TodoList.Priority.Medium);

    // Verify owner can access their own todo
    TodoList.Todo memory ownerTodo = todoList.getTodo(1);
    assertEq(ownerTodo.title, "Owner Todo");

    // Verify user1 can access their own todo
    vm.prank(user1);
    TodoList.Todo memory user1Todo = todoList.getTodo(1);
    assertEq(user1Todo.title, "User1 Todo");

    // Each user has separate todo lists, so they can't interfere with each other
    TodoList.Todo[] memory ownerTodos = todoList.getTodos();
    assertEq(ownerTodos.length, 1);

    vm.prank(user1);
    TodoList.Todo[] memory user1Todos = todoList.getTodos();
    assertEq(user1Todos.length, 1);
  }

  function test_AccessControl_ShouldHandleOwnershipTransfer() public {
    todoList.createTodo("Owner Todo", "Description", TodoList.Priority.Medium);

    // Transfer ownership
    todoList.transferOwnership(user1);

    // Verify new owner
    assertEq(todoList.owner(), user1);

    // Old owner should still have access to their todos
    TodoList.Todo memory todo = todoList.getTodo(1);
    assertEq(todo.title, "Owner Todo");
  }

  function test_AccessControl_ShouldPreventOwnershipTransferToZeroAddress() public {
    vm.expectRevert(abi.encodeWithSelector(OwnableInvalidOwner.selector, address(0)));
    todoList.transferOwnership(address(0));
  }

  function test_AccessControl_ShouldEmitOwnershipTransferEvent() public {
    vm.expectEmit(true, true, false, true);
    emit OwnershipTransferred(owner, user1);

    todoList.transferOwnership(user1);
  }

  // ============ Edge Cases and Error Handling Tests ============

  function test_EdgeCase_ShouldHandleMaximumTitleLength() public {
    string memory maxTitle = _generateString(100);

    todoList.createTodo(maxTitle, "Description", TodoList.Priority.Medium);

    TodoList.Todo memory todo = todoList.getTodo(1);
    assertEq(todo.title, maxTitle);
  }

  function test_EdgeCase_ShouldHandleMaximumDescriptionLength() public {
    string memory maxDescription = _generateString(500);

    todoList.createTodo("Title", maxDescription, TodoList.Priority.Medium);

    TodoList.Todo memory todo = todoList.getTodo(1);
    assertEq(todo.description, maxDescription);
  }

  function test_EdgeCase_ShouldHandleSpecialCharactersInStrings() public {
    string memory specialTitle = unicode"Todo with émojis 🚀 and spëcial chars!@#$%^&*()";
    string memory specialDescription = 'Description with newlines\nand tabs\t and quotes "test"';

    todoList.createTodo(specialTitle, specialDescription, TodoList.Priority.Medium);

    TodoList.Todo memory todo = todoList.getTodo(1);
    assertEq(todo.title, specialTitle);
    assertEq(todo.description, specialDescription);
  }

  // ============ Event Emission Tests ============

  function test_Events_ShouldEmitAllRequiredEventsWithCorrectParameters() public {
    // Test TodoCreated event
    vm.expectEmit(true, true, false, true);
    emit TodoCreated(owner, 1, "Event Test", TodoList.Priority.Medium);
    todoList.createTodo("Event Test", "Description", TodoList.Priority.Medium);

    // Test TodoUpdated event
    vm.expectEmit(true, true, false, true);
    emit TodoUpdated(owner, 1, "Updated Event Test", TodoList.Priority.High);
    todoList.updateTodo(1, "Updated Event Test", "Updated Description", uint256(TodoList.Priority.High));

    // Test TodoCompletionToggled event
    vm.expectEmit(true, true, false, true);
    emit TodoCompletionToggled(owner, 1, true);
    todoList.toggleTodoCompletion(1);

    // Test TodoDeleted event
    vm.expectEmit(true, true, false, true);
    emit TodoDeleted(owner, 1);
    todoList.deleteTodo(1);
  }

  // ============ Helper Functions ============

  function _generateString(uint256 length) internal pure returns (string memory) {
    bytes memory buffer = new bytes(length);
    for (uint256 i = 0; i < length; i++) {
      buffer[i] = "a";
    }
    return string(buffer);
  }
}
