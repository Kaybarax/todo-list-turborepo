# Solana Todo Program Guide

This guide provides detailed information about the Solana Todo Program, its architecture, and how to use it in your applications.

## Program Overview

The Todo Program is a decentralized application built on the Solana blockchain using the Anchor framework. It allows users to create and manage todo lists with full CRUD (Create, Read, Update, Delete) functionality.

### Key Features

- **User-Owned Todo Lists**: Each user has their own todo list stored on-chain
- **Full CRUD Operations**: Create, read, update, and delete todos
- **Priority Levels**: Support for Low, Medium, and High priority todos
- **Completion Tracking**: Mark todos as complete/incomplete with timestamps
- **Statistics**: Get todo statistics (total, completed, pending, high priority)
- **Access Control**: Only the owner can modify their todo list

## Program Architecture

### Account Structure

The program uses two main account types:

1. **TodoList Account**: A Program Derived Address (PDA) that stores:
   - Owner's public key
   - Array of Todo items
   - Next ID counter for todos

2. **Todo Item Structure**: Each todo item contains:
   - Unique ID
   - Title (max 100 characters)
   - Description (max 500 characters)
   - Completion status
   - Priority level (Low, Medium, High)
   - Creation timestamp
   - Last update timestamp
   - Completion timestamp (if completed)

### Program Instructions

The program exposes the following instructions:

1. **initialize_todo_list**: Creates a new todo list for a user
   - Accounts: `todo_list` (PDA), `owner` (signer), `system_program`
   - No parameters

2. **create_todo**: Adds a new todo item
   - Accounts: `todo_list` (PDA), `owner` (signer)
   - Parameters: `title` (string), `description` (string), `priority` (enum)

3. **update_todo**: Updates an existing todo's title, description, or priority
   - Accounts: `todo_list` (PDA), `owner` (signer)
   - Parameters: `todo_id` (u64), `title` (optional string), `description` (optional string), `priority` (optional enum)

4. **toggle_todo_completion**: Marks a todo as complete/incomplete
   - Accounts: `todo_list` (PDA), `owner` (signer)
   - Parameters: `todo_id` (u64)

5. **delete_todo**: Removes a todo from the list
   - Accounts: `todo_list` (PDA), `owner` (signer)
   - Parameters: `todo_id` (u64)

6. **get_todo_stats**: Returns statistics about the todo list
   - Accounts: `todo_list` (PDA), `owner` (signer)
   - Returns: `TodoStats` struct with total, completed, pending, and high priority counts

## Security Model

The program implements several security measures:

1. **PDA-based Accounts**: Todo lists are stored in Program Derived Addresses (PDAs) derived from the owner's public key
2. **Owner Verification**: All write operations verify the transaction signer is the todo list owner
3. **Input Validation**: Title and description lengths are validated to prevent overflow attacks
4. **Rent Exemption**: Accounts are rent-exempt to ensure data persistence

## Error Handling

The program defines custom errors for common failure scenarios:

- `TodoNotFound`: The specified todo ID doesn't exist
- `TitleTooLong`: Title exceeds the maximum length (100 characters)
- `DescriptionTooLong`: Description exceeds the maximum length (500 characters)
- `MaxTodosReached`: The todo list has reached its maximum capacity (50 todos)

## Client Integration

### TypeScript/JavaScript Integration

Here's how to integrate the Todo Program in a TypeScript/JavaScript application:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoProgram } from "./types/todo_program";

// Initialize connection and wallet
const connection = new anchor.web3.Connection(
  anchor.web3.clusterApiUrl("devnet"),
  "confirmed"
);
const wallet = useWallet(); // or any wallet adapter

// Create provider
const provider = new anchor.AnchorProvider(
  connection,
  wallet,
  { commitment: "confirmed" }
);

// Load program
const programId = new anchor.web3.PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
const program = new anchor.Program(
  idl, // Load from IDL file
  programId,
  provider
) as Program<TodoProgram>;

// Derive PDA for todo list
const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("todo_list"), wallet.publicKey.toBuffer()],
  program.programId
);

// Initialize todo list
async function initializeTodoList() {
  return program.methods
    .initializeTodoList()
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
}

// Create a todo
async function createTodo(title, description, priority) {
  return program.methods
    .createTodo(title, description, priority) // priority: { low: {} }, { medium: {} }, or { high: {} }
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .rpc();
}

// Fetch todos
async function fetchTodos() {
  const todoList = await program.account.todoList.fetch(todoListPda);
  return todoList.todos;
}

// Update a todo
async function updateTodo(id, title, description, priority) {
  return program.methods
    .updateTodo(
      new anchor.BN(id),
      title, // Pass null to keep current value
      description, // Pass null to keep current value
      priority // Pass null to keep current value
    )
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .rpc();
}

// Toggle todo completion
async function toggleTodoCompletion(id) {
  return program.methods
    .toggleTodoCompletion(new anchor.BN(id))
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .rpc();
}

// Delete a todo
async function deleteTodo(id) {
  return program.methods
    .deleteTodo(new anchor.BN(id))
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .rpc();
}

// Get todo statistics
async function getTodoStats() {
  return program.methods
    .getTodoStats()
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .view();
}
```

### React Integration Example

Here's a simple React component that integrates with the Todo Program:

```tsx
import React, { useState, useEffect } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { TodoProgram } from './types/todo_program';
import { idl } from './idl/todo_program';

const TodoApp = () => {
  const wallet = useAnchorWallet();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState(null);
  const [todoListPda, setTodoListPda] = useState(null);

  // Initialize program when wallet connects
  useEffect(() => {
    if (!wallet) return;

    const connection = new anchor.web3.Connection(
      anchor.web3.clusterApiUrl('devnet'),
      'confirmed'
    );

    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );

    const programId = new anchor.web3.PublicKey(
      'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
    );

    const program = new anchor.Program(
      idl,
      programId,
      provider
    );

    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('todo_list'), wallet.publicKey.toBuffer()],
      programId
    );

    setProgram(program);
    setTodoListPda(pda);
    fetchTodos(program, pda);
  }, [wallet]);

  // Fetch todos
  const fetchTodos = async (program, pda) => {
    if (!program || !pda) return;

    try {
      setLoading(true);
      
      try {
        const todoList = await program.account.todoList.fetch(pda);
        setTodos(todoList.todos);
      } catch (error) {
        // Todo list doesn't exist yet
        setTodos([]);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize todo list
  const initializeTodoList = async () => {
    if (!program || !wallet) return;

    try {
      setLoading(true);
      await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListPda,
          owner: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      fetchTodos(program, todoListPda);
    } catch (error) {
      console.error('Error initializing todo list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!program || !wallet) return;

    try {
      setLoading(true);
      
      // Convert priority string to Anchor enum format
      const priorityEnum = { [priority]: {} };
      
      await program.methods
        .createTodo(title, description, priorityEnum)
        .accounts({
          todoList: todoListPda,
          owner: wallet.publicKey,
        })
        .rpc();
      
      setTitle('');
      setDescription('');
      setPriority('medium');
      fetchTodos(program, todoListPda);
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion
  const toggleCompletion = async (id) => {
    if (!program || !wallet) return;

    try {
      setLoading(true);
      await program.methods
        .toggleTodoCompletion(new anchor.BN(id))
        .accounts({
          todoList: todoListPda,
          owner: wallet.publicKey,
        })
        .rpc();
      
      fetchTodos(program, todoListPda);
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (!program || !wallet) return;

    try {
      setLoading(true);
      await program.methods
        .deleteTodo(new anchor.BN(id))
        .accounts({
          todoList: todoListPda,
          owner: wallet.publicKey,
        })
        .rpc();
      
      fetchTodos(program, todoListPda);
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet) {
    return <div>Please connect your wallet to use the Todo App</div>;
  }

  return (
    <div>
      <h1>Solana Todo App</h1>
      
      {todos.length === 0 && (
        <button onClick={initializeTodoList} disabled={loading}>
          Initialize Todo List
        </button>
      )}
      
      <form onSubmit={createTodo}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" disabled={loading}>
          Add Todo
        </button>
      </form>
      
      {loading && <div>Loading...</div>}
      
      <ul>
        {todos.map((todo) => (
          <li key={todo.id.toString()}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompletion(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <span className={`priority priority-${Object.keys(todo.priority)[0]}`}>
              {Object.keys(todo.priority)[0]}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
```

## Deployment Guide

### Local Development

1. Install dependencies:
```bash
cd apps/blockchain-smart-contracts/solana
yarn install
```

2. Build the program:
```bash
anchor build
```

3. Start a local validator:
```bash
solana-test-validator
```

4. Deploy locally:
```bash
anchor deploy
```

5. Run tests:
```bash
anchor test
```

### Devnet Deployment

1. Configure Solana CLI for devnet:
```bash
solana config set --url devnet
```

2. Ensure you have SOL for deployment:
```bash
solana airdrop 2
```

3. Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

4. Run the deployment script:
```bash
yarn deploy:devnet
```

### Mainnet Deployment

1. Configure Solana CLI for mainnet:
```bash
solana config set --url mainnet-beta
```

2. Ensure you have sufficient SOL (at least 1 SOL recommended)

3. Deploy to mainnet:
```bash
anchor deploy --provider.cluster mainnet
```

4. Run the deployment script:
```bash
yarn deploy:mainnet
```

## Program Limitations

- Maximum 50 todos per user (configurable in code)
- Title limited to 100 characters
- Description limited to 500 characters
- No todo sharing between users (by design)

## Transaction Costs

- Initialize todo list: ~0.002 SOL
- Create todo: ~0.0005 SOL
- Update todo: ~0.0005 SOL
- Toggle completion: ~0.0005 SOL
- Delete todo: ~0.0005 SOL

## Advanced Topics

### Custom Client Integration

For custom client integration, you'll need:

1. The program ID: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
2. The IDL file (located at `target/idl/todo_program.json` after building)
3. A Solana wallet (like Phantom, Solflare, or a keypair)

### Account Size Calculation

The TodoList account size is calculated as:
- 8 bytes (discriminator)
- 32 bytes (owner public key)
- 4 bytes (vector length)
- (50 * Todo size) bytes (todos array)
- 8 bytes (next_id)

Each Todo item size:
- 8 bytes (id)
- 4 + 100 bytes (title)
- 4 + 500 bytes (description)
- 1 byte (completed)
- 1 byte (priority)
- 8 bytes (created_at)
- 8 bytes (updated_at)
- 1 + 8 bytes (completed_at)

### Custom PDA Derivation

The program uses a PDA derived from:
- Seed 1: The string "todo_list"
- Seed 2: The owner's public key

```typescript
const [todoListPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("todo_list"), ownerPublicKey.toBuffer()],
  programId
);
```

## Troubleshooting

### Common Issues

1. **Account already in use**: The todo list has already been initialized
   - Solution: Use the existing todo list instead of initializing a new one

2. **Todo not found**: The specified todo ID doesn't exist
   - Solution: Verify the todo ID exists in the list

3. **Invalid owner**: Only the owner can modify their todo list
   - Solution: Ensure you're using the correct wallet

4. **Title/description too long**: Exceeds maximum length
   - Solution: Shorten the text to fit within limits

### Debug Commands

```bash
# Check program deployment
solana program show Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

# Check account info
solana account <ACCOUNT_ADDRESS>

# View transaction logs
solana logs <TRANSACTION_SIGNATURE>
```

## Resources

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Solana Explorer](https://explorer.solana.com/)