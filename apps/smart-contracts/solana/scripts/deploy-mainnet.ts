import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoProgram } from "../target/types/todo_program";
import fs from "fs";
import readline from "readline";

async function confirmMainnetDeployment(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "⚠️  You are about to deploy to MAINNET. This will cost real SOL. Are you sure? (yes/no): ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "yes");
      }
    );
  });
}

async function deployToMainnet() {
  console.log("🚀 Preparing to deploy Todo Program to Mainnet...");

  // Confirm deployment
  const confirmed = await confirmMainnetDeployment();
  if (!confirmed) {
    console.log("❌ Deployment cancelled by user");
    process.exit(0);
  }

  // Configure the client to use mainnet
  const connection = new anchor.web3.Connection(
    anchor.web3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  // Load wallet from file system
  const wallet = anchor.Wallet.local();
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoProgram as Program<TodoProgram>;
  
  console.log("Program ID:", program.programId.toString());
  console.log("Wallet:", provider.wallet.publicKey.toString());

  try {
    // Check wallet balance
    const balance = await connection.getBalance(provider.wallet.publicKey);
    console.log("Wallet balance:", balance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

    if (balance < 1 * anchor.web3.LAMPORTS_PER_SOL) {
      console.log("❌ Insufficient balance for mainnet deployment. Need at least 1 SOL.");
      process.exit(1);
    }

    // Check if the program is already deployed
    const programInfo = await provider.connection.getAccountInfo(program.programId);
    
    if (programInfo) {
      console.log("✅ Program already deployed to mainnet");
      console.log("Program ID:", program.programId.toString());
    } else {
      console.log("❌ Program not found on mainnet");
      console.log("Please run 'anchor deploy --provider.cluster mainnet' first");
      process.exit(1);
    }

    // Test basic functionality (minimal testing on mainnet)
    console.log("\n🧪 Performing minimal functionality test on mainnet...");
    
    const testWallet = provider.wallet as anchor.Wallet;
    const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo_list"), testWallet.publicKey.toBuffer()],
      program.programId
    );

    // Check if todo list exists
    try {
      const todoListAccount = await program.account.todoList.fetch(todoListPda);
      console.log("✅ Todo list already exists on mainnet");
      console.log("Total Todos:", todoListAccount.todos.length);
    } catch (error) {
      console.log("📝 Todo list not found. You can create one using the client application.");
    }

    // Save deployment info
    const deploymentInfo = {
      network: "mainnet-beta",
      programId: program.programId.toString(),
      deployedAt: new Date().toISOString(),
      wallet: provider.wallet.publicKey.toString(),
      rpcUrl: provider.connection.rpcEndpoint,
      explorerUrl: `https://explorer.solana.com/address/${program.programId}`,
    };

    fs.writeFileSync(
      "./deployments/mainnet.json",
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n🎉 Mainnet deployment verification completed successfully!");
    console.log("📄 Deployment info saved to ./deployments/mainnet.json");
    console.log("🔗 View program on Solana Explorer:", deploymentInfo.explorerUrl);
    
    console.log("\n⚠️  IMPORTANT MAINNET NOTES:");
    console.log("- This program is now live on Solana mainnet");
    console.log("- All transactions will cost real SOL");
    console.log("- Make sure to test thoroughly on devnet first");
    console.log("- Consider implementing additional security measures");

  } catch (error) {
    console.error("❌ Mainnet deployment verification failed:", error);
    process.exit(1);
  }
}

// Create deployments directory if it doesn't exist
if (!fs.existsSync("./deployments")) {
  fs.mkdirSync("./deployments");
}

deployToMainnet().catch(console.error);