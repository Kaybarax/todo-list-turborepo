# Polkadot Todo Pallet

A Substrate pallet for managing todo items on a Polkadot-based blockchain.

## Features

- **Decentralized Storage**: All todos are stored on-chain
- **User-Owned Data**: Each account has its own todo list
- **CRUD Operations**: Create, read, update, and delete todos
- **Priority Levels**: Support for Low, Medium, and High priority todos
- **Completion Tracking**: Mark todos as complete/incomplete with timestamps
- **Statistics**: Get todo statistics (total, completed, pending, high priority)

## Pallet Structure

### Storage Items

- **Todos**: Maps account IDs to a list of todos
- **NextId**: Maps account IDs to the next todo ID
- **TodoStats**: Maps account IDs to todo statistics

### Extrinsics (Transactions)

1. **create_todo**: Create a new todo item
   - Parameters: `title`, `description`, `priority`

2. **update_todo**: Update an existing todo
   - Parameters: `id`, `title` (optional), `description` (optional), `priority` (optional)

3. **toggle_todo_completion**: Toggle the completion status of a todo
   - Parameters: `id`

4. **delete_todo**: Delete a todo
   - Parameters: `id`

### Events

- **TodoCreated**: Emitted when a todo is created
- **TodoUpdated**: Emitted when a todo is updated
- **TodoCompletionToggled**: Emitted when a todo's completion status is toggled
- **TodoDeleted**: Emitted when a todo is deleted

### Errors

- **TodoListFull**: The todo list has reached its maximum capacity
- **TitleTooLong**: The todo title exceeds the maximum length
- **DescriptionTooLong**: The todo description exceeds the maximum length
- **TodoNotFound**: The specified todo ID doesn't exist

## Installation

### Add to Your Runtime

1. Add the pallet to your runtime's `Cargo.toml`:

```toml
[dependencies]
pallet-todo = { version = "0.1.0", default-features = false, path = "../path/to/pallet-todo" }

[features]
default = ["std"]
std = [
    # ...
    "pallet-todo/std",
    # ...
]
```

2. Configure the pallet in your runtime's `lib.rs`:

```rust
parameter_types! {
    // Maximum length for todo title (in bytes)
    pub const MaxTitleLength: u32 = 100;
    // Maximum length for todo description (in bytes)
    pub const MaxDescriptionLength: u32 = 500;
    // Maximum number of todos per account
    pub const MaxTodosPerAccount: u32 = 50;
}

impl pallet_todo::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type Moment = u64;
    type TimeProvider = Timestamp;
    type MaxTitleLength = MaxTitleLength;
    type MaxDescriptionLength = MaxDescriptionLength;
    type MaxTodosPerAccount = MaxTodosPerAccount;
}

// Include the pallet in your runtime
construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        // ...
        Todo: pallet_todo,
        // ...
    }
);
```

## Usage

### Creating a Todo

```rust
// Create a todo with medium priority
Todo::create_todo(
    RuntimeOrigin::signed(account_id),
    b"Buy groceries".to_vec(),
    b"Milk, eggs, bread".to_vec(),
    pallet_todo::Priority::Medium,
)
```

### Updating a Todo

```rust
// Update a todo's title and priority
Todo::update_todo(
    RuntimeOrigin::signed(account_id),
    todo_id,
    Some(b"Buy organic groceries".to_vec()),
    None, // Keep the same description
    Some(pallet_todo::Priority::High),
)
```

### Toggling Completion

```rust
// Mark a todo as completed (or incomplete if already completed)
Todo::toggle_todo_completion(
    RuntimeOrigin::signed(account_id),
    todo_id,
)
```

### Deleting a Todo

```rust
// Delete a todo
Todo::delete_todo(
    RuntimeOrigin::signed(account_id),
    todo_id,
)
```

### Reading Todos

```rust
// Get all todos for an account
let todos = pallet_todo::Todos::<Runtime>::get(account_id);

// Get todo statistics for an account
let stats = pallet_todo::TodoStats::<Runtime>::get(account_id);
```

## Frontend Integration

### Using Polkadot.js API

```javascript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

// Connect to the node
const wsProvider = new WsProvider('ws://localhost:9944');
const api = await ApiPromise.create({ provider: wsProvider });

// Enable the extension
await web3Enable('Todo App');

// Get accounts
const accounts = await web3Accounts();
const account = accounts[0];

// Create a todo
const createTodo = async () => {
  const title = 'Buy groceries';
  const description = 'Milk, eggs, bread';
  const priority = { Medium: null }; // Low, Medium, or High

  await api.tx.todo
    .createTodo(title, description, priority)
    .signAndSend(account.address, { signer: account.signer }, ({ status }) => {
      if (status.isInBlock) {
        console.log(`Transaction included in block ${status.asInBlock}`);
      }
    });
};

// Get todos
const getTodos = async address => {
  const todos = await api.query.todo.todos(address);
  return todos.toHuman();
};

// Get todo statistics
const getTodoStats = async address => {
  const stats = await api.query.todo.todoStats(address);
  return stats.toHuman();
};

// Toggle todo completion
const toggleTodoCompletion = async todoId => {
  await api.tx.todo.toggleTodoCompletion(todoId).signAndSend(account.address, { signer: account.signer });
};

// Delete todo
const deleteTodo = async todoId => {
  await api.tx.todo.deleteTodo(todoId).signAndSend(account.address, { signer: account.signer });
};
```

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const TodoApp = () => {
  const [api, setApi] = useState(null);
  const [account, setAccount] = useState(null);
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  // Initialize API and account
  useEffect(() => {
    const init = async () => {
      const wsProvider = new WsProvider('ws://localhost:9944');
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);

      await web3Enable('Todo App');
      const accounts = await web3Accounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    };

    init();
  }, []);

  // Load todos and stats when account changes
  useEffect(() => {
    if (api && account) {
      fetchTodos();
    }
  }, [api, account]);

  const fetchTodos = async () => {
    if (!api || !account) return;

    setLoading(true);
    try {
      const todos = await api.query.todo.todos(account.address);
      setTodos(todos.toHuman() || []);

      const stats = await api.query.todo.todoStats(account.address);
      setStats(stats.toHuman() || { total: 0, completed: 0, pending: 0, highPriority: 0 });
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async e => {
    e.preventDefault();
    if (!api || !account || !title) return;

    setLoading(true);
    try {
      await api.tx.todo
        .createTodo(title, description, { [priority]: null })
        .signAndSend(account.address, { signer: account.signer }, ({ status }) => {
          if (status.isInBlock) {
            setTitle('');
            setDescription('');
            setPriority('Medium');
            fetchTodos();
          }
        });
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompletion = async id => {
    if (!api || !account) return;

    setLoading(true);
    try {
      await api.tx.todo
        .toggleTodoCompletion(id)
        .signAndSend(account.address, { signer: account.signer }, ({ status }) => {
          if (status.isInBlock) {
            fetchTodos();
          }
        });
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async id => {
    if (!api || !account) return;

    setLoading(true);
    try {
      await api.tx.todo.deleteTodo(id).signAndSend(account.address, { signer: account.signer }, ({ status }) => {
        if (status.isInBlock) {
          fetchTodos();
        }
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!api || !account) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Polkadot Todo App</h1>

      <div className="stats">
        <h3>Statistics</h3>
        <p>Total: {stats.total}</p>
        <p>Completed: {stats.completed}</p>
        <p>Pending: {stats.pending}</p>
        <p>High Priority: {stats.highPriority}</p>
      </div>

      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          maxLength={100}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={500}
        />
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" disabled={loading}>
          Add Todo
        </button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span className={`priority priority-${Object.keys(todo.priority)[0].toLowerCase()}`}>
              {Object.keys(todo.priority)[0]}
            </span>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <div className="todo-actions">
              <button onClick={() => handleToggleCompletion(todo.id)}>
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
```

## Development

### Building

```bash
cargo build --release
```

### Testing

```bash
cargo test
```

### Benchmarking

```bash
cargo build --release --features runtime-benchmarks
./target/release/node-template benchmark pallet --pallet pallet_todo --extrinsic '*' --steps 50 --repeat 20
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
