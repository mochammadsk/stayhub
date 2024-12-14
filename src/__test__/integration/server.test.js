const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../../app'); // Pastikan ini mengarah ke file app.js
const http = require('http');

describe('Server and Database', () => {
  let mongoServer;
  let server;

  // Mock fungsi connectDB
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DB_URL, {});
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error.message}`);
    }
  };

  // Mock fungsi startServer
  const startServer = async () => {
    await connectDB();
    const port = process.env.PORT || 3000;
    server = http.createServer(app);
    return new Promise((resolve, reject) => {
      server.listen(port, (err) => {
        if (err) return reject(err);
        resolve(server);
      });
    });
  };

  // Setup MongoMemoryServer sebelum semua pengujian
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.DB_URL = mongoServer.getUri(); // Gunakan URI dari MongoMemoryServer
    process.env.PORT = 3000; // Tentukan port untuk server
  });

  // Close server dan koneksi MongoDB setelah pengujian
  afterAll(async () => {
    if (server) server.close(); // Tutup server
    await mongoose.disconnect(); // Pastikan koneksi MongoDB ditutup
    await mongoServer.stop(); // Hentikan MongoMemoryServer
  });

  test('Connect to the database successfully', async () => {
    await expect(connectDB()).resolves.not.toThrow(); // Pastikan connectDB tidak melempar error
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  test('Start the server without errors', async () => {
    await expect(startServer()).resolves.not.toThrow(); // Pastikan server dapat dimulai tanpa error
    expect(server.listening).toBe(true); // Periksa apakah server mendengarkan
  });
});
