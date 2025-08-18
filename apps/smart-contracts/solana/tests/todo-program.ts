import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { TodoProgram } from '../target/types/todo_program';
import { expect } from 'chai';

describe('todo-program', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoProgram as Program<TodoProgram>;
  const owner = provider.wallet as anchor.Wallet;

  let todoListPda: anchor.web3.PublicKey;
  let _todoListBump: number;

  before(async () => {
    // Derive the PDA for the todo list
    [todoListPda, _todoListBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('todo_list'), owner.publicKey.toBuffer()],
      program.programId,
    );
  });

  describe('Initialize Todo List', () => {
    it('Should initialize a new todo list', async () => {
      const tx = await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log('Initialize transaction signature:', tx);

      // Fetch the todo list account
      const todoListAccount = await program.account.todoList.fetch(todoListPda);

      expect(todoListAccount.owner.toString()).to.equal(owner.publicKey.toString());
      expect(todoListAccount.todos).to.have.length(0);
      expect(todoListAccount.nextId.toNumber()).to.equal(1);
    });

    it('Should fail to initialize todo list twice', async () => {
      try {
        await program.methods
          .initializeTodoList()
          .accounts({
            todoList: todoListPda,
            owner: owner.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('already in use');
      }
    });
  });

  describe('Create Todo', () => {
    it('Should create a new todo with high priority', async () => {
      const title = 'Test Todo';
      const description = 'This is a test todo item';
      const priority = { high: {} };

      const tx = await program.methods
        .createTodo(title, description, priority)
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      console.log('Create todo transaction signature:', tx);

      // Fetch the updated todo list
      const todoListAccount = await program.account.todoList.fetch(todoListPda);

      expect(todoListAccount.todos).to.have.length(1);
      expect(todoListAccount.nextId.toNumber()).to.equal(2);

      const todo = todoListAccount.todos[0];
      expect(todo.id.toNumber()).to.equal(1);
      expect(todo.title).to.equal(title);
      expect(todo.description).to.equal(description);
      expect(todo.completed).to.be.false;
      expect(todo.priority).to.deep.equal(priority);
      expect(todo.completedAt).to.be.null;
    });

    it('Should create multiple todos with different priorities', async () => {
      // Create medium priority todo
      await program.methods
        .createTodo('Medium Priority Todo', 'Medium priority task', { medium: {} })
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      // Create low priority todo
      await program.methods
        .createTodo('Low Priority Todo', 'Low priority task', { low: {} })
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      const todoListAccount = await program.account.todoList.fetch(todoListPda);
      expect(todoListAccount.todos).to.have.length(3);
      expect(todoListAccount.nextId.toNumber()).to.equal(4);
    });

    it('Should fail to create todo with title too long', async () => {
      const longTitle = 'a'.repeat(101); // 101 characters

      try {
        await program.methods
          .createTodo(longTitle, 'Description', { medium: {} })
          .accounts({
            todoList: todoListPda,
            owner: owner.publicKey,
          })
          .rpc();

        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('TitleTooLong');
      }
    });

    it('Should fail to create todo with description too long', async () => {
      const longDescription = 'a'.repeat(501); // 501 characters

      try {
        await program.methods
          .createTodo('Title', longDescription, { medium: {} })
          .accounts({
            todoList: todoListPda,
            owner: owner.publicKey,
          })
          .rpc();

        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('DescriptionTooLong');
      }
    });
  });

  describe('Update Todo', () => {
    it('Should update todo title and priority', async () => {
      const newTitle = 'Updated Todo Title';
      const newPriority = { low: {} };

      await program.methods
        .updateTodo(new anchor.BN(1), newTitle, null, newPriority)
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      const todoListAccount = await program.account.todoList.fetch(todoListPda);
      const updatedTodo = todoListAccount.todos.find(t => t.id.toNumber() === 1);

      expect(updatedTodo.title).to.equal(newTitle);
      expect(updatedTodo.priority).to.deep.equal(newPriority);
    });

    it('Should update todo description', async () => {
      const newDescription = 'Updated description';

      await program.methods
        .updateTodo(new anchor.BN(1), null, newDescription, null)
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      const todoListAccount = await program.account.todoList.fetch(todoListPda);
      const updatedTodo = todoListAccount.todos.find(t => t.id.toNumber() === 1);

      expect(updatedTodo.description).to.equal(newDescription);
    });

    it('Should fail to update non-existent todo', async () => {
      try {
        await program.methods
          .updateTodo(new anchor.BN(999), 'New Title', null, null)
          .accounts({
            todoList: todoListPda,
            owner: owner.publicKey,
          })
          .rpc();

        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('TodoNotFound');
      }
    });
  });

  describe('Toggle Todo Completion', () => {
    it('Should mark todo as completed', async () => {
      await program.methods
        .toggleTodoCompletion(new anchor.BN(1))
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      const todoListAccount = await program.account.todoList.fetch(todoListPda);
      const completedTodo = todoListAccount.todos.find(t => t.id.toNumber() === 1);

      expect(completedTodo.completed).to.be.true;
      expect(completedTodo.completedAt).to.not.be.null;
    });

    it('Should mark completed todo as incomplete', async () => {
      await program.methods
        .toggleTodoCompletion(new anchor.BN(1))
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      const todoListAccount = await program.account.todoList.fetch(todoListPda);
      const incompleteTodo = todoListAccount.todos.find(t => t.id.toNumber() === 1);

      expect(incompleteTodo.completed).to.be.false;
      expect(incompleteTodo.completedAt).to.be.null;
    });

    it('Should fail to toggle non-existent todo', async () => {
      try {
        await program.methods
          .toggleTodoCompletion(new anchor.BN(999))
          .accounts({
            todoList: todoListPda,
            owner: owner.publicKey,
          })
          .rpc();

        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('TodoNotFound');
      }
    });
  });

  describe('Delete Todo', () => {
    it('Should delete a todo', async () => {
      // First, get the current number of todos
      let todoListAccount = await program.account.todoList.fetch(todoListPda);
      const initialCount = todoListAccount.todos.length;

      await program.methods
        .deleteTodo(new anchor.BN(2))
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      todoListAccount = await program.account.todoList.fetch(todoListPda);
      expect(todoListAccount.todos).to.have.length(initialCount - 1);

      // Verify the specific todo was deleted
      const deletedTodo = todoListAccount.todos.find(t => t.id.toNumber() === 2);
      expect(deletedTodo).to.be.undefined;
    });

    it('Should fail to delete non-existent todo', async () => {
      try {
        await program.methods
          .deleteTodo(new anchor.BN(999))
          .accounts({
            todoList: todoListPda,
            owner: owner.publicKey,
          })
          .rpc();

        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('TodoNotFound');
      }
    });
  });

  describe('Get Todo Stats', () => {
    it('Should return correct todo statistics', async () => {
      // First, create a few more todos and complete some
      await program.methods
        .createTodo('Completed Todo', 'This will be completed', { high: {} })
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      // Complete the newly created todo
      const todoListAccount = await program.account.todoList.fetch(todoListPda);
      const lastTodoId = todoListAccount.nextId.toNumber() - 1;

      await program.methods
        .toggleTodoCompletion(new anchor.BN(lastTodoId))
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .rpc();

      // Get stats
      const stats = await program.methods
        .getTodoStats()
        .accounts({
          todoList: todoListPda,
          owner: owner.publicKey,
        })
        .view();

      expect(stats.total).to.be.greaterThan(0);
      expect(stats.completed).to.be.greaterThan(0);
      expect(stats.pending).to.equal(stats.total - stats.completed);
      expect(stats.highPriority).to.be.greaterThanOrEqual(0);
    });
  });

  describe('Access Control', () => {
    it('Should fail when non-owner tries to create todo', async () => {
      // Create a new keypair to simulate different user
      const otherUser = anchor.web3.Keypair.generate();

      try {
        await program.methods
          .createTodo('Unauthorized Todo', 'This should fail', { medium: {} })
          .accounts({
            todoList: todoListPda,
            owner: otherUser.publicKey,
          })
          .signers([otherUser])
          .rpc();

        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('has_one');
      }
    });
  });
});
