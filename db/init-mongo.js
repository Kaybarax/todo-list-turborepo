// MongoDB initialization script for Todo App
// This script runs when MongoDB container starts for the first time
// It creates the database, collections, indexes, and sample data

// Switch to the todo-app database
db = db.getSiblingDB('todo-app');

// Enable authentication if not already enabled
try {
  db.runCommand({ connectionStatus: 1 });
  print('MongoDB connection established successfully');
} catch (error) {
  print('Error connecting to MongoDB: ' + error);
}

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address'
        },
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'must be a string between 1 and 100 characters'
        },
        password: {
          bsonType: 'string',
          description: 'hashed password'
        },
        walletAddress: {
          bsonType: 'string',
          description: 'blockchain wallet address'
        },
        createdAt: {
          bsonType: 'date',
          description: 'must be a date'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'must be a date'
        }
      }
    }
  }
});

db.createCollection('todos', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'userId', 'completed', 'priority', 'createdAt'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'must be a string between 1 and 200 characters'
        },
        description: {
          bsonType: 'string',
          maxLength: 1000,
          description: 'must be a string with max 1000 characters'
        },
        completed: {
          bsonType: 'bool',
          description: 'must be a boolean'
        },
        priority: {
          bsonType: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'must be one of: low, medium, high'
        },
        dueDate: {
          bsonType: 'date',
          description: 'must be a date'
        },
        tags: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          },
          description: 'must be an array of strings'
        },
        userId: {
          bsonType: 'objectId',
          description: 'must be a valid ObjectId'
        },
        blockchainNetwork: {
          bsonType: 'string',
          enum: ['polygon', 'solana', 'polkadot'],
          description: 'must be one of: polygon, solana, polkadot'
        },
        transactionHash: {
          bsonType: 'string',
          description: 'blockchain transaction hash'
        },
        createdAt: {
          bsonType: 'date',
          description: 'must be a date'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'must be a date'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ walletAddress: 1 }, { unique: true, sparse: true });
db.users.createIndex({ createdAt: 1 });

db.todos.createIndex({ userId: 1 });
db.todos.createIndex({ userId: 1, completed: 1 });
db.todos.createIndex({ userId: 1, priority: 1 });
db.todos.createIndex({ userId: 1, dueDate: 1 });
db.todos.createIndex({ userId: 1, createdAt: -1 });
db.todos.createIndex({ tags: 1 });
db.todos.createIndex({ blockchainNetwork: 1 });
db.todos.createIndex({ transactionHash: 1 }, { sparse: true });

// Text search indexes
db.todos.createIndex({
  title: 'text',
  description: 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    description: 5,
    tags: 1
  },
  name: 'todo_text_search'
});

// Create a default admin user (for development only)
if (db.getName() === 'todo-app' && db.users.countDocuments() === 0) {
  db.users.insertOne({
    email: 'admin@todo-app.com',
    name: 'Admin User',
    password: '$2b$10$rQZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8Q', // hashed 'admin123'
    createdAt: new Date(),
    updatedAt: new Date()
  });

  print('Created default admin user: admin@todo-app.com / admin123');
}

// Create sample todos for development
if (db.getName() === 'todo-app' && db.todos.countDocuments() === 0) {
  const adminUser = db.users.findOne({ email: 'admin@todo-app.com' });
  
  if (adminUser) {
    const sampleTodos = [
      {
        title: 'Setup development environment',
        description: 'Install Node.js, Docker, and other development tools',
        completed: true,
        priority: 'high',
        tags: ['development', 'setup'],
        userId: adminUser._id,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication with login and registration',
        completed: true,
        priority: 'high',
        tags: ['authentication', 'security'],
        userId: adminUser._id,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Create todo CRUD operations',
        description: 'Implement create, read, update, delete operations for todos',
        completed: false,
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        tags: ['api', 'crud'],
        userId: adminUser._id,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Add blockchain integration',
        description: 'Integrate with Polygon, Solana, and Polkadot networks',
        completed: false,
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        tags: ['blockchain', 'integration'],
        userId: adminUser._id,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Write comprehensive tests',
        description: 'Add unit, integration, and e2e tests for all components',
        completed: false,
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        tags: ['testing', 'quality'],
        userId: adminUser._id,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Deploy to production',
        description: 'Set up CI/CD pipeline and deploy to production environment',
        completed: false,
        priority: 'low',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        tags: ['deployment', 'devops'],
        userId: adminUser._id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    db.todos.insertMany(sampleTodos);
    print('Created sample todos for development');
  }
}

print('MongoDB initialization completed successfully');
print('Database: ' + db.getName());
print('Collections: ' + db.getCollectionNames().join(', '));
print('Users count: ' + db.users.countDocuments());
print('Todos count: ' + db.todos.countDocuments());