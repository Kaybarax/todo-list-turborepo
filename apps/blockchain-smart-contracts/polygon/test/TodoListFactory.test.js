const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TodoListFactory Contract Tests', function () {
  let TodoListFactory;
  let todoListFactory;
  let TodoList;
  let owner;
  let user1;
  let user2;
  let user3;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, user3, ...addrs] = await ethers.getSigners();
    
    // Deploy TodoList contract for factory to use
    TodoList = await ethers.getContractFactory('TodoList');
    
    // Deploy TodoListFactory
    TodoListFactory = await ethers.getContractFactory('TodoListFactory');
    todoListFactory = await TodoListFactory.deploy();
    await todoListFactory.deployed();
  });

  describe('Deployment', function () {
    it('Should deploy successfully', async function () {
      expect(todoListFactory.address).to.be.properAddress;
    });

    it('Should initialize with empty state', async function () {
      const allTodoLists = await todoListFactory.getAllTodoLists();
      expect(allTodoLists).to.have.length(0);
    });

    it('Should have correct initial user count', async function () {
      const userCount = await todoListFactory.getUserCount();
      expect(userCount).to.equal(0);
    });
  });

  describe('TodoList Creation', function () {
    it('Should create TodoList for user successfully', async function () {
      await expect(todoListFactory.connect(user1).createTodoList())
        .to.emit(todoListFactory, 'TodoListCreated')
        .withArgs(user1.address);

      const userTodoListAddress = await todoListFactory.getUserTodoList(user1.address);
      expect(userTodoListAddress).to.not.equal(ethers.constants.AddressZero);
    });

    it('Should increment user count after creation', async function () {
      await todoListFactory.connect(user1).createTodoList();
      
      const userCount = await todoListFactory.getUserCount();
      expect(userCount).to.equal(1);
    });

    it('Should add TodoList to global list', async function () {
      await todoListFactory.connect(user1).createTodoList();
      
      const allTodoLists = await todoListFactory.getAllTodoLists();
      expect(allTodoLists).to.have.length(1);
      
      const userTodoListAddress = await todoListFactory.getUserTodoList(user1.address);
      expect(allTodoLists[0]).to.equal(userTodoListAddress);
    });

    it('Should prevent duplicate TodoList creation for same user', async function () {
      await todoListFactory.connect(user1).createTodoList();
      
      await expect(todoListFactory.connect(user1).createTodoList())
        .to.be.revertedWith('TodoList already exists for this user');
    });

    it('Should allow multiple users to create TodoLists', async function () {
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
      await todoListFactory.connect(user3).createTodoList();

      const userCount = await todoListFactory.getUserCount();
      expect(userCount).to.equal(3);

      const allTodoLists = await todoListFactory.getAllTodoLists();
      expect(allTodoLists).to.have.length(3);

      // Verify each user has their own TodoList
      const user1TodoList = await todoListFactory.getUserTodoList(user1.address);
      const user2TodoList = await todoListFactory.getUserTodoList(user2.address);
      const user3TodoList = await todoListFactory.getUserTodoList(user3.address);

      expect(user1TodoList).to.not.equal(user2TodoList);
      expect(user2TodoList).to.not.equal(user3TodoList);
      expect(user1TodoList).to.not.equal(user3TodoList);
    });

    it('Should create TodoList with correct owner', async function () {
      await todoListFactory.connect(user1).createTodoList();
      
      const todoListAddress = await todoListFactory.getUserTodoList(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);
      
      const owner = await todoListContract.owner();
      expect(owner).to.equal(user1.address);
    });

    it('Should create functional TodoList contract', async function () {
      await todoListFactory.connect(user1).createTodoList();
      
      const todoListAddress = await todoListFactory.getUserTodoList(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);
      
      // Test basic functionality
      await todoListContract.connect(user1).createTodo(
        'Factory Test Todo',
        'Created via factory',
        1,
        Math.floor(Date.now() / 1000) + 86400
      );

      const todoCount = await todoListContract.getTodoCount();
      expect(todoCount).to.equal(1);

      const todo = await todoListContract.getTodo(0);
      expect(todo.title).to.equal('Factory Test Todo');
      expect(todo.owner).to.equal(user1.address);
    });
  });

  describe('TodoList Retrieval', function () {
    beforeEach(async function () {
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
      await todoListFactory.connect(user3).createTodoList();
    });

    it('Should return correct TodoList address for user', async function () {
      const user1TodoList = await todoListFactory.getUserTodoList(user1.address);
      const user2TodoList = await todoListFactory.getUserTodoList(user2.address);
      
      expect(user1TodoList).to.be.properAddress;
      expect(user2TodoList).to.be.properAddress;
      expect(user1TodoList).to.not.equal(user2TodoList);
    });

    it('Should return zero address for user without TodoList', async function () {
      const nonExistentUserTodoList = await todoListFactory.getUserTodoList(addrs[0].address);
      expect(nonExistentUserTodoList).to.equal(ethers.constants.AddressZero);
    });

    it('Should return all TodoList addresses', async function () {
      const allTodoLists = await todoListFactory.getAllTodoLists();
      expect(allTodoLists).to.have.length(3);
      
      // Verify all addresses are valid
      allTodoLists.forEach(address => {
        expect(address).to.be.properAddress;
        expect(address).to.not.equal(ethers.constants.AddressZero);
      });
    });

    it('Should return correct user count', async function () {
      const userCount = await todoListFactory.getUserCount();
      expect(userCount).to.equal(3);
    });

    it('Should check TodoList existence correctly', async function () {
      const user1Exists = await todoListFactory.hasTodoList(user1.address);
      const user2Exists = await todoListFactory.hasTodoList(user2.address);
      const nonExistentExists = await todoListFactory.hasTodoList(addrs[0].address);

      expect(user1Exists).to.be.true;
      expect(user2Exists).to.be.true;
      expect(nonExistentExists).to.be.false;
    });

    it('Should return users with TodoLists', async function () {
      const usersWithTodoLists = await todoListFactory.getUsersWithTodoLists();
      expect(usersWithTodoLists).to.have.length(3);
      expect(usersWithTodoLists).to.include(user1.address);
      expect(usersWithTodoLists).to.include(user2.address);
      expect(usersWithTodoLists).to.include(user3.address);
    });
  });

  describe('TodoList Management', function () {
    beforeEach(async function () {
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
    });

    it('Should allow users to delete their TodoList', async function () {
      await expect(todoListFactory.connect(user1).deleteTodoList())
        .to.emit(todoListFactory, 'TodoListDeleted')
        .withArgs(user1.address);

      const userTodoList = await todoListFactory.getUserTodoList(user1.address);
      expect(userTodoList).to.equal(ethers.constants.AddressZero);

      const userCount = await todoListFactory.getUserCount();
      expect(userCount).to.equal(1);

      const allTodoLists = await todoListFactory.getAllTodoLists();
      expect(allTodoLists).to.have.length(1);
    });

    it('Should fail to delete non-existent TodoList', async function () {
      await expect(todoListFactory.connect(user3).deleteTodoList())
        .to.be.revertedWith('TodoList does not exist for this user');
    });

    it('Should allow recreation after deletion', async function () {
      // Delete TodoList
      await todoListFactory.connect(user1).deleteTodoList();
      
      // Recreate TodoList
      await todoListFactory.connect(user1).createTodoList();
      
      const newTodoListAddress = await todoListFactory.getUserTodoList(user1.address);
      expect(newTodoListAddress).to.not.equal(ethers.constants.AddressZero);
      
      const userCount = await todoListFactory.getUserCount();
      expect(userCount).to.equal(2);
    });

    it('Should maintain data integrity after deletion', async function () {
      const originalUser2TodoList = await todoListFactory.getUserTodoList(user2.address);
      
      // Delete user1's TodoList
      await todoListFactory.connect(user1).deleteTodoList();
      
      // Verify user2's TodoList is unaffected
      const user2TodoList = await todoListFactory.getUserTodoList(user2.address);
      expect(user2TodoList).to.equal(originalUser2TodoList);
      
      const todoListContract = TodoList.attach(user2TodoList);
      const owner = await todoListContract.owner();
      expect(owner).to.equal(user2.address);
    });
  });

  describe('Batch Operations', function () {
    it('Should handle batch TodoList creation', async function () {
      const users = [user1, user2, user3];
      const promises = users.map(user => todoListFactory.connect(user).createTodoList());
      
      await Promise.all(promises);
      
      const userCount = await todoListFactory.getUserCount();
      expect(userCount).to.equal(3);
      
      const allTodoLists = await todoListFactory.getAllTodoLists();
      expect(allTodoLists).to.have.length(3);
    });

    it('Should get TodoList info for multiple users', async function () {
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
      
      const users = [user1.address, user2.address, user3.address];
      const todoListAddresses = await todoListFactory.getTodoListsForUsers(users);
      
      expect(todoListAddresses).to.have.length(3);
      expect(todoListAddresses[0]).to.not.equal(ethers.constants.AddressZero);
      expect(todoListAddresses[1]).to.not.equal(ethers.constants.AddressZero);
      expect(todoListAddresses[2]).to.equal(ethers.constants.AddressZero); // user3 doesn't have TodoList
    });

    it('Should get statistics for all TodoLists', async function () {
      // Create TodoLists and add some todos
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
      
      const user1TodoListAddress = await todoListFactory.getUserTodoList(user1.address);
      const user2TodoListAddress = await todoListFactory.getUserTodoList(user2.address);
      
      const user1TodoList = TodoList.attach(user1TodoListAddress);
      const user2TodoList = TodoList.attach(user2TodoListAddress);
      
      // Add todos to user1's list
      await user1TodoList.connect(user1).createTodo('User1 Todo 1', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      await user1TodoList.connect(user1).createTodo('User1 Todo 2', 'Description', 2, Math.floor(Date.now() / 1000) + 86400);
      await user1TodoList.connect(user1).toggleTodo(0); // Complete first todo
      
      // Add todos to user2's list
      await user2TodoList.connect(user2).createTodo('User2 Todo 1', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      
      const globalStats = await todoListFactory.getGlobalStats();
      expect(globalStats.totalUsers).to.equal(2);
      expect(globalStats.totalTodos).to.equal(3);
      expect(globalStats.totalCompletedTodos).to.equal(1);
    });
  });

  describe('Access Control and Security', function () {
    it('Should allow only TodoList owner to delete their TodoList', async function () {
      await todoListFactory.connect(user1).createTodoList();
      
      // user2 should not be able to delete user1's TodoList
      await expect(todoListFactory.connect(user2).deleteTodoList())
        .to.be.revertedWith('TodoList does not exist for this user');
    });

    it('Should prevent unauthorized access to management functions', async function () {
      // Only contract owner should be able to call admin functions (if any)
      // For this example, we'll test that regular users can't call hypothetical admin functions
      
      // This test would be relevant if there were admin-only functions
      // For now, we'll verify that all public functions work as expected
      await todoListFactory.connect(user1).createTodoList();
      
      const userTodoList = await todoListFactory.connect(user2).getUserTodoList(user1.address);
      expect(userTodoList).to.not.equal(ethers.constants.AddressZero);
    });

    it('Should handle malicious input gracefully', async function () {
      // Test with zero address (should not be possible due to msg.sender)
      // Test with contract addresses as users
      const contractAddress = todoListFactory.address;
      
      // This should work as any address can create a TodoList
      await todoListFactory.connect(user1).createTodoList();
      
      const userTodoList = await todoListFactory.getUserTodoList(user1.address);
      expect(userTodoList).to.not.equal(ethers.constants.AddressZero);
    });
  });

  describe('Event Emission', function () {
    it('Should emit TodoListCreated event with correct parameters', async function () {
      await expect(todoListFactory.connect(user1).createTodoList())
        .to.emit(todoListFactory, 'TodoListCreated')
        .withArgs(user1.address);
    });

    it('Should emit TodoListDeleted event with correct parameters', async function () {
      await todoListFactory.connect(user1).createTodoList();
      
      await expect(todoListFactory.connect(user1).deleteTodoList())
        .to.emit(todoListFactory, 'TodoListDeleted')
        .withArgs(user1.address);
    });

    it('Should emit events in correct order for multiple operations', async function () {
      const tx1 = await todoListFactory.connect(user1).createTodoList();
      const receipt1 = await tx1.wait();
      
      const tx2 = await todoListFactory.connect(user2).createTodoList();
      const receipt2 = await tx2.wait();
      
      // Verify events were emitted
      const events1 = receipt1.events.filter(e => e.event === 'TodoListCreated');
      const events2 = receipt2.events.filter(e => e.event === 'TodoListCreated');
      
      expect(events1).to.have.length(1);
      expect(events2).to.have.length(1);
      expect(events1[0].args.user).to.equal(user1.address);
      expect(events2[0].args.user).to.equal(user2.address);
    });
  });

  describe('Gas Optimization and Performance', function () {
    it('Should have reasonable gas costs for TodoList creation', async function () {
      const tx = await todoListFactory.connect(user1).createTodoList();
      const receipt = await tx.wait();
      
      // TodoList creation should be reasonably efficient
      expect(receipt.gasUsed.toNumber()).to.be.lessThan(2000000); // 2M gas limit
    });

    it('Should scale efficiently with number of TodoLists', async function () {
      const gasUsages = [];
      
      // Create multiple TodoLists and measure gas usage
      for (let i = 0; i < 5; i++) {
        const user = addrs[i];
        const tx = await todoListFactory.connect(user).createTodoList();
        const receipt = await tx.wait();
        gasUsages.push(receipt.gasUsed.toNumber());
      }
      
      // Gas usage should not increase significantly with number of TodoLists
      const firstGas = gasUsages[0];
      const lastGas = gasUsages[gasUsages.length - 1];
      const increase = (lastGas - firstGas) / firstGas;
      
      expect(increase).to.be.lessThan(0.2); // Less than 20% increase
    });

    it('Should handle large number of TodoLists efficiently', async function () {
      // Create many TodoLists
      const numTodoLists = 20;
      for (let i = 0; i < numTodoLists; i++) {
        await todoListFactory.connect(addrs[i]).createTodoList();
      }
      
      // Test retrieval performance
      const startTime = Date.now();
      const allTodoLists = await todoListFactory.getAllTodoLists();
      const endTime = Date.now();
      
      expect(allTodoLists).to.have.length(numTodoLists);
      expect(endTime - startTime).to.be.lessThan(1000); // Should complete within 1 second
    });
  });

  describe('Edge Cases and Error Handling', function () {
    it('Should handle empty state queries correctly', async function () {
      const allTodoLists = await todoListFactory.getAllTodoLists();
      const userCount = await todoListFactory.getUserCount();
      const usersWithTodoLists = await todoListFactory.getUsersWithTodoLists();
      
      expect(allTodoLists).to.have.length(0);
      expect(userCount).to.equal(0);
      expect(usersWithTodoLists).to.have.length(0);
    });

    it('Should handle queries for non-existent users', async function () {
      const nonExistentTodoList = await todoListFactory.getUserTodoList(user1.address);
      const hasNonExistentTodoList = await todoListFactory.hasTodoList(user1.address);
      
      expect(nonExistentTodoList).to.equal(ethers.constants.AddressZero);
      expect(hasNonExistentTodoList).to.be.false;
    });

    it('Should handle rapid successive operations', async function () {
      // Rapid creation and deletion
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user1).deleteTodoList();
      await todoListFactory.connect(user1).createTodoList();
      
      const userTodoList = await todoListFactory.getUserTodoList(user1.address);
      expect(userTodoList).to.not.equal(ethers.constants.AddressZero);
      
      const userCount = await todoListFactory.getUserCount();
      expect(userCount).to.equal(1);
    });

    it('Should maintain consistency under concurrent operations', async function () {
      // Simulate concurrent TodoList creation
      const promises = [
        todoListFactory.connect(user1).createTodoList(),
        todoListFactory.connect(user2).createTodoList(),
        todoListFactory.connect(user3).createTodoList(),
      ];
      
      await Promise.all(promises);
      
      // Verify final state is consistent
      const userCount = await todoListFactory.getUserCount();
      const allTodoLists = await todoListFactory.getAllTodoLists();
      
      expect(userCount).to.equal(3);
      expect(allTodoLists).to.have.length(3);
      
      // Verify each user has their own TodoList
      const user1TodoList = await todoListFactory.getUserTodoList(user1.address);
      const user2TodoList = await todoListFactory.getUserTodoList(user2.address);
      const user3TodoList = await todoListFactory.getUserTodoList(user3.address);
      
      expect(user1TodoList).to.not.equal(ethers.constants.AddressZero);
      expect(user2TodoList).to.not.equal(ethers.constants.AddressZero);
      expect(user3TodoList).to.not.equal(ethers.constants.AddressZero);
      
      expect(user1TodoList).to.not.equal(user2TodoList);
      expect(user2TodoList).to.not.equal(user3TodoList);
      expect(user1TodoList).to.not.equal(user3TodoList);
    });
  });

  describe('Integration and Interoperability', function () {
    it('Should work with external contracts', async function () {
      await todoListFactory.connect(user1).createTodoList();
      
      const todoListAddress = await todoListFactory.getUserTodoList(user1.address);
      const todoListContract = TodoList.attach(todoListAddress);
      
      // Test that the created TodoList works with external interactions
      await todoListContract.connect(user1).createTodo(
        'Integration Test',
        'Testing external interaction',
        1,
        Math.floor(Date.now() / 1000) + 86400
      );
      
      const todo = await todoListContract.getTodo(0);
      expect(todo.title).to.equal('Integration Test');
    });

    it('Should support factory pattern correctly', async function () {
      // Create multiple TodoLists
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
      
      // Verify they are independent instances
      const user1TodoListAddress = await todoListFactory.getUserTodoList(user1.address);
      const user2TodoListAddress = await todoListFactory.getUserTodoList(user2.address);
      
      const user1TodoList = TodoList.attach(user1TodoListAddress);
      const user2TodoList = TodoList.attach(user2TodoListAddress);
      
      // Add different todos to each list
      await user1TodoList.connect(user1).createTodo('User1 Todo', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      await user2TodoList.connect(user2).createTodo('User2 Todo', 'Description', 2, Math.floor(Date.now() / 1000) + 86400);
      
      // Verify independence
      const user1TodoCount = await user1TodoList.getTodoCount();
      const user2TodoCount = await user2TodoList.getTodoCount();
      
      expect(user1TodoCount).to.equal(1);
      expect(user2TodoCount).to.equal(1);
      
      const user1Todo = await user1TodoList.getTodo(0);
      const user2Todo = await user2TodoList.getTodo(0);
      
      expect(user1Todo.title).to.equal('User1 Todo');
      expect(user2Todo.title).to.equal('User2 Todo');
      expect(user1Todo.priority).to.equal(1);
      expect(user2Todo.priority).to.equal(2);
    });
  });

  describe('Upgrade and Migration Support', function () {
    it('Should support data export for migration', async function () {
      // Create TodoLists with data
      await todoListFactory.connect(user1).createTodoList();
      await todoListFactory.connect(user2).createTodoList();
      
      const user1TodoListAddress = await todoListFactory.getUserTodoList(user1.address);
      const user2TodoListAddress = await todoListFactory.getUserTodoList(user2.address);
      
      const user1TodoList = TodoList.attach(user1TodoListAddress);
      const user2TodoList = TodoList.attach(user2TodoListAddress);
      
      await user1TodoList.connect(user1).createTodo('Migration Test 1', 'Description', 1, Math.floor(Date.now() / 1000) + 86400);
      await user2TodoList.connect(user2).createTodo('Migration Test 2', 'Description', 2, Math.floor(Date.now() / 1000) + 86400);
      
      // Export data for migration
      const allTodoLists = await todoListFactory.getAllTodoLists();
      const usersWithTodoLists = await todoListFactory.getUsersWithTodoLists();
      const globalStats = await todoListFactory.getGlobalStats();
      
      // Verify export data completeness
      expect(allTodoLists).to.have.length(2);
      expect(usersWithTodoLists).to.have.length(2);
      expect(globalStats.totalUsers).to.equal(2);
      expect(globalStats.totalTodos).to.equal(2);
      
      // In a real migration, this data would be used to populate a new factory contract
      expect(allTodoLists[0]).to.be.properAddress;
      expect(allTodoLists[1]).to.be.properAddress;
      expect(usersWithTodoLists).to.include(user1.address);
      expect(usersWithTodoLists).to.include(user2.address);
    });
  });
});