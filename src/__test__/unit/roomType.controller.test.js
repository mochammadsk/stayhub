const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../../app'); // Path ke app.js
const TypeRoom = require('../../models/roomType.model'); // Path ke model TypeRoom

describe('TypeRoom Controller Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await TypeRoom.deleteMany();
  });

  describe('GET /types', () => {
    it('should return 404 if no type rooms found', async () => {
      const response = await request(app).get('/types');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /types/:id', () => {
    it('should return 404 if type room not found', async () => {
      const response = await request(app).get('/types/invalid_id');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /types/:id', () => {

    it('should return 404 if type room not found', async () => {
      const response = await request(app).put('/types/invalid_id').send({
        name: 'Standard Updated',
      });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /types/:id', () => {
    it('should return 404 if type room not found', async () => {
      const response = await request(app).delete('/types/invalid_id');
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /types', () => {

    it('should return 404 if no type rooms found', async () => {
      const response = await request(app).delete('/types');
      expect(response.status).toBe(404);
    });
  });
});
