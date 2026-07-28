import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/todos',
  options: {
    retryWrites: true,
    w: 'majority',
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE, 10) || 10,
    serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT_MS, 10) || 5000,
    socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS, 10) || 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
    autoIndex: process.env.NODE_ENV !== 'production',
  },
}));
