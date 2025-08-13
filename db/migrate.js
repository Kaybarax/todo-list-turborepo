#!/usr/bin/env node

/**
 * Migration runner for Todo App MongoDB
 * This script provides a convenient way to run database migrations
 * using the migrate-mongo library with proper error handling and logging.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.development' });

// Configuration
const MIGRATE_MONGO_CONFIG = path.join(__dirname, 'migrate-mongo-config.js');
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

/**
 * Execute a command and return a promise
 */
function execCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

/**
 * Check if migrate-mongo is installed
 */
async function checkMigrateMongo() {
  try {
    await execCommand('npx migrate-mongo --version');
    return true;
  } catch (error) {
    console.error('migrate-mongo is not installed. Installing...');
    try {
      await execCommand('npm install -g migrate-mongo');
      console.log('migrate-mongo installed successfully');
      return true;
    } catch (installError) {
      console.error('Failed to install migrate-mongo:', installError.error.message);
      return false;
    }
  }
}

/**
 * List available migrations
 */
async function listMigrations() {
  console.log('📋 Available migrations:');

  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('No migrations directory found');
    return;
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.js'))
    .sort();

  if (files.length === 0) {
    console.log('No migration files found');
    return;
  }

  files.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
}

/**
 * Show migration status
 */
async function showStatus() {
  try {
    console.log('📊 Migration status:');
    const { stdout } = await execCommand(`npx migrate-mongo status -f ${MIGRATE_MONGO_CONFIG}`);
    console.log(stdout);
  } catch (error) {
    console.error('Error checking migration status:', error.stderr || error.error.message);
  }
}

/**
 * Run migrations up
 */
async function migrateUp() {
  try {
    console.log('⬆️  Running migrations up...');
    const { stdout } = await execCommand(`npx migrate-mongo up -f ${MIGRATE_MONGO_CONFIG}`);
    console.log(stdout);
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error.stderr || error.error.message);
    process.exit(1);
  }
}

/**
 * Run migrations down
 */
async function migrateDown(count = 1) {
  try {
    console.log(`⬇️  Running ${count} migration(s) down...`);
    const command =
      count === 'all'
        ? `npx migrate-mongo down -f ${MIGRATE_MONGO_CONFIG} --all`
        : `npx migrate-mongo down -f ${MIGRATE_MONGO_CONFIG}`;

    const { stdout } = await execCommand(command);
    console.log(stdout);
    console.log('✅ Rollback completed successfully');
  } catch (error) {
    console.error('❌ Error rolling back migrations:', error.stderr || error.error.message);
    process.exit(1);
  }
}

/**
 * Create a new migration file
 */
async function createMigration(name) {
  if (!name) {
    console.error('❌ Migration name is required');
    console.log('Usage: node migrate.js create <migration-name>');
    process.exit(1);
  }

  try {
    console.log(`📝 Creating migration: ${name}`);
    const { stdout } = await execCommand(`npx migrate-mongo create ${name} -f ${MIGRATE_MONGO_CONFIG}`);
    console.log(stdout);
    console.log('✅ Migration file created successfully');
  } catch (error) {
    console.error('❌ Error creating migration:', error.stderr || error.error.message);
    process.exit(1);
  }
}

/**
 * Reset database (run all migrations down, then up)
 */
async function resetDatabase() {
  console.log('🔄 Resetting database...');

  try {
    // First, run all migrations down
    await migrateDown('all');

    // Then, run all migrations up
    await migrateUp();

    console.log('✅ Database reset completed successfully');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
📚 Todo App Database Migration Tool

Usage: node migrate.js <command> [options]

Commands:
  up                    Run all pending migrations
  down [count]          Rollback migrations (default: 1, use 'all' for all)
  status                Show migration status
  list                  List available migration files
  create <name>         Create a new migration file
  reset                 Reset database (down all, then up all)
  help                  Show this help message

Examples:
  node migrate.js up                    # Run all pending migrations
  node migrate.js down                  # Rollback last migration
  node migrate.js down 3                # Rollback last 3 migrations
  node migrate.js down all              # Rollback all migrations
  node migrate.js create add-user-roles # Create new migration
  node migrate.js status                # Check migration status
  node migrate.js reset                 # Reset entire database

Environment:
  MONGODB_URI           MongoDB connection string
  MONGODB_DATABASE      Database name

Configuration file: ${MIGRATE_MONGO_CONFIG}
Migrations directory: ${MIGRATIONS_DIR}
`);
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  // Check if migrate-mongo is available
  const migrateMongAvailable = await checkMigrateMongo();
  if (!migrateMongAvailable) {
    process.exit(1);
  }

  // Validate configuration file exists
  if (!fs.existsSync(MIGRATE_MONGO_CONFIG)) {
    console.error(`❌ Configuration file not found: ${MIGRATE_MONGO_CONFIG}`);
    process.exit(1);
  }

  // Execute command
  switch (command) {
    case 'up':
      await migrateUp();
      break;

    case 'down':
      const count = arg || 1;
      await migrateDown(count);
      break;

    case 'status':
      await showStatus();
      break;

    case 'list':
      await listMigrations();
      break;

    case 'create':
      await createMigration(arg);
      break;

    case 'reset':
      await resetDatabase();
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      if (!command) {
        console.log('⚡ Todo App Database Migration Tool');
        console.log('Run "node migrate.js help" for usage information');
        await showStatus();
      } else {
        console.error(`❌ Unknown command: ${command}`);
        console.log('Run "node migrate.js help" for usage information');
        process.exit(1);
      }
      break;
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
  migrateUp,
  migrateDown,
  showStatus,
  createMigration,
  resetDatabase,
};
