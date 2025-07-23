import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { TodoProgram } from "../target/types/todo_program";
import fs from "fs";
import path from "path";

/**
 * Example client integration for the Todo Program
 * 
 * This example demonstrates how to:
 * 1. Connect to the Solana network
 * 2. Load the Todo Program
 * 3. Initialize a todo list
 * 4. Create, update, toggle, and delete todos
 * 5. Get todo statistics
 */
async function main() {
  // Load program ID from deployments
  let programId: PublicKey;
  try {
    // Try to load from deployment file
    const deploymentPath = path.join(__dirname, "../deployments/devnet.json");
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
      programId = new PublicKey(deployment.programId);
      console.log("Loaded program ID from deployment:", programId.toString());
    } else {
      // Fallback to default program ID
      programId = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
      console.log("Using default program ID:", programId.toString());
    }
  } catch (error) {
    // Fallback to default program ID
    programId = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
    console.log("Using default program ID:", programId.toString());
  }

  // Connect to the network (devnet for this example)
  const connection = new Connection(
    anchor.web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  // Load or create a wallet
  let wallet: anchor.Wallet;
  const keypairPath = path.join(__dirname, "../keypair.json");
  
  if (fs.existsSync(keypairPath)) {
    // Load existing keypair
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
    const secretKey = Uint8Array.from(keypairData);
    const keypair = Keypair.fromSecretKey(secretKey);
    wallet = new anchor.Wallet(keypair);
    console.log("Loaded existing wallet:", wallet.publicKey.toString());
  } else {
    // Create new keypair
    const keypair = Keypair.generate();
    wallet = new anchor.Wallet(keypair);
    
    // Save keypair for future use
    fs.writeFileSync(
      keypairPath,
      JSON.stringify(Array.from(keypair.secretKey))
    );
    console.log("Created new wallet:", wallet.publicKey.toString());
    
    // Request airdrop for testing
    console.log("Requesting airdrop of 2 SOL...");
    const signature = await connection.requestAirdrop(
      wallet.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(signature);
    console.log("Airdrop received!");
  }

  // Create provider and load program
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: "confirmed" }
  );
  
  // Create program interface
  const idl = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../target/idl/todo_program.json"),
      "utf-8"
    )
  );
  
  const program = new anchor.Program(
    idl,
    programId,
    provider
  ) as unknown as Program<TodoProgram>;

  // Derive PDA for todo list
  const [todoListPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("todo_list"), wallet.publicKey.toBuffer()],
    program.programId
  );
  console.log("Todo List PDA:", todoListPda.toString());

  // Check if todo list exists
  let todoListExists = false;
  try {
    await program.account.todoList.fetch(todoListPda);
    todoListExists = true;
    console.log("Todo list already exists");
  } catch (error) {
    console.log("Todo list does not exist yet");
  }

  // Initialize todo list if it doesn't exist
  if (!todoListExists) {
    console.log("Initializing todo list...");
    const tx = await program.methods
      .initializeTodoList()
      .accounts({
        todoList: todoListPda,
        owner: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Todo list initialized. Transaction:", tx);
  }

  // Create a new todo
  console.log("\nCreating a new todo...");
  const createTx = await program.methods
    .createTodo(
      "Complete Solana integration",
      "Implement the Solana todo program for the monorepo modernization",
      { high: {} }
    )
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .rpc();
  console.log("Todo created. Transaction:", createTx);

  // Fetch the todo list
  let todoList = await program.account.todoList.fetch(todoListPda);
  console.log("\nCurrent todos:");
  todoList.todos.forEach((todo: any, index: number) => {
    console.log(`${index + 1}. ID: ${todo.id.toString()}`);
    console.log(`   Title: ${todo.title}`);
    console.log(`   Description: ${todo.description}`);
    console.log(`   Priority: ${Object.keys(todo.priority)[0]}`);
    console.log(`   Completed: ${todo.completed}`);
    console.log(`   Created at: ${new Date(todo.createdAt.toNumber() * 1000).toISOString()}`);
    console.log("");
  });

  // Get the ID of the last created todo
  const lastTodoId = todoList.todos[todoList.todos.length - 1].id;

  // Update the todo
  console.log("\nUpdating todo...");
  const updateTx = await program.methods
    .updateTodo(
      lastTodoId,
      "Completed Solana integration",
      "Successfully implemented the Solana todo program",
      null // Keep the same priority
    )
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .rpc();
  console.log("Todo updated. Transaction:", updateTx);

  // Toggle todo completion
  console.log("\nToggling todo completion...");
  const toggleTx = await program.methods
    .toggleTodoCompletion(lastTodoId)
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .rpc();
  console.log("Todo completion toggled. Transaction:", toggleTx);

  // Get todo statistics
  console.log("\nGetting todo statistics...");
  const stats = await program.methods
    .getTodoStats()
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .view();
  
  console.log("Todo Statistics:");
  console.log(`Total todos: ${stats.total}`);
  console.log(`Completed todos: ${stats.completed}`);
  console.log(`Pending todos: ${stats.pending}`);
  console.log(`High priority todos: ${stats.highPriority}`);

  // Fetch the updated todo list
  todoList = await program.account.todoList.fetch(todoListPda);
  console.log("\nUpdated todos:");
  todoList.todos.forEach((todo: any, index: number) => {
    console.log(`${index + 1}. ${todo.title} (${todo.completed ? 'Completed' : 'Pending'})`);
  });

  // Delete a todo (uncomment to test)
  /*
  console.log("\nDeleting todo...");
  const deleteTx = await program.methods
    .deleteTodo(lastTodoId)
    .accounts({
      todoList: todoListPda,
      owner: wallet.publicKey,
    })
    .rpc();
  console.log("Todo deleted. Transaction:", deleteTx);
  */

  console.log("\nClient integration example completed successfully!");
}

main().catch((error) => {
  console.error("Error in client integration example:", error);
});