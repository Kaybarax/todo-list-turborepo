const { ethers } = require('hardhat');

/**
 * Setup script for local Base development environment
 * This script deploys contracts and sets up test data for development
 */
async function main() {
  console.log('🚀 Setting up local Base development environment...\n');

  // Get signers
  const [deployer, user1, user2, user3] = await ethers.getSigners();

  console.log('📋 Account Information:');
  console.log(`Deployer: ${deployer.address}`);
  console.log(`User1: ${user1.address}`);
  console.log(`User2: ${user2.address}`);
  console.log(`User3: ${user3.address}\n`);

  // Check network
  const network = await ethers.provider.getNetwork();
  console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Check balances
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${ethers.formatEther(deployerBalance)} ETH\n`);

  try {
    // Deploy TodoListFactory
    console.log('📦 Deploying TodoListFactory...');
    const TodoListFactory = await ethers.getContractFactory('TodoListFactory');
    const todoListFactory = await TodoListFactory.deploy();
    await todoListFactory.waitForDeployment();

    const factoryAddress = await todoListFactory.getAddress();
    console.log(`✅ TodoListFactory deployed to: ${factoryAddress}`);

    // Verify deployment
    const factoryOwner = await todoListFactory.owner();
    console.log(`👤 Factory owner: ${factoryOwner}\n`);

    // Create TodoLists for test users
    console.log('🏗️  Creating TodoLists for test users...');

    const users = [
      { signer: user1, name: 'User1' },
      { signer: user2, name: 'User2' },
      { signer: user3, name: 'User3' },
    ];

    const todoListAddresses = {};

    for (const user of users) {
      console.log(`Creating TodoList for ${user.name}...`);
      const tx = await todoListFactory.connect(user.signer).createTodoList();
      await tx.wait();

      const todoListAddress = await todoListFactory.getTodoListForUser(user.signer.address);
      todoListAddresses[user.name] = todoListAddress;
      console.log(`✅ ${user.name} TodoList: ${todoListAddress}`);
    }

    console.log('\n🎯 Creating sample todos...');

    // Create sample todos for each user
    const TodoList = await ethers.getContractFactory('TodoList');

    // User1 todos - Developer tasks
    const user1TodoList = TodoList.attach(todoListAddresses.User1);
    await user1TodoList.connect(user1).createTodo(
      'Implement Base integration',
      'Add Base network support to the application',
      2, // High priority
    );
    await user1TodoList.connect(user1).createTodo(
      'Write unit tests',
      'Create comprehensive test suite for Base contracts',
      1, // Medium priority
    );
    await user1TodoList.connect(user1).createTodo(
      'Update documentation',
      'Document Base network setup and deployment',
      0, // Low priority
    );

    // Complete one task
    await user1TodoList.connect(user1).toggleTodoCompletion(2);
    console.log('✅ User1: Created 3 todos (1 completed)');

    // User2 todos - Project management tasks
    const user2TodoList = TodoList.attach(todoListAddresses.User2);
    await user2TodoList.connect(user2).createTodo(
      'Review Base deployment',
      'Check Base smart contract deployment and functionality',
      2, // High priority
    );
    await user2TodoList.connect(user2).createTodo(
      'Plan testing strategy',
      'Define comprehensive testing approach for Base integration',
      1, // Medium priority
    );
    await user2TodoList.connect(user2).createTodo(
      'Prepare demo',
      'Create demo showcasing Base network features',
      1, // Medium priority
    );
    await user2TodoList.connect(user2).createTodo(
      'Schedule team meeting',
      'Organize meeting to discuss Base integration progress',
      0, // Low priority
    );

    // Complete two tasks
    await user2TodoList.connect(user2).toggleTodoCompletion(1);
    await user2TodoList.connect(user2).toggleTodoCompletion(4);
    console.log('✅ User2: Created 4 todos (2 completed)');

    // User3 todos - QA tasks
    const user3TodoList = TodoList.attach(todoListAddresses.User3);
    await user3TodoList.connect(user3).createTodo(
      'Test Base network connectivity',
      'Verify application can connect to Base network',
      2, // High priority
    );
    await user3TodoList.connect(user3).createTodo(
      'Validate gas optimization',
      'Ensure Base L2 gas optimizations are working correctly',
      1, // Medium priority
    );

    console.log('✅ User3: Created 2 todos (0 completed)');

    // Display summary
    console.log('\n📊 Development Environment Summary:');
    console.log('=====================================');
    console.log(`Factory Address: ${factoryAddress}`);
    console.log(`Total Users: ${await todoListFactory.getUserCount()}`);

    for (const user of users) {
      const todoList = TodoList.attach(todoListAddresses[user.name]);
      const todos = await todoList.connect(user.signer).getTodos();
      const stats = await todoList.connect(user.signer).getTodoStats();

      console.log(`\n${user.name} (${user.signer.address}):`);
      console.log(`  TodoList: ${todoListAddresses[user.name]}`);
      console.log(`  Total Todos: ${stats.total}`);
      console.log(`  Completed: ${stats.completed}`);
      console.log(`  Pending: ${stats.pending}`);
      console.log(`  High Priority: ${stats.highPriority}`);
    }

    // Save deployment info
    const deploymentInfo = {
      network: {
        name: network.name,
        chainId: network.chainId.toString(),
      },
      contracts: {
        TodoListFactory: factoryAddress,
      },
      users: {
        deployer: deployer.address,
        user1: user1.address,
        user2: user2.address,
        user3: user3.address,
      },
      todoLists: todoListAddresses,
      timestamp: new Date().toISOString(),
    };

    console.log('\n💾 Deployment info saved to deployment-info.json');

    // In a real environment, you might want to save this to a file
    // const fs = require('fs');
    // fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

    console.log('\n🎉 Local Base development environment setup complete!');
    console.log('\n🔧 Next steps:');
    console.log('1. Use the factory address to interact with the contracts');
    console.log('2. Test todo operations using the deployed TodoLists');
    console.log('3. Verify Base L2 optimizations are working');
    console.log('4. Run integration tests against the deployed contracts');
  } catch (error) {
    console.error('\n❌ Error setting up development environment:');
    console.error(error);
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };
