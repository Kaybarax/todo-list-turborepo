/* eslint-disable no-unused-vars */
import { BlockchainNetwork } from '@todo/services';
import { Alert } from 'react-native';

import { type Todo } from '../store/todoStore';

export interface BlockchainTodo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: number; // Unix timestamp
  tags: string[];
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  owner: string; // Wallet address
}

export interface TransactionResult {
  hash: string;
  blockNumber?: number;
  gasUsed?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface BlockchainServiceInterface {
  // Todo operations
  createTodo(_todo: Omit<BlockchainTodo, 'id' | 'createdAt' | 'updatedAt' | 'owner'>): Promise<TransactionResult>;
  updateTodo(_id: string, _updates: Partial<BlockchainTodo>): Promise<TransactionResult>;
  deleteTodo(_id: string): Promise<TransactionResult>;
  getTodo(_id: string): Promise<BlockchainTodo | null>;
  getUserTodos(_userAddress: string): Promise<BlockchainTodo[]>;

  // Transaction monitoring
  getTransactionStatus(_hash: string): Promise<'pending' | 'confirmed' | 'failed'>;
  waitForTransaction(_hash: string): Promise<TransactionResult>;
}

// Base mobile blockchain service with common mobile-specific functionality
abstract class MobileBlockchainService implements BlockchainServiceInterface {
  protected networkName: string;

  constructor(networkName: string) {
    this.networkName = networkName;
  }

  abstract createTodo(
    _todo: Omit<BlockchainTodo, 'id' | 'createdAt' | 'updatedAt' | 'owner'>,
  ): Promise<TransactionResult>;
  abstract updateTodo(_id: string, _updates: Partial<BlockchainTodo>): Promise<TransactionResult>;
  abstract deleteTodo(_id: string): Promise<TransactionResult>;
  abstract getTodo(_id: string): Promise<BlockchainTodo | null>;
  abstract getUserTodos(_userAddress: string): Promise<BlockchainTodo[]>;

  async getTransactionStatus(_hash: string): Promise<'pending' | 'confirmed' | 'failed'> {
    await this.simulateNetworkDelay(500);

    // Mock status - randomly return confirmed after some time
    return Math.random() > 0.3 ? 'confirmed' : 'pending';
  }

  async waitForTransaction(hash: string): Promise<TransactionResult> {
    // Show mobile-friendly loading state
    return new Promise(resolve => {
      Alert.alert(
        'Transaction Processing',
        `Your transaction is being processed on ${this.networkName}. This may take a few moments.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Simulate waiting for confirmation
              this.simulateNetworkDelay(3000)
                .then(() => {
                  resolve({
                    hash,
                    blockNumber: Math.floor(Math.random() * 1000000),
                    gasUsed: Math.floor(Math.random() * 50000),
                    status: 'confirmed',
                  });
                })
                .catch(() => {
                  resolve({
                    hash,
                    blockNumber: Math.floor(Math.random() * 1000000),
                    gasUsed: Math.floor(Math.random() * 50000),
                    status: 'failed',
                  });
                });
            },
          },
        ],
      );
    });
  }

  protected async simulateNetworkDelay(ms: number = 1000): Promise<void> {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms));
  }

  protected generateMockTransactionHash(): string {
    return Math.random().toString(16).substr(2, 64);
  }

  protected showTransactionAlert(type: 'success' | 'error', message: string) {
    Alert.alert(type === 'success' ? 'Transaction Successful' : 'Transaction Failed', message, [{ text: 'OK' }]);
  }
}

// Solana mobile blockchain service implementation
export class SolanaMobileBlockchainService extends MobileBlockchainService {
  private _programId: string;

  constructor(programId: string) {
    super('Solana');
    this._programId = programId;
  }

  async createTodo(
    _todo: Omit<BlockchainTodo, 'id' | 'createdAt' | 'updatedAt' | 'owner'>,
  ): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1500);

    const result = {
      hash: this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert('success', `Todo created on Solana network!\nTransaction: ${result.hash.slice(0, 8)}...`);

    return result;
  }

  async updateTodo(_id: string, _updates: Partial<BlockchainTodo>): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1200);

    const result = {
      hash: this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert('success', `Todo updated on Solana network!\nTransaction: ${result.hash.slice(0, 8)}...`);

    return result;
  }

  async deleteTodo(_id: string): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1000);

    const result = {
      hash: this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo deleted from Solana network!\nTransaction: ${result.hash.slice(0, 8)}...`,
    );

    return result;
  }

  async getTodo(_id: string): Promise<BlockchainTodo | null> {
    await this.simulateNetworkDelay();
    return null;
  }

  async getUserTodos(_userAddress: string): Promise<BlockchainTodo[]> {
    await this.simulateNetworkDelay();
    return [];
  }
}

// Polkadot mobile blockchain service implementation
export class PolkadotMobileBlockchainService extends MobileBlockchainService {
  constructor() {
    super('Polkadot');
  }

  async createTodo(
    _todo: Omit<BlockchainTodo, 'id' | 'createdAt' | 'updatedAt' | 'owner'>,
  ): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1800);

    const result = {
      hash: this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo created on Polkadot network!\nTransaction: ${result.hash.slice(0, 8)}...`,
    );

    return result;
  }

  async updateTodo(_id: string, _updates: Partial<BlockchainTodo>): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1500);

    const result = {
      hash: this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo updated on Polkadot network!\nTransaction: ${result.hash.slice(0, 8)}...`,
    );

    return result;
  }

  async deleteTodo(_id: string): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1200);

    const result = {
      hash: this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo deleted from Polkadot network!\nTransaction: ${result.hash.slice(0, 8)}...`,
    );

    return result;
  }

  async getTodo(_id: string): Promise<BlockchainTodo | null> {
    await this.simulateNetworkDelay();
    return null;
  }

  async getUserTodos(_userAddress: string): Promise<BlockchainTodo[]> {
    await this.simulateNetworkDelay();
    return [];
  }
}

// Polygon mobile blockchain service implementation
export class PolygonMobileBlockchainService extends MobileBlockchainService {
  private contractAddress: string;

  constructor(contractAddress: string) {
    super('Polygon');
    this.contractAddress = contractAddress;
  }

  async createTodo(
    _todo: Omit<BlockchainTodo, 'id' | 'createdAt' | 'updatedAt' | 'owner'>,
  ): Promise<TransactionResult> {
    await this.simulateNetworkDelay(2000);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo created on Polygon network!\nTransaction: ${result.hash.slice(0, 10)}...`,
    );

    return result;
  }

  async updateTodo(_id: string, _updates: Partial<BlockchainTodo>): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1700);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo updated on Polygon network!\nTransaction: ${result.hash.slice(0, 10)}...`,
    );

    return result;
  }

  async deleteTodo(_id: string): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1400);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo deleted from Polygon network!\nTransaction: ${result.hash.slice(0, 10)}...`,
    );

    return result;
  }

  async getTodo(_id: string): Promise<BlockchainTodo | null> {
    await this.simulateNetworkDelay();
    return null;
  }

  async getUserTodos(_userAddress: string): Promise<BlockchainTodo[]> {
    await this.simulateNetworkDelay();
    return [];
  }
}

// Moonbeam mobile blockchain service implementation
export class MoonbeamMobileBlockchainService extends MobileBlockchainService {
  private contractAddress: string;

  constructor(contractAddress: string) {
    super('Moonbeam');
    this.contractAddress = contractAddress;
  }

  async createTodo(
    _todo: Omit<BlockchainTodo, 'id' | 'createdAt' | 'updatedAt' | 'owner'>,
  ): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1800);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo created on Moonbeam network!\nTransaction: ${result.hash.slice(0, 10)}...`,
    );

    return result;
  }

  async updateTodo(_id: string, _updates: Partial<BlockchainTodo>): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1500);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo updated on Moonbeam network!\nTransaction: ${result.hash.slice(0, 10)}...`,
    );

    return result;
  }

  async deleteTodo(_id: string): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1300);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo deleted from Moonbeam network!\nTransaction: ${result.hash.slice(0, 10)}...`,
    );

    return result;
  }

  async getTodo(_id: string): Promise<BlockchainTodo | null> {
    await this.simulateNetworkDelay();
    return null;
  }

  async getUserTodos(_userAddress: string): Promise<BlockchainTodo[]> {
    await this.simulateNetworkDelay();
    return [];
  }
}

// Base mobile blockchain service implementation
export class BaseMobileBlockchainService extends MobileBlockchainService {
  private contractAddress: string;

  constructor(contractAddress: string) {
    super('Base');
    this.contractAddress = contractAddress;
  }

  async createTodo(
    _todo: Omit<BlockchainTodo, 'id' | 'createdAt' | 'updatedAt' | 'owner'>,
  ): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1600);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert('success', `Todo created on Base network!\nTransaction: ${result.hash.slice(0, 10)}...`);

    return result;
  }

  async updateTodo(_id: string, _updates: Partial<BlockchainTodo>): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1300);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert('success', `Todo updated on Base network!\nTransaction: ${result.hash.slice(0, 10)}...`);

    return result;
  }

  async deleteTodo(_id: string): Promise<TransactionResult> {
    await this.simulateNetworkDelay(1100);

    const result = {
      hash: '0x' + this.generateMockTransactionHash(),
      status: 'pending' as const,
    };

    this.showTransactionAlert(
      'success',
      `Todo deleted from Base network!\nTransaction: ${result.hash.slice(0, 10)}...`,
    );

    return result;
  }

  async getTodo(_id: string): Promise<BlockchainTodo | null> {
    await this.simulateNetworkDelay();
    return null;
  }

  async getUserTodos(_userAddress: string): Promise<BlockchainTodo[]> {
    await this.simulateNetworkDelay();
    return [];
  }
}

// Factory function to create mobile blockchain service instances
export function createMobileBlockchainService(network: BlockchainNetwork): BlockchainServiceInterface {
  switch (network) {
    case BlockchainNetwork.SOLANA:
    case BlockchainNetwork.SOLANA_DEVNET:
      return new SolanaMobileBlockchainService('TodoProgramMobile123');

    case BlockchainNetwork.POLKADOT:
    case BlockchainNetwork.POLKADOT_TESTNET:
      return new PolkadotMobileBlockchainService();

    case BlockchainNetwork.POLYGON:
    case BlockchainNetwork.POLYGON_MUMBAI:
      return new PolygonMobileBlockchainService('0x1234567890123456789012345678901234567890');

    case BlockchainNetwork.MOONBEAM:
    case BlockchainNetwork.MOONBEAM_TESTNET:
      return new MoonbeamMobileBlockchainService('0x1234567890123456789012345678901234567890');

    case BlockchainNetwork.BASE:
    case BlockchainNetwork.BASE_TESTNET:
      return new BaseMobileBlockchainService('0x1234567890123456789012345678901234567890');

    default:
      throw new Error(
        `Unsupported network: ${network}. Available networks: ${Object.values(BlockchainNetwork).join(', ')}`,
      );
  }
}

// Legacy function for backward compatibility
export function createMobileBlockchainServiceLegacy(
  network: 'solana' | 'polkadot' | 'polygon',
): BlockchainServiceInterface {
  const networkMap = {
    solana: BlockchainNetwork.SOLANA,
    polkadot: BlockchainNetwork.POLKADOT,
    polygon: BlockchainNetwork.POLYGON,
  };

  return createMobileBlockchainService(networkMap[network]);
}

// Utility function to convert Todo to BlockchainTodo
export function todoToBlockchainTodo(todo: Todo): Omit<BlockchainTodo, 'owner'> {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    priority: todo.priority,
    dueDate: todo.dueDate ? Math.floor(todo.dueDate.getTime() / 1000) : undefined,
    tags: todo.tags,
    createdAt: Math.floor(todo.createdAt.getTime() / 1000),
    updatedAt: Math.floor(todo.updatedAt.getTime() / 1000),
  };
}

// Utility function to convert BlockchainTodo to Todo
export function blockchainTodoToTodo(blockchainTodo: BlockchainTodo, userId: string): Todo {
  return {
    id: blockchainTodo.id,
    title: blockchainTodo.title,
    description: blockchainTodo.description,
    completed: blockchainTodo.completed,
    priority: blockchainTodo.priority,
    dueDate: blockchainTodo.dueDate ? new Date(blockchainTodo.dueDate * 1000) : undefined,
    tags: blockchainTodo.tags,
    createdAt: new Date(blockchainTodo.createdAt * 1000),
    updatedAt: new Date(blockchainTodo.updatedAt * 1000),
    userId,
    blockchainAddress: blockchainTodo.owner,
  };
}
