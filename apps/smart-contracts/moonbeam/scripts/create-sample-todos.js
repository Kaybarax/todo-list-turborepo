// Script to create sample todos for testing on Moonbeam
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get the network name
  const network = hre.network.name;
  console.log(`Creating sample todos on Moonbeam ${network}...`);

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

  // Create sample todos specific to Moonbeam
  const sampleTodos = [
    {
      title: "Deploy on Moonbeam parachain",
      description: "Successfully deploy todo contracts on Moonbeam, the EVM-compatible Polkadot parachain",
      priority: 2, // High
    },
    {
      title: "Test cross-chain functionality",
      description: "Verify that the contract works seamlessly with Polkadot ecosystem",
      priority: 1, // Medium
    },
    {
      title: "Optimize for GLMR gas costs",
      description: "Ensure efficient gas usage for Moonbeam's native GLMR token",
      priority: 1, // Medium
    },
    {
      title: "Integrate with Polkadot wallets",
      description: "Test compatibility with Polkadot.js and other Substrate wallets",
      priority: 0, // Low
    },
    {
      title: "Document Moonbeam specifics",
      description: "Create documentation for Moonbeam-specific features and considerations",
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

  const tokenSymbol = network === "moonbeam" ? "GLMR" : "DEV";
  console.log(`\nSample todos created successfully on Moonbeam ${network}!`);
  console.log(`Gas costs paid in ${tokenSymbol} tokens.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });