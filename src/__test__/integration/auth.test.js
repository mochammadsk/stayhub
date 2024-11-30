const request = require('supertest');
const app = require('../../../app');

// Register
describe('POST /register', () => {
  it('should register a user successfully', async () => {
    const response = await request(app).post('/register').send({
      fullName: 'Test User',
      email: 'user@example.com',
      phone: '0123456789',
      password: 'User_123',
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      'Successful registration! Please verify your email'
    );
    expect(response.body.user).toHaveProperty('_id');
  });

  it('should return error if email already exists', async () => {
    // Register user pertama
    await request(app).post('/register').send({
      fullName: 'Test User',
      email: 'user@example.com',
      phone: '0123456789',
      password: 'User_123',
    });

    // Coba register dengan email yang sama
    const response = await request(app).post('/register').send({
      fullName: 'Test User',
      email: 'user@example.com',
      phone: '0123456789',
      password: 'User_123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });
});
