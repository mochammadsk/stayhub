const {updateProfile, deletePhotoProfile } = require('../../controllers/user.controller');
const User = require('../../models/user.model');
const fs = require('fs').promises;

// Mock fungsi `fs`
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(() => Promise.resolve()),
    unlink: jest.fn(() => Promise.resolve()),
  },
}));

// Mock fungsi `User` model
jest.mock('../../models/user.model');

describe('User Controller Tests', () => {
  let mockUser;

  beforeEach(() => {
    // Mock data user untuk pengujian
    mockUser = {
      _id: '63a9f0ea7f6b123456789abc',
      fullName: 'Test User',
      email: 'testuser@example.com',
      phone: 1234567890,
      address: '123 Test Street',
      password: 'securepassword',
      profileImages: [{ url: '/uploads/profile1.jpg', filename: 'profile1.jpg' }],
      ktpImages: [{ url: '/uploads/ktp1.jpg', filename: 'ktp1.jpg' }],
      save: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('updateProfile', () => {
    it('should update user profile', async () => {
      User.findById.mockResolvedValue(mockUser); // Mock findById

      const req = {
        user: { id: mockUser._id },
        body: { fullName: 'Updated Name', phone: 9876543210 },
        files: null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(mockUser.fullName).toBe('Updated Name');
      expect(mockUser.phone).toBe(9876543210);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });
  });

  describe('deletePhotoProfile', () => {
    it('should delete profile images', async () => {
      User.findById.mockResolvedValue(mockUser); // Mock findById

      const req = { user: { id: mockUser._id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deletePhotoProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(mockUser.images).toEqual([]); // Periksa array kosong
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });

    it('should return 404 if user is not found', async () => {
      User.findById.mockResolvedValue(null); // Mock user tidak ditemukan

      const req = { user: { id: 'nonexistentId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deletePhotoProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith('nonexistentId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});
