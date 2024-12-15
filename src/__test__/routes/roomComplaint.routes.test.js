const request = require('supertest');
const express = require('express');
const app = express();
const complaintRoutes = require('../../routes/roomComplaint.routes');

jest.mock('../../controllers/roomComplaint.controller', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  getById: jest.fn((req, res) => res.status(200).json({ message: 'Complaint found' })),
  create: jest.fn((req, res) => res.status(201).json({ message: 'Data created' })),
  update: jest.fn((req, res) => res.status(200).json({ message: 'Data updated' })),
  updateStatus: jest.fn((req, res) => res.status(200).json({ message: 'Status updated successfully' })),
  deleteById: jest.fn((req, res) => res.status(200).json({ message: 'Data deleted' })),
}));

jest.mock('../../middelware/auth.middleware', () => ({
  auth: () => (req, res, next) => next(),
}));

app.use(express.json());
complaintRoutes(app);

describe('Room Complaint Routes Test', () => {
  it('GET /complaint should return 200', async () => {
    const response = await request(app).get('/complaint');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found');
  });

  it('GET /complaint/:id should return 200', async () => {
    const response = await request(app).get('/complaint/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Complaint found');
  });

  it('POST /complaint/:id should return 201', async () => {
    const response = await request(app).post('/complaint/1').send({
      title: 'AC Not Working',
      description: 'The air conditioner is broken.',
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Data created');
  });

  it('PUT /complaint/:id should return 200', async () => {
    const response = await request(app).put('/complaint/1').send({
      title: 'Updated Title',
      description: 'Updated Description',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data updated');
  });

  it('PATCH /complaint/:id/status should return 200', async () => {
    const response = await request(app).patch('/complaint/1/status').send({
      status: 'Selesai',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Status updated successfully');
  });

  it('DELETE /complaint/:id should return 200', async () => {
    const response = await request(app).delete('/complaint/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data deleted');
  });
});
