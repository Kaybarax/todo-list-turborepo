// Script to create sample todos for testing on Base
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get the network name
  const network = hre.network.name;
  console.log(`Creating sample todos on Base ${network}...`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Using account: ${deployer.address}`);

  // Load deployment info
  const deploymentPath = path.join(__dirname, `../deployments/${network}.json`);
  if (!fs.existsSync(deploymentPath)) {
    console.error(`Deployment info not found for ${network}`);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const todoListAddress = deploymentInfo.todoList;

  if (!todoListAddress) {
    console.error("TodoList address not found in deployment info");
    console.log("Please run create-todo-list.js first");
    process.exit(1);
  }

  // Connect to TodoList
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const todoList = TodoList.attach(todoListAddress);

  // Create sample todos specific to Base
  const sampleTodos = [
    {
      title: "Deploy on Base L2",
      description: "Successfully deploy todo contracts on Base, Coinbase's Ethereum L2 optimistic rollup",
      priority: 2, // High
    },
    {
      title: "Test L2 transaction speeds",
      description: "Verify fast and cheap transactions on Base's optimistic rollup",
      priority: 1, // Medium
    },
    {
      title: "Optimize for low gas costs",
      description: "Ensure efficient gas usage for Base's low-cost environment",
      priority: 1, // Medium
    },
    {
      title: "Integrate with Base ecosystem",
      description: "Test compatibility with Base-native dApps and protocols",
      priority: 0, // Low
    },
    {
      title: "Document Base specifics",
      description: "Create documentation for Base L2-specific features and optimizations",
      priority: 0, // Low
    },
  ];

  console.log("Creating sample todos...");
  for (const todo of sampleTodos) {
    console.log(`Creating todo: ${todo.title}`);
    const tx = await todoList.createTodo(todo.title, todo.description, todo.priority);
    await tx.wait();
  }

  // Mark some todos as completed
  console.log("Marking some todos as completed...");
  await (await todoList.toggleTodoCompletion(1)).wait();
  await (await todoList.toggleTodoCompletion(3)).wait();

  // Get todo stats
  const stats = await todoList.getTodoStats();
  console.log("\nTodo Statistics:");
  console.log(`Total: ${stats.total}`);
  console.log(`Completed: ${stats.completed}`);
  console.log(`Pending: ${stats.pending}`);
  console.log(`High Priority: ${stats.highPriority}`);

  console.log(`\nSample todos created successfully on Base ${network}!`);
  console.log(`Gas costs paid in ETH tokens.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });