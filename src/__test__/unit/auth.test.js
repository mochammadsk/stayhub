const { register } = require('../../controllers/auth.controller');
const User = require('../../models/user.model');
const UserVerification = require('../../models/userVerification.model');
const sendVerificationEmail = require('../../services/userVerification.service');
const argon2 = require('argon2');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../models/user.model');
jest.mock('../../models/userVerification.model');
jest.mock('../../services/userVerification.service');
jest.mock('argon2');
jest.mock('bcrypt');
jest.mock('uuid');

describe('Auth Controller - Register', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'Test User',
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('register a new user successfully', async () => {
    // Mock dependencies
    User.findOne.mockResolvedValue(null); // Simulate no existing user with the email
    argon2.hash.mockResolvedValue('hashed_password'); // Simulate password hashing
    User.create.mockResolvedValue({
      _id: 'user_id',
      email: 'test@example.com',
      fullName: 'Test User',
    }); // Simulate user creation in the database
    uuidv4.mockReturnValue('unique_string');
    bcrypt.hash.mockResolvedValue('hashed_unique_string'); // Simulate hashing unique string
    UserVerification.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true), // Simulate saving verification data
    }));
    sendVerificationEmail.mockResolvedValue(true); // Simulate email sending

    // Call the function
    await register(mockReq, mockRes);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(argon2.hash).toHaveBeenCalledWith('Password123');
    expect(User.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashed_password',
      fullName: 'Test User',
    });
    expect(UserVerification).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Test User',
      expect.any(String)
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Successful registration! Please verify your email',
      user: {
        _id: 'user_id',
        email: 'test@example.com',
        fullName: 'Test User',
      },
    });
  });

  it('return 400 if email already exists', async () => {
    // Mock dependencies
    User.findOne.mockResolvedValue({ email: 'test@example.com' }); // Simulate user already exists

    // Call the function
    await register(mockReq, mockRes);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email already exists',
    });
  });

  it('handle internal server errors', async () => {
    // Mock dependencies
    User.findOne.mockRejectedValue(new Error('Database error')); // Simulate database error

    // Call the function
    await register(mockReq, mockRes);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error: expect.any(Error),
    });
  });
});
