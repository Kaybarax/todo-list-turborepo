import { BlockchainError, BlockchainErrorType, BlockchainNetwork } from '../errors';

describe('BlockchainError', () => {
  describe('constructor', () => {
    it('should create a basic error with type and message', () => {
      const error = new BlockchainError(BlockchainErrorType.NETWORK_ERROR, 'Network connection failed');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BlockchainError);
      expect(error.name).toBe('BlockchainError');
      expect(error.type).toBe(BlockchainErrorType.NETWORK_ERROR);
      expect(error.message).toBe('Network connection failed');
      expect(error.originalError).toBeUndefined();
      expect(error.transactionHash).toBeUndefined();
      expect(error.network).toBeUndefined();
    });

    it('should create an error with all options', () => {
      const originalError = new Error('Original error');
      const error = new BlockchainError(BlockchainErrorType.TRANSACTION_FAILED, 'Transaction failed', {
        originalError,
        transactionHash: '0x123',
        network: BlockchainNetwork.POLYGON,
      });

      expect(error.type).toBe(BlockchainErrorType.TRANSACTION_FAILED);
      expect(error.message).toBe('Transaction failed');
      expect(error.originalError).toBe(originalError);
      expect(error.transactionHash).toBe('0x123');
      expect(error.network).toBe(BlockchainNetwork.POLYGON);
    });

    it('should maintain proper prototype chain for instanceof checks', () => {
      const error = new BlockchainError(BlockchainErrorType.UNKNOWN_ERROR, 'Test error');

      expect(error instanceof Error).toBe(true);
      expect(error instanceof BlockchainError).toBe(true);
    });
  });

  describe('static factory methods', () => {
    describe('walletConnectionFailed', () => {
      it('should create a wallet connection failed error', () => {
        const error = BlockchainError.walletConnectionFailed('Failed to connect to MetaMask');

        expect(error.type).toBe(BlockchainErrorType.WALLET_CONNECTION_FAILED);
        expect(error.message).toBe('Failed to connect to MetaMask');
        expect(error.originalError).toBeUndefined();
        expect(error.network).toBeUndefined();
      });

      it('should create a wallet connection failed error with all options', () => {
        const originalError = new Error('MetaMask not found');
        const error = BlockchainError.walletConnectionFailed(
          'Failed to connect to MetaMask',
          originalError,
          BlockchainNetwork.POLYGON,
        );

        expect(error.type).toBe(BlockchainErrorType.WALLET_CONNECTION_FAILED);
        expect(error.message).toBe('Failed to connect to MetaMask');
        expect(error.originalError).toBe(originalError);
        expect(error.network).toBe(BlockchainNetwork.POLYGON);
      });
    });

    describe('walletNotConnected', () => {
      it('should create a wallet not connected error with default message', () => {
        const error = BlockchainError.walletNotConnected();

        expect(error.type).toBe(BlockchainErrorType.WALLET_NOT_CONNECTED);
        expect(error.message).toBe('Wallet is not connected');
        expect(error.network).toBeUndefined();
      });

      it('should create a wallet not connected error with custom message and network', () => {
        const error = BlockchainError.walletNotConnected('Please connect your wallet', BlockchainNetwork.SOLANA);

        expect(error.type).toBe(BlockchainErrorType.WALLET_NOT_CONNECTED);
        expect(error.message).toBe('Please connect your wallet');
        expect(error.network).toBe(BlockchainNetwork.SOLANA);
      });
    });

    describe('transactionFailed', () => {
      it('should create a transaction failed error', () => {
        const error = BlockchainError.transactionFailed('Transaction reverted');

        expect(error.type).toBe(BlockchainErrorType.TRANSACTION_FAILED);
        expect(error.message).toBe('Transaction reverted');
        expect(error.transactionHash).toBeUndefined();
        expect(error.originalError).toBeUndefined();
        expect(error.network).toBeUndefined();
      });

      it('should create a transaction failed error with all options', () => {
        const originalError = new Error('Gas estimation failed');
        const error = BlockchainError.transactionFailed(
          'Transaction reverted',
          '0x456',
          originalError,
          BlockchainNetwork.POLYGON_MUMBAI,
        );

        expect(error.type).toBe(BlockchainErrorType.TRANSACTION_FAILED);
        expect(error.message).toBe('Transaction reverted');
        expect(error.transactionHash).toBe('0x456');
        expect(error.originalError).toBe(originalError);
        expect(error.network).toBe(BlockchainNetwork.POLYGON_MUMBAI);
      });
    });

    describe('networkError', () => {
      it('should create a network error', () => {
        const error = BlockchainError.networkError('RPC endpoint unavailable');

        expect(error.type).toBe(BlockchainErrorType.NETWORK_ERROR);
        expect(error.message).toBe('RPC endpoint unavailable');
        expect(error.originalError).toBeUndefined();
        expect(error.network).toBeUndefined();
      });

      it('should create a network error with original error and network', () => {
        const originalError = new Error('Connection timeout');
        const error = BlockchainError.networkError('RPC endpoint unavailable', originalError, BlockchainNetwork.BASE);

        expect(error.type).toBe(BlockchainErrorType.NETWORK_ERROR);
        expect(error.message).toBe('RPC endpoint unavailable');
        expect(error.originalError).toBe(originalError);
        expect(error.network).toBe(BlockchainNetwork.BASE);
      });
    });

    describe('contractError', () => {
      it('should create a contract error', () => {
        const error = BlockchainError.contractError('Contract execution failed');

        expect(error.type).toBe(BlockchainErrorType.CONTRACT_ERROR);
        expect(error.message).toBe('Contract execution failed');
        expect(error.originalError).toBeUndefined();
        expect(error.network).toBeUndefined();
      });

      it('should create a contract error with original error and network', () => {
        const originalError = new Error('Revert reason');
        const error = BlockchainError.contractError(
          'Contract execution failed',
          originalError,
          BlockchainNetwork.MOONBEAM,
        );

        expect(error.type).toBe(BlockchainErrorType.CONTRACT_ERROR);
        expect(error.message).toBe('Contract execution failed');
        expect(error.originalError).toBe(originalError);
        expect(error.network).toBe(BlockchainNetwork.MOONBEAM);
      });
    });

    describe('insufficientFunds', () => {
      it('should create an insufficient funds error with default message', () => {
        const error = BlockchainError.insufficientFunds();

        expect(error.type).toBe(BlockchainErrorType.INSUFFICIENT_FUNDS);
        expect(error.message).toBe('Insufficient funds for transaction');
        expect(error.originalError).toBeUndefined();
        expect(error.network).toBeUndefined();
      });

      it('should create an insufficient funds error with custom message and options', () => {
        const originalError = new Error('Balance too low');
        const error = BlockchainError.insufficientFunds(
          'Not enough ETH',
          originalError,
          BlockchainNetwork.BASE_TESTNET,
        );

        expect(error.type).toBe(BlockchainErrorType.INSUFFICIENT_FUNDS);
        expect(error.message).toBe('Not enough ETH');
        expect(error.originalError).toBe(originalError);
        expect(error.network).toBe(BlockchainNetwork.BASE_TESTNET);
      });
    });

    describe('userRejected', () => {
      it('should create a user rejected error with default message', () => {
        const error = BlockchainError.userRejected();

        expect(error.type).toBe(BlockchainErrorType.USER_REJECTED);
        expect(error.message).toBe('User rejected the transaction');
        expect(error.originalError).toBeUndefined();
        expect(error.network).toBeUndefined();
      });

      it('should create a user rejected error with custom message and options', () => {
        const originalError = new Error('User denied transaction signature');
        const error = BlockchainError.userRejected(
          'Transaction cancelled by user',
          originalError,
          BlockchainNetwork.SOLANA_DEVNET,
        );

        expect(error.type).toBe(BlockchainErrorType.USER_REJECTED);
        expect(error.message).toBe('Transaction cancelled by user');
        expect(error.originalError).toBe(originalError);
        expect(error.network).toBe(BlockchainNetwork.SOLANA_DEVNET);
      });
    });

    describe('walletNotFound', () => {
      it('should create a wallet not found error', () => {
        const error = BlockchainError.walletNotFound('Phantom wallet not detected');

        expect(error.type).toBe(BlockchainErrorType.WALLET_CONNECTION_FAILED);
        expect(error.message).toBe('Phantom wallet not detected');
        expect(error.network).toBeUndefined();
        expect(error.originalError).toBeUndefined();
      });

      it('should create a wallet not found error with network and original error', () => {
        const originalError = new Error('Extension not installed');
        const error = BlockchainError.walletNotFound(
          'Phantom wallet not detected',
          BlockchainNetwork.SOLANA,
          originalError,
        );

        expect(error.type).toBe(BlockchainErrorType.WALLET_CONNECTION_FAILED);
        expect(error.message).toBe('Phantom wallet not detected');
        expect(error.network).toBe(BlockchainNetwork.SOLANA);
        expect(error.originalError).toBe(originalError);
      });
    });

    describe('connectionFailed', () => {
      it('should create a connection failed error', () => {
        const error = BlockchainError.connectionFailed('Failed to establish connection');

        expect(error.type).toBe(BlockchainErrorType.WALLET_CONNECTION_FAILED);
        expect(error.message).toBe('Failed to establish connection');
        expect(error.network).toBeUndefined();
        expect(error.originalError).toBeUndefined();
      });

      it('should create a connection failed error with network and options', () => {
        const originalError = new Error('Connection refused');
        const error = BlockchainError.connectionFailed('Failed to establish connection', BlockchainNetwork.POLKADOT, {
          originalError,
        });

        expect(error.type).toBe(BlockchainErrorType.WALLET_CONNECTION_FAILED);
        expect(error.message).toBe('Failed to establish connection');
        expect(error.network).toBe(BlockchainNetwork.POLKADOT);
        expect(error.originalError).toBe(originalError);
      });
    });

    describe('unknownError', () => {
      it('should create an unknown error with default message', () => {
        const error = BlockchainError.unknownError();

        expect(error.type).toBe(BlockchainErrorType.UNKNOWN_ERROR);
        expect(error.message).toBe('An unknown error occurred');
        expect(error.originalError).toBeUndefined();
        expect(error.network).toBeUndefined();
      });

      it('should create an unknown error with custom message and options', () => {
        const originalError = new Error('Unexpected error');
        const error = BlockchainError.unknownError(
          'Something went wrong',
          originalError,
          BlockchainNetwork.POLKADOT_TESTNET,
        );

        expect(error.type).toBe(BlockchainErrorType.UNKNOWN_ERROR);
        expect(error.message).toBe('Something went wrong');
        expect(error.originalError).toBe(originalError);
        expect(error.network).toBe(BlockchainNetwork.POLKADOT_TESTNET);
      });
    });

    describe('Moonbeam-specific errors', () => {
      describe('moonbeamConnectionFailed', () => {
        it('should create a Moonbeam connection failed error', () => {
          const error = BlockchainError.moonbeamConnectionFailed('Failed to connect to Moonbeam');

          expect(error.type).toBe(BlockchainErrorType.MOONBEAM_CONNECTION_FAILED);
          expect(error.message).toBe('Failed to connect to Moonbeam');
          expect(error.originalError).toBeUndefined();
          expect(error.network).toBeUndefined();
        });

        it('should create a Moonbeam connection failed error with options', () => {
          const originalError = new Error('Moonbeam RPC error');
          const error = BlockchainError.moonbeamConnectionFailed(
            'Failed to connect to Moonbeam',
            originalError,
            BlockchainNetwork.MOONBEAM,
          );

          expect(error.type).toBe(BlockchainErrorType.MOONBEAM_CONNECTION_FAILED);
          expect(error.message).toBe('Failed to connect to Moonbeam');
          expect(error.originalError).toBe(originalError);
          expect(error.network).toBe(BlockchainNetwork.MOONBEAM);
        });
      });

      describe('moonbeamSubstrateError', () => {
        it('should create a Moonbeam Substrate error', () => {
          const error = BlockchainError.moonbeamSubstrateError('Substrate layer error');

          expect(error.type).toBe(BlockchainErrorType.MOONBEAM_SUBSTRATE_ERROR);
          expect(error.message).toBe('Substrate layer error');
          expect(error.originalError).toBeUndefined();
          expect(error.network).toBeUndefined();
        });

        it('should create a Moonbeam Substrate error with options', () => {
          const originalError = new Error('Substrate runtime error');
          const error = BlockchainError.moonbeamSubstrateError(
            'Substrate layer error',
            originalError,
            BlockchainNetwork.MOONBEAM_TESTNET,
          );

          expect(error.type).toBe(BlockchainErrorType.MOONBEAM_SUBSTRATE_ERROR);
          expect(error.message).toBe('Substrate layer error');
          expect(error.originalError).toBe(originalError);
          expect(error.network).toBe(BlockchainNetwork.MOONBEAM_TESTNET);
        });
      });

      describe('moonbeamEvmError', () => {
        it('should create a Moonbeam EVM error', () => {
          const error = BlockchainError.moonbeamEvmError('EVM execution failed');

          expect(error.type).toBe(BlockchainErrorType.MOONBEAM_EVM_ERROR);
          expect(error.message).toBe('EVM execution failed');
          expect(error.originalError).toBeUndefined();
          expect(error.network).toBeUndefined();
        });

        it('should create a Moonbeam EVM error with options', () => {
          const originalError = new Error('EVM revert');
          const error = BlockchainError.moonbeamEvmError(
            'EVM execution failed',
            originalError,
            BlockchainNetwork.MOONBEAM,
          );

          expect(error.type).toBe(BlockchainErrorType.MOONBEAM_EVM_ERROR);
          expect(error.message).toBe('EVM execution failed');
          expect(error.originalError).toBe(originalError);
          expect(error.network).toBe(BlockchainNetwork.MOONBEAM);
        });
      });
    });

    describe('Base-specific errors', () => {
      describe('baseL2Error', () => {
        it('should create a Base L2 error', () => {
          const error = BlockchainError.baseL2Error('L2 processing error');

          expect(error.type).toBe(BlockchainErrorType.BASE_L2_ERROR);
          expect(error.message).toBe('L2 processing error');
          expect(error.originalError).toBeUndefined();
          expect(error.network).toBeUndefined();
        });

        it('should create a Base L2 error with options', () => {
          const originalError = new Error('L2 batch failed');
          const error = BlockchainError.baseL2Error('L2 processing error', originalError, BlockchainNetwork.BASE);

          expect(error.type).toBe(BlockchainErrorType.BASE_L2_ERROR);
          expect(error.message).toBe('L2 processing error');
          expect(error.originalError).toBe(originalError);
          expect(error.network).toBe(BlockchainNetwork.BASE);
        });
      });

      describe('baseSequencerError', () => {
        it('should create a Base sequencer error', () => {
          const error = BlockchainError.baseSequencerError('Sequencer unavailable');

          expect(error.type).toBe(BlockchainErrorType.BASE_SEQUENCER_ERROR);
          expect(error.message).toBe('Sequencer unavailable');
          expect(error.originalError).toBeUndefined();
          expect(error.network).toBeUndefined();
        });

        it('should create a Base sequencer error with options', () => {
          const originalError = new Error('Sequencer timeout');
          const error = BlockchainError.baseSequencerError(
            'Sequencer unavailable',
            originalError,
            BlockchainNetwork.BASE_TESTNET,
          );

          expect(error.type).toBe(BlockchainErrorType.BASE_SEQUENCER_ERROR);
          expect(error.message).toBe('Sequencer unavailable');
          expect(error.originalError).toBe(originalError);
          expect(error.network).toBe(BlockchainNetwork.BASE_TESTNET);
        });
      });

      describe('baseBridgeError', () => {
        it('should create a Base bridge error', () => {
          const error = BlockchainError.baseBridgeError('Bridge operation failed');

          expect(error.type).toBe(BlockchainErrorType.BASE_BRIDGE_ERROR);
          expect(error.message).toBe('Bridge operation failed');
          expect(error.originalError).toBeUndefined();
          expect(error.network).toBeUndefined();
        });

        it('should create a Base bridge error with options', () => {
          const originalError = new Error('Bridge contract error');
          const error = BlockchainError.baseBridgeError(
            'Bridge operation failed',
            originalError,
            BlockchainNetwork.BASE,
          );

          expect(error.type).toBe(BlockchainErrorType.BASE_BRIDGE_ERROR);
          expect(error.message).toBe('Bridge operation failed');
          expect(error.originalError).toBe(originalError);
          expect(error.network).toBe(BlockchainNetwork.BASE);
        });
      });
    });

    describe('General network errors', () => {
      describe('networkSwitchRequired', () => {
        it('should create a network switch required error', () => {
          const error = BlockchainError.networkSwitchRequired('Please switch to Polygon network');

          expect(error.type).toBe(BlockchainErrorType.NETWORK_SWITCH_REQUIRED);
          expect(error.message).toBe('Please switch to Polygon network');
          expect(error.network).toBeUndefined();
          expect(error.originalError).toBeUndefined();
        });

        it('should create a network switch required error with options', () => {
          const originalError = new Error('Wrong network');
          const error = BlockchainError.networkSwitchRequired(
            'Please switch to Polygon network',
            BlockchainNetwork.POLYGON,
            originalError,
          );

          expect(error.type).toBe(BlockchainErrorType.NETWORK_SWITCH_REQUIRED);
          expect(error.message).toBe('Please switch to Polygon network');
          expect(error.network).toBe(BlockchainNetwork.POLYGON);
          expect(error.originalError).toBe(originalError);
        });
      });

      describe('unsupportedWallet', () => {
        it('should create an unsupported wallet error', () => {
          const error = BlockchainError.unsupportedWallet('Wallet not supported for this network');

          expect(error.type).toBe(BlockchainErrorType.UNSUPPORTED_WALLET);
          expect(error.message).toBe('Wallet not supported for this network');
          expect(error.network).toBeUndefined();
          expect(error.originalError).toBeUndefined();
        });

        it('should create an unsupported wallet error with options', () => {
          const originalError = new Error('Wallet incompatible');
          const error = BlockchainError.unsupportedWallet(
            'Wallet not supported for this network',
            BlockchainNetwork.SOLANA,
            originalError,
          );

          expect(error.type).toBe(BlockchainErrorType.UNSUPPORTED_WALLET);
          expect(error.message).toBe('Wallet not supported for this network');
          expect(error.network).toBe(BlockchainNetwork.SOLANA);
          expect(error.originalError).toBe(originalError);
        });
      });
    });
  });

  describe('error serialization', () => {
    it('should be serializable to JSON', () => {
      const originalError = new Error('Original error');
      const error = BlockchainError.transactionFailed(
        'Transaction failed',
        '0x123',
        originalError,
        BlockchainNetwork.POLYGON,
      );

      // Error objects don't serialize message by default, so we need to create a custom serialization
      const serializable = {
        name: error.name,
        message: error.message,
        type: error.type,
        transactionHash: error.transactionHash,
        network: error.network,
      };

      const serialized = JSON.stringify(serializable);
      const parsed = JSON.parse(serialized);

      expect(parsed.name).toBe('BlockchainError');
      expect(parsed.message).toBe('Transaction failed');
      expect(parsed.type).toBe(BlockchainErrorType.TRANSACTION_FAILED);
      expect(parsed.transactionHash).toBe('0x123');
      expect(parsed.network).toBe(BlockchainNetwork.POLYGON);
    });
  });

  describe('error inheritance', () => {
    it('should work with try-catch blocks', () => {
      const throwError = () => {
        throw BlockchainError.walletNotConnected('Test error');
      };

      expect(() => throwError()).toThrow(BlockchainError);
      expect(() => throwError()).toThrow(Error);
      expect(() => throwError()).toThrow('Test error');
    });

    it('should work with error handling patterns', () => {
      try {
        throw BlockchainError.networkError('Network error');
      } catch (error) {
        expect(error instanceof BlockchainError).toBe(true);
        expect(error instanceof Error).toBe(true);

        if (error instanceof BlockchainError) {
          expect(error.type).toBe(BlockchainErrorType.NETWORK_ERROR);
        }
      }
    });
  });
});
