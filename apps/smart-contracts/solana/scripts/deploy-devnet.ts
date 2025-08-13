import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { TodoProgram } from '../target/types/todo_program';
import fs from 'fs';

async function deployToDevnet() {
  console.log('🚀 Deploying Todo Program to Devnet...');

  // Configure the client to use devnet
  const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('devnet'), 'confirmed');

  // Load wallet from file system
  const wallet = anchor.Wallet.local();
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });

  anchor.setProvider(provider);

  const program = anchor.workspace.TodoProgram as Program<TodoProgram>;

  console.log('Program ID:', program.programId.toString());
  console.log('Wallet:', provider.wallet.publicKey.toString());

  try {
    // Check wallet balance
    const balance = await connection.getBalance(provider.wallet.publicKey);
    console.log('Wallet balance:', balance / anchor.web3.LAMPORTS_PER_SOL, 'SOL');

    if (balance < 0.1 * anchor.web3.LAMPORTS_PER_SOL) {
      console.log('⚠️  Low wallet balance. You may need to airdrop SOL for devnet deployment.');
      console.log('Run: solana airdrop 2 --url devnet');
    }

    // Check if the program is already deployed
    const programInfo = await provider.connection.getAccountInfo(program.programId);

    if (programInfo) {
      console.log('✅ Program already deployed to devnet');
      console.log('Program ID:', program.programId.toString());
    } else {
      console.log('❌ Program not found on devnet');
      console.log("Please run 'anchor deploy --provider.cluster devnet' first");
      process.exit(1);
    }

    // Test basic functionality
    console.log('\n🧪 Testing basic functionality on devnet...');

    const testWallet = provider.wallet as anchor.Wallet;
    const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('todo_list'), testWallet.publicKey.toBuffer()],
      program.programId,
    );

    // Check if todo list exists, if not create it
    try {
      await program.account.todoList.fetch(todoListPda);
      console.log('✅ Todo list already exists');
    } catch (error) {
      console.log('📝 Creating new todo list on devnet...');

      const tx = await program.methods
        .initializeTodoList()
        .accounts({
          todoList: todoListPda,
          owner: testWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log('✅ Todo list created. Transaction:', tx);
      console.log('🔗 View on Solana Explorer:', `https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    }

    // Create a test todo
    console.log('📝 Creating test todo on devnet...');

    const testTx = await program.methods
      .createTodo('Devnet Test Todo', 'This is a test todo deployed on Solana devnet', { high: {} })
      .accounts({
        todoList: todoListPda,
        owner: testWallet.publicKey,
      })
      .rpc();

    console.log('✅ Test todo created. Transaction:', testTx);
    console.log('🔗 View on Solana Explorer:', `https://explorer.solana.com/tx/${testTx}?cluster=devnet`);

    // Fetch and display the todo list
    const todoListAccount = await program.account.todoList.fetch(todoListPda);
    console.log('\n📊 Current Todo List on Devnet:');
    console.log('Owner:', todoListAccount.owner.toString());
    console.log('Total Todos:', todoListAccount.todos.length);
    console.log('Next ID:', todoListAccount.nextId.toString());

    if (todoListAccount.todos.length > 0) {
      console.log('\nTodos:');
      todoListAccount.todos.forEach((todo, index) => {
        console.log(`  ${index + 1}. ${todo.title} (${todo.completed ? 'Completed' : 'Pending'})`);
      });
    }

    // Save deployment info
    const deploymentInfo = {
      network: 'devnet',
      programId: program.programId.toString(),
      deployedAt: new Date().toISOString(),
      wallet: provider.wallet.publicKey.toString(),
      rpcUrl: provider.connection.rpcEndpoint,
      explorerUrl: `https://explorer.solana.com/address/${program.programId}?cluster=devnet`,
    };

    fs.writeFileSync('./deployments/devnet.json', JSON.stringify(deploymentInfo, null, 2));

    console.log('\n🎉 Deployment to devnet completed successfully!');
    console.log('📄 Deployment info saved to ./deployments/devnet.json');
    console.log('🔗 View program on Solana Explorer:', deploymentInfo.explorerUrl);
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Create deployments directory if it doesn't exist
if (!fs.existsSync('./deployments')) {
  fs.mkdirSync('./deployments');
}

deployToDevnet().catch(console.error);
