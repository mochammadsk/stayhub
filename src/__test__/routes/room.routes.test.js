const request = require('supertest');
const express = require('express');
const app = express();
const roomRoutes = require('../../routes/room.routes');

jest.mock('../../controllers/room.controller', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  getById: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  create: jest.fn((req, res) => res.status(201).json({ message: 'Room created successfully' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'Data berhasil dihapus' })),
}));

jest.mock('../../middelware/auth.middleware', () => ({
  auth: () => (req, res, next) => next(),
}));

app.use(express.json());
roomRoutes(app);

describe('Room Routes Test', () => {
  it('GET /room should return 200', async () => {
    const response = await request(app).get('/room');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found');
  });

  it('GET /room/:id should return 200', async () => {
    const response = await request(app).get('/room/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found');
  });

  it('POST /room/add should return 201', async () => {
    const response = await request(app).post('/room/add').send({ name: 'Room A', type: 'Type A' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Room created successfully');
  });

  it('DELETE /room/delete/:id should return 200', async () => {
    const response = await request(app).delete('/room/delete/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data berhasil dihapus');
  });
});
