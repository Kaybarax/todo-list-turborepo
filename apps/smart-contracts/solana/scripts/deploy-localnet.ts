import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoProgram } from "../target/types/todo_program";
import fs from "fs";

async function deployToLocalnet() {
  console.log("🚀 Deploying Todo Program to Localnet...");

  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoProgram as Program<TodoProgram>;
  
  console.log("Program ID:", program.programId.toString());
  console.log("Wallet:", provider.wallet.publicKey.toString());

  try {
    // Check if the program is already deployed
    const programInfo = await provider.connection.getAccountInfo(program.programId);
    
    if (programInfo) {
      console.log("✅ Program already deployed to localnet");
      console.log("Program ID:", program.programId.toString());
    } else {
      console.log("❌ Program not found on localnet");
      console.log("Please run 'anchor deploy' first");
      process.exit(1);
    }

    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");
    
    const testWallet = provider.wallet as anchor.Wallet;
    const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo_list"), testWallet.publicKey.toBuffer()],
      program.programId
    );

    // Check if todo list exists, if not create it
    try {
      await program.account.todoList.fetch(todoListPda);
      console.log("✅ Todo list already exists");
    } catch (error) {
      console.log("📝 Creating new todo list...");
      
      const tx = await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListPda,
          owner: testWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Todo list created. Transaction:", tx);
    }

    // Create a test todo
    console.log("📝 Creating test todo...");
    
    const testTx = await program.methods
      .createTodo("Test Todo", "This is a test todo from deployment script", { medium: {} })
      .accounts({
        todoList: todoListPda,
        owner: testWallet.publicKey,
      })
      .rpc();

    console.log("✅ Test todo created. Transaction:", testTx);

    // Fetch and display the todo list
    const todoListAccount = await program.account.todoList.fetch(todoListPda);
    console.log("\n📊 Current Todo List:");
    console.log("Owner:", todoListAccount.owner.toString());
    console.log("Total Todos:", todoListAccount.todos.length);
    console.log("Next ID:", todoListAccount.nextId.toString());

    if (todoListAccount.todos.length > 0) {
      console.log("\nTodos:");
      todoListAccount.todos.forEach((todo, index) => {
        console.log(`  ${index + 1}. ${todo.title} (${todo.completed ? 'Completed' : 'Pending'})`);
      });
    }

    // Save deployment info
    const deploymentInfo = {
      network: "localnet",
      programId: program.programId.toString(),
      deployedAt: new Date().toISOString(),
      wallet: provider.wallet.publicKey.toString(),
      rpcUrl: provider.connection.rpcEndpoint,
    };

    fs.writeFileSync(
      "./deployments/localnet.json",
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n🎉 Deployment to localnet completed successfully!");
    console.log("📄 Deployment info saved to ./deployments/localnet.json");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Create deployments directory if it doesn't exist
if (!fs.existsSync("./deployments")) {
  fs.mkdirSync("./deployments");
}

deployToLocalnet().catch(console.error);