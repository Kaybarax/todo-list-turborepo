// Script to deploy the TodoList contracts on Moonbeam
const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  // Get the network name
  const network = hre.network.name;
  console.log(`Deploying to Moonbeam ${network}...`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const tokenSymbol = network === 'moonbeam' ? 'GLMR' : 'DEV';
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} ${tokenSymbol}`);

  // Deploy TodoListFactory
  console.log('Deploying TodoListFactory...');
  const TodoListFactory = await hre.ethers.getContractFactory('TodoListFactory');
  const todoListFactory = await TodoListFactory.deploy();
  await todoListFactory.waitForDeployment();

  const todoListFactoryAddress = await todoListFactory.getAddress();
  console.log(`TodoListFactory deployed to: ${todoListFactoryAddress}`);

  // Save deployment info
  const deploymentDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentInfo = {
    network,
    chainId: network === 'moonbeam' ? 1284 : network === 'moonbase' ? 1287 : 1281,
    todoListFactory: todoListFactoryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  fs.writeFileSync(path.join(deploymentDir, `${network}.json`), JSON.stringify(deploymentInfo, null, 2));

  console.log(`Deployment info saved to deployments/${network}.json`);

  // Wait for a few blocks for Moonscan to index the contract
  if (network !== 'localhost' && network !== 'hardhat' && network !== 'moonbeam_dev') {
    console.log('Waiting for Moonscan to index the contract...');
    await new Promise(resolve => setTimeout(resolve, 60000)); // 60 seconds

    // Verify contract on Moonscan
    console.log('Verifying contract on Moonscan...');
    try {
      await hre.run('verify:verify', {
        address: todoListFactoryAddress,
        constructorArguments: [],
      });
      console.log('Contract verified on Moonscan');
    } catch (error) {
      console.error('Error verifying contract:', error);
    }
  }

  console.log('Deployment completed successfully!');
  console.log('\nNext steps:');
  console.log("1. Run 'npm run create-todo-list' to create a TodoList instance");
  console.log("2. Run 'npm run create-sample-todos' to populate with sample data");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
