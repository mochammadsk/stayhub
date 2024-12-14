const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../../app'); // Path ke app.js
const FacilityRoom = require('../../models/roomFacility.model'); // Path ke model FacilityRoom

describe('FacilityRoom Controller Tests', () => {
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
    await FacilityRoom.deleteMany();
  });

  describe('GET /facilities', () => {
    it('should return 404 if no facilities found', async () => {
      const response = await request(app).get('/facilities');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /facilities/:id', () => {
    it('should return 404 if facility not found', async () => {
      const response = await request(app).get('/facilities/invalid_id');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /facilities/:id', () => {

    it('should return 404 if facility not found', async () => {
      const response = await request(app).put('/facilities/invalid_id').send({ name: 'TV' });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /facilities/:id', () => {

    it('should return 404 if facility not found', async () => {
      const response = await request(app).delete('/facilities/invalid_id');
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /facilities', () => {

    it('should return 404 if no facilities found', async () => {
      const response = await request(app).delete('/facilities');
      expect(response.status).toBe(404);
    });
  });
});
