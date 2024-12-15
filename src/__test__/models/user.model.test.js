const mongoose = require('mongoose');
const User = require('../../models/user.model');

describe('User Model Test', () => {
  // Sebelum semua pengujian dimulai
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/stayhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Setelah semua pengujian selesai
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Membersihkan koleksi sebelum setiap pengujian
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user with all required fields', async () => {
    const userData = {
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      phone: 1234567890,
      address: '123 Main Street',
      password: 'securepassword',
      profileImages: [{ url: 'https://example.com/profile.jpg', filename: 'profile.jpg' }],
      ktpImages: [{ url: 'https://example.com/ktp.jpg', filename: 'ktp.jpg' }],
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.fullName).toBe(userData.fullName);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe('user'); // Nilai default
    expect(savedUser.verified).toBe(false); // Nilai default
  });

  it('should fail to create a user without required fields', async () => {
    const userData = {
      email: 'johndoe@example.com', // Tidak menyertakan fullName, phone, address, dan password
    };

    const user = new User(userData);

    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.fullName).toBeDefined();
    expect(err.errors.phone).toBeDefined();
    expect(err.errors.address).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('should default role to "user" if not provided', async () => {
    const userData = {
      fullName: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: 9876543210,
      address: '456 Main Street',
      password: 'anothersecurepassword',
      profileImages: [{ url: 'https://example.com/profile2.jpg', filename: 'profile2.jpg' }],
      ktpImages: [{ url: 'https://example.com/ktp2.jpg', filename: 'ktp2.jpg' }],
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.role).toBe('user'); // Default role
  });

  it('should handle the toJSON method correctly', async () => {
    const userData = {
      fullName: 'Alice Smith',
      email: 'alicesmith@example.com',
      phone: 1231231234,
      address: '789 Main Street',
      password: 'strongpassword',
      profileImages: [{ url: 'https://example.com/profile3.jpg', filename: 'profile3.jpg' }],
      ktpImages: [{ url: 'https://example.com/ktp3.jpg', filename: 'ktp3.jpg' }],
    };

    const user = new User(userData);
    const savedUser = await user.save();
    const userJson = savedUser.toJSON();

    expect(userJson.id).toBeDefined();
    expect(userJson._id).toBeUndefined();
    expect(userJson.__v).toBeUndefined();
  });
});
