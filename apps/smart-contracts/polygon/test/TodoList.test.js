const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TodoList Contract Tests', function () {
  let TodoList;
  let todoList;
  let owner;
  let user1;
  let user2;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();
    
    TodoList = await ethers.getContractFactory('TodoList');
    todoList = await TodoList.deploy(owner.address);
    await todoList.deployed();
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await todoList.owner()).to.equal(owner.address);
    });

    it('Should initialize with empty todo list', async function () {
      expect(await todoList.getTodoCount()).to.equal(0);
    });

    it('Should emit OwnershipTransferred event on deployment', async function () {
      const TodoListFactory = await ethers.getContractFactory('TodoList');
      
      await expect(TodoListFactory.deploy(owner.address))
        .to.emit(TodoListFactory, 'OwnershipTransferred')
        .withArgs(ethers.constants.AddressZero, owner.address);
    });
  });

  describe('Todo Creation', function () {
    const validTodo = {
      title: 'Test Todo',
      description: 'Test Description',
      priority: 1, // medium
      dueDate: Math.floor(Date.now() / 1000) + 86400, // tomorrow
    };

    it('Should create a todo successfully', async function () {
      await expect(todoList.createTodo(
        validTodo.title,
        validTodo.description,
        validTodo.priority,
        validTodo.dueDate
      ))
        .to.emit(todoList, 'TodoCreated')
        .withArgs(0, owner.address, validTodo.title);

      const todo = await todoList.getTodo(0);
      expect(todo.title).to.equal(validTodo.title);
      expect(todo.description).to.equal(validTodo.description);
      expect(todo.priority).to.equal(validTodo.priority);
      expect(todo.dueDate).to.equal(validTodo.dueDate);
      expect(todo.completed).to.be.false;
      expect(todo.owner).to.equal(owner.address);
      expect(todo.createdAt).to.be.above(0);
    });

    it('Should increment todo count after creation', async function () {
      await todoList.createTodo(
        validTodo.title,
        validTodo.description,
        validTodo.priority,
        validTodo.dueDate
      );

      expect(await todoList.getTodoCount()).to.equal(1);
    });

    it('Should fail with empty title', async function () {
      await expect(todoList.createTodo(
        '',
        validTodo.description,
        validTodo.priority,
        validTodo.dueDate
      )).to.be.revertedWith('Title cannot be empty');
    });

    it('Should fail with past due date', async function () {
      const pastDate = Math.floor(Date.now() / 1000) - 86400; // yesterday
      
      await expect(todoList.createTodo(
        validTodo.title,
        validTodo.description,
        validTodo.priority,
        pastDate
      )).to.be.revertedWith('Due date cannot be in the past');
    });

    it('Should fail with invalid priority', async function () {
      await expect(todoList.createTodo(
        validTodo.title,
        validTodo.description,
        5, // invalid priority
        validTodo.dueDate
      )).to.be.revertedWith('Invalid priority');
    });

    it('Should allow only owner to create todos', async function () {
      await expect(todoList.connect(user1).createTodo(
        validTodo.title,
        validTodo.description,
        validTodo.priority,
        validTodo.dueDate
      )).to.be.revertedWith('Not the owner of this TodoList');
    });

    it('Should handle different priority levels', async function () {
      // Low priority
      await todoList.createTodo('Low Priority', 'Description', 0, validTodo.dueDate);
      let todo = await todoList.getTodo(0);
      expect(todo.priority).to.equal(0);

      // Medium priority
      await todoList.createTodo('Medium Priority', 'Description', 1, validTodo.dueDate);
      todo = await todoList.getTodo(1);
      expect(todo.priority).to.equal(1);

      // High priority
      await todoList.createTodo('High Priority', 'Description', 2, validTodo.dueDate);
      todo = await todoList.getTodo(2);
      expect(todo.priority).to.equal(2);
    });

    it('Should handle maximum title length', async function () {
      const longTitle = 'a'.repeat(200); // Assuming max length is 200
      
      await todoList.createTodo(
        longTitle,
        validTodo.description,
        validTodo.priority,
        validTodo.dueDate
      );

      const todo = await todoList.getTodo(0);
      expect(todo.title).to.equal(longTitle);
    });

    it('Should handle empty description', async function () {
      await todoList.createTodo(
        validTodo.title,
        '',
        validTodo.priority,
        validTodo.dueDate
      );

      const todo = await todoList.getTodo(0);
      expect(todo.description).to.equal('');
    });
  });

  describe('Todo Retrieval', function () {
    beforeEach(async function () {
      // Create test todos
      await todoList.createTodo('Todo 1', 'Description 1', 0, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Todo 2', 'Description 2', 1, Math.floor(Date.now() / 1000) + 172800);
      await todoList.createTodo('Todo 3', 'Description 3', 2, Math.floor(Date.now() / 1000) + 259200);
    });

    it('Should get todo by index', async function () {
      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal('Todo 2');
      expect(todo.description).to.equal('Description 2');
      expect(todo.priority).to.equal(1);
    });

    it('Should fail to get non-existent todo', async function () {
      await expect(todoList.getTodo(999)).to.be.revertedWith('Todo does not exist');
    });

    it('Should get all todos', async function () {
      const todos = await todoList.getAllTodos();
      expect(todos.length).to.equal(3);
      expect(todos[0].title).to.equal('Todo 1');
      expect(todos[1].title).to.equal('Todo 2');
      expect(todos[2].title).to.equal('Todo 3');
    });

    it('Should get correct todo count', async function () {
      expect(await todoList.getTodoCount()).to.equal(3);
    });

    it('Should get todos by completion status', async function () {
      // Complete one todo
      await todoList.toggleTodo(1);

      const completedTodos = await todoList.getTodosByStatus(true);
      const activeTodos = await todoList.getTodosByStatus(false);

      expect(completedTodos.length).to.equal(1);
      expect(activeTodos.length).to.equal(2);
      expect(completedTodos[0].title).to.equal('Todo 2');
    });

    it('Should get todos by priority', async function () {
      const highPriorityTodos = await todoList.getTodosByPriority(2);
      const mediumPriorityTodos = await todoList.getTodosByPriority(1);
      const lowPriorityTodos = await todoList.getTodosByPriority(0);

      expect(highPriorityTodos.length).to.equal(1);
      expect(mediumPriorityTodos.length).to.equal(1);
      expect(lowPriorityTodos.length).to.equal(1);
      expect(highPriorityTodos[0].title).to.equal('Todo 3');
    });

    it('Should get overdue todos', async function () {
      // Create an overdue todo (this would require time manipulation in a real test)
      // For now, we'll test the function exists and returns empty array
      const overdueTodos = await todoList.getOverdueTodos();
      expect(Array.isArray(overdueTodos)).to.be.true;
    });
  });

  describe('Todo Updates', function () {
    beforeEach(async function () {
      await todoList.createTodo('Original Title', 'Original Description', 1, Math.floor(Date.now() / 1000) + 86400);
    });

    it('Should update todo successfully', async function () {
      const newTitle = 'Updated Title';
      const newDescription = 'Updated Description';
      const newPriority = 2;
      const newDueDate = Math.floor(Date.now() / 1000) + 172800;

      await expect(todoList.updateTodo(0, newTitle, newDescription, newPriority, newDueDate))
        .to.emit(todoList, 'TodoUpdated')
        .withArgs(0, owner.address);

      const todo = await todoList.getTodo(0);
      expect(todo.title).to.equal(newTitle);
      expect(todo.description).to.equal(newDescription);
      expect(todo.priority).to.equal(newPriority);
      expect(todo.dueDate).to.equal(newDueDate);
    });

    it('Should fail to update non-existent todo', async function () {
      await expect(todoList.updateTodo(999, 'Title', 'Description', 1, Math.floor(Date.now() / 1000) + 86400))
        .to.be.revertedWith('Todo does not exist');
    });

    it('Should fail to update with empty title', async function () {
      await expect(todoList.updateTodo(0, '', 'Description', 1, Math.floor(Date.now() / 1000) + 86400))
        .to.be.revertedWith('Title cannot be empty');
    });

    it('Should fail to update with past due date', async function () {
      const pastDate = Math.floor(Date.now() / 1000) - 86400;
      await expect(todoList.updateTodo(0, 'Title', 'Description', 1, pastDate))
        .to.be.revertedWith('Due date cannot be in the past');
    });

    it('Should fail to update with invalid priority', async function () {
      await expect(todoList.updateTodo(0, 'Title', 'Description', 5, Math.floor(Date.now() / 1000) + 86400))
        .to.be.revertedWith('Invalid priority');
    });

    it('Should allow only owner to update todos', async function () {
      await expect(todoList.connect(user1).updateTodo(0, 'Hacked', 'Description', 1, Math.floor(Date.now() / 1000) + 86400))
        .to.be.revertedWith('Not the owner of this TodoList');
    });

    it('Should preserve creation timestamp on update', async function () {
      const originalTodo = await todoList.getTodo(0);
      const originalCreatedAt = originalTodo.createdAt;

      await todoList.updateTodo(0, 'Updated Title', 'Updated Description', 2, Math.floor(Date.now() / 1000) + 172800);

      const updatedTodo = await todoList.getTodo(0);
      expect(updatedTodo.createdAt).to.equal(originalCreatedAt);
    });
  });

  describe('Todo Completion Toggle', function () {
    beforeEach(async function () {
      await todoList.createTodo('Test Todo', 'Test Description', 1, Math.floor(Date.now() / 1000) + 86400);
    });

    it('Should toggle todo completion', async function () {
      // Initially not completed
      let todo = await todoList.getTodo(0);
      expect(todo.completed).to.be.false;

      // Toggle to completed
      await expect(todoList.toggleTodo(0))
        .to.emit(todoList, 'TodoToggled')
        .withArgs(0, owner.address, true);

      todo = await todoList.getTodo(0);
      expect(todo.completed).to.be.true;

      // Toggle back to not completed
      await expect(todoList.toggleTodo(0))
        .to.emit(todoList, 'TodoToggled')
        .withArgs(0, owner.address, false);

      todo = await todoList.getTodo(0);
      expect(todo.completed).to.be.false;
    });

    it('Should fail to toggle non-existent todo', async function () {
      await expect(todoList.toggleTodo(999)).to.be.revertedWith('Todo does not exist');
    });

    it('Should allow only owner to toggle todos', async function () {
      await expect(todoList.connect(user1).toggleTodo(0))
        .to.be.revertedWith('Not the owner of this TodoList');
    });

    it('Should update completion statistics', async function () {
      // Create multiple todos
      await todoList.createTodo('Todo 2', 'Description 2', 1, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Todo 3', 'Description 3', 1, Math.floor(Date.now() / 1000) + 86400);

      // Complete one todo
      await todoList.toggleTodo(0);

      const stats = await todoList.getStats();
      expect(stats.totalTodos).to.equal(3);
      expect(stats.completedTodos).to.equal(1);
      expect(stats.activeTodos).to.equal(2);
    });
  });

  describe('Todo Deletion', function () {
    beforeEach(async function () {
      await todoList.createTodo('Todo 1', 'Description 1', 1, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Todo 2', 'Description 2', 1, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Todo 3', 'Description 3', 1, Math.floor(Date.now() / 1000) + 86400);
    });

    it('Should delete todo successfully', async function () {
      await expect(todoList.deleteTodo(1))
        .to.emit(todoList, 'TodoDeleted')
        .withArgs(1, owner.address);

      // Verify todo is deleted
      await expect(todoList.getTodo(1)).to.be.revertedWith('Todo does not exist');

      // Verify count is updated
      expect(await todoList.getTodoCount()).to.equal(2);
    });

    it('Should fail to delete non-existent todo', async function () {
      await expect(todoList.deleteTodo(999)).to.be.revertedWith('Todo does not exist');
    });

    it('Should allow only owner to delete todos', async function () {
      await expect(todoList.connect(user1).deleteTodo(0))
        .to.be.revertedWith('Not the owner of this TodoList');
    });

    it('Should maintain array integrity after deletion', async function () {
      // Delete middle todo
      await todoList.deleteTodo(1);

      // Verify remaining todos are accessible
      const todo0 = await todoList.getTodo(0);
      const todo2 = await todoList.getTodo(2);

      expect(todo0.title).to.equal('Todo 1');
      expect(todo2.title).to.equal('Todo 3');
    });

    it('Should update statistics after deletion', async function () {
      // Complete one todo before deletion
      await todoList.toggleTodo(1);

      let stats = await todoList.getStats();
      expect(stats.totalTodos).to.equal(3);
      expect(stats.completedTodos).to.equal(1);

      // Delete the completed todo
      await todoList.deleteTodo(1);

      stats = await todoList.getStats();
      expect(stats.totalTodos).to.equal(2);
      expect(stats.completedTodos).to.equal(0);
    });
  });

  describe('Statistics and Analytics', function () {
    beforeEach(async function () {
      // Create todos with different priorities and completion status
      await todoList.createTodo('High Priority Todo', 'Description', 2, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Medium Priority Todo', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Low Priority Todo', 'Description', 0, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Another High Priority', 'Description', 2, Math.floor(Date.now() / 1000) + 86400);

      // Complete some todos
      await todoList.toggleTodo(0);
      await todoList.toggleTodo(2);
    });

    it('Should return correct basic statistics', async function () {
      const stats = await todoList.getStats();

      expect(stats.totalTodos).to.equal(4);
      expect(stats.completedTodos).to.equal(2);
      expect(stats.activeTodos).to.equal(2);
    });

    it('Should return priority distribution', async function () {
      const priorityStats = await todoList.getPriorityStats();

      expect(priorityStats.highPriority).to.equal(2);
      expect(priorityStats.mediumPriority).to.equal(1);
      expect(priorityStats.lowPriority).to.equal(1);
    });

    it('Should calculate completion rate', async function () {
      const completionRate = await todoList.getCompletionRate();
      
      // 2 completed out of 4 total = 50%
      expect(completionRate).to.equal(50);
    });

    it('Should return empty stats for empty todo list', async function () {
      // Deploy new empty contract
      const emptyTodoList = await TodoList.deploy(owner.address);
      await emptyTodoList.deployed();

      const stats = await emptyTodoList.getStats();
      expect(stats.totalTodos).to.equal(0);
      expect(stats.completedTodos).to.equal(0);
      expect(stats.activeTodos).to.equal(0);
    });
  });

  describe('Access Control and Security', function () {
    beforeEach(async function () {
      await todoList.createTodo('Owner Todo', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
    });

    it('Should prevent unauthorized access to all functions', async function () {
      const unauthorizedUser = user1;

      await expect(unauthorizedUser.createTodo('Hack', 'Hack', 1, Math.floor(Date.now() / 1000) + 86400))
        .to.be.revertedWith('Not the owner of this TodoList');

      await expect(unauthorizedUser.updateTodo(0, 'Hack', 'Hack', 1, Math.floor(Date.now() / 1000) + 86400))
        .to.be.revertedWith('Not the owner of this TodoList');

      await expect(unauthorizedUser.toggleTodo(0))
        .to.be.revertedWith('Not the owner of this TodoList');

      await expect(unauthorizedUser.deleteTodo(0))
        .to.be.revertedWith('Not the owner of this TodoList');
    });

    it('Should allow read access to anyone', async function () {
      // Anyone should be able to read todos
      const todo = await todoList.connect(user1).getTodo(0);
      expect(todo.title).to.equal('Owner Todo');

      const todos = await todoList.connect(user1).getAllTodos();
      expect(todos.length).to.equal(1);

      const count = await todoList.connect(user1).getTodoCount();
      expect(count).to.equal(1);

      const stats = await todoList.connect(user1).getStats();
      expect(stats.totalTodos).to.equal(1);
    });

    it('Should handle ownership transfer', async function () {
      // Transfer ownership
      await todoList.transferOwnership(user1.address);

      // Verify new owner can manage todos
      await todoList.connect(user1).createTodo('New Owner Todo', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);

      // Verify old owner cannot manage todos
      await expect(todoList.createTodo('Old Owner Todo', 'Description', 1, Math.floor(Date.now() / 1000) + 86400))
        .to.be.revertedWith('Not the owner of this TodoList');
    });

    it('Should prevent ownership transfer to zero address', async function () {
      await expect(todoList.transferOwnership(ethers.constants.AddressZero))
        .to.be.revertedWith('New owner cannot be zero address');
    });

    it('Should emit ownership transfer event', async function () {
      await expect(todoList.transferOwnership(user1.address))
        .to.emit(todoList, 'OwnershipTransferred')
        .withArgs(owner.address, user1.address);
    });
  });

  describe('Edge Cases and Error Handling', function () {
    it('Should handle maximum number of todos', async function () {
      // Create many todos to test limits (adjust based on gas limits)
      const maxTodos = 100;
      
      for (let i = 0; i < maxTodos; i++) {
        await todoList.createTodo(`Todo ${i}`, `Description ${i}`, i % 3, Math.floor(Date.now() / 1000) + 86400);
      }

      expect(await todoList.getTodoCount()).to.equal(maxTodos);
      
      // Verify we can still access all todos
      const todos = await todoList.getAllTodos();
      expect(todos.length).to.equal(maxTodos);
    });

    it('Should handle very long strings', async function () {
      const longTitle = 'a'.repeat(1000);
      const longDescription = 'b'.repeat(2000);

      await todoList.createTodo(longTitle, longDescription, 1, Math.floor(Date.now() / 1000) + 86400);

      const todo = await todoList.getTodo(0);
      expect(todo.title).to.equal(longTitle);
      expect(todo.description).to.equal(longDescription);
    });

    it('Should handle special characters in strings', async function () {
      const specialTitle = 'Todo with émojis 🚀 and spëcial chars!@#$%^&*()';
      const specialDescription = 'Description with newlines\nand tabs\t and quotes "test"';

      await todoList.createTodo(specialTitle, specialDescription, 1, Math.floor(Date.now() / 1000) + 86400);

      const todo = await todoList.getTodo(0);
      expect(todo.title).to.equal(specialTitle);
      expect(todo.description).to.equal(specialDescription);
    });

    it('Should handle boundary values for timestamps', async function () {
      // Test with far future date
      const farFuture = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60 * 100); // 100 years

      await todoList.createTodo('Future Todo', 'Description', 1, farFuture);

      const todo = await todoList.getTodo(0);
      expect(todo.dueDate).to.equal(farFuture);
    });

    it('Should handle rapid successive operations', async function () {
      // Create multiple todos rapidly
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(todoList.createTodo(`Rapid Todo ${i}`, 'Description', 1, Math.floor(Date.now() / 1000) + 86400));
      }

      await Promise.all(promises);
      expect(await todoList.getTodoCount()).to.equal(10);
    });

    it('Should maintain state consistency under concurrent operations', async function () {
      // Create initial todos
      await todoList.createTodo('Todo 1', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Todo 2', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);

      // Perform concurrent operations
      const operations = [
        todoList.toggleTodo(0),
        todoList.updateTodo(1, 'Updated Todo 2', 'Updated Description', 2, Math.floor(Date.now() / 1000) + 172800),
        todoList.createTodo('Todo 3', 'Description', 0, Math.floor(Date.now() / 1000) + 86400),
      ];

      await Promise.all(operations);

      // Verify final state
      const todo0 = await todoList.getTodo(0);
      const todo1 = await todoList.getTodo(1);
      const todo2 = await todoList.getTodo(2);

      expect(todo0.completed).to.be.true;
      expect(todo1.title).to.equal('Updated Todo 2');
      expect(todo2.title).to.equal('Todo 3');
      expect(await todoList.getTodoCount()).to.equal(3);
    });
  });

  describe('Gas Optimization and Performance', function () {
    it('Should have reasonable gas costs for basic operations', async function () {
      // Create todo
      const createTx = await todoList.createTodo('Gas Test', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      const createReceipt = await createTx.wait();
      expect(createReceipt.gasUsed.toNumber()).to.be.lessThan(200000);

      // Update todo
      const updateTx = await todoList.updateTodo(0, 'Updated', 'Updated Description', 2, Math.floor(Date.now() / 1000) + 172800);
      const updateReceipt = await updateTx.wait();
      expect(updateReceipt.gasUsed.toNumber()).to.be.lessThan(100000);

      // Toggle todo
      const toggleTx = await todoList.toggleTodo(0);
      const toggleReceipt = await toggleTx.wait();
      expect(toggleReceipt.gasUsed.toNumber()).to.be.lessThan(50000);

      // Delete todo
      const deleteTx = await todoList.deleteTodo(0);
      const deleteReceipt = await deleteTx.wait();
      expect(deleteReceipt.gasUsed.toNumber()).to.be.lessThan(50000);
    });

    it('Should scale efficiently with number of todos', async function () {
      const gasUsages = [];

      // Measure gas usage for creating todos at different list sizes
      for (let i = 0; i < 10; i++) {
        const tx = await todoList.createTodo(`Todo ${i}`, 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
        const receipt = await tx.wait();
        gasUsages.push(receipt.gasUsed.toNumber());
      }

      // Gas usage should not increase significantly with list size
      const firstGas = gasUsages[0];
      const lastGas = gasUsages[gasUsages.length - 1];
      const increase = (lastGas - firstGas) / firstGas;
      
      expect(increase).to.be.lessThan(0.1); // Less than 10% increase
    });
  });

  describe('Event Emission and Logging', function () {
    it('Should emit all required events with correct parameters', async function () {
      // Test TodoCreated event
      await expect(todoList.createTodo('Event Test', 'Description', 1, Math.floor(Date.now() / 1000) + 86400))
        .to.emit(todoList, 'TodoCreated')
        .withArgs(0, owner.address, 'Event Test');

      // Test TodoUpdated event
      await expect(todoList.updateTodo(0, 'Updated Event Test', 'Updated Description', 2, Math.floor(Date.now() / 1000) + 172800))
        .to.emit(todoList, 'TodoUpdated')
        .withArgs(0, owner.address);

      // Test TodoToggled event
      await expect(todoList.toggleTodo(0))
        .to.emit(todoList, 'TodoToggled')
        .withArgs(0, owner.address, true);

      // Test TodoDeleted event
      await expect(todoList.deleteTodo(0))
        .to.emit(todoList, 'TodoDeleted')
        .withArgs(0, owner.address);
    });

    it('Should emit events in correct order for batch operations', async function () {
      const tx = await todoList.createTodo('Batch Test', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      const receipt = await tx.wait();

      // Verify event order and parameters
      const events = receipt.events.filter(e => e.event === 'TodoCreated');
      expect(events).to.have.length(1);
      expect(events[0].args.todoId).to.equal(0);
      expect(events[0].args.owner).to.equal(owner.address);
      expect(events[0].args.title).to.equal('Batch Test');
    });
  });

  describe('Integration with External Contracts', function () {
    it('Should be compatible with factory pattern', async function () {
      // This test would verify integration with TodoListFactory
      // For now, we'll test that the contract can be created with different owners
      const todoList1 = await TodoList.deploy(user1.address);
      const todoList2 = await TodoList.deploy(user2.address);

      await todoList1.deployed();
      await todoList2.deployed();

      expect(await todoList1.owner()).to.equal(user1.address);
      expect(await todoList2.owner()).to.equal(user2.address);

      // Verify they operate independently
      await todoList1.connect(user1).createTodo('User1 Todo', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      await todoList2.connect(user2).createTodo('User2 Todo', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);

      expect(await todoList1.getTodoCount()).to.equal(1);
      expect(await todoList2.getTodoCount()).to.equal(1);

      const todo1 = await todoList1.getTodo(0);
      const todo2 = await todoList2.getTodo(0);

      expect(todo1.title).to.equal('User1 Todo');
      expect(todo2.title).to.equal('User2 Todo');
    });
  });

  describe('Upgrade and Migration Scenarios', function () {
    it('Should support data migration patterns', async function () {
      // Create todos in original contract
      await todoList.createTodo('Migration Test 1', 'Description 1', 1, Math.floor(Date.now() / 1000) + 86400);
      await todoList.createTodo('Migration Test 2', 'Description 2', 2, Math.floor(Date.now() / 1000) + 172800);
      await todoList.toggleTodo(0);

      // Get all data for migration
      const todos = await todoList.getAllTodos();
      const stats = await todoList.getStats();

      expect(todos).to.have.length(2);
      expect(stats.totalTodos).to.equal(2);
      expect(stats.completedTodos).to.equal(1);

      // In a real migration, this data would be used to populate a new contract
      // For this test, we'll verify the data structure is complete
      todos.forEach(todo => {
        expect(todo).to.have.property('title');
        expect(todo).to.have.property('description');
        expect(todo).to.have.property('completed');
        expect(todo).to.have.property('priority');
        expect(todo).to.have.property('dueDate');
        expect(todo).to.have.property('owner');
        expect(todo).to.have.property('createdAt');
      });
    });
  });
});