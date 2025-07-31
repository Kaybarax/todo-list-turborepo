# Solana Todo Program

A decentralized todo list application built on Solana using the Anchor framework.

## Features

- **Decentralized Storage**: All todos are stored on the Solana blockchain
- **User-Owned Data**: Each user has their own todo list account
- **CRUD Operations**: Create, read, update, and delete todos
- **Priority Levels**: Support for Low, Medium, and High priority todos
- **Completion Tracking**: Mark todos as complete/incomplete with timestamps
- **Statistics**: Get todo statistics (total, completed, pending, high priority)
- **Access Control**: Only the owner can modify their todo list

## Program Structure

### Instructions

1. **initialize_todo_list**: Creates a new todo list for a user
2. **create_todo**: Adds a new todo item
3. **update_todo**: Updates an existing todo's title, description, or priority
4. **toggle_todo_completion**: Marks a todo as complete/incomplete
5. **delete_todo**: Removes a todo from the list
6. **get_todo_stats**: Returns statistics about the todo list

### Accounts

- **TodoList**: Main account storing user's todos and metadata
- **Todo**: Individual todo item with title, description, priority, and timestamps

### Data Types

```rust
pub struct Todo {
    pub id: u64,
    pub title: String,        // Max 100 characters
    pub description: String,  // Max 500 characters
    pub completed: bool,
    pub priority: Priority,   // Low, Medium, High
    pub created_at: i64,
    pub updated_at: i64,
    pub completed_at: Option<i64>,
}

pub enum Priority {
    Low,
    Medium,
    High,
}
```

## Setup and Development

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.16+)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) (v0.29+)
- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/) or [npm](https://npmjs.com/)

### Installation

1. Clone the repository and navigate to the Solana contracts directory:
```bash
cd apps/smart-contracts/solana
```

2. Install dependencies:
```bash
yarn install
```

3. Build the program:
```bash
anchor build
```

### Local Development

1. Start a local Solana validator:
```bash
solana-test-validator
```

2. Configure Solana CLI to use localhost:
```bash
solana config set --url localhost
```

3. Create a new keypair (if needed):
```bash
solana-keygen new
```

4. Airdrop SOL for testing:
```bash
solana airdrop 10
```

5. Deploy the program:
```bash
anchor deploy
```

6. Run tests:
```bash
anchor test
```

### Network Deployment

#### Devnet Deployment

1. Configure for devnet:
```bash
solana config set --url devnet
```

2. Airdrop SOL for deployment:
```bash
solana airdrop 2
```

3. Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

4. Run deployment script:
```bash
yarn deploy:devnet
```

#### Mainnet Deployment

⚠️ **Warning**: Mainnet deployment costs real SOL. Test thoroughly on devnet first.

1. Configure for mainnet:
```bash
solana config set --url mainnet-beta
```

2. Ensure sufficient SOL balance (minimum 1 SOL recommended)

3. Deploy to mainnet:
```bash
anchor deploy --provider.cluster mainnet
```

4. Run deployment script:
```bash
yarn deploy:mainnet
```

## Testing

The program includes comprehensive tests covering:

- Todo list initialization
- CRUD operations for todos
- Priority management
- Completion status tracking
- Error handling
- Access control
- Statistics calculation

Run tests with:
```bash
anchor test
```

For specific test files:
```bash
anchor test --skip-deploy tests/todo-program.ts
```

## Client Integration

### TypeScript/JavaScript

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoProgram } from "./types/todo_program";

// Initialize program
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.TodoProgram as Program<TodoProgram>;

// Get user's todo list PDA
const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("todo_list"), wallet.publicKey.toBuffer()],
  program.programId
);

// Initialize todo list
await program.methods
  .initializeTodoList()
  .accounts({
    todoList: todoListPda,
    owner: wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

// Create a todo
await program.methods
  .createTodo("My Todo", "Description", { medium: {} })
  .accounts({
    todoList: todoListPda,
    owner: wallet.publicKey,
  })
  .rpc();
```

## Program Addresses

### Localnet
- Program ID: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

### Devnet
- Program ID: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
- Explorer: [View on Solana Explorer](https://explorer.solana.com/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS?cluster=devnet)

### Mainnet
- Program ID: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
- Explorer: [View on Solana Explorer](https://explorer.solana.com/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS)

## Security Considerations

- **Access Control**: Only the owner of a todo list can modify it
- **Data Validation**: Input validation for title and description lengths
- **PDA Security**: Uses Program Derived Addresses for deterministic account creation
- **Rent Exemption**: Accounts are rent-exempt to prevent data loss

## Limitations

- Maximum 50 todos per user (configurable in code)
- Title limited to 100 characters
- Description limited to 500 characters
- No todo sharing between users (by design)

## Cost Analysis

### Transaction Costs (approximate)

- Initialize todo list: ~0.002 SOL
- Create todo: ~0.0005 SOL
- Update todo: ~0.0005 SOL
- Toggle completion: ~0.0005 SOL
- Delete todo: ~0.0005 SOL

### Storage Costs

- Todo list account: ~0.01 SOL (rent-exempt)
- Additional storage scales with number of todos

## Troubleshooting

### Common Issues

1. **Program not found**: Ensure the program is deployed to the correct network
2. **Insufficient funds**: Airdrop SOL for devnet or ensure sufficient balance for mainnet
3. **Account already exists**: Todo list can only be initialized once per user
4. **Todo not found**: Verify the todo ID exists in the list
5. **Access denied**: Ensure you're using the correct wallet/owner

### Debug Commands

```bash
# Check program deployment
solana program show <PROGRAM_ID>

# Check account info
solana account <ACCOUNT_ADDRESS>

# View transaction logs
solana logs <TRANSACTION_SIGNATURE>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.