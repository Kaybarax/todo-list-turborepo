const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('Moonbeam TodoList Contract Tests', function () {
  let TodoList;
  let todoList;
  let owner;
  let user1;
  let user2;
  let addrs;

  // Deploy fixture for reuse
  async function deployTodoListFixture() {
    const [owner, user1, user2, ...addrs] = await ethers.getSigners();

    const TodoList = await ethers.getContractFactory('TodoList');
    const todoList = await TodoList.deploy();

    return { TodoList, todoList, owner, user1, user2, addrs };
  }

  beforeEach(async function () {
    ({ TodoList, todoList, owner, user1, user2, addrs } = await loadFixture(deployTodoListFixture));
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await todoList.owner()).to.equal(owner.address);
    });

    it('Should initialize with correct constants', async function () {
      expect(await todoList.MAX_TITLE_LENGTH()).to.equal(100);
      expect(await todoList.MAX_DESCRIPTION_LENGTH()).to.equal(500);
      expect(await todoList.MAX_TODOS_PER_USER()).to.equal(50);
    });

    it('Should initialize with empty todo stats', async function () {
      const stats = await todoList.getTodoStats();
      expect(stats.total).to.equal(0);
      expect(stats.completed).to.equal(0);
      expect(stats.pending).to.equal(0);
      expect(stats.highPriority).to.equal(0);
    });
  });

  describe('Todo Creation', function () {
    const validTodo = {
      title: 'Deploy on Moonbeam parachain',
      description: "Successfully deploy todo contracts on Moonbeam's EVM-compatible parachain",
      priority: 1, // Medium
    };

    it('Should create a todo successfully', async function () {
      await expect(todoList.createTodo(validTodo.title, validTodo.description, validTodo.priority))
        .to.emit(todoList, 'TodoCreated')
        .withArgs(owner.address, 1, validTodo.title, validTodo.priority);

      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(1);

      const todo = todos[0];
      expect(todo.id).to.equal(1);
      expect(todo.title).to.equal(validTodo.title);
      expect(todo.description).to.equal(validTodo.description);
      expect(todo.priority).to.equal(validTodo.priority);
      expect(todo.completed).to.be.false;
      expect(todo.createdAt).to.be.above(0);
      expect(todo.updatedAt).to.be.above(0);
      expect(todo.completedAt).to.equal(0);
    });

    it('Should create multiple todos with incremental IDs', async function () {
      await todoList.createTodo('Todo 1', 'Description 1', 0);
      await todoList.createTodo('Todo 2', 'Description 2', 1);
      await todoList.createTodo('Todo 3', 'Description 3', 2);

      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(3);
      expect(todos[0].id).to.equal(1);
      expect(todos[1].id).to.equal(2);
      expect(todos[2].id).to.equal(3);
    });

    it('Should fail with empty title', async function () {
      await expect(todoList.createTodo('', validTodo.description, validTodo.priority)).to.be.revertedWith(
        'Title cannot be empty',
      );
    });

    it('Should fail with title too long', async function () {
      const longTitle = 'a'.repeat(101); // 101 characters

      await expect(todoList.createTodo(longTitle, validTodo.description, validTodo.priority)).to.be.revertedWith(
        'Title is too long',
      );
    });

    it('Should fail with description too long', async function () {
      const longDescription = 'a'.repeat(501); // 501 characters

      await expect(todoList.createTodo(validTodo.title, longDescription, validTodo.priority)).to.be.revertedWith(
        'Description is too long',
      );
    });

    it('Should allow empty description', async function () {
      await expect(todoList.createTodo(validTodo.title, '', validTodo.priority)).to.not.be.reverted;
    });

    it('Should handle all priority levels', async function () {
      await todoList.createTodo('Low Priority', 'Description', 0);
      await todoList.createTodo('Medium Priority', 'Description', 1);
      await todoList.createTodo('High Priority', 'Description', 2);

      const todos = await todoList.getTodos();
      expect(todos[0].priority).to.equal(0); // Low
      expect(todos[1].priority).to.equal(1); // Medium
      expect(todos[2].priority).to.equal(2); // High
    });

    it('Should fail when todo list is full', async function () {
      // Create maximum number of todos
      for (let i = 0; i < 50; i++) {
        await todoList.createTodo(`Todo ${i}`, `Description ${i}`, 0);
      }

      // Try to create one more
      await expect(todoList.createTodo('Extra Todo', 'Extra Description', 0)).to.be.revertedWith('Todo list is full');
    });

    it('Should work for different users independently', async function () {
      await todoList.connect(user1).createTodo('User1 Todo', 'Description', 1);
      await todoList.connect(user2).createTodo('User2 Todo', 'Description', 2);

      const user1Todos = await todoList.connect(user1).getTodos();
      const user2Todos = await todoList.connect(user2).getTodos();

      expect(user1Todos.length).to.equal(1);
      expect(user2Todos.length).to.equal(1);
      expect(user1Todos[0].title).to.equal('User1 Todo');
      expect(user2Todos[0].title).to.equal('User2 Todo');
    });
  });

  describe('Todo Retrieval', function () {
    beforeEach(async function () {
      await todoList.createTodo('Todo 1', 'Description 1', 0);
      await todoList.createTodo('Todo 2', 'Description 2', 1);
      await todoList.createTodo('Todo 3', 'Description 3', 2);
    });

    it('Should get all todos for user', async function () {
      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(3);
    });

    it('Should get specific todo by ID', async function () {
      const todo = await todoList.getTodo(2);
      expect(todo.id).to.equal(2);
      expect(todo.title).to.equal('Todo 2');
      expect(todo.description).to.equal('Description 2');
      expect(todo.priority).to.equal(1);
    });

    it('Should fail to get non-existent todo', async function () {
      await expect(todoList.getTodo(999)).to.be.revertedWith('Todo not found');
    });

    it('Should return correct todo stats', async function () {
      // Complete one todo
      await todoList.toggleTodoCompletion(1);

      const stats = await todoList.getTodoStats();
      expect(stats.total).to.equal(3);
      expect(stats.completed).to.equal(1);
      expect(stats.pending).to.equal(2);
      expect(stats.highPriority).to.equal(1); // Todo 3 has high priority and is not completed
    });
  });

  describe('Todo Updates', function () {
    beforeEach(async function () {
      await todoList.createTodo('Original Title', 'Original Description', 1);
    });

    it('Should update todo title', async function () {
      const newTitle = 'Updated Title';

      await expect(todoList.updateTodo(1, newTitle, '', ethers.MaxUint256))
        .to.emit(todoList, 'TodoUpdated')
        .withArgs(owner.address, 1, newTitle, 1);

      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal(newTitle);
      expect(todo.description).to.equal('Original Description'); // unchanged
      expect(todo.priority).to.equal(1); // unchanged
    });

    it('Should update todo description', async function () {
      const newDescription = 'Updated Description';

      await todoList.updateTodo(1, '', newDescription, ethers.MaxUint256);

      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal('Original Title'); // unchanged
      expect(todo.description).to.equal(newDescription);
      expect(todo.priority).to.equal(1); // unchanged
    });

    it('Should update todo priority', async function () {
      await todoList.updateTodo(1, '', '', 2); // High priority

      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal('Original Title'); // unchanged
      expect(todo.description).to.equal('Original Description'); // unchanged
      expect(todo.priority).to.equal(2);
    });

    it('Should update multiple fields at once', async function () {
      await todoList.updateTodo(1, 'New Title', 'New Description', 0);

      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal('New Title');
      expect(todo.description).to.equal('New Description');
      expect(todo.priority).to.equal(0);
    });

    it('Should update timestamp on update', async function () {
      const todoBefore = await todoList.getTodo(1);

      // Wait a bit to ensure timestamp difference
      await time.increase(1);

      await todoList.updateTodo(1, 'Updated Title', '', ethers.MaxUint256);

      const todoAfter = await todoList.getTodo(1);
      expect(todoAfter.updatedAt).to.be.above(todoBefore.updatedAt);
    });

    it('Should fail to update non-existent todo', async function () {
      await expect(todoList.updateTodo(999, 'Title', 'Description', 1)).to.be.revertedWith('Todo not found');
    });

    it('Should fail with invalid priority', async function () {
      await expect(todoList.updateTodo(1, '', '', 3)) // Invalid priority
        .to.be.revertedWith('Invalid priority value');
    });

    it('Should fail with title too long', async function () {
      const longTitle = 'a'.repeat(101);

      await expect(todoList.updateTodo(1, longTitle, '', ethers.MaxUint256)).to.be.revertedWith('Title is too long');
    });

    it('Should fail with description too long', async function () {
      const longDescription = 'a'.repeat(501);

      await expect(todoList.updateTodo(1, '', longDescription, ethers.MaxUint256)).to.be.revertedWith(
        'Description is too long',
      );
    });
  });

  describe('Todo Completion Toggle', function () {
    beforeEach(async function () {
      await todoList.createTodo('Test Todo', 'Test Description', 1);
    });

    it('Should toggle todo completion from false to true', async function () {
      await expect(todoList.toggleTodoCompletion(1))
        .to.emit(todoList, 'TodoCompletionToggled')
        .withArgs(owner.address, 1, true);

      const todo = await todoList.getTodo(1);
      expect(todo.completed).to.be.true;
      expect(todo.completedAt).to.be.above(0);
    });

    it('Should toggle todo completion from true to false', async function () {
      // First complete it
      await todoList.toggleTodoCompletion(1);

      // Then uncomplete it
      await expect(todoList.toggleTodoCompletion(1))
        .to.emit(todoList, 'TodoCompletionToggled')
        .withArgs(owner.address, 1, false);

      const todo = await todoList.getTodo(1);
      expect(todo.completed).to.be.false;
      expect(todo.completedAt).to.equal(0);
    });

    it('Should update timestamp on completion toggle', async function () {
      const todoBefore = await todoList.getTodo(1);

      await time.increase(1);

      await todoList.toggleTodoCompletion(1);

      const todoAfter = await todoList.getTodo(1);
      expect(todoAfter.updatedAt).to.be.above(todoBefore.updatedAt);
    });

    it('Should fail to toggle non-existent todo', async function () {
      await expect(todoList.toggleTodoCompletion(999)).to.be.revertedWith('Todo not found');
    });
  });

  describe('Todo Deletion', function () {
    beforeEach(async function () {
      await todoList.createTodo('Todo 1', 'Description 1', 0);
      await todoList.createTodo('Todo 2', 'Description 2', 1);
      await todoList.createTodo('Todo 3', 'Description 3', 2);
    });

    it('Should delete todo successfully', async function () {
      await expect(todoList.deleteTodo(2)).to.emit(todoList, 'TodoDeleted').withArgs(owner.address, 2);

      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(2);

      // Should not find the deleted todo
      await expect(todoList.getTodo(2)).to.be.revertedWith('Todo not found');
    });

    it('Should maintain array integrity after deletion', async function () {
      await todoList.deleteTodo(1); // Delete first todo

      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(2);

      // Remaining todos should still be accessible
      const todo2 = await todoList.getTodo(2);
      const todo3 = await todoList.getTodo(3);

      expect(todo2.title).to.equal('Todo 2');
      expect(todo3.title).to.equal('Todo 3');
    });

    it('Should delete last todo correctly', async function () {
      await todoList.deleteTodo(3); // Delete last todo

      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(2);

      // First two todos should still exist
      const todo1 = await todoList.getTodo(1);
      const todo2 = await todoList.getTodo(2);

      expect(todo1.title).to.equal('Todo 1');
      expect(todo2.title).to.equal('Todo 2');
    });

    it('Should fail to delete non-existent todo', async function () {
      await expect(todoList.deleteTodo(999)).to.be.revertedWith('Todo not found');
    });

    it('Should allow creating new todo after deletion', async function () {
      await todoList.deleteTodo(2);

      await todoList.createTodo('New Todo', 'New Description', 1);

      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(3);

      // New todo should have ID 4 (next in sequence)
      const newTodo = todos[2];
      expect(newTodo.id).to.equal(4);
      expect(newTodo.title).to.equal('New Todo');
    });
  });

  describe('Access Control', function () {
    beforeEach(async function () {
      await todoList.connect(user1).createTodo('User1 Todo', 'Description', 1);
      await todoList.connect(user2).createTodo('User2 Todo', 'Description', 1);
    });

    it('Should only allow users to access their own todos', async function () {
      const user1Todos = await todoList.connect(user1).getTodos();
      const user2Todos = await todoList.connect(user2).getTodos();

      expect(user1Todos.length).to.equal(1);
      expect(user2Todos.length).to.equal(1);
      expect(user1Todos[0].title).to.equal('User1 Todo');
      expect(user2Todos[0].title).to.equal('User2 Todo');
    });

    it('Should not allow users to access other users todos by ID', async function () {
      // User1 creates a todo with ID 1
      // User2 tries to access it - should fail because it doesn't exist in user2's list
      await expect(todoList.connect(user2).getTodo(1)).to.be.revertedWith('Todo not found');
    });

    it('Should not allow users to modify other users todos', async function () {
      // User2 tries to update User1's todo - should fail
      await expect(todoList.connect(user2).updateTodo(1, 'Hacked', '', ethers.MaxUint256)).to.be.revertedWith(
        'Todo not found',
      );
    });
  });

  describe('Gas Optimization Tests', function () {
    it('Should handle maximum todos efficiently', async function () {
      // Create maximum number of todos
      for (let i = 0; i < 50; i++) {
        await todoList.createTodo(`Todo ${i}`, `Description ${i}`, i % 3);
      }

      // Should still be able to retrieve all todos efficiently
      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(50);

      // Should be able to get stats efficiently
      const stats = await todoList.getTodoStats();
      expect(stats.total).to.equal(50);
    });

    it('Should handle deletion efficiently with large todo list', async function () {
      // Create multiple todos
      for (let i = 0; i < 10; i++) {
        await todoList.createTodo(`Todo ${i}`, `Description ${i}`, i % 3);
      }

      // Delete from middle
      await todoList.deleteTodo(5);

      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(9);
    });
  });

  describe('Moonbeam-Specific Features', function () {
    it("Should work with Moonbeam's EVM compatibility", async function () {
      // Test that standard EVM features work on Moonbeam
      const blockNumber = await ethers.provider.getBlockNumber();
      expect(blockNumber).to.be.above(0);

      // Create a todo and verify it works with Moonbeam's block structure
      await todoList.createTodo('Moonbeam Todo', 'Testing EVM compatibility', 2);

      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(1);
      expect(todos[0].createdAt).to.be.above(0);
    });

    it("Should handle Moonbeam's gas pricing efficiently", async function () {
      // Create a todo and check that it doesn't consume excessive gas
      const tx = await todoList.createTodo('Gas Test', 'Testing gas efficiency', 1);
      const receipt = await tx.wait();

      // Moonbeam should have reasonable gas costs
      expect(receipt.gasUsed).to.be.below(200000); // Should be well under 200k gas
    });
  });
});
