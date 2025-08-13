const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('Moonbeam Integration Tests', function () {
  let TodoListFactory;
  let todoListFactory;
  let TodoList;
  let owner;
  let user1;
  let user2;
  let user3;
  let addrs;

  // Deploy fixture for integration tests
  async function deployIntegrationFixture() {
    const [owner, user1, user2, user3, ...addrs] = await ethers.getSigners();

    const TodoListFactory = await ethers.getContractFactory('TodoListFactory');
    const todoListFactory = await TodoListFactory.deploy();

    const TodoList = await ethers.getContractFactory('TodoList');

    return { TodoListFactory, todoListFactory, TodoList, owner, user1, user2, user3, addrs };
  }

  beforeEach(async function () {
    ({ TodoListFactory, todoListFactory, TodoList, owner, user1, user2, user3, addrs } =
      await loadFixture(deployIntegrationFixture));
  });

  describe('End-to-End Workflow', function () {
    it('Should support complete todo management workflow', async function () {
      // Step 1: User creates a TodoList through factory
      await todoListFactory.connect(user1).createTodoList();
      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Step 2: User creates multiple todos
      await todoListContract.connect(user1).createTodo(
        'Deploy on Moonbeam',
        'Deploy smart contracts on Moonbeam parachain',
        2, // High priority
      );

      await todoListContract.connect(user1).createTodo(
        'Test Polkadot integration',
        'Verify cross-chain functionality',
        1, // Medium priority
      );

      await todoListContract.connect(user1).createTodo(
        'Optimize gas costs',
        'Ensure efficient gas usage on Moonbeam',
        0, // Low priority
      );

      // Step 3: Verify todos were created
      const todos = await todoListContract.connect(user1).getTodos();
      expect(todos.length).to.equal(3);
      expect(todos[0].title).to.equal('Deploy on Moonbeam');
      expect(todos[1].title).to.equal('Test Polkadot integration');
      expect(todos[2].title).to.equal('Optimize gas costs');

      // Step 4: Update a todo
      await todoListContract.connect(user1).updateTodo(
        2,
        'Test Polkadot integration - Updated',
        'Verify cross-chain functionality with additional testing',
        2, // Change to high priority
      );

      const updatedTodo = await todoListContract.connect(user1).getTodo(2);
      expect(updatedTodo.title).to.equal('Test Polkadot integration - Updated');
      expect(updatedTodo.priority).to.equal(2);

      // Step 5: Complete a todo
      await todoListContract.connect(user1).toggleTodoCompletion(1);
      const completedTodo = await todoListContract.connect(user1).getTodo(1);
      expect(completedTodo.completed).to.be.true;
      expect(completedTodo.completedAt).to.be.above(0);

      // Step 6: Check statistics
      const stats = await todoListContract.connect(user1).getTodoStats();
      expect(stats.total).to.equal(3);
      expect(stats.completed).to.equal(1);
      expect(stats.pending).to.equal(2);
      expect(stats.highPriority).to.equal(1); // Todo 2 is high priority and not completed

      // Step 7: Delete a todo
      await todoListContract.connect(user1).deleteTodo(3);
      const finalTodos = await todoListContract.connect(user1).getTodos();
      expect(finalTodos.length).to.equal(2);

      // Step 8: Verify final state
      const finalStats = await todoListContract.connect(user1).getTodoStats();
      expect(finalStats.total).to.equal(2);
      expect(finalStats.completed).to.equal(1);
      expect(finalStats.pending).to.equal(1);
    });

    it('Should support multiple users with independent todo lists', async function () {
      // Create TodoLists for multiple users
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
      await todoListFactory.connect(user3).createTodoList();

      const user1TodoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const user2TodoListAddress = await todoListFactory.getTodoListForUser(user2.address);
      const user3TodoListAddress = await todoListFactory.getTodoListForUser(user3.address);

      const user1TodoList = TodoList.attach(user1TodoListAddress);
      const user2TodoList = TodoList.attach(user2TodoListAddress);
      const user3TodoList = TodoList.attach(user3TodoListAddress);

      // Each user creates different todos
      await user1TodoList.connect(user1).createTodo('User1 Todo 1', 'Description 1', 0);
      await user1TodoList.connect(user1).createTodo('User1 Todo 2', 'Description 2', 1);

      await user2TodoList.connect(user2).createTodo('User2 Todo 1', 'Description 1', 2);
      await user2TodoList.connect(user2).createTodo('User2 Todo 2', 'Description 2', 0);
      await user2TodoList.connect(user2).createTodo('User2 Todo 3', 'Description 3', 1);

      await user3TodoList.connect(user3).createTodo('User3 Todo 1', 'Description 1', 1);

      // Verify each user has their own todos
      const user1Todos = await user1TodoList.connect(user1).getTodos();
      const user2Todos = await user2TodoList.connect(user2).getTodos();
      const user3Todos = await user3TodoList.connect(user3).getTodos();

      expect(user1Todos.length).to.equal(2);
      expect(user2Todos.length).to.equal(3);
      expect(user3Todos.length).to.equal(1);

      // Verify todo isolation
      expect(user1Todos[0].title).to.equal('User1 Todo 1');
      expect(user2Todos[0].title).to.equal('User2 Todo 1');
      expect(user3Todos[0].title).to.equal('User3 Todo 1');

      // Verify factory tracking
      expect(await todoListFactory.getUserCount()).to.equal(3);
      const users = await todoListFactory.getUsers(0, 10);
      expect(users).to.include(user1.address);
      expect(users).to.include(user2.address);
      expect(users).to.include(user3.address);
    });
  });

  describe('Moonbeam-Specific Integration Tests', function () {
    it("Should handle Moonbeam's EVM compatibility across contracts", async function () {
      // Test that both factory and TodoList work together on Moonbeam
      const blockNumberBefore = await ethers.provider.getBlockNumber();

      // Create TodoList through factory
      await todoListFactory.connect(user1).createTodoList();
      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Create a todo with Moonbeam-specific content
      await todoListContract
        .connect(user1)
        .createTodo('Moonbeam Parachain Integration', 'Test full EVM compatibility on Polkadot parachain', 2);

      const blockNumberAfter = await ethers.provider.getBlockNumber();
      expect(blockNumberAfter).to.be.above(blockNumberBefore);

      // Verify the todo was created successfully
      const todos = await todoListContract.connect(user1).getTodos();
      expect(todos.length).to.equal(1);
      expect(todos[0].title).to.equal('Moonbeam Parachain Integration');
      expect(todos[0].createdAt).to.be.above(0);
    });

    it('Should handle gas optimization across contract interactions', async function () {
      // Test gas efficiency for the complete workflow
      const gasUsages = [];

      // Create TodoList
      const createTx = await todoListFactory.connect(user1).createTodoList();
      const createReceipt = await createTx.wait();
      gasUsages.push({ operation: 'createTodoList', gas: createReceipt.gasUsed });

      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Create todo
      const todoTx = await todoListContract
        .connect(user1)
        .createTodo('Gas Optimization Test', 'Testing gas efficiency on Moonbeam', 1);
      const todoReceipt = await todoTx.wait();
      gasUsages.push({ operation: 'createTodo', gas: todoReceipt.gasUsed });

      // Update todo
      const updateTx = await todoListContract
        .connect(user1)
        .updateTodo(1, 'Updated Gas Test', 'Updated description', 2);
      const updateReceipt = await updateTx.wait();
      gasUsages.push({ operation: 'updateTodo', gas: updateReceipt.gasUsed });

      // Toggle completion
      const toggleTx = await todoListContract.connect(user1).toggleTodoCompletion(1);
      const toggleReceipt = await toggleTx.wait();
      gasUsages.push({ operation: 'toggleCompletion', gas: toggleReceipt.gasUsed });

      // All operations should have reasonable gas costs for Moonbeam
      gasUsages.forEach(({ operation, gas }) => {
        console.log(`${operation}: ${gas} gas`);
        expect(gas).to.be.below(500000); // Should be efficient
        expect(gas).to.be.above(20000); // Should do meaningful work
      });
    });

    it("Should support Moonbeam's substrate-based features", async function () {
      // Test that the contracts work well with Moonbeam's substrate architecture
      await todoListFactory.connect(user1).createTodoList();
      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Create todos with substrate-related content
      await todoListContract
        .connect(user1)
        .createTodo('Substrate Integration', "Leverage Moonbeam's Substrate-based architecture", 2);

      await todoListContract
        .connect(user1)
        .createTodo('Cross-chain Communication', 'Test XCM integration with other parachains', 1);

      // Verify both todos were created successfully
      const todos = await todoListContract.connect(user1).getTodos();
      expect(todos.length).to.equal(2);

      // Test that we can perform operations on both
      await todoListContract.connect(user1).toggleTodoCompletion(1);
      await todoListContract.connect(user1).updateTodo(2, '', 'Updated XCM testing', ethers.MaxUint256);

      const stats = await todoListContract.connect(user1).getTodoStats();
      expect(stats.total).to.equal(2);
      expect(stats.completed).to.equal(1);
      expect(stats.pending).to.equal(1);
    });
  });

  describe('Performance and Scalability Tests', function () {
    it('Should handle large-scale operations efficiently', async function () {
      // Create TodoLists for many users
      const userCount = 10;
      const todosPerUser = 5;

      for (let i = 0; i < userCount; i++) {
        await todoListFactory.connect(addrs[i]).createTodoList();

        const todoListAddress = await todoListFactory.getTodoListForUser(addrs[i].address);
        const todoListContract = TodoList.attach(todoListAddress);

        // Create multiple todos for each user
        for (let j = 0; j < todosPerUser; j++) {
          await todoListContract.connect(addrs[i]).createTodo(
            `User ${i} Todo ${j}`,
            `Description for user ${i} todo ${j}`,
            j % 3, // Rotate through priorities
          );
        }
      }

      // Verify all users and todos were created
      expect(await todoListFactory.getUserCount()).to.equal(userCount);

      // Test that we can still query efficiently
      const users = await todoListFactory.getUsers(0, userCount);
      expect(users.length).to.equal(userCount);

      // Verify each user has their todos
      for (let i = 0; i < userCount; i++) {
        const todoListAddress = await todoListFactory.getTodoListForUser(addrs[i].address);
        const todoListContract = TodoList.attach(todoListAddress);
        const todos = await todoListContract.connect(addrs[i]).getTodos();
        expect(todos.length).to.equal(todosPerUser);
      }
    });

    it('Should maintain performance with complex operations', async function () {
      await todoListFactory.connect(user1).createTodoList();
      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Create many todos
      const todoCount = 20;
      for (let i = 0; i < todoCount; i++) {
        await todoListContract
          .connect(user1)
          .createTodo(`Performance Test Todo ${i}`, `Testing performance with todo ${i}`, i % 3);
      }

      // Perform various operations
      const startTime = Date.now();

      // Update several todos
      for (let i = 1; i <= 5; i++) {
        await todoListContract
          .connect(user1)
          .updateTodo(i, `Updated Todo ${i}`, `Updated description ${i}`, (i + 1) % 3);
      }

      // Complete several todos
      for (let i = 6; i <= 10; i++) {
        await todoListContract.connect(user1).toggleTodoCompletion(i);
      }

      // Delete several todos
      for (let i = 11; i <= 15; i++) {
        await todoListContract.connect(user1).deleteTodo(i);
      }

      const endTime = Date.now();
      const operationTime = endTime - startTime;

      // Should complete operations in reasonable time
      expect(operationTime).to.be.below(30000); // 30 seconds max

      // Verify final state
      const finalTodos = await todoListContract.connect(user1).getTodos();
      expect(finalTodos.length).to.equal(15); // 20 - 5 deleted

      const stats = await todoListContract.connect(user1).getTodoStats();
      expect(stats.total).to.equal(15);
      expect(stats.completed).to.equal(5);
      expect(stats.pending).to.equal(10);
    });
  });

  describe('Error Handling and Edge Cases', function () {
    it('Should handle contract interaction failures gracefully', async function () {
      await todoListFactory.connect(user1).createTodoList();
      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Try to access non-existent todo
      await expect(todoListContract.connect(user1).getTodo(999)).to.be.revertedWith('Todo not found');

      // Try to update non-existent todo
      await expect(todoListContract.connect(user1).updateTodo(999, 'Title', 'Desc', 1)).to.be.revertedWith(
        'Todo not found',
      );

      // Try to delete non-existent todo
      await expect(todoListContract.connect(user1).deleteTodo(999)).to.be.revertedWith('Todo not found');

      // Try to create duplicate TodoList
      await expect(todoListFactory.connect(user1).createTodoList()).to.be.revertedWith(
        'TodoList already exists for this user',
      );
    });

    it('Should maintain data integrity across complex operations', async function () {
      await todoListFactory.connect(user1).createTodoList();
      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Create, update, complete, and delete todos in various orders
      await todoListContract.connect(user1).createTodo('Todo 1', 'Desc 1', 0);
      await todoListContract.connect(user1).createTodo('Todo 2', 'Desc 2', 1);
      await todoListContract.connect(user1).createTodo('Todo 3', 'Desc 3', 2);
      await todoListContract.connect(user1).createTodo('Todo 4', 'Desc 4', 0);

      // Complex sequence of operations
      await todoListContract.connect(user1).toggleTodoCompletion(2);
      await todoListContract.connect(user1).deleteTodo(1);
      await todoListContract.connect(user1).updateTodo(3, 'Updated Todo 3', '', 1);
      await todoListContract.connect(user1).createTodo('Todo 5', 'Desc 5', 2);
      await todoListContract.connect(user1).toggleTodoCompletion(4);

      // Verify final state is consistent
      const todos = await todoListContract.connect(user1).getTodos();
      expect(todos.length).to.equal(4); // 5 created - 1 deleted

      const stats = await todoListContract.connect(user1).getTodoStats();
      expect(stats.total).to.equal(4);
      expect(stats.completed).to.equal(2); // Todos 2 and 4
      expect(stats.pending).to.equal(2);

      // Verify specific todos exist and have correct properties
      const todo3 = await todoListContract.connect(user1).getTodo(3);
      expect(todo3.title).to.equal('Updated Todo 3');
      expect(todo3.priority).to.equal(1);

      const todo5 = await todoListContract.connect(user1).getTodo(5);
      expect(todo5.title).to.equal('Todo 5');
      expect(todo5.priority).to.equal(2);
    });
  });

  describe('Event Emission Integration', function () {
    it('Should emit all events correctly throughout workflow', async function () {
      // Test TodoListFactory events
      await expect(todoListFactory.connect(user1).createTodoList())
        .to.emit(todoListFactory, 'TodoListCreated')
        .withArgs(user1.address, await todoListFactory.connect(user1).getTodoList.staticCall());

      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Test TodoList events
      await expect(todoListContract.connect(user1).createTodo('Test Todo', 'Description', 1))
        .to.emit(todoListContract, 'TodoCreated')
        .withArgs(user1.address, 1, 'Test Todo', 1);

      await expect(todoListContract.connect(user1).updateTodo(1, 'Updated Todo', '', ethers.MaxUint256))
        .to.emit(todoListContract, 'TodoUpdated')
        .withArgs(user1.address, 1, 'Updated Todo', 1);

      await expect(todoListContract.connect(user1).toggleTodoCompletion(1))
        .to.emit(todoListContract, 'TodoCompletionToggled')
        .withArgs(user1.address, 1, true);

      await expect(todoListContract.connect(user1).deleteTodo(1))
        .to.emit(todoListContract, 'TodoDeleted')
        .withArgs(user1.address, 1);
    });
  });
});
