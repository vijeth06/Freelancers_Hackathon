const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  process.env.JWT_SECRET = 'test-jwt-secret-that-is-long-enough';
  process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-that-is-long-enough';
  process.env.NODE_ENV = 'test';

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
