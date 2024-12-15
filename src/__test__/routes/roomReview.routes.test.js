const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../../routes/roomReview.routes');

jest.mock('../../controllers/roomReview.controller', () => ({
  getById: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  create: jest.fn((req, res) => res.status(201).json({ message: 'Data created' })),
  update: jest.fn((req, res) => res.status(200).json({ message: 'Data updated' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'Data deleted' })),
}));

jest.mock('../../middelware/auth.middleware', () => ({
  auth: () => (req, res, next) => next(),
}));

app.use(express.json());
router(app);

describe('RoomReview Routes Test', () => {
  it('GET /review/:id should return 200', async () => {
    const response = await request(app).get('/review/1');
    expect(response.status).toBe(200);
  });

  it('POST /review/:id should return 201', async () => {
    const response = await request(app)
      .post('/review/1')
      .send({ rating: 5, comment: 'Good!' });
    expect(response.status).toBe(201);
  });

  it('PUT /review/:id should return 200', async () => {
    const response = await request(app)
      .put('/review/1')
      .send({ rating: 4, comment: 'Updated!' });
    expect(response.status).toBe(200);
  });

  it('DELETE /review/:id should return 200', async () => {
    const response = await request(app).delete('/review/1');
    expect(response.status).toBe(200);
  });
});
