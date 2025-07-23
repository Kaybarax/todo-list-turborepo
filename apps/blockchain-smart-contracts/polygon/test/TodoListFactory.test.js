const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoListFactory", function () {
  let TodoListFactory;
  let todoListFactory;
  let TodoList;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy TodoList contract for reference
    TodoList = await ethers.getContractFactory("TodoList");

    // Deploy TodoListFactory contract
    TodoListFactory = await ethers.getContractFactory("TodoListFactory");
    todoListFactory = await TodoListFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await todoListFactory.owner()).to.equal(owner.address);
    });

    it("Should have no users initially", async function () {
      expect(await todoListFactory.getUserCount()).to.equal(0);
    });
  });

  describe("Create TodoList", function () {
    it("Should create a TodoList for a user", async function () {
      // Create TodoList
      const tx = await todoListFactory.createTodoList();
      const receipt = await tx.wait();

      // Check event
      const event = receipt.logs[0];
      const args = event.args;
      expect(args.user).to.equal(owner.address);

      // Check TodoList address
      const todoListAddress = await todoListFactory.getTodoList();
      expect(todoListAddress).to.equal(args.todoList);
      expect(todoListAddress).to.not.equal(ethers.ZeroAddress);

      // Check user count
      expect(await todoListFactory.getUserCount()).to.equal(1);

      // Check users list
      const users = await todoListFactory.getUsers(0, 10);
      expect(users.length).to.equal(1);
      expect(users[0]).to.equal(owner.address);
    });

    it("Should fail if user already has a TodoList", async function () {
      // Create first TodoList
      await todoListFactory.createTodoList();

      // Try to create another TodoList
      await expect(
        todoListFactory.createTodoList()
      ).to.be.revertedWith("TodoList already exists for this user");
    });

    it("Should create TodoLists for different users", async function () {
      // Create TodoList for owner
      await todoListFactory.createTodoList();

      // Create TodoList for user1
      await todoListFactory.connect(user1).createTodoList();

      // Create TodoList for user2
      await todoListFactory.connect(user2).createTodoList();

      // Check user count
      expect(await todoListFactory.getUserCount()).to.equal(3);

      // Check TodoList addresses
      const ownerTodoList = await todoListFactory.getTodoList();
      const user1TodoList = await todoListFactory.connect(user1).getTodoList();
      const user2TodoList = await todoListFactory.connect(user2).getTodoList();

      expect(ownerTodoList).to.not.equal(ethers.ZeroAddress);
      expect(user1TodoList).to.not.equal(ethers.ZeroAddress);
      expect(user2TodoList).to.not.equal(ethers.ZeroAddress);

      expect(ownerTodoList).to.not.equal(user1TodoList);
      expect(ownerTodoList).to.not.equal(user2TodoList);
      expect(user1TodoList).to.not.equal(user2TodoList);
    });

    it("Should transfer ownership of TodoList to the user", async function () {
      // Create TodoList
      await todoListFactory.connect(user1).createTodoList();

      // Get TodoList address
      const todoListAddress = await todoListFactory.connect(user1).getTodoList();

      // Check TodoList owner
      const todoList = await TodoList.attach(todoListAddress);
      expect(await todoList.owner()).to.equal(user1.address);
    });
  });

  describe("Get TodoList", function () {
    beforeEach(async function () {
      // Create TodoLists
      await todoListFactory.createTodoList();
      await todoListFactory.connect(user1).createTodoList();
    });

    it("Should return the correct TodoList for the caller", async function () {
      const ownerTodoList = await todoListFactory.getTodoList();
      const user1TodoList = await todoListFactory.connect(user1).getTodoList();

      expect(ownerTodoList).to.not.equal(ethers.ZeroAddress);
      expect(user1TodoList).to.not.equal(ethers.ZeroAddress);
      expect(ownerTodoList).to.not.equal(user1TodoList);
    });

    it("Should return the correct TodoList for a specific user", async function () {
      const ownerTodoList = await todoListFactory.getTodoListForUser(owner.address);
      const user1TodoList = await todoListFactory.getTodoListForUser(user1.address);

      expect(ownerTodoList).to.not.equal(ethers.ZeroAddress);
      expect(user1TodoList).to.not.equal(ethers.ZeroAddress);
      expect(ownerTodoList).to.not.equal(user1TodoList);
    });

    it("Should return zero address for user without TodoList", async function () {
      const user2TodoList = await todoListFactory.getTodoListForUser(user2.address);
      expect(user2TodoList).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Get Users", function () {
    beforeEach(async function () {
      // Create TodoLists for multiple users
      await todoListFactory.createTodoList();
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
    });

    it("Should return all users", async function () {
      const users = await todoListFactory.getUsers(0, 10);
      expect(users.length).to.equal(3);
      expect(users[0]).to.equal(owner.address);
      expect(users[1]).to.equal(user1.address);
      expect(users[2]).to.equal(user2.address);
    });

    it("Should return users with pagination", async function () {
      // Get first page
      const page1 = await todoListFactory.getUsers(0, 2);
      expect(page1.length).to.equal(2);
      expect(page1[0]).to.equal(owner.address);
      expect(page1[1]).to.equal(user1.address);

      // Get second page
      const page2 = await todoListFactory.getUsers(2, 2);
      expect(page2.length).to.equal(1);
      expect(page2[0]).to.equal(user2.address);
    });

    it("Should return empty array for out of bounds offset", async function () {
      const users = await todoListFactory.getUsers(10, 10);
      expect(users.length).to.equal(0);
    });

    it("Should handle limit larger than available users", async function () {
      const users = await todoListFactory.getUsers(1, 10);
      expect(users.length).to.equal(2);
      expect(users[0]).to.equal(user1.address);
      expect(users[1]).to.equal(user2.address);
    });
  });
});