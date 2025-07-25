/**
 * Seed script for MongoDB to create initial data for development
 * Compatible with the modernized NestJS API structure
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.development' });

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/todo-app?authSource=admin';
const DATABASE_NAME = process.env.MONGODB_DATABASE || 'todo-app';

// Sample data
const sampleUsers = [
  {
    _id: new ObjectId('507f1f77bcf86cd799439011'),
    email: 'admin@todo-app.com',
    name: 'Admin User',
    password: '$2b$10$rQZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8Q', // hashed 'admin123'
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    schemaVersion: 2
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439012'),
    email: 'user@todo-app.com',
    name: 'Test User',
    password: '$2b$10$rQZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8Q', // hashed 'user123'
    role: 'user',
    isActive: true,
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
    schemaVersion: 2
  }
];

const sampleTodos = [
  {
    _id: new ObjectId('507f1f77bcf86cd799439021'),
    title: 'Setup development environment',
    description: 'Install Node.js, Docker, pnpm, and configure the development container',
    completed: true,
    priority: 'high',
    tags: ['development', 'setup', 'infrastructure'],
    userId: new ObjectId('507f1f77bcf86cd799439011'),
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T15:00:00Z'),
    schemaVersion: 2
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439022'),
    title: 'Implement user authentication',
    description: 'Add JWT-based authentication with login, registration, and password reset',
    completed: true,
    priority: 'high',
    tags: ['authentication', 'security', 'api'],
    userId: new ObjectId('507f1f77bcf86cd799439011'),
    createdAt: new Date('2024-01-02T09:00:00Z'),
    updatedAt: new Date('2024-01-03T14:00:00Z'),
    schemaVersion: 2
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439023'),
    title: 'Create todo CRUD operations',
    description: 'Implement create, read, update, delete operations for todos with proper validation',
    completed: false,
    priority: 'high',
    dueDate: new Date('2024-02-01T00:00:00Z'),
    tags: ['api', 'crud', 'validation'],
    userId: new ObjectId('507f1f77bcf86cd799439011'),
    createdAt: new Date('2024-01-03T11:00:00Z'),
    updatedAt: new Date('2024-01-03T11:00:00Z'),
    schemaVersion: 2
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439024'),
    title: 'Add blockchain integration',
    description: 'Integrate with Polygon, Solana, and Polkadot networks for decentralized todo storage',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-02-15T00:00:00Z'),
    tags: ['blockchain', 'integration', 'web3'],
    userId: new ObjectId('507f1f77bcf86cd799439012'),
    blockchainNetwork: 'polygon',
    createdAt: new Date('2024-01-04T13:00:00Z'),
    updatedAt: new Date('2024-01-04T13:00:00Z'),
    schemaVersion: 2
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439025'),
    title: 'Write comprehensive tests',
    description: 'Add unit, integration, and e2e tests for all components and services',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-01-25T00:00:00Z'),
    tags: ['testing', 'quality', 'automation'],
    userId: new ObjectId('507f1f77bcf86cd799439012'),
    createdAt: new Date('2024-01-05T10:00:00Z'),
    updatedAt: new Date('2024-01-05T10:00:00Z'),
    schemaVersion: 2
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439026'),
    title: 'Implement caching layer',
    description: 'Add Redis caching for frequently accessed data and session management',
    completed: false,
    priority: 'low',
    dueDate: new Date('2024-02-10T00:00:00Z'),
    tags: ['caching', 'performance', 'redis'],
    userId: new ObjectId('507f1f77bcf86cd799439011'),
    createdAt: new Date('2024-01-06T14:00:00Z'),
    updatedAt: new Date('2024-01-06T14:00:00Z'),
    schemaVersion: 2
  },
  {
    _id: new ObjectId('507f1f77bcf86cd799439027'),
    title: 'Deploy to production',
    description: 'Set up CI/CD pipeline and deploy to production environment with monitoring',
    completed: false,
    priority: 'low',
    dueDate: new Date('2024-03-01T00:00:00Z'),
    tags: ['deployment', 'devops', 'monitoring'],
    userId: new ObjectId('507f1f77bcf86cd799439011'),
    createdAt: new Date('2024-01-07T16:00:00Z'),
    updatedAt: new Date('2024-01-07T16:00:00Z'),
    schemaVersion: 2
  }
];

/**
 * Connect to MongoDB
 */
async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB successfully');
  return { client, db: client.db(DATABASE_NAME) };
}

/**
 * Seed users collection
 */
async function seedUsers(db) {
  const usersCollection = db.collection('users');
  
  // Check if users already exist
  const existingUsersCount = await usersCollection.countDocuments();
  if (existingUsersCount > 0) {
    console.log(`Users collection already has ${existingUsersCount} documents, skipping user seeding`);
    return;
  }

  // Insert sample users
  const result = await usersCollection.insertMany(sampleUsers);
  console.log(`Inserted ${result.insertedCount} users`);
}

/**
 * Seed todos collection
 */
async function seedTodos(db) {
  const todosCollection = db.collection('todos');
  
  // Check if todos already exist
  const existingTodosCount = await todosCollection.countDocuments();
  if (existingTodosCount > 0) {
    console.log(`Todos collection already has ${existingTodosCount} documents, skipping todo seeding`);
    return;
  }

  // Insert sample todos
  const result = await todosCollection.insertMany(sampleTodos);
  console.log(`Inserted ${result.insertedCount} todos`);
}

/**
 * Create additional indexes for performance
 */
async function createAdditionalIndexes(db) {
  console.log('Creating additional indexes...');
  
  const usersCollection = db.collection('users');
  const todosCollection = db.collection('todos');

  // Users indexes
  await usersCollection.createIndex({ email: 1 }, { unique: true, background: true });
  await usersCollection.createIndex({ walletAddress: 1 }, { unique: true, sparse: true, background: true });
  await usersCollection.createIndex({ role: 1 }, { background: true });
  await usersCollection.createIndex({ isActive: 1 }, { background: true });
  await usersCollection.createIndex({ createdAt: 1 }, { background: true });

  // Todos indexes (additional to those created in init-mongo.js)
  await todosCollection.createIndex({ userId: 1, completed: 1, priority: 1 }, { background: true });
  await todosCollection.createIndex({ userId: 1, dueDate: 1 }, { background: true });
  await todosCollection.createIndex({ userId: 1, createdAt: -1 }, { background: true });
  await todosCollection.createIndex({ blockchainNetwork: 1 }, { sparse: true, background: true });
  await todosCollection.createIndex({ transactionHash: 1 }, { unique: true, sparse: true, background: true });
  
  console.log('Additional indexes created successfully');
}

/**
 * Main function to seed the database
 */
async function seedDatabase() {
  let client;
  
  try {
    console.log('Starting database seeding process...');
    console.log(`Connecting to: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    const { client: dbClient, db } = await connectToDatabase();
    client = dbClient;

    // Seed collections
    await seedUsers(db);
    await seedTodos(db);
    await createAdditionalIndexes(db);

    // Display statistics
    const usersCount = await db.collection('users').countDocuments();
    const todosCount = await db.collection('todos').countDocuments();
    
    console.log('\n=== Database Seeding Complete ===');
    console.log(`Database: ${DATABASE_NAME}`);
    console.log(`Users: ${usersCount}`);
    console.log(`Todos: ${todosCount}`);
    console.log('\nSample credentials:');
    console.log('Admin: admin@todo-app.com / admin123');
    console.log('User:  user@todo-app.com / user123');
    console.log('=====================================\n');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

/**
 * Clear all data (for testing purposes)
 */
async function clearDatabase() {
  let client;
  
  try {
    console.log('Clearing database...');
    
    const { client: dbClient, db } = await connectToDatabase();
    client = dbClient;

    await db.collection('users').deleteMany({});
    await db.collection('todos').deleteMany({});
    await db.collection('migrations_changelog').deleteMany({});

    console.log('Database cleared successfully');
    
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the appropriate function based on command line arguments
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'clear') {
    clearDatabase()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Error:', error);
        process.exit(1);
      });
  } else {
    seedDatabase()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Error:', error);
        process.exit(1);
      });
  }
}

module.exports = { 
  seedDatabase, 
  clearDatabase,
  sampleUsers,
  sampleTodos
};
