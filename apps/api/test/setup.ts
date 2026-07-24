import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

beforeAll(async () => {
  // When MONGODB_URI is already set (e.g. CI service container), use it directly
  // to avoid concurrent mongod binary download/exec across parallel test suites.
  const existingUri = process.env.MONGODB_URI;
  if (existingUri) {
    return;
  }
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
});
