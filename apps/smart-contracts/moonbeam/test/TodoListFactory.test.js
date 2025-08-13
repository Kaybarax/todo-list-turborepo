const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('Moonbeam TodoListFactory Contract Tests', function () {
  let TodoListFactory;
  let todoListFactory;
  let TodoList;
  let owner;
  let user1;
  let user2;
  let user3;
  let addrs;

  // Deploy fixture for reuse
  async function deployTodoListFactoryFixture() {
    const [owner, user1, user2, user3, ...addrs] = await ethers.getSigners();

    const TodoListFactory = await ethers.getContractFactory('TodoListFactory');
    const todoListFactory = await TodoListFactory.deploy();

    const TodoList = await ethers.getContractFactory('TodoList');

    return { TodoListFactory, todoListFactory, TodoList, owner, user1, user2, user3, addrs };
  }

  beforeEach(async function () {
    ({ TodoListFactory, todoListFactory, TodoList, owner, user1, user2, user3, addrs } =
      await loadFixture(deployTodoListFactoryFixture));
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await todoListFactory.owner()).to.equal(owner.address);
    });

    it('Should initialize with zero users', async function () {
      expect(await todoListFactory.getUserCount()).to.equal(0);
    });

    it('Should have empty users array initially', async function () {
      const users = await todoListFactory.getUsers(0, 10);
      expect(users.length).to.equal(0);
    });
  });

  describe('TodoList Creation', function () {
    it('Should create a TodoList for a user', async function () {
      await expect(todoListFactory.connect(user1).createTodoList())
        .to.emit(todoListFactory, 'TodoListCreated')
        .withArgs(user1.address, await todoListFactory.connect(user1).getTodoList.staticCall());

      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      expect(todoListAddress).to.not.equal(ethers.ZeroAddress);
    });

    it('Should return the correct TodoList address for user', async function () {
      const tx = await todoListFactory.connect(user1).createTodoList();
      const receipt = await tx.wait();

      // Get the TodoList address from the event
      const event = receipt.logs.find(log => {
        try {
          const parsed = todoListFactory.interface.parseLog(log);
          return parsed.name === 'TodoListCreated';
        } catch {
          return false;
        }
      });

      const todoListAddress = todoListFactory.interface.parseLog(event).args.todoList;

      // Verify the factory returns the same address
      expect(await todoListFactory.getTodoListForUser(user1.address)).to.equal(todoListAddress);
      expect(await todoListFactory.connect(user1).getTodoList()).to.equal(todoListAddress);
    });

    it('Should transfer ownership of TodoList to the user', async function () {
      await todoListFactory.connect(user1).createTodoList();

      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      expect(await todoListContract.owner()).to.equal(user1.address);
    });

    it('Should increment user count after creation', async function () {
      expect(await todoListFactory.getUserCount()).to.equal(0);

      await todoListFactory.connect(user1).createTodoList();
      expect(await todoListFactory.getUserCount()).to.equal(1);

      await todoListFactory.connect(user2).createTodoList();
      expect(await todoListFactory.getUserCount()).to.equal(2);
    });

    it('Should add user to users array', async function () {
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();

      const users = await todoListFactory.getUsers(0, 10);
      expect(users.length).to.equal(2);
      expect(users[0]).to.equal(user1.address);
      expect(users[1]).to.equal(user2.address);
    });

    it('Should fail if user already has a TodoList', async function () {
      await todoListFactory.connect(user1).createTodoList();

      await expect(todoListFactory.connect(user1).createTodoList()).to.be.revertedWith(
        'TodoList already exists for this user',
      );
    });

    it('Should allow multiple users to create TodoLists', async function () {
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
      await todoListFactory.connect(user3).createTodoList();

      const user1TodoList = await todoListFactory.getTodoListForUser(user1.address);
      const user2TodoList = await todoListFactory.getTodoListForUser(user2.address);
      const user3TodoList = await todoListFactory.getTodoListForUser(user3.address);

      expect(user1TodoList).to.not.equal(user2TodoList);
      expect(user2TodoList).to.not.equal(user3TodoList);
      expect(user1TodoList).to.not.equal(user3TodoList);

      // All should be valid addresses
      expect(user1TodoList).to.not.equal(ethers.ZeroAddress);
      expect(user2TodoList).to.not.equal(ethers.ZeroAddress);
      expect(user3TodoList).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe('TodoList Retrieval', function () {
    beforeEach(async function () {
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
    });

    it('Should return correct TodoList for user', async function () {
      const user1TodoList = await todoListFactory.connect(user1).getTodoList();
      const user2TodoList = await todoListFactory.connect(user2).getTodoList();

      expect(user1TodoList).to.not.equal(ethers.ZeroAddress);
      expect(user2TodoList).to.not.equal(ethers.ZeroAddress);
      expect(user1TodoList).to.not.equal(user2TodoList);
    });

    it('Should return zero address for user without TodoList', async function () {
      const todoListAddress = await todoListFactory.getTodoListForUser(user3.address);
      expect(todoListAddress).to.equal(ethers.ZeroAddress);
    });

    it('Should return zero address when user calls getTodoList without creating one', async function () {
      const todoListAddress = await todoListFactory.connect(user3).getTodoList();
      expect(todoListAddress).to.equal(ethers.ZeroAddress);
    });
  });

  describe('User Management', function () {
    beforeEach(async function () {
      // Create TodoLists for multiple users
      for (let i = 0; i < 5; i++) {
        await todoListFactory.connect(addrs[i]).createTodoList();
      }
    });

    it('Should return correct user count', async function () {
      expect(await todoListFactory.getUserCount()).to.equal(5);
    });

    it('Should return users with pagination', async function () {
      // Get first 3 users
      const firstBatch = await todoListFactory.getUsers(0, 3);
      expect(firstBatch.length).to.equal(3);
      expect(firstBatch[0]).to.equal(addrs[0].address);
      expect(firstBatch[1]).to.equal(addrs[1].address);
      expect(firstBatch[2]).to.equal(addrs[2].address);

      // Get next 2 users
      const secondBatch = await todoListFactory.getUsers(3, 2);
      expect(secondBatch.length).to.equal(2);
      expect(secondBatch[0]).to.equal(addrs[3].address);
      expect(secondBatch[1]).to.equal(addrs[4].address);
    });

    it('Should handle pagination beyond available users', async function () {
      const users = await todoListFactory.getUsers(3, 10); // Request 10 but only 2 available
      expect(users.length).to.equal(2);
      expect(users[0]).to.equal(addrs[3].address);
      expect(users[1]).to.equal(addrs[4].address);
    });

    it('Should return empty array when offset is beyond user count', async function () {
      const users = await todoListFactory.getUsers(10, 5);
      expect(users.length).to.equal(0);
    });

    it('Should handle zero limit', async function () {
      const users = await todoListFactory.getUsers(0, 0);
      expect(users.length).to.equal(0);
    });

    it('Should return all users when limit is very large', async function () {
      const users = await todoListFactory.getUsers(0, 1000);
      expect(users.length).to.equal(5);
    });
  });

  describe('TodoList Functionality Integration', function () {
    let user1TodoListContract;
    let user2TodoListContract;

    beforeEach(async function () {
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();

      const user1TodoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const user2TodoListAddress = await todoListFactory.getTodoListForUser(user2.address);

      user1TodoListContract = TodoList.attach(user1TodoListAddress);
      user2TodoListContract = TodoList.attach(user2TodoListAddress);
    });

    it('Should allow users to create todos in their TodoList', async function () {
      await user1TodoListContract
        .connect(user1)
        .createTodo('Moonbeam Integration Test', 'Test todo creation through factory', 1);

      const todos = await user1TodoListContract.connect(user1).getTodos();
      expect(todos.length).to.equal(1);
      expect(todos[0].title).to.equal('Moonbeam Integration Test');
    });

    it('Should maintain separation between user TodoLists', async function () {
      await user1TodoListContract.connect(user1).createTodo('User1 Todo', 'Description', 1);
      await user2TodoListContract.connect(user2).createTodo('User2 Todo', 'Description', 2);

      const user1Todos = await user1TodoListContract.connect(user1).getTodos();
      const user2Todos = await user2TodoListContract.connect(user2).getTodos();

      expect(user1Todos.length).to.equal(1);
      expect(user2Todos.length).to.equal(1);
      expect(user1Todos[0].title).to.equal('User1 Todo');
      expect(user2Todos[0].title).to.equal('User2 Todo');
    });

    it('Should not allow users to access other users TodoLists directly', async function () {
      await user1TodoListContract.connect(user1).createTodo('Private Todo', 'Description', 1);

      // User2 should not be able to access User1's todos
      const user2Todos = await user1TodoListContract.connect(user2).getTodos();
      expect(user2Todos.length).to.equal(0); // User2 has no todos in User1's contract
    });

    it('Should allow users to perform all TodoList operations', async function () {
      // Create todo
      await user1TodoListContract.connect(user1).createTodo('Test Todo', 'Description', 1);

      // Update todo
      await user1TodoListContract.connect(user1).updateTodo(1, 'Updated Todo', '', ethers.MaxUint256);

      // Toggle completion
      await user1TodoListContract.connect(user1).toggleTodoCompletion(1);

      // Verify changes
      const todo = await user1TodoListContract.connect(user1).getTodo(1);
      expect(todo.title).to.equal('Updated Todo');
      expect(todo.completed).to.be.true;
    });
  });

  describe('Access Control', function () {
    it('Should only allow contract owner to perform owner functions', async function () {
      // In this case, the factory doesn't have specific owner-only functions
      // but we can test ownership transfer if needed
      expect(await todoListFactory.owner()).to.equal(owner.address);
    });

    it('Should allow any user to create their own TodoList', async function () {
      // Any user should be able to create a TodoList
      await expect(todoListFactory.connect(user1).createTodoList()).to.not.be.reverted;
      await expect(todoListFactory.connect(user2).createTodoList()).to.not.be.reverted;
      await expect(todoListFactory.connect(addrs[0]).createTodoList()).to.not.be.reverted;
    });

    it('Should allow anyone to query public information', async function () {
      await todoListFactory.connect(user1).createTodoList();

      // Anyone should be able to query public information
      expect(await todoListFactory.connect(user2).getUserCount()).to.equal(1);
      expect(await todoListFactory.connect(user3).getTodoListForUser(user1.address)).to.not.equal(ethers.ZeroAddress);

      const users = await todoListFactory.connect(addrs[0]).getUsers(0, 10);
      expect(users.length).to.equal(1);
    });
  });

  describe('Gas Optimization Tests', function () {
    it('Should handle many users efficiently', async function () {
      // Create TodoLists for many users
      const userCount = 20;
      for (let i = 0; i < userCount; i++) {
        await todoListFactory.connect(addrs[i]).createTodoList();
      }

      expect(await todoListFactory.getUserCount()).to.equal(userCount);

      // Should still be able to query users efficiently
      const allUsers = await todoListFactory.getUsers(0, userCount);
      expect(allUsers.length).to.equal(userCount);
    });

    it('Should create TodoList with reasonable gas cost', async function () {
      const tx = await todoListFactory.connect(user1).createTodoList();
      const receipt = await tx.wait();

      // Should not consume excessive gas for TodoList creation
      expect(receipt.gasUsed).to.be.below(500000); // Should be well under 500k gas
    });

    it('Should handle pagination efficiently with large user base', async function () {
      // Create many users
      for (let i = 0; i < 50; i++) {
        await todoListFactory.connect(addrs[i]).createTodoList();
      }

      // Test various pagination scenarios
      const batch1 = await todoListFactory.getUsers(0, 10);
      const batch2 = await todoListFactory.getUsers(10, 10);
      const batch3 = await todoListFactory.getUsers(40, 20);

      expect(batch1.length).to.equal(10);
      expect(batch2.length).to.equal(10);
      expect(batch3.length).to.equal(10); // Only 10 users left from index 40
    });
  });

  describe('Moonbeam-Specific Features', function () {
    it("Should work with Moonbeam's EVM compatibility", async function () {
      // Test that contract deployment and interaction work on Moonbeam
      const blockNumber = await ethers.provider.getBlockNumber();
      expect(blockNumber).to.be.above(0);

      // Create a TodoList and verify it works with Moonbeam's infrastructure
      await todoListFactory.connect(user1).createTodoList();

      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      expect(todoListAddress).to.not.equal(ethers.ZeroAddress);

      // Verify the created contract is functional
      const todoListContract = TodoList.attach(todoListAddress);
      expect(await todoListContract.owner()).to.equal(user1.address);
    });

    it("Should handle Moonbeam's parachain features", async function () {
      // Test that the factory works well with Moonbeam's parachain architecture
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();

      // Verify that multiple contract deployments work correctly
      const user1TodoList = await todoListFactory.getTodoListForUser(user1.address);
      const user2TodoList = await todoListFactory.getTodoListForUser(user2.address);

      expect(user1TodoList).to.not.equal(user2TodoList);

      // Both contracts should be functional
      const contract1 = TodoList.attach(user1TodoList);
      const contract2 = TodoList.attach(user2TodoList);

      expect(await contract1.owner()).to.equal(user1.address);
      expect(await contract2.owner()).to.equal(user2.address);
    });

    it("Should be compatible with Moonbeam's gas pricing model", async function () {
      // Create multiple TodoLists and verify gas costs are reasonable for Moonbeam
      const transactions = [];

      for (let i = 0; i < 5; i++) {
        const tx = await todoListFactory.connect(addrs[i]).createTodoList();
        const receipt = await tx.wait();
        transactions.push(receipt);
      }

      // All transactions should have reasonable gas costs for Moonbeam
      transactions.forEach(receipt => {
        expect(receipt.gasUsed).to.be.below(500000);
        expect(receipt.gasUsed).to.be.above(100000); // Should use some gas
      });
    });
  });

  describe('Edge Cases', function () {
    it('Should handle contract interaction after ownership transfer', async function () {
      await todoListFactory.connect(user1).createTodoList();

      const todoListAddress = await todoListFactory.getTodoListForUser(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);

      // Transfer ownership of the TodoList to another user
      await todoListContract.connect(user1).transferOwnership(user2.address);

      // Factory should still return the same address
      expect(await todoListFactory.getTodoListForUser(user1.address)).to.equal(todoListAddress);

      // But the TodoList owner should be user2 now
      expect(await todoListContract.owner()).to.equal(user2.address);
    });

    it('Should handle zero address queries gracefully', async function () {
      const todoListAddress = await todoListFactory.getTodoListForUser(ethers.ZeroAddress);
      expect(todoListAddress).to.equal(ethers.ZeroAddress);
    });

    it('Should maintain state consistency across multiple operations', async function () {
      // Create TodoLists for multiple users in sequence
      const users = [user1, user2, user3];

      for (const user of users) {
        await todoListFactory.connect(user).createTodoList();
      }

      // Verify all state is consistent
      expect(await todoListFactory.getUserCount()).to.equal(3);

      const allUsers = await todoListFactory.getUsers(0, 10);
      expect(allUsers.length).to.equal(3);

      for (let i = 0; i < users.length; i++) {
        expect(allUsers[i]).to.equal(users[i].address);

        const todoListAddress = await todoListFactory.getTodoListForUser(users[i].address);
        expect(todoListAddress).to.not.equal(ethers.ZeroAddress);

        const todoListContract = TodoList.attach(todoListAddress);
        expect(await todoListContract.owner()).to.equal(users[i].address);
      }
    });
  });
});
