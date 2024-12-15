const request = require('supertest');
const express = require('express');
const app = express();
const adminRoutes = require('../../routes/admin.routes');

jest.mock('../../controllers/admin.controller', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  getById: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  updateRole: jest.fn((req, res) => res.status(200).json({ message: 'Data updated' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'User deleted successfully' })),
}));

jest.mock('../../middelware/auth.middleware', () => ({
  auth: () => (req, res, next) => next(),
}));

app.use(express.json());
adminRoutes(app);

describe('Admin Routes Tests', () => {
  it('GET /list/user should return 200', async () => {
    const response = await request(app).get('/list/user');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found');
  });

  it('GET /list/user/:id should return 200', async () => {
    const response = await request(app).get('/list/user/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found');
  });

  it('PUT /update/user/:id should return 200', async () => {
    const response = await request(app)
      .put('/update/user/1')
      .send({ role: 'admin' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data updated');
  });

  it('DELETE /delete/user/:id should return 200', async () => {
    const response = await request(app).delete('/delete/user/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  });

});
