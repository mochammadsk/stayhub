const request = require('supertest');
const express = require('express');
const app = express();
const facilityRoutes = require('../../routes/roomFacility.routes');

jest.mock('../../controllers/roomFacility.controller', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ messages: 'Data found' })),
  getById: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  create: jest.fn((req, res) => res.status(201).json({ message: 'Data created' })),
  update: jest.fn((req, res) => res.status(200).json({ message: 'Data updated' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'Data deleted' })),
  deleteAll: jest.fn((req, res) => res.status(200).json({ message: 'Data deleted' })),
}));

jest.mock('../../middelware/auth.middleware', () => ({
  auth: () => (req, res, next) => next(),
}));

app.use(express.json());
facilityRoutes(app);

describe('Facility Routes Test', () => {
  it('GET /facility should return 200', async () => {
    const response = await request(app).get('/facility');
    expect(response.status).toBe(200);
    expect(response.body.messages).toBe('Data found');
  });

  it('GET /facility/:id should return 200', async () => {
    const response = await request(app).get('/facility/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found');
  });

  it('POST /facility/add should return 201', async () => {
    const response = await request(app).post('/facility/add').send({ name: 'Facility A' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Data created');
  });

  it('PUT /facility/update/:id should return 200', async () => {
    const response = await request(app).put('/facility/update/1').send({ name: 'Facility B' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data updated');
  });

  it('DELETE /facility/delete/:id should return 200', async () => {
    const response = await request(app).delete('/facility/delete/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data deleted');
  });

  it('DELETE /facility/delete should return 200', async () => {
    const response = await request(app).delete('/facility/delete');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data deleted');
  });
});
