const request = require('supertest');
const express = require('express');
const app = express();
const userRoutes = require('../../routes/user.routes');

jest.mock('../../controllers/user.controller', () => ({
  getProfile: jest.fn((req, res) => res.status(200).json({ message: 'Data found' })),
  updateProfile: jest.fn((req, res) => res.status(200).json({ message: 'Profile updated successfully' })),
  deletePhotoProfile: jest.fn((req, res) => res.status(200).json({ message: 'Profile updated successfully' })),
}));

jest.mock('../../middelware/auth.middleware', () => ({
  auth: () => (req, res, next) => next(),
}));

app.use(express.json());
userRoutes(app);

describe('User Routes Test', () => {
  it('GET /user/profile should return 200', async () => {
    const response = await request(app).get('/user/profile');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data found');
  });

  it('PUT /user/profile/update should return 200', async () => {
    const response = await request(app)
      .put('/user/profile/update')
      .send({ fullName: 'Updated Name', phone: 9876543210 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profile updated successfully');
  });

  it('DELETE /user/profile/update should return 200', async () => {
    const response = await request(app).delete('/user/profile/update');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profile updated successfully');
  });
});
