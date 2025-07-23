// Script to deploy the TodoList contracts
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get the network name
  const network = hre.network.name;
  console.log(`Deploying to ${network}...`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} MATIC`);

  // Deploy TodoListFactory
  console.log("Deploying TodoListFactory...");
  const TodoListFactory = await hre.ethers.getContractFactory("TodoListFactory");
  const todoListFactory = await TodoListFactory.deploy();
  await todoListFactory.waitForDeployment();

  const todoListFactoryAddress = await todoListFactory.getAddress();
  console.log(`TodoListFactory deployed to: ${todoListFactoryAddress}`);

  // Save deployment info
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentInfo = {
    network,
    todoListFactory: todoListFactoryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(deploymentDir, `${network}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`Deployment info saved to deployments/${network}.json`);

  // Wait for a few blocks for Polygonscan to index the contract
  if (network !== "localhost" && network !== "hardhat") {
    console.log("Waiting for Polygonscan to index the contract...");
    await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds

    // Verify contract on Polygonscan
    console.log("Verifying contract on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: todoListFactoryAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Polygonscan");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });