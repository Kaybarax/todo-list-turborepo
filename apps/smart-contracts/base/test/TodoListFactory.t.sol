// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {TodoListFactory} from "../src/TodoListFactory.sol";
import {TodoList} from "../src/TodoList.sol";

contract TodoListFactoryTest is Test {
  TodoListFactory public factory;
  address public owner;
  address public user1;
  address public user2;
  address public user3;
  address public user4;
  address public user5;

  // Events to test
  event TodoListCreated(address indexed user, address todoList);
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  // Custom errors to test
  error TodoListAlreadyExists();
  error OwnableInvalidOwner(address owner);

  function setUp() public {
    owner = address(this);
    user1 = address(0x1);
    user2 = address(0x2);
    user3 = address(0x3);
    user4 = address(0x4);
    user5 = address(0x5);

    vm.deal(user1, 100 ether);
    vm.deal(user2, 100 ether);
    vm.deal(user3, 100 ether);
    vm.deal(user4, 100 ether);
    vm.deal(user5, 100 ether);

    factory = new TodoListFactory();
  }

  // ============ Deployment Tests ============

  function test_Deployment_ShouldSetCorrectOwner() public view {
    assertEq(factory.owner(), owner);
  }

  function test_Deployment_ShouldInitializeWithEmptyState() public view {
    uint256 userCount = factory.getUserCount();
    assertEq(userCount, 0);
  }

  function test_Deployment_ShouldHaveNoUsersInitially() public view {
    address[] memory users = factory.getUsers(0, 10);
    assertEq(users.length, 0);
  }

  // ============ TodoList Creation Tests ============

  function test_CreateTodoList_ShouldCreateSuccessfully() public {
    vm.startPrank(user1);

    // Record logs to verify event emission
    vm.recordLogs();
    factory.createTodoList();

    // Verify event was emitted
    Vm.Log[] memory entries = vm.getRecordedLogs();
    bool foundEvent = false;
    for (uint256 i = 0; i < entries.length; i++) {
      if (entries[i].topics[0] == keccak256("TodoListCreated(address,address)")) {
        foundEvent = true;
        break;
      }
    }
    assertTrue(foundEvent, "TodoListCreated event not emitted");

    address todoListAddress = factory.getTodoListForUser(user1);
    assertTrue(todoListAddress != address(0));

    vm.stopPrank();
  }

  function test_CreateTodoList_ShouldIncrementUserCount() public {
    vm.prank(user1);
    factory.createTodoList();

    uint256 userCount = factory.getUserCount();
    assertEq(userCount, 1);
  }

  function test_CreateTodoList_ShouldAddUserToUsersArray() public {
    vm.prank(user1);
    factory.createTodoList();

    address[] memory users = factory.getUsers(0, 10);
    assertEq(users.length, 1);
    assertEq(users[0], user1);
  }

  function test_CreateTodoList_ShouldPreventDuplicateCreation() public {
    vm.startPrank(user1);

    factory.createTodoList();

    vm.expectRevert(TodoListAlreadyExists.selector);
    factory.createTodoList();

    vm.stopPrank();
  }

  function test_CreateTodoList_ShouldAllowMultipleUsersToCreate() public {
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    vm.prank(user3);
    factory.createTodoList();

    uint256 userCount = factory.getUserCount();
    assertEq(userCount, 3);

    address[] memory users = factory.getUsers(0, 10);
    assertEq(users.length, 3);

    // Verify each user has their own TodoList
    address user1TodoList = factory.getTodoListForUser(user1);
    address user2TodoList = factory.getTodoListForUser(user2);
    address user3TodoList = factory.getTodoListForUser(user3);

    assertTrue(user1TodoList != user2TodoList);
    assertTrue(user2TodoList != user3TodoList);
    assertTrue(user1TodoList != user3TodoList);
  }

  function test_CreateTodoList_ShouldCreateWithCorrectOwner() public {
    vm.prank(user1);
    factory.createTodoList();

    address todoListAddress = factory.getTodoListForUser(user1);
    TodoList todoList = TodoList(todoListAddress);

    assertEq(todoList.owner(), user1);
  }

  function test_CreateTodoList_ShouldCreateFunctionalContract() public {
    vm.prank(user1);
    factory.createTodoList();

    address todoListAddress = factory.getTodoListForUser(user1);
    TodoList todoList = TodoList(todoListAddress);

    // Test basic functionality
    vm.prank(user1);
    todoList.createTodo("Factory Test Todo", "Created via factory", TodoList.Priority.Medium);

    vm.prank(user1);
    TodoList.Todo[] memory todos = todoList.getTodos();

    assertEq(todos.length, 1);
    assertEq(todos[0].title, "Factory Test Todo");
  }

  function test_CreateTodoList_ShouldReturnCorrectAddress() public {
    vm.prank(user1);
    address returnedAddress = factory.createTodoList();

    address storedAddress = factory.getTodoListForUser(user1);
    assertEq(storedAddress, returnedAddress);
  }

  // ============ TodoList Retrieval Tests ============

  function test_GetTodoListForUser_ShouldReturnCorrectAddress() public {
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    address user1TodoList = factory.getTodoListForUser(user1);
    address user2TodoList = factory.getTodoListForUser(user2);

    assertTrue(user1TodoList != address(0));
    assertTrue(user2TodoList != address(0));
    assertTrue(user1TodoList != user2TodoList);
  }

  function test_GetTodoListForUser_ShouldReturnZeroAddressForNonExistent() public {
    address nonExistentTodoList = factory.getTodoListForUser(user1);
    assertEq(nonExistentTodoList, address(0));
  }

  function test_GetTodoList_ShouldReturnCorrectAddressForCaller() public {
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    vm.prank(user1);
    address user1TodoList = factory.getTodoList();

    vm.prank(user2);
    address user2TodoList = factory.getTodoList();

    assertTrue(user1TodoList != address(0));
    assertTrue(user2TodoList != address(0));
    assertTrue(user1TodoList != user2TodoList);
  }

  function test_GetTodoList_ShouldReturnZeroAddressForCallerWithoutTodoList() public {
    vm.prank(user1);
    address nonExistentTodoList = factory.getTodoList();
    assertEq(nonExistentTodoList, address(0));
  }

  function test_GetUserCount_ShouldReturnCorrectCount() public {
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    vm.prank(user3);
    factory.createTodoList();

    uint256 userCount = factory.getUserCount();
    assertEq(userCount, 3);
  }

  function test_GetUsers_ShouldReturnUsersWithPagination() public {
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    vm.prank(user3);
    factory.createTodoList();

    // Get first 2 users
    address[] memory firstBatch = factory.getUsers(0, 2);
    assertEq(firstBatch.length, 2);
    assertEq(firstBatch[0], user1);
    assertEq(firstBatch[1], user2);

    // Get remaining users
    address[] memory secondBatch = factory.getUsers(2, 2);
    assertEq(secondBatch.length, 1);
    assertEq(secondBatch[0], user3);
  }

  function test_GetUsers_ShouldHandlePaginationEdgeCases() public {
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    vm.prank(user3);
    factory.createTodoList();

    // Request beyond available users
    address[] memory beyondUsers = factory.getUsers(10, 5);
    assertEq(beyondUsers.length, 0);

    // Request with large limit
    address[] memory allUsers = factory.getUsers(0, 100);
    assertEq(allUsers.length, 3);
    assertEq(allUsers[0], user1);
    assertEq(allUsers[1], user2);
    assertEq(allUsers[2], user3);
  }

  function test_GetUsers_ShouldReturnPartialResultsWhenLimitExceedsRemaining() public {
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    vm.prank(user3);
    factory.createTodoList();

    address[] memory partialUsers = factory.getUsers(1, 10);
    assertEq(partialUsers.length, 2);
    assertEq(partialUsers[0], user2);
    assertEq(partialUsers[1], user3);
  }

  function test_GetUsers_ShouldHandleZeroLimit() public {
    vm.prank(user1);
    factory.createTodoList();

    address[] memory users = factory.getUsers(0, 0);
    assertEq(users.length, 0);
  }

  function test_GetUsers_ShouldHandleLargeOffset() public {
    vm.prank(user1);
    factory.createTodoList();

    address[] memory users = factory.getUsers(1000, 10);
    assertEq(users.length, 0);
  }

  // ============ Multi-User Scenario Tests ============

  function test_MultiUser_ShouldMaintainIndependentTodoLists() public {
    // Create TodoLists for multiple users
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    // Get TodoList contracts
    address user1TodoListAddress = factory.getTodoListForUser(user1);
    address user2TodoListAddress = factory.getTodoListForUser(user2);

    TodoList user1TodoList = TodoList(user1TodoListAddress);
    TodoList user2TodoList = TodoList(user2TodoListAddress);

    // Add different todos to each list
    vm.prank(user1);
    user1TodoList.createTodo("User1 Todo", "Description", TodoList.Priority.Low);

    vm.prank(user2);
    user2TodoList.createTodo("User2 Todo", "Description", TodoList.Priority.High);

    // Verify independence
    vm.prank(user1);
    TodoList.Todo[] memory user1Todos = user1TodoList.getTodos();

    vm.prank(user2);
    TodoList.Todo[] memory user2Todos = user2TodoList.getTodos();

    assertEq(user1Todos.length, 1);
    assertEq(user2Todos.length, 1);
    assertEq(user1Todos[0].title, "User1 Todo");
    assertEq(user2Todos[0].title, "User2 Todo");
    assertEq(uint256(user1Todos[0].priority), uint256(TodoList.Priority.Low));
    assertEq(uint256(user2Todos[0].priority), uint256(TodoList.Priority.High));
  }

  function test_MultiUser_ShouldHandleComplexScenarios() public {
    // Create TodoLists for multiple users
    address[3] memory testUsers = [user1, user2, user3];

    for (uint256 i = 0; i < testUsers.length; i++) {
      vm.prank(testUsers[i]);
      factory.createTodoList();

      address todoListAddress = factory.getTodoListForUser(testUsers[i]);
      TodoList todoList = TodoList(todoListAddress);

      // Add todos with different properties
      vm.startPrank(testUsers[i]);
      todoList.createTodo("Todo 1", "Description 1", TodoList.Priority.Low);
      todoList.createTodo("Todo 2", "Description 2", TodoList.Priority.Medium);
      todoList.toggleTodoCompletion(1); // Complete first todo
      vm.stopPrank();
    }

    // Verify all data is accessible
    address[] memory allUsers = factory.getUsers(0, 10);
    assertEq(allUsers.length, 3);

    for (uint256 i = 0; i < allUsers.length; i++) {
      address todoListAddress = factory.getTodoListForUser(allUsers[i]);
      assertTrue(todoListAddress != address(0));

      TodoList todoList = TodoList(todoListAddress);

      vm.prank(allUsers[i]);
      TodoList.Todo[] memory todos = todoList.getTodos();
      assertEq(todos.length, 2);

      vm.prank(allUsers[i]);
      TodoList.TodoStats memory stats = todoList.getTodoStats();
      assertEq(stats.total, 2);
      assertEq(stats.completed, 1);
    }
  }

  // ============ Access Control and Ownership Tests ============

  function test_AccessControl_ShouldAllowAnyUserToCreateTodoList() public {
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    address user1TodoList = factory.getTodoListForUser(user1);
    address user2TodoList = factory.getTodoListForUser(user2);

    assertTrue(user1TodoList != address(0));
    assertTrue(user2TodoList != address(0));
  }

  function test_AccessControl_ShouldAllowReadAccessToAnyone() public {
    vm.prank(user1);
    factory.createTodoList();

    // Anyone should be able to read TodoList addresses
    vm.prank(user2);
    address todoListAddress = factory.getTodoListForUser(user1);
    assertTrue(todoListAddress != address(0));

    vm.prank(user2);
    uint256 userCount = factory.getUserCount();
    assertEq(userCount, 1);
  }

  function test_AccessControl_ShouldHandleOwnershipTransfer() public {
    // Transfer factory ownership
    factory.transferOwnership(user1);

    // Verify new owner
    assertEq(factory.owner(), user1);

    // Factory should still work normally
    vm.prank(user2);
    factory.createTodoList();

    address todoListAddress = factory.getTodoListForUser(user2);
    assertTrue(todoListAddress != address(0));
  }

  function test_AccessControl_ShouldPreventOwnershipTransferToZeroAddress() public {
    vm.expectRevert(abi.encodeWithSelector(OwnableInvalidOwner.selector, address(0)));
    factory.transferOwnership(address(0));
  }

  function test_AccessControl_ShouldEmitOwnershipTransferEvent() public {
    vm.expectEmit(true, true, false, true);
    emit OwnershipTransferred(owner, user1);

    factory.transferOwnership(user1);
  }

  // ============ Event Emission Tests ============

  function test_Events_ShouldEmitTodoListCreatedWithCorrectParameters() public {
    vm.startPrank(user1);

    // We can't predict the exact address, but we can verify the event is emitted
    vm.recordLogs();
    address todoListAddress = factory.createTodoList();

    Vm.Log[] memory entries = vm.getRecordedLogs();

    // Find the TodoListCreated event
    bool foundEvent = false;
    for (uint256 i = 0; i < entries.length; i++) {
      if (entries[i].topics[0] == keccak256("TodoListCreated(address,address)")) {
        foundEvent = true;
        address eventUser = address(uint160(uint256(entries[i].topics[1])));
        address eventTodoList = abi.decode(entries[i].data, (address));

        assertEq(eventUser, user1);
        assertEq(eventTodoList, todoListAddress);
        break;
      }
    }

    assertTrue(foundEvent, "TodoListCreated event not found");

    vm.stopPrank();
  }

  function test_Events_ShouldEmitEventsInCorrectOrderForMultipleOperations() public {
    vm.recordLogs();

    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    Vm.Log[] memory entries = vm.getRecordedLogs();

    // Count TodoListCreated events
    uint256 eventCount = 0;
    for (uint256 i = 0; i < entries.length; i++) {
      if (entries[i].topics[0] == keccak256("TodoListCreated(address,address)")) {
        eventCount++;
      }
    }

    assertEq(eventCount, 2, "Should emit 2 TodoListCreated events");
  }

  // ============ Edge Cases and Error Handling Tests ============

  function test_EdgeCase_ShouldHandleEmptyStateQueries() public view {
    uint256 userCount = factory.getUserCount();
    address[] memory users = factory.getUsers(0, 10);

    assertEq(userCount, 0);
    assertEq(users.length, 0);
  }

  function test_EdgeCase_ShouldHandleQueriesForNonExistentUsers() public view {
    address nonExistentTodoList = factory.getTodoListForUser(user1);
    assertEq(nonExistentTodoList, address(0));
  }

  function test_EdgeCase_ShouldMaintainConsistencyUnderConcurrentOperations() public {
    // Simulate concurrent TodoList creation
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    vm.prank(user3);
    factory.createTodoList();

    // Verify final state is consistent
    uint256 userCount = factory.getUserCount();
    address[] memory users = factory.getUsers(0, 10);

    assertEq(userCount, 3);
    assertEq(users.length, 3);

    // Verify each user has their own TodoList
    address user1TodoList = factory.getTodoListForUser(user1);
    address user2TodoList = factory.getTodoListForUser(user2);
    address user3TodoList = factory.getTodoListForUser(user3);

    assertTrue(user1TodoList != address(0));
    assertTrue(user2TodoList != address(0));
    assertTrue(user3TodoList != address(0));

    assertTrue(user1TodoList != user2TodoList);
    assertTrue(user2TodoList != user3TodoList);
    assertTrue(user1TodoList != user3TodoList);
  }

  // ============ Integration Tests ============

  function test_Integration_ShouldWorkWithExternalContracts() public {
    vm.prank(user1);
    factory.createTodoList();

    address todoListAddress = factory.getTodoListForUser(user1);
    TodoList todoList = TodoList(todoListAddress);

    // Test that the created TodoList works with external interactions
    vm.prank(user1);
    todoList.createTodo("Integration Test", "Testing external interaction", TodoList.Priority.Medium);

    vm.prank(user1);
    TodoList.Todo[] memory todos = todoList.getTodos();

    assertEq(todos.length, 1);
    assertEq(todos[0].title, "Integration Test");
  }

  function test_Integration_ShouldSupportFactoryPatternCorrectly() public {
    // Create multiple TodoLists
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    // Verify they are independent instances
    address user1TodoListAddress = factory.getTodoListForUser(user1);
    address user2TodoListAddress = factory.getTodoListForUser(user2);

    TodoList user1TodoList = TodoList(user1TodoListAddress);
    TodoList user2TodoList = TodoList(user2TodoListAddress);

    // Add different todos to each list
    vm.prank(user1);
    user1TodoList.createTodo("User1 Todo", "Description", TodoList.Priority.Low);

    vm.prank(user2);
    user2TodoList.createTodo("User2 Todo", "Description", TodoList.Priority.High);

    // Verify independence
    vm.prank(user1);
    TodoList.Todo[] memory user1Todos = user1TodoList.getTodos();

    vm.prank(user2);
    TodoList.Todo[] memory user2Todos = user2TodoList.getTodos();

    assertEq(user1Todos.length, 1);
    assertEq(user2Todos.length, 1);
    assertEq(user1Todos[0].title, "User1 Todo");
    assertEq(user2Todos[0].title, "User2 Todo");
    assertEq(uint256(user1Todos[0].priority), uint256(TodoList.Priority.Low));
    assertEq(uint256(user2Todos[0].priority), uint256(TodoList.Priority.High));
  }

  // ============ Data Export and Migration Tests ============

  function test_Migration_ShouldSupportDataExport() public {
    // Create TodoLists with data
    vm.prank(user1);
    factory.createTodoList();

    vm.prank(user2);
    factory.createTodoList();

    address user1TodoListAddress = factory.getTodoListForUser(user1);
    address user2TodoListAddress = factory.getTodoListForUser(user2);

    TodoList user1TodoList = TodoList(user1TodoListAddress);
    TodoList user2TodoList = TodoList(user2TodoListAddress);

    vm.prank(user1);
    user1TodoList.createTodo("Migration Test 1", "Description", TodoList.Priority.Low);

    vm.prank(user2);
    user2TodoList.createTodo("Migration Test 2", "Description", TodoList.Priority.High);

    // Export data for migration
    address[] memory users = factory.getUsers(0, 10);
    uint256 userCount = factory.getUserCount();

    // Verify export data completeness
    assertEq(users.length, 2);
    assertEq(userCount, 2);

    bool foundUser1 = false;
    bool foundUser2 = false;
    for (uint256 i = 0; i < users.length; i++) {
      if (users[i] == user1) foundUser1 = true;
      if (users[i] == user2) foundUser2 = true;
    }
    assertTrue(foundUser1);
    assertTrue(foundUser2);

    // Verify TodoList addresses are valid
    assertTrue(user1TodoListAddress != address(0));
    assertTrue(user2TodoListAddress != address(0));
  }

  function test_Migration_ShouldMaintainDataIntegrity() public {
    // Create comprehensive test data
    address[3] memory testUsers = [user1, user2, user3];

    for (uint256 i = 0; i < testUsers.length; i++) {
      vm.prank(testUsers[i]);
      factory.createTodoList();

      address todoListAddress = factory.getTodoListForUser(testUsers[i]);
      TodoList todoList = TodoList(todoListAddress);

      // Add todos with different properties
      vm.startPrank(testUsers[i]);
      todoList.createTodo("Todo 1", "Description 1", TodoList.Priority.Low);
      todoList.createTodo("Todo 2", "Description 2", TodoList.Priority.Medium);
      todoList.toggleTodoCompletion(1); // Complete first todo
      vm.stopPrank();
    }

    // Verify all data is accessible for migration
    address[] memory allUsers = factory.getUsers(0, 10);
    assertEq(allUsers.length, 3);

    for (uint256 i = 0; i < allUsers.length; i++) {
      address todoListAddress = factory.getTodoListForUser(allUsers[i]);
      assertTrue(todoListAddress != address(0));

      TodoList todoList = TodoList(todoListAddress);

      vm.prank(allUsers[i]);
      TodoList.Todo[] memory todos = todoList.getTodos();
      assertEq(todos.length, 2);

      vm.prank(allUsers[i]);
      TodoList.TodoStats memory stats = todoList.getTodoStats();
      assertEq(stats.total, 2);
      assertEq(stats.completed, 1);
    }
  }
}
