// Migration configuration for Todo App MongoDB
// This configuration works with the modernized NestJS API structure

require('dotenv').config({ path: '.env.development' });

const config = {
  mongodb: {
    // MongoDB connection URL - supports both local and containerized environments
    url: process.env.MONGODB_URI || "mongodb://admin:password@localhost:27017/todo-app?authSource=admin",

    // Database name for the Todo App
    databaseName: process.env.MONGODB_DATABASE || "todo-app",

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Additional options for production environments
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    }
  },

  // The migrations directory
  migrationsDir: "migrations",

  // Collection to store migration history
  changelogCollectionName: "migrations_changelog",

  // File extension for migration files
  migrationFileExtension: ".js",

  // Use file hash for migration tracking
  useFileHash: true,

  // Module system
  moduleSystem: 'commonjs',
};

// Validate configuration
if (!config.mongodb.url) {
  throw new Error('MONGODB_URI environment variable is required');
}

module.exports = config;
