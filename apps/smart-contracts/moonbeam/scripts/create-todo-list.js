// Script to create a TodoList for the deployer on Moonbeam
const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  // Get the network name
  const network = hre.network.name;
  console.log(`Creating TodoList on Moonbeam ${network}...`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Using account: ${deployer.address}`);

  // Load deployment info
  const deploymentPath = path.join(__dirname, `../deployments/${network}.json`);
  if (!fs.existsSync(deploymentPath)) {
    console.error(`Deployment info not found for ${network}`);
    console.log('Please run the deploy script first');
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const todoListFactoryAddress = deploymentInfo.todoListFactory;

  // Connect to TodoListFactory
  const TodoListFactory = await hre.ethers.getContractFactory('TodoListFactory');
  const todoListFactory = TodoListFactory.attach(todoListFactoryAddress);

  // Check if TodoList already exists
  const existingTodoList = await todoListFactory.getTodoList();
  if (existingTodoList !== hre.ethers.ZeroAddress) {
    console.log(`TodoList already exists at: ${existingTodoList}`);
    return;
  }

  // Create TodoList
  console.log('Creating TodoList...');
  const tx = await todoListFactory.createTodoList();
  const receipt = await tx.wait();

  // Get TodoList address
  const todoListAddress = await todoListFactory.getTodoList();
  console.log(`TodoList created at: ${todoListAddress}`);
  console.log(`Transaction hash: ${receipt.hash}`);

  // Update deployment info
  deploymentInfo.todoList = todoListAddress;
  deploymentInfo.updatedAt = new Date().toISOString();

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info updated in deployments/${network}.json`);

  const tokenSymbol = network === 'moonbeam' ? 'GLMR' : 'DEV';
  console.log(`\nTodoList successfully created on Moonbeam ${network}!`);
  console.log(`Gas costs paid in ${tokenSymbol} tokens.`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
