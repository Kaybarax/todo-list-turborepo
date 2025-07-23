const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
  let TodoList;
  let todoList;
  let owner;
  let user1;
  let user2;

  // Priority enum values
  const Priority = {
    Low: 0,
    Medium: 1,
    High: 2,
  };

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy TodoList contract
    TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await todoList.owner()).to.equal(owner.address);
    });

    it("Should have correct constants", async function () {
      expect(await todoList.MAX_TITLE_LENGTH()).to.equal(100);
      expect(await todoList.MAX_DESCRIPTION_LENGTH()).to.equal(500);
      expect(await todoList.MAX_TODOS_PER_USER()).to.equal(50);
    });
  });

  describe("Create Todo", function () {
    it("Should create a todo successfully", async function () {
      const title = "Test Todo";
      const description = "This is a test todo";
      const priority = Priority.Medium;

      // Create todo
      const tx = await todoList.createTodo(title, description, priority);
      const receipt = await tx.wait();

      // Check event
      const event = receipt.logs[0];
      const args = event.args;
      expect(args.user).to.equal(owner.address);
      expect(args.id).to.equal(1);
      expect(args.title).to.equal(title);
      expect(args.priority).to.equal(priority);

      // Check todo
      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(1);
      expect(todos[0].id).to.equal(1);
      expect(todos[0].title).to.equal(title);
      expect(todos[0].description).to.equal(description);
      expect(todos[0].completed).to.equal(false);
      expect(todos[0].priority).to.equal(priority);
      expect(todos[0].completedAt).to.equal(0);
    });

    it("Should fail if title is empty", async function () {
      await expect(
        todoList.createTodo("", "Description", Priority.Medium)
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should fail if title is too long", async function () {
      const longTitle = "a".repeat(101);
      await expect(
        todoList.createTodo(longTitle, "Description", Priority.Medium)
      ).to.be.revertedWith("Title is too long");
    });

    it("Should fail if description is too long", async function () {
      const longDescription = "a".repeat(501);
      await expect(
        todoList.createTodo("Title", longDescription, Priority.Medium)
      ).to.be.revertedWith("Description is too long");
    });

    it("Should fail if todo list is full", async function () {
      // Create 50 todos (max limit)
      for (let i = 0; i < 50; i++) {
        await todoList.createTodo(`Todo ${i}`, `Description ${i}`, Priority.Medium);
      }

      // Try to create one more
      await expect(
        todoList.createTodo("One more", "Description", Priority.Medium)
      ).to.be.revertedWith("Todo list is full");
    });

    it("Should create todos for different users", async function () {
      // Create todo for owner
      await todoList.createTodo("Owner Todo", "Owner Description", Priority.High);

      // Create todo for user1
      await todoList.connect(user1).createTodo("User1 Todo", "User1 Description", Priority.Medium);

      // Check owner's todos
      const ownerTodos = await todoList.getTodos();
      expect(ownerTodos.length).to.equal(1);
      expect(ownerTodos[0].title).to.equal("Owner Todo");

      // Check user1's todos
      const user1Todos = await todoList.connect(user1).getTodos();
      expect(user1Todos.length).to.equal(1);
      expect(user1Todos[0].title).to.equal("User1 Todo");
    });
  });

  describe("Update Todo", function () {
    beforeEach(async function () {
      // Create a todo for testing
      await todoList.createTodo("Test Todo", "Test Description", Priority.Medium);
    });

    it("Should update todo title", async function () {
      const newTitle = "Updated Todo";
      await todoList.updateTodo(1, newTitle, "", ethers.MaxUint256);

      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal(newTitle);
      expect(todo.description).to.equal("Test Description"); // Unchanged
      expect(todo.priority).to.equal(Priority.Medium); // Unchanged
    });

    it("Should update todo description", async function () {
      const newDescription = "Updated Description";
      await todoList.updateTodo(1, "", newDescription, ethers.MaxUint256);

      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal("Test Todo"); // Unchanged
      expect(todo.description).to.equal(newDescription);
      expect(todo.priority).to.equal(Priority.Medium); // Unchanged
    });

    it("Should update todo priority", async function () {
      const newPriority = Priority.High;
      await todoList.updateTodo(1, "", "", newPriority);

      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal("Test Todo"); // Unchanged
      expect(todo.description).to.equal("Test Description"); // Unchanged
      expect(todo.priority).to.equal(newPriority);
    });

    it("Should update multiple fields at once", async function () {
      const newTitle = "Updated Todo";
      const newDescription = "Updated Description";
      const newPriority = Priority.High;

      await todoList.updateTodo(1, newTitle, newDescription, newPriority);

      const todo = await todoList.getTodo(1);
      expect(todo.title).to.equal(newTitle);
      expect(todo.description).to.equal(newDescription);
      expect(todo.priority).to.equal(newPriority);
    });

    it("Should fail if todo doesn't exist", async function () {
      await expect(
        todoList.updateTodo(999, "New Title", "", ethers.MaxUint256)
      ).to.be.revertedWith("Todo not found");
    });

    it("Should fail if title is too long", async function () {
      const longTitle = "a".repeat(101);
      await expect(
        todoList.updateTodo(1, longTitle, "", ethers.MaxUint256)
      ).to.be.revertedWith("Title is too long");
    });

    it("Should fail if description is too long", async function () {
      const longDescription = "a".repeat(501);
      await expect(
        todoList.updateTodo(1, "", longDescription, ethers.MaxUint256)
      ).to.be.revertedWith("Description is too long");
    });

    it("Should fail if priority is invalid", async function () {
      await expect(
        todoList.updateTodo(1, "", "", 3) // Invalid priority (only 0, 1, 2 are valid)
      ).to.be.revertedWith("Invalid priority value");
    });

    it("Should emit TodoUpdated event", async function () {
      const newTitle = "Updated Todo";
      const newPriority = Priority.High;

      await expect(todoList.updateTodo(1, newTitle, "", newPriority))
        .to.emit(todoList, "TodoUpdated")
        .withArgs(owner.address, 1, newTitle, newPriority);
    });
  });

  describe("Toggle Todo Completion", function () {
    beforeEach(async function () {
      // Create a todo for testing
      await todoList.createTodo("Test Todo", "Test Description", Priority.Medium);
    });

    it("Should mark todo as completed", async function () {
      await todoList.toggleTodoCompletion(1);

      const todo = await todoList.getTodo(1);
      expect(todo.completed).to.equal(true);
      expect(todo.completedAt).to.not.equal(0);
    });

    it("Should mark completed todo as incomplete", async function () {
      // First mark as completed
      await todoList.toggleTodoCompletion(1);

      // Then mark as incomplete
      await todoList.toggleTodoCompletion(1);

      const todo = await todoList.getTodo(1);
      expect(todo.completed).to.equal(false);
      expect(todo.completedAt).to.equal(0);
    });

    it("Should fail if todo doesn't exist", async function () {
      await expect(
        todoList.toggleTodoCompletion(999)
      ).to.be.revertedWith("Todo not found");
    });

    it("Should emit TodoCompletionToggled event", async function () {
      await expect(todoList.toggleTodoCompletion(1))
        .to.emit(todoList, "TodoCompletionToggled")
        .withArgs(owner.address, 1, true);
    });
  });

  describe("Delete Todo", function () {
    beforeEach(async function () {
      // Create todos for testing
      await todoList.createTodo("Todo 1", "Description 1", Priority.Low);
      await todoList.createTodo("Todo 2", "Description 2", Priority.Medium);
      await todoList.createTodo("Todo 3", "Description 3", Priority.High);
    });

    it("Should delete a todo", async function () {
      // Delete the second todo
      await todoList.deleteTodo(2);

      // Check todos
      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(2);

      // Check that the remaining todos are 1 and 3
      const ids = todos.map(todo => todo.id.toString());
      expect(ids).to.include("1");
      expect(ids).to.include("3");
      expect(ids).to.not.include("2");
    });

    it("Should fail if todo doesn't exist", async function () {
      await expect(
        todoList.deleteTodo(999)
      ).to.be.revertedWith("Todo not found");
    });

    it("Should emit TodoDeleted event", async function () {
      await expect(todoList.deleteTodo(2))
        .to.emit(todoList, "TodoDeleted")
        .withArgs(owner.address, 2);
    });

    it("Should handle deletion of the last todo correctly", async function () {
      // Delete the last todo
      await todoList.deleteTodo(3);

      // Check todos
      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(2);

      // Check that the remaining todos are 1 and 2
      const ids = todos.map(todo => todo.id.toString());
      expect(ids).to.include("1");
      expect(ids).to.include("2");
      expect(ids).to.not.include("3");
    });

    it("Should handle deletion of all todos", async function () {
      // Delete all todos
      await todoList.deleteTodo(1);
      await todoList.deleteTodo(2);
      await todoList.deleteTodo(3);

      // Check todos
      const todos = await todoList.getTodos();
      expect(todos.length).to.equal(0);
    });
  });

  describe("Get Todo Stats", function () {
    beforeEach(async function () {
      // Create todos with different priorities
      await todoList.createTodo("Low Priority", "Description", Priority.Low);
      await todoList.createTodo("Medium Priority", "Description", Priority.Medium);
      await todoList.createTodo("High Priority 1", "Description", Priority.High);
      await todoList.createTodo("High Priority 2", "Description", Priority.High);

      // Mark one high priority todo as completed
      await todoList.toggleTodoCompletion(3);
    });

    it("Should return correct todo statistics", async function () {
      const stats = await todoList.getTodoStats();
      expect(stats.total).to.equal(4);
      expect(stats.completed).to.equal(1);
      expect(stats.pending).to.equal(3);
      expect(stats.highPriority).to.equal(1); // Only count incomplete high priority todos
    });

    it("Should update stats when todos are added", async function () {
      // Add another high priority todo
      await todoList.createTodo("High Priority 3", "Description", Priority.High);

      const stats = await todoList.getTodoStats();
      expect(stats.total).to.equal(5);
      expect(stats.highPriority).to.equal(2);
    });

    it("Should update stats when todos are completed", async function () {
      // Complete another todo
      await todoList.toggleTodoCompletion(4);

      const stats = await todoList.getTodoStats();
      expect(stats.completed).to.equal(2);
      expect(stats.pending).to.equal(2);
      expect(stats.highPriority).to.equal(0); // All high priority todos are completed
    });

    it("Should update stats when todos are deleted", async function () {
      // Delete a completed high priority todo
      await todoList.deleteTodo(3);

      const stats = await todoList.getTodoStats();
      expect(stats.total).to.equal(3);
      expect(stats.completed).to.equal(0);
      expect(stats.highPriority).to.equal(1);
    });

    it("Should handle empty todo list", async function () {
      // Create a new user with no todos
      const stats = await todoList.connect(user2).getTodoStats();
      expect(stats.total).to.equal(0);
      expect(stats.completed).to.equal(0);
      expect(stats.pending).to.equal(0);
      expect(stats.highPriority).to.equal(0);
    });
  });
});