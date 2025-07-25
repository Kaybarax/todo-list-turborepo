#!/usr/bin/env node

/**
 * Database setup script for Todo App
 * This script handles the complete database setup process including
 * migrations, seeding, and validation for development and production environments.
 */

const { MongoClient } = require('mongodb');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.development' });

// Import other modules
const { seedDatabase, clearDatabase } = require('./seed-todos');
const { migrateUp, showStatus } = require('./migrate');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/todo-app?authSource=admin';
const DATABASE_NAME = process.env.MONGODB_DATABASE || 'todo-app';

/**
 * Connect to MongoDB and test connection
 */
async function testConnection() {
  let client;
  
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log(`Connecting to: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Test database access
    const db = client.db(DATABASE_NAME);
    await db.admin().ping();
    
    console.log('✅ MongoDB connection successful');
    
    // Show database info
    const stats = await db.stats();
    console.log(`📊 Database: ${DATABASE_NAME}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    
    return { client, db };
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Make sure MongoDB is running');
      console.log('   2. Check if Docker containers are started: docker-compose -f docker-compose.dev.yml up -d');
      console.log('   3. Verify connection string in environment variables');
    }
    
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

/**
 * Check if required dependencies are installed
 */
function checkDependencies() {
  console.log('📦 Checking dependencies...');
  
  const requiredPackages = ['mongodb', 'dotenv'];
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  const missingPackages = requiredPackages.filter(pkg => 
    !packageJson.dependencies?.[pkg] && !packageJson.devDependencies?.[pkg]
  );
  
  if (missingPackages.length > 0) {
    console.error(`❌ Missing required packages: ${missingPackages.join(', ')}`);
    console.log('Install with: pnpm add ' + missingPackages.join(' '));
    return false;
  }
  
  console.log('✅ All dependencies are installed');
  return true;
}

/**
 * Validate environment configuration
 */
function validateEnvironment() {
  console.log('⚙️  Validating environment configuration...');
  
  const requiredEnvVars = ['MONGODB_URI', 'MONGODB_DATABASE'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    console.log('Using default values for development');
  }
  
  console.log('Environment configuration:');
  console.log(`   MONGODB_URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`   MONGODB_DATABASE: ${DATABASE_NAME}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  
  return true;
}

/**
 * Run database migrations
 */
async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  try {
    await migrateUp();
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

/**
 * Seed database with initial data
 */
async function runSeeding() {
  console.log('🌱 Seeding database with initial data...');
  
  try {
    await seedDatabase();
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    throw error;
  }
}

/**
 * Validate database schema and indexes
 */
async function validateDatabase() {
  let client;
  
  try {
    console.log('🔍 Validating database schema and indexes...');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    
    // Check required collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const requiredCollections = ['users', 'todos', 'blockchain_transactions', 'user_wallets', 'network_status'];
    const missingCollections = requiredCollections.filter(name => !collectionNames.includes(name));
    
    if (missingCollections.length > 0) {
      console.warn(`⚠️  Missing collections: ${missingCollections.join(', ')}`);
    } else {
      console.log('✅ All required collections exist');
    }
    
    // Check indexes for critical collections
    const criticalCollections = ['users', 'todos'];
    for (const collectionName of criticalCollections) {
      if (collectionNames.includes(collectionName)) {
        const indexes = await db.collection(collectionName).indexes();
        console.log(`   ${collectionName}: ${indexes.length} indexes`);
      }
    }
    
    // Check data counts
    const userCount = await db.collection('users').countDocuments();
    const todoCount = await db.collection('todos').countDocuments();
    
    console.log(`📊 Data summary:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Todos: ${todoCount}`);
    
    console.log('✅ Database validation completed');
    
  } catch (error) {
    console.error('❌ Database validation failed:', error.message);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

/**
 * Complete database setup
 */
async function setupDatabase(options = {}) {
  const { skipMigrations = false, skipSeeding = false, clearFirst = false } = options;
  
  console.log('🚀 Starting database setup...');
  console.log('=====================================');
  
  try {
    // Check dependencies
    if (!checkDependencies()) {
      process.exit(1);
    }
    
    // Validate environment
    validateEnvironment();
    
    // Test connection
    await testConnection();
    
    // Clear database if requested
    if (clearFirst) {
      console.log('🧹 Clearing existing data...');
      await clearDatabase();
    }
    
    // Run migrations
    if (!skipMigrations) {
      await runMigrations();
    }
    
    // Seed database
    if (!skipSeeding) {
      await runSeeding();
    }
    
    // Validate setup
    await validateDatabase();
    
    console.log('=====================================');
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('🌐 You can now start the application:');
    console.log('   pnpm dev');
    console.log('');
    console.log('📊 Access the database:');
    console.log('   MongoDB: mongo-cli');
    console.log('   Redis: redis-cli');
    console.log('');
    
  } catch (error) {
    console.log('=====================================');
    console.error('❌ Database setup failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check if MongoDB is running');
    console.log('   2. Verify environment variables');
    console.log('   3. Check network connectivity');
    console.log('   4. Review error logs above');
    console.log('');
    process.exit(1);
  }
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
🗄️  Todo App Database Setup Tool

Usage: node setup.js [command] [options]

Commands:
  setup                 Complete database setup (default)
  test                  Test database connection
  migrate               Run migrations only
  seed                  Seed database only
  validate              Validate database schema
  clear                 Clear all data
  reset                 Clear data and run full setup
  help                  Show this help message

Options:
  --skip-migrations     Skip running migrations
  --skip-seeding        Skip database seeding
  --clear-first         Clear existing data before setup

Examples:
  node setup.js                        # Full setup
  node setup.js setup --skip-seeding   # Setup without seeding
  node setup.js test                   # Test connection only
  node setup.js reset                  # Clear and setup
  node setup.js clear                  # Clear all data

Environment Variables:
  MONGODB_URI           MongoDB connection string
  MONGODB_DATABASE      Database name
  NODE_ENV              Environment (development/production)

For more information, see: db/README.md
`);
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2] || 'setup';
  const options = {
    skipMigrations: process.argv.includes('--skip-migrations'),
    skipSeeding: process.argv.includes('--skip-seeding'),
    clearFirst: process.argv.includes('--clear-first')
  };

  switch (command) {
    case 'setup':
      await setupDatabase(options);
      break;
    
    case 'test':
      await testConnection();
      break;
    
    case 'migrate':
      await runMigrations();
      break;
    
    case 'seed':
      await runSeeding();
      break;
    
    case 'validate':
      await validateDatabase();
      break;
    
    case 'clear':
      await clearDatabase();
      console.log('✅ Database cleared successfully');
      break;
    
    case 'reset':
      await setupDatabase({ ...options, clearFirst: true });
      break;
    
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    
    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run "node setup.js help" for usage information');
      process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = {
  setupDatabase,
  testConnection,
  runMigrations,
  runSeeding,
  validateDatabase
};