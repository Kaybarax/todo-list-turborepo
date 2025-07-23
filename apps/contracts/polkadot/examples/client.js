// Example client for interacting with the Todo pallet
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { cryptoWaitReady } = require('@polkadot/util-crypto');

async function main() {
  // Wait for the crypto libraries to be ready
  await cryptoWaitReady();

  // Connect to a local Substrate node
  console.log('Connecting to Substrate node...');
  const wsProvider = new WsProvider('ws://localhost:9944');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Create a test account
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  console.log(`Using account: ${alice.address}`);

  // Check account balance
  const { data: { free: balance } } = await api.query.system.account(alice.address);
  console.log(`Free balance: ${balance.toHuman()}`);

  try {
    // Create a todo
    console.log('\nCreating a todo...');
    const title = 'Implement Polkadot pallet';
    const description = 'Create a todo pallet for Substrate';
    const priority = { High: null }; // Options: Low, Medium, High

    const createTx = api.tx.todo.createTodo(title, description, priority);
    const createHash = await createTx.signAndSend(alice);
    console.log(`Todo creation submitted with hash: ${createHash.toHex()}`);

    // Wait for the transaction to be included in a block
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Get todos
    console.log('\nFetching todos...');
    const todos = await api.query.todo.todos(alice.address);
    console.log('Todos:', JSON.stringify(todos.toHuman(), null, 2));

    // Get todo stats
    console.log('\nFetching todo statistics...');
    const stats = await api.query.todo.todoStats(alice.address);
    console.log('Statistics:', stats.toHuman());

    // Get the ID of the first todo
    const todoId = todos.toHuman()[0].id;

    // Update a todo
    console.log(`\nUpdating todo ${todoId}...`);
    const updateTitle = 'Implement Polkadot pallet (updated)';
    const updateTx = api.tx.todo.updateTodo(todoId, updateTitle, null, null);
    const updateHash = await updateTx.signAndSend(alice);
    console.log(`Todo update submitted with hash: ${updateHash.toHex()}`);

    // Wait for the transaction to be included in a block
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Toggle todo completion
    console.log(`\nToggling completion of todo ${todoId}...`);
    const toggleTx = api.tx.todo.toggleTodoCompletion(todoId);
    const toggleHash = await toggleTx.signAndSend(alice);
    console.log(`Todo completion toggle submitted with hash: ${toggleHash.toHex()}`);

    // Wait for the transaction to be included in a block
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Get updated todos
    console.log('\nFetching updated todos...');
    const updatedTodos = await api.query.todo.todos(alice.address);
    console.log('Updated todos:', JSON.stringify(updatedTodos.toHuman(), null, 2));

    // Get updated todo stats
    console.log('\nFetching updated todo statistics...');
    const updatedStats = await api.query.todo.todoStats(alice.address);
    console.log('Updated statistics:', updatedStats.toHuman());

    // Delete a todo (uncomment to test)
    /*
    console.log(`\nDeleting todo ${todoId}...`);
    const deleteTx = api.tx.todo.deleteTodo(todoId);
    const deleteHash = await deleteTx.signAndSend(alice);
    console.log(`Todo deletion submitted with hash: ${deleteHash.toHex()}`);

    // Wait for the transaction to be included in a block
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Verify deletion
    console.log('\nVerifying deletion...');
    const finalTodos = await api.query.todo.todos(alice.address);
    console.log('Final todos:', JSON.stringify(finalTodos.toHuman(), null, 2));
    */

    console.log('\nClient example completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from the API
    await api.disconnect();
    console.log('Disconnected from Substrate node');
  }
}

main().catch(console.error);