const { ethers } = require('hardhat');

/**
 * Test script for local Base development environment
 * This script runs comprehensive tests against deployed contracts
 */
async function main() {
  console.log('🧪 Testing local Base development environment...\n');

  // Get signers
  const [deployer, user1, user2, user3] = await ethers.getSigners();
  
  console.log('📋 Test Configuration:');
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Test Users: ${user1.address}, ${user2.address}, ${user3.address}\n`);

  // Check network
  const network = await ethers.provider.getNetwork();
  console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  function logTest(testName, passed, details = '') {
    if (passed) {
      console.log(`✅ ${testName}`);
      testsPassed++;
    } else {
      console.log(`❌ ${testName}${details ? ': ' + details : ''}`);
      testsFailed++;
    }
  }

  try {
    console.log('🚀 Starting comprehensive tests...\n');

    // Test 1: Deploy TodoListFactory
    console.log('📦 Test 1: Contract Deployment');
    const TodoListFactory = await ethers.getContractFactory('TodoListFactory');
    const todoListFactory = await TodoListFactory.deploy();
    await todoListFactory.waitForDeployment();
    
    const factoryAddress = await todoListFactory.getAddress();
    logTest('TodoListFactory deployment', factoryAddress !== ethers.ZeroAddress);
    
    const factoryOwner = await todoListFactory.owner();
    logTest('Factory owner verification', factoryOwner === deployer.address);

    // Test 2: TodoList Creation
    console.log('\n🏗️  Test 2: TodoList Creation');
    
    const createTx = await todoListFactory.connect(user1).createTodoList();
    await createTx.wait();
    
    const user1TodoListAddress = await todoListFactory.getTodoListForUser(user1.address);
    logTest('TodoList creation', user1TodoListAddress !== ethers.ZeroAddress);
    
    const userCount = await todoListFactory.getUserCount();
    logTest('User count increment', userCount === 1n);

    // Test 3: TodoList Functionality
    console.log('\n📝 Test 3: TodoList Operations');
    
    const TodoList = await ethers.getContractFactory('TodoList');
    const user1TodoList = TodoList.attach(user1TodoListAddress);
    
    // Test todo creation
    const createTodoTx = await user1TodoList.connect(user1).createTodo(
      'Test Todo',
      'Testing todo creation',
      1
    );
    await createTodoTx.wait();
    
    const todos = await user1TodoList.connect(user1).getTodos();
    logTest('Todo creation', todos.length === 1);
    logTest('Todo data integrity', todos[0].title === 'Test Todo' && todos[0].priority === 1);

    // Test todo update
    await user1TodoList.connect(user1).updateTodo(1, 'Updated Todo', 'Updated description', 2);
    const updatedTodo = await user1TodoList.connect(user1).getTodo(1);
    logTest('Todo update', updatedTodo.title === 'Updated Todo' && updatedTodo.priority === 2);

    // Test todo completion toggle
    await user1TodoList.connect(user1).toggleTodoCompletion(1);
    const completedTodo = await user1TodoList.connect(user1).getTodo(1);
    logTest('Todo completion toggle', completedTodo.completed === true);

    // Test 4: Statistics
    console.log('\n📊 Test 4: Statistics and Analytics');
    
    // Create more todos for statistics testing
    await user1TodoList.connect(user1).createTodo('High Priority Todo', 'Important task', 2);
    await user1TodoList.connect(user1).createTodo('Low Priority Todo', 'Optional task', 0);
    
    const stats = await user1TodoList.connect(user1).getTodoStats();
    logTest('Statistics calculation', stats.total === 3n && stats.completed === 1n && stats.pending === 2n);
    logTest('High priority count', stats.highPriority === 1n); // One uncompleted high priority

    // Test 5: Multiple Users
    console.log('\n👥 Test 5: Multi-User Support');
    
    // Create TodoList for user2
    await todoListFactory.connect(user2).createTodoList();
    const user2TodoListAddress = await todoListFactory.getTodoListForUser(user2.address);
    const user2TodoList = TodoList.attach(user2TodoListAddress);
    
    // Create todo for user2
    await user2TodoList.connect(user2).createTodo('User2 Todo', 'User2 task', 1);
    
    const user2Todos = await user2TodoList.connect(user2).getTodos();
    logTest('Multi-user isolation', user2Todos.length === 1 && user2Todos[0].title === 'User2 Todo');
    
    // Verify users cannot access each other's todos
    try {
      await user1TodoList.connect(user2).getTodo(1);
      logTest('Access control', false, 'User2 should not access User1 todos');
    } catch (error) {
      logTest('Access control', error.message.includes('Todo not found'));
    }

    // Test 6: Factory Operations
    console.log('\n🏭 Test 6: Factory Operations');
    
    const totalUsers = await todoListFactory.getUserCount();
    logTest('Total user count', totalUsers === 2n);
    
    const users = await todoListFactory.getUsers(0, 10);
    logTest('User enumeration', users.length === 2 && users.includes(user1.address) && users.includes(user2.address));

    // Test 7: Error Handling
    console.log('\n🚨 Test 7: Error Handling');
    
    // Test duplicate TodoList creation
    try {
      await todoListFactory.connect(user1).createTodoList();
      logTest('Duplicate prevention', false, 'Should prevent duplicate TodoList creation');
    } catch (error) {
      logTest('Duplicate prevention', error.message.includes('TodoList already exists'));
    }
    
    // Test invalid todo operations
    try {
      await user1TodoList.connect(user1).createTodo('', 'Empty title test', 1);
      logTest('Empty title validation', false, 'Should reject empty title');
    } catch (error) {
      logTest('Empty title validation', error.message.includes('Title cannot be empty'));
    }
    
    try {
      await user1TodoList.connect(user1).getTodo(999);
      logTest('Non-existent todo handling', false, 'Should reject non-existent todo access');
    } catch (error) {
      logTest('Non-existent todo handling', error.message.includes('Todo not found'));
    }

    // Test 8: Gas Efficiency (Base L2 specific)
    console.log('\n⛽ Test 8: Gas Efficiency (Base L2)');
    
    const gasTx = await user1TodoList.connect(user1).createTodo('Gas Test', 'Testing gas usage', 1);
    const gasReceipt = await gasTx.wait();
    
    logTest('Gas efficiency', gasReceipt.gasUsed < 200000n, `Gas used: ${gasReceipt.gasUsed}`);

    // Test 9: Event Emission
    console.log('\n📡 Test 9: Event Emission');
    
    const eventTx = await user1TodoList.connect(user1).createTodo('Event Test', 'Testing events', 2);
    const eventReceipt = await eventTx.wait();
    
    const todoCreatedEvents = eventReceipt.logs.filter(log => {
      try {
        const parsed = user1TodoList.interface.parseLog(log);
        return parsed.name === 'TodoCreated';
      } catch {
        return false;
      }
    });
    
    logTest('Event emission', todoCreatedEvents.length === 1);

    // Test 10: Performance with Multiple Operations
    console.log('\n🏃 Test 10: Performance Testing');
    
    const startTime = Date.now();
    
    // Perform multiple operations
    const operations = [];
    for (let i = 0; i < 10; i++) {
      operations.push(user1TodoList.connect(user1).createTodo(`Perf Test ${i}`, `Performance test ${i}`, i % 3));
    }
    
    await Promise.all(operations);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    logTest('Performance test', duration < 10000, `Duration: ${duration}ms`);
    
    const finalTodos = await user1TodoList.connect(user1).getTodos();
    logTest('Batch operations', finalTodos.length >= 10);

    // Test 11: Data Integrity
    console.log('\n🔒 Test 11: Data Integrity');
    
    // Perform mixed operations and verify state consistency
    await user1TodoList.connect(user1).toggleTodoCompletion(2);
    await user1TodoList.connect(user1).updateTodo(3, 'Integrity Test', 'Updated for integrity', 1);
    await user1TodoList.connect(user1).deleteTodo(4);
    
    const integrityTodos = await user1TodoList.connect(user1).getTodos();
    const integrityStats = await user1TodoList.connect(user1).getTodoStats();
    
    logTest('Data integrity', integrityStats.total === BigInt(integrityTodos.length));

    // Test 12: Base Network Specific Features
    console.log('\n🌐 Test 12: Base Network Features');
    
    // Verify we're on Base or compatible network
    const chainId = network.chainId;
    logTest('Network compatibility', chainId === 8453n || chainId === 31337n, `Chain ID: ${chainId}`);
    
    // Test Base-specific optimizations (low gas costs)
    const baseTx = await user1TodoList.connect(user1).createTodo('Base Test', 'Base network test', 1);
    const baseReceipt = await baseTx.wait();
    logTest('Base L2 efficiency', baseReceipt.gasUsed < 150000n, `Gas used: ${baseReceipt.gasUsed}`);

    // Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsFailed}`);
    console.log(`📊 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 All tests passed! Base development environment is ready.');
      console.log('\n🔧 Environment Details:');
      console.log(`Factory Address: ${factoryAddress}`);
      console.log(`User1 TodoList: ${user1TodoListAddress}`);
      console.log(`User2 TodoList: ${user2TodoListAddress}`);
      console.log(`Total Users: ${await todoListFactory.getUserCount()}`);
    } else {
      console.log('\n⚠️  Some tests failed. Please review the issues above.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Critical error during testing:');
    console.error(error);
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };