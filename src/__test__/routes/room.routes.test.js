const request = require('supertest');
const express = require('express');
const app = express();
const roomRoutes = require('../../routes/room.routes');

jest.mock('../../controllers/room.controller', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  getById: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  create: jest.fn((req, res) => res.status(201).json({ message: 'Room created successfully' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'Data berhasil dihapus' })),
  update: jest.fn((req, res) => res.status(200).json({ message: 'Room updated successfully' })),
  deleteAll: jest.fn((req, res) => res.status(200).json({ message: 'All rooms deleted successfully' })),
  getByUser: jest.fn((req, res) => res.status(200).json({ message: 'Data found for user' })),
}));

// Mock the auth middleware
jest.mock('../../middelware/auth.middleware', () => ({
  auth: jest.fn((role) => (req, res, next) => {
    req.user = { role }; // Simulating the user role based on the route
    next(); // Call next to pass control to the next middleware
  }),
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

  // Testing PUT /room/update/:id route to ensure middleware is called
  it('PUT /room/update/:id should return 200 and call auth middleware', async () => {
    const response = await request(app).put('/room/update/1').send({ name: 'Updated Room', type: 'Updated Type' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Room updated successfully');

    // Verifying auth middleware was called with the correct role
    expect(require('../../middelware/auth.middleware').auth).toHaveBeenCalledWith('admin');
  });

  // Testing DELETE /room/delete route to ensure middleware is called
  it('DELETE /room/delete should return 200 and call auth middleware', async () => {
    const response = await request(app).delete('/room/delete');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('All rooms deleted successfully');

    // Verifying auth middleware was called with the correct role
    expect(require('../../middelware/auth.middleware').auth).toHaveBeenCalledWith('admin');
  });

  // Testing GET /room/user/:id route to ensure middleware is called
  it('GET /room/user/:id should return 200 and call auth middleware', async () => {
    const response = await request(app).get('/room/user/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found for user');

    // Verifying auth middleware was called with the correct role
    expect(require('../../middelware/auth.middleware').auth).toHaveBeenCalledWith('user');
  });
});
