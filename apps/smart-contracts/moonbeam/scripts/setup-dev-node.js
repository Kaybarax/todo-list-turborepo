// Script to set up local Moonbeam development node for testing
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Setup script for local Moonbeam development environment
 * This script helps developers set up a local Moonbeam node for testing
 */

console.log('🌙 Moonbeam Development Node Setup');
console.log('=====================================');

// Check if Docker is available
function checkDockerAvailability() {
  return new Promise(resolve => {
    const docker = spawn('docker', ['--version']);

    docker.on('close', code => {
      if (code === 0) {
        console.log('✅ Docker is available');
        resolve(true);
      } else {
        console.log('❌ Docker is not available or not installed');
        console.log('Please install Docker to run a local Moonbeam node');
        resolve(false);
      }
    });

    docker.on('error', () => {
      console.log('❌ Docker is not available or not installed');
      resolve(false);
    });
  });
}

// Setup local Moonbeam development node using Docker
async function setupMoonbeamDevNode() {
  console.log('\n📦 Setting up Moonbeam development node...');

  const dockerAvailable = await checkDockerAvailability();
  if (!dockerAvailable) {
    console.log('\n🔧 Alternative: Use Hardhat Network');
    console.log("You can use Hardhat's built-in network for testing:");
    console.log('  npm run node');
    console.log('  npm run test');
    return;
  }

  console.log('\n🚀 Starting Moonbeam development node with Docker...');
  console.log('This will start a local Moonbeam node compatible with Ethereum tools');

  // Moonbeam development node Docker command
  const dockerCommand = [
    'run',
    '--rm',
    '--name',
    'moonbeam-dev',
    '-p',
    '9944:9944',
    '-p',
    '9933:9933',
    'purestake/moonbeam:latest',
    '--dev',
    '--ws-external',
    '--rpc-external',
    '--rpc-cors',
    'all',
    '--rpc-methods',
    'unsafe',
  ];

  console.log('Docker command:', 'docker', dockerCommand.join(' '));
  console.log('\n📝 Node will be available at:');
  console.log('  WebSocket: ws://localhost:9944');
  console.log('  HTTP RPC: http://localhost:9933');
  console.log('  Chain ID: 1281 (Moonbeam Development)');

  console.log('\n⚠️  Note: This will run in the foreground. Press Ctrl+C to stop.');
  console.log('To run in background, add -d flag to the docker command.');

  console.log('\n🔑 Development Accounts:');
  console.log('The node comes with pre-funded development accounts:');
  console.log('  Alith: 0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac');
  console.log('  Baltathar: 0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0');
  console.log('  Charleth: 0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc');

  console.log('\n▶️  Starting node...');

  const dockerProcess = spawn('docker', dockerCommand, { stdio: 'inherit' });

  dockerProcess.on('close', code => {
    console.log(`\n🛑 Moonbeam development node stopped with code ${code}`);
  });

  dockerProcess.on('error', error => {
    console.error('❌ Error starting Moonbeam node:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Docker is running');
    console.log('2. Check if ports 9944 and 9933 are available');
    console.log('3. Try pulling the image manually: docker pull purestake/moonbeam:latest');
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Moonbeam development node...');
    dockerProcess.kill('SIGTERM');
  });
}

// Create development configuration file
function createDevConfig() {
  const configPath = path.join(__dirname, '../.env.dev');

  const devConfig = `# Moonbeam Development Node Configuration
# This file is created automatically by setup-dev-node.js

# Development node RPC URL
MOONBEAM_DEV_RPC_URL=http://localhost:9933

# Development node WebSocket URL  
MOONBEAM_DEV_WS_URL=ws://localhost:9944

# Development chain ID
MOONBEAM_DEV_CHAIN_ID=1281

# Pre-funded development accounts (DO NOT USE IN PRODUCTION)
# Alith - has 1000000000000000000000000 DEV tokens
DEV_PRIVATE_KEY_ALITH=0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133

# Baltathar - has 1000000000000000000000000 DEV tokens  
DEV_PRIVATE_KEY_BALTATHAR=0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b

# Charleth - has 1000000000000000000000000 DEV tokens
DEV_PRIVATE_KEY_CHARLETH=0x0b6e18cafb6ed99687ec547bd28139cafdd2bffe70e6b688025de6b445aa5c5b

# Default private key for development (Alith)
PRIVATE_KEY=0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133

# Explorer URL for development (not available for local node)
MOONBEAM_DEV_EXPLORER_URL=http://localhost:9933
`;

  fs.writeFileSync(configPath, devConfig);
  console.log(`✅ Development configuration created at ${configPath}`);
}

// Main setup function
async function main() {
  try {
    // Create development configuration
    createDevConfig();

    console.log('\n🎯 Setup Options:');
    console.log('1. Start local Moonbeam development node (Docker required)');
    console.log('2. Use Hardhat network for testing');
    console.log('3. Exit');

    // For now, we'll provide instructions for both options
    console.log('\n📋 Instructions:');
    console.log('\n🐳 Option 1: Local Moonbeam Node (Recommended)');
    console.log('  1. Make sure Docker is installed and running');
    console.log('  2. Run: npm run setup-dev-node');
    console.log('  3. In another terminal: npm run test');
    console.log('  4. Deploy contracts: npm run deploy:dev');

    console.log('\n⚡ Option 2: Hardhat Network (Faster for testing)');
    console.log('  1. Run: npm run node');
    console.log('  2. In another terminal: npm run test');
    console.log('  3. Deploy contracts: npm run deploy:local');

    console.log('\n🧪 Running Tests:');
    console.log('  npm run test              # Run all tests');
    console.log('  npm run test:coverage     # Run tests with coverage');
    console.log('  npm run test:gas          # Run tests with gas reporting');

    console.log('\n📊 Additional Commands:');
    console.log('  npm run compile           # Compile contracts');
    console.log('  npm run size              # Check contract sizes');
    console.log('  npm run lint              # Lint Solidity code');

    // If Docker is available, offer to start the node
    const dockerAvailable = await checkDockerAvailability();
    if (dockerAvailable) {
      console.log('\n🚀 Would you like to start the Moonbeam development node now?');
      console.log('Run this script with --start flag to begin: node scripts/setup-dev-node.js --start');

      if (process.argv.includes('--start')) {
        await setupMoonbeamDevNode();
      }
    }
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  main();
}

module.exports = {
  setupMoonbeamDevNode,
  createDevConfig,
  checkDockerAvailability,
};
