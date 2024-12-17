const request = require('supertest');
const express = require('express');
const app = express();
const typeRoutes = require('../../routes/roomType.routes');

jest.mock('../../controllers/roomType.controller', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ messages: 'Data found' })),
  getById: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  create: jest.fn((req, res) => res.status(201).json({ messages: 'Data created' })),
  update: jest.fn((req, res) => res.status(200).json({ message: 'Data updated' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'Data deleted' })),
  deleteAll: jest.fn((req, res) => res.status(200).json({ message: 'All data deleted' })),
}));

// Mock the auth middleware
jest.mock('../../middelware/auth.middleware', () => ({
  auth: jest.fn((role) => (req, res, next) => {
    req.user = { role }; // Simulating the user role based on the route
    next(); // Call next to pass control to the next middleware
  }),
}));

app.use(express.json());
typeRoutes(app);

describe('TypeRoom Routes Test', () => {
  it('GET /type should return 200', async () => {
    const response = await request(app).get('/type');
    expect(response.status).toBe(200);
    expect(response.body.messages).toBe('Data found');
  });

  it('GET /type/:id should return 200', async () => {
    const response = await request(app).get('/type/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found');
  });

  it('POST /type/add should return 201', async () => {
    const response = await request(app).post('/type/add').send({
      name: 'Deluxe',
      facility: ['WiFi', 'AC'],
      description: 'Spacious room with amenities',
      cost: 100,
    });
    expect(response.status).toBe(201);
    expect(response.body.messages).toBe('Data created');
  });

  it('PUT /type/update/:id should return 200', async () => {
    const response = await request(app).put('/type/update/1').send({
      name: 'Deluxe Updated',
      facility: ['WiFi'],
      description: 'Updated description',
      cost: 120,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data updated');
  });

  it('DELETE /type/delete/:id should return 200', async () => {
    const response = await request(app).delete('/type/delete/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data deleted');
  });

  // Add a test for DELETE /type/delete route to ensure it is covered
  it('DELETE /type/delete should return 200 and call auth middleware', async () => {
    const response = await request(app).delete('/type/delete');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('All data deleted');

    // Verify auth middleware was called with the correct role
    expect(require('../../middelware/auth.middleware').auth).toHaveBeenCalledWith('admin');
  });
});
