const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB, startServer } = require('../../../server');

describe('Server and Database', () => {
  let mongoServer;
  let server;

  // Setup MongoMemoryServer sebelum semua pengujian
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.DB_URL = mongoServer.getUri();
    process.env.PORT = 3000;
  });

  // Close server dan koneksi MongoDB setelah pengujian
  afterAll(async () => {
    if (server) server.close();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test('Connect to the database successfully', async () => {
    await expect(connectDB()).resolves.not.toThrow();
    expect(mongoose.connection.readyState).toBe(1);
  });

  test('Start the server without errors', async () => {
    server = await startServer();
    expect(server.listening).toBe(true);
  });
});
