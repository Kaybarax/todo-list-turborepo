require('@nomicfoundation/hardhat-toolbox');
require('hardhat-contract-sizer');
require('dotenv').config();

const PRIVATE_KEY =
  process.env.MOONBEAM_PRIVATE_KEY ||
  process.env.PRIVATE_KEY ||
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const MOONBEAM_RPC_URL = process.env.MOONBEAM_RPC_URL || 'https://rpc.api.moonbeam.network';
const MOONBASE_RPC_URL = process.env.MOONBASE_RPC_URL || 'https://rpc.api.moonbase.moonbeam.network';
const MOONSCAN_API_KEY = process.env.MOONSCAN_API_KEY || '';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1281, // Moonbeam development chain ID
    },
    localhost: {
      chainId: 1281,
    },
    moonbeam: {
      url: MOONBEAM_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 1284, // Moonbeam mainnet
      gasPrice: 100000000000, // 100 gwei
    },
    moonbase: {
      url: MOONBASE_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 1287, // Moonbase Alpha testnet
      gasPrice: 1000000000, // 1 gwei
    },
    // Local development node
    moonbeam_dev: {
      url: 'http://localhost:9933',
      accounts: [PRIVATE_KEY],
      chainId: 1281,
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
      moonbeam: MOONSCAN_API_KEY,
      moonbaseAlpha: MOONSCAN_API_KEY,
    },
    customChains: [
      {
        network: 'moonbeam',
        chainId: 1284,
        urls: {
          apiURL: 'https://api-moonbeam.moonscan.io/api',
          browserURL: 'https://moonscan.io/',
        },
      },
      {
        network: 'moonbaseAlpha',
        chainId: 1287,
        urls: {
          apiURL: 'https://api-moonbase.moonscan.io/api',
          browserURL: 'https://moonbase.moonscan.io/',
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: 'GLMR', // Moonbeam native token
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  },
};
