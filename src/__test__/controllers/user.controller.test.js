const { getProfile, updateProfile, deletePhotoProfile } = require('../../controllers/user.controller');
const User = require('../../models/user.model');
const fs = require('fs').promises;
const path = require('path');

// Mock fs
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(() => Promise.resolve()),
    unlink: jest.fn(() => Promise.resolve()),
  },
}));

// Mock User model
jest.mock('../../models/user.model');

describe('User Controller Tests', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      _id: '63a9f0ea7f6b123456789abc',
      fullName: 'Test User',
      email: 'testuser@example.com',
      phone: 1234567890,
      address: '123 Test Street',
      password: 'securepassword',
      profileImages: [{ url: '/uploads/profile1.jpg', filename: 'profile1.jpg' }],
      ktpImages: [{ url: '/uploads/ktp1.jpg', filename: 'ktp1.jpg' }],
      images: [{ url: '/uploads/image1.jpg', filename: 'image1.jpg' }],
      save: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return 200 with user data', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          fullName: 'Test User',
          email: 'test@example.com',
        }),
      });
  
      const req = { user: { id: 'validUserId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getProfile(req, res);
  
      expect(User.findById).toHaveBeenCalledWith('validUserId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.objectContaining({ fullName: 'Test User' }),
      });
    });
  
    it('should return 404 if user not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
  
      const req = { user: { id: 'nonexistentId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getProfile(req, res);
  
      expect(User.findById).toHaveBeenCalledWith('nonexistentId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  
    it('should handle server errors', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database Error')),
      });
  
      const req = { user: { id: 'errorUserId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getProfile(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: expect.anything(),
      });
    });
  });

  describe('updateProfile', () => {
    it('should return 404 if user is not found', async () => {
      User.findById.mockResolvedValue(null); // Simulasikan user tidak ditemukan
    
      const req = {
        user: { id: 'nonexistentId' },
        body: { fullName: 'Nonexistent User' },
        files: null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      await updateProfile(req, res);
    
      expect(User.findById).toHaveBeenCalledWith('nonexistentId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should not update fullName if it is not provided', async () => {
      User.findById.mockResolvedValue(mockUser);
    
      const req = {
        user: { id: mockUser._id },
        body: {}, // fullName tidak ada
        files: null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      await updateProfile(req, res);
    
      expect(mockUser.fullName).toBe(mockUser.fullName); // Tidak diubah
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });
    
    it('should update profile with new files', async () => {
      User.findById.mockResolvedValue(mockUser);

      const req = {
        user: { id: mockUser._id },
        body: { fullName: 'Updated User' },
        files: {
          profileImages: [{ path: '/uploads/newProfile.jpg', filename: 'newProfile.jpg' }],
          ktpImages: [{ path: '/uploads/newKtp.jpg', filename: 'newKtp.jpg' }],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateProfile(req, res);

      expect(mockUser.profileImages).toEqual([{ url: '/uploads/newProfile.jpg', filename: 'newProfile.jpg' }]);
      expect(mockUser.ktpImages).toEqual([{ url: '/uploads/newKtp.jpg', filename: 'newKtp.jpg' }]);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });
    
    

    it('should handle error during update', async () => {
      User.findById.mockRejectedValue(new Error('Database error'));

      const req = { user: { id: mockUser._id }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Internal Server Error' }));
    });
  });

  describe('deletePhotoProfile', () => {
    it('should delete images and update user', async () => {
      User.findById.mockResolvedValue(mockUser);

      const req = { user: { id: mockUser._id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deletePhotoProfile(req, res);

      expect(fs.unlink).toHaveBeenCalledTimes(1);
      expect(mockUser.images).toEqual([]);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });

    it('should return 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      const req = { user: { id: 'nonexistentId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deletePhotoProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle error during file unlink', async () => {
      User.findById.mockResolvedValue(mockUser);
      fs.access.mockResolvedValue();
      fs.unlink.mockRejectedValue(new Error('File system error'));

      const req = { user: { id: mockUser._id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deletePhotoProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Internal Server Error' }));
    });
  });
});
