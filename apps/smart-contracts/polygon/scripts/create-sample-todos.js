// Script to create sample todos for testing
const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  // Get the network name
  const network = hre.network.name;
  console.log(`Creating sample todos on ${network}...`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Using account: ${deployer.address}`);

  // Load deployment info
  const deploymentPath = path.join(__dirname, `../deployments/${network}.json`);
  if (!fs.existsSync(deploymentPath)) {
    console.error(`Deployment info not found for ${network}`);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const todoListAddress = deploymentInfo.todoList;

  if (!todoListAddress) {
    console.error('TodoList address not found in deployment info');
    console.log('Please run create-todo-list.js first');
    process.exit(1);
  }

  // Connect to TodoList
  const TodoList = await hre.ethers.getContractFactory('TodoList');
  const todoList = TodoList.attach(todoListAddress);

  // Create sample todos
  const sampleTodos = [
    {
      title: 'Implement Polygon smart contract',
      description: 'Create a smart contract for todo management on Polygon',
      priority: 2, // High
    },
    {
      title: 'Write comprehensive tests',
      description: 'Create unit tests for all contract functionality',
      priority: 1, // Medium
    },
    {
      title: 'Deploy to Mumbai testnet',
      description: 'Test the contract on Mumbai before mainnet deployment',
      priority: 1, // Medium
    },
    {
      title: 'Create frontend integration',
      description: 'Integrate the contract with the frontend application',
      priority: 0, // Low
    },
    {
      title: 'Document the API',
      description: 'Create comprehensive documentation for the contract API',
      priority: 0, // Low
    },
  ];

  console.log('Creating sample todos...');
  for (const todo of sampleTodos) {
    console.log(`Creating todo: ${todo.title}`);
    const tx = await todoList.createTodo(todo.title, todo.description, todo.priority);
    await tx.wait();
  }

  // Mark some todos as completed
  console.log('Marking some todos as completed...');
  await (await todoList.toggleTodoCompletion(1)).wait();
  await (await todoList.toggleTodoCompletion(2)).wait();

  // Get todo stats
  const stats = await todoList.getTodoStats();
  console.log('\nTodo Statistics:');
  console.log(`Total: ${stats.total}`);
  console.log(`Completed: ${stats.completed}`);
  console.log(`Pending: ${stats.pending}`);
  console.log(`High Priority: ${stats.highPriority}`);

  console.log('\nSample todos created successfully!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
