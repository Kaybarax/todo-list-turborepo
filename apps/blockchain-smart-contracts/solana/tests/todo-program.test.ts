import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { TodoProgram } from '../target/types/todo_program';
import { expect } from 'chai';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';

describe('todo-program', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoProgram as Program<TodoProgram>;
  const user = provider.wallet as anchor.Wallet;

  let todoAccount: Keypair;
  let todoListAccount: Keypair;

  beforeEach(async () => {
    todoAccount = Keypair.generate();
    todoListAccount = Keypair.generate();
  });

  describe('initialize_todo_list', () => {
    it('should initialize a new todo list', async () => {
      await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoListAccount])
        .rpc();

      const todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);
      
      expect(todoListData.owner.toString()).to.equal(user.publicKey.toString());
      expect(todoListData.todos).to.have.length(0);
      expect(todoListData.totalTodos.toNumber()).to.equal(0);
      expect(todoListData.completedTodos.toNumber()).to.equal(0);
    });

    it('should fail to initialize with invalid owner', async () => {
      const invalidUser = Keypair.generate();
      
      try {
        await program.methods
          .initializeTodoList()
          .accounts({
            todoList: todoListAccount.publicKey,
            user: invalidUser.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([todoListAccount, invalidUser])
          .rpc();
        
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('create_todo', () => {
    beforeEach(async () => {
      // Initialize todo list first
      await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoListAccount])
        .rpc();
    });

    it('should create a new todo', async () => {
      const title = 'Test Todo';
      const description = 'Test Description';
      const priority = { medium: {} };
      const dueDate = new anchor.BN(Date.now() + 86400000); // Tomorrow

      await program.methods
        .createTodo(title, description, priority, dueDate)
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoAccount])
        .rpc();

      const todoData = await program.account.todo.fetch(todoAccount.publicKey);
      const todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);

      expect(todoData.title).to.equal(title);
      expect(todoData.description).to.equal(description);
      expect(todoData.completed).to.be.false;
      expect(todoData.priority).to.deep.equal(priority);
      expect(todoData.dueDate.toNumber()).to.equal(dueDate.toNumber());
      expect(todoData.owner.toString()).to.equal(user.publicKey.toString());
      
      expect(todoListData.totalTodos.toNumber()).to.equal(1);
      expect(todoListData.completedTodos.toNumber()).to.equal(0);
    });

    it('should create todo with high priority', async () => {
      const title = 'Urgent Todo';
      const description = 'Very important task';
      const priority = { high: {} };
      const dueDate = new anchor.BN(Date.now() + 3600000); // 1 hour

      await program.methods
        .createTodo(title, description, priority, dueDate)
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoAccount])
        .rpc();

      const todoData = await program.account.todo.fetch(todoAccount.publicKey);
      
      expect(todoData.priority).to.deep.equal(priority);
      expect(todoData.title).to.equal(title);
    });

    it('should create todo with low priority', async () => {
      const title = 'Low Priority Todo';
      const description = 'Can wait';
      const priority = { low: {} };
      const dueDate = new anchor.BN(Date.now() + 604800000); // 1 week

      await program.methods
        .createTodo(title, description, priority, dueDate)
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoAccount])
        .rpc();

      const todoData = await program.account.todo.fetch(todoAccount.publicKey);
      
      expect(todoData.priority).to.deep.equal(priority);
    });

    it('should fail to create todo with empty title', async () => {
      const title = '';
      const description = 'Test Description';
      const priority = { medium: {} };
      const dueDate = new anchor.BN(Date.now() + 86400000);

      try {
        await program.methods
          .createTodo(title, description, priority, dueDate)
          .accounts({
            todo: todoAccount.publicKey,
            todoList: todoListAccount.publicKey,
            user: user.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([todoAccount])
          .rpc();
        
        expect.fail('Should have thrown an error for empty title');
      } catch (error) {
        expect(error.message).to.include('Title cannot be empty');
      }
    });

    it('should fail to create todo with past due date', async () => {
      const title = 'Test Todo';
      const description = 'Test Description';
      const priority = { medium: {} };
      const dueDate = new anchor.BN(Date.now() - 86400000); // Yesterday

      try {
        await program.methods
          .createTodo(title, description, priority, dueDate)
          .accounts({
            todo: todoAccount.publicKey,
            todoList: todoListAccount.publicKey,
            user: user.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([todoAccount])
          .rpc();
        
        expect.fail('Should have thrown an error for past due date');
      } catch (error) {
        expect(error.message).to.include('Due date cannot be in the past');
      }
    });
  });

  describe('update_todo', () => {
    beforeEach(async () => {
      // Initialize todo list and create a todo
      await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoListAccount])
        .rpc();

      await program.methods
        .createTodo('Original Title', 'Original Description', { medium: {} }, new anchor.BN(Date.now() + 86400000))
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoAccount])
        .rpc();
    });

    it('should update todo title and description', async () => {
      const newTitle = 'Updated Title';
      const newDescription = 'Updated Description';
      const newPriority = { high: {} };
      const newDueDate = new anchor.BN(Date.now() + 172800000); // 2 days

      await program.methods
        .updateTodo(newTitle, newDescription, newPriority, newDueDate)
        .accounts({
          todo: todoAccount.publicKey,
          user: user.publicKey,
        })
        .rpc();

      const todoData = await program.account.todo.fetch(todoAccount.publicKey);
      
      expect(todoData.title).to.equal(newTitle);
      expect(todoData.description).to.equal(newDescription);
      expect(todoData.priority).to.deep.equal(newPriority);
      expect(todoData.dueDate.toNumber()).to.equal(newDueDate.toNumber());
    });

    it('should fail to update todo by non-owner', async () => {
      const unauthorizedUser = Keypair.generate();
      
      try {
        await program.methods
          .updateTodo('Hacked Title', 'Hacked Description', { high: {} }, new anchor.BN(Date.now() + 86400000))
          .accounts({
            todo: todoAccount.publicKey,
            user: unauthorizedUser.publicKey,
          })
          .signers([unauthorizedUser])
          .rpc();
        
        expect.fail('Should have thrown an error for unauthorized update');
      } catch (error) {
        expect(error.message).to.include('Unauthorized');
      }
    });
  });

  describe('toggle_todo', () => {
    beforeEach(async () => {
      // Initialize todo list and create a todo
      await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoListAccount])
        .rpc();

      await program.methods
        .createTodo('Test Todo', 'Test Description', { medium: {} }, new anchor.BN(Date.now() + 86400000))
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoAccount])
        .rpc();
    });

    it('should toggle todo completion status', async () => {
      // Initially not completed
      let todoData = await program.account.todo.fetch(todoAccount.publicKey);
      expect(todoData.completed).to.be.false;

      // Toggle to completed
      await program.methods
        .toggleTodo()
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
        })
        .rpc();

      todoData = await program.account.todo.fetch(todoAccount.publicKey);
      let todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);
      
      expect(todoData.completed).to.be.true;
      expect(todoListData.completedTodos.toNumber()).to.equal(1);

      // Toggle back to not completed
      await program.methods
        .toggleTodo()
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
        })
        .rpc();

      todoData = await program.account.todo.fetch(todoAccount.publicKey);
      todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);
      
      expect(todoData.completed).to.be.false;
      expect(todoListData.completedTodos.toNumber()).to.equal(0);
    });

    it('should fail to toggle todo by non-owner', async () => {
      const unauthorizedUser = Keypair.generate();
      
      try {
        await program.methods
          .toggleTodo()
          .accounts({
            todo: todoAccount.publicKey,
            todoList: todoListAccount.publicKey,
            user: unauthorizedUser.publicKey,
          })
          .signers([unauthorizedUser])
          .rpc();
        
        expect.fail('Should have thrown an error for unauthorized toggle');
      } catch (error) {
        expect(error.message).to.include('Unauthorized');
      }
    });
  });

  describe('delete_todo', () => {
    beforeEach(async () => {
      // Initialize todo list and create a todo
      await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoListAccount])
        .rpc();

      await program.methods
        .createTodo('Test Todo', 'Test Description', { medium: {} }, new anchor.BN(Date.now() + 86400000))
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoAccount])
        .rpc();
    });

    it('should delete todo successfully', async () => {
      await program.methods
        .deleteTodo()
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
        })
        .rpc();

      // Verify todo account is closed
      try {
        await program.account.todo.fetch(todoAccount.publicKey);
        expect.fail('Todo account should be closed');
      } catch (error) {
        expect(error.message).to.include('Account does not exist');
      }

      // Verify todo list stats are updated
      const todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);
      expect(todoListData.totalTodos.toNumber()).to.equal(0);
    });

    it('should fail to delete todo by non-owner', async () => {
      const unauthorizedUser = Keypair.generate();
      
      try {
        await program.methods
          .deleteTodo()
          .accounts({
            todo: todoAccount.publicKey,
            todoList: todoListAccount.publicKey,
            user: unauthorizedUser.publicKey,
          })
          .signers([unauthorizedUser])
          .rpc();
        
        expect.fail('Should have thrown an error for unauthorized deletion');
      } catch (error) {
        expect(error.message).to.include('Unauthorized');
      }
    });

    it('should update completed count when deleting completed todo', async () => {
      // First complete the todo
      await program.methods
        .toggleTodo()
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
        })
        .rpc();

      let todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);
      expect(todoListData.completedTodos.toNumber()).to.equal(1);

      // Then delete it
      await program.methods
        .deleteTodo()
        .accounts({
          todo: todoAccount.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
        })
        .rpc();

      todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);
      expect(todoListData.totalTodos.toNumber()).to.equal(0);
      expect(todoListData.completedTodos.toNumber()).to.equal(0);
    });
  });

  describe('get_todo_stats', () => {
    beforeEach(async () => {
      // Initialize todo list
      await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todoListAccount])
        .rpc();
    });

    it('should return correct stats for empty todo list', async () => {
      const todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);
      
      expect(todoListData.totalTodos.toNumber()).to.equal(0);
      expect(todoListData.completedTodos.toNumber()).to.equal(0);
    });

    it('should return correct stats with multiple todos', async () => {
      const todo1 = Keypair.generate();
      const todo2 = Keypair.generate();
      const todo3 = Keypair.generate();

      // Create 3 todos
      await program.methods
        .createTodo('Todo 1', 'Description 1', { high: {} }, new anchor.BN(Date.now() + 86400000))
        .accounts({
          todo: todo1.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todo1])
        .rpc();

      await program.methods
        .createTodo('Todo 2', 'Description 2', { medium: {} }, new anchor.BN(Date.now() + 86400000))
        .accounts({
          todo: todo2.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todo2])
        .rpc();

      await program.methods
        .createTodo('Todo 3', 'Description 3', { low: {} }, new anchor.BN(Date.now() + 86400000))
        .accounts({
          todo: todo3.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([todo3])
        .rpc();

      // Complete one todo
      await program.methods
        .toggleTodo()
        .accounts({
          todo: todo1.publicKey,
          todoList: todoListAccount.publicKey,
          user: user.publicKey,
        })
        .rpc();

      const todoListData = await program.account.todoList.fetch(todoListAccount.publicKey);
      
      expect(todoListData.totalTodos.toNumber()).to.equal(3);
      expect(todoListData.completedTodos.toNumber()).to.equal(1);
    });
  });

  describe('error handling', () => {
    it('should handle account not found errors', async () => {
      const nonExistentTodo = Keypair.generate();
      
      try {
        await program.account.todo.fetch(nonExistentTodo.publicKey);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Account does not exist');
      }
    });

    it('should handle insufficient funds for account creation', async () => {
      const poorUser = Keypair.generate();
      const newTodoList = Keypair.generate();
      
      try {
        await program.methods
          .initializeTodoList()
          .accounts({
            todoList: newTodoList.publicKey,
            user: poorUser.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([newTodoList, poorUser])
          .rpc();
        
        expect.fail('Should have thrown an error for insufficient funds');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});