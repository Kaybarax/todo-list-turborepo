import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

/**
 * Resolve a MongoDB URI for tests with associated lifecycle cleanup.
 *
 * When MONGODB_URI is already set (e.g. CI service container), use it directly.
 * Otherwise start an in-memory MongoMemoryServer.
 *
 * Compare the return pattern:
 *   const { uri, stop } = await resolveTestMongoUri();
 *   // ... connect with uri ...
 *   await stop(); // in afterAll
 */
export async function resolveTestMongoUri(): Promise<{
  uri: string;
  stop: () => Promise<void>;
}> {
  const existingUri = process.env.MONGODB_URI;
  if (existingUri) {
    return {
      uri: existingUri,
      stop: async () => {
        /* shared CI service — do not manage its lifecycle */
      },
    };
  }

  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  return {
    uri,
    stop: async () => {
      await mongoose.disconnect();
      await mongod.stop();
    },
  };
}
