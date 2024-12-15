const { getAll, getById, updateRole, deleteById } = require('../../controllers/admin.controller');
const User = require('../../models/user.model');
const fs = require('fs').promises;

// Mock fungsi fs
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(() => Promise.resolve()),
    unlink: jest.fn(() => Promise.resolve()),
  },
}));

// Mock fungsi user model
jest.mock('../../models/user.model');

describe('Admin Controller Tests', () => {
  describe('getAll', () => {
    it('should return all users if they exist', async () => {
      const mockUsers = [
        { _id: '1', userName: 'Test User 1', email: 'testuser1@example.com' },
        { _id: '2', userName: 'Test User 2', email: 'testuser2@example.com' },
      ];

      User.find.mockResolvedValue(mockUsers);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User found', data: mockUsers });
    });

    it('should return 404 if no users are found', async () => {
      User.find.mockResolvedValue([]);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });
  });

  describe('getById', () => {
    it('should return user data if user exists', async () => {
      const mockUser = { _id: '1', userName: 'Test User', email: 'testuser@example.com' };
      User.findById.mockResolvedValue(mockUser);

      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User found', data: mockUser });
    });

    it('should return 404 if user is not found', async () => {
      User.findById.mockResolvedValue(null);

      const req = { params: { id: 'invalidId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });
  });

  describe('updateRole', () => {
    it('should update the user role and return the updated user', async () => {
      const mockRoleUpdate = { role: 'admin' };
      const mockUser = { _id: '1', userName: 'Test User', email: 'testuser@example.com', role: 'admin' };
      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      const req = { params: { id: '1' }, body: mockRoleUpdate };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateRole(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Data updated', data: mockUser });
    });

    it('should return 404 if user not found', async () => {
      const mockRoleUpdate = { role: 'admin' };
      User.findByIdAndUpdate.mockResolvedValue(null);

      const req = { params: { id: 'invalidId' }, body: mockRoleUpdate };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateRole(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });
  });

  describe('deleteById', () => {
    it('should delete the user and return success message', async () => {
      const mockUser = { _id: '1', userName: 'Test User' };
      User.findByIdAndDelete.mockResolvedValue(mockUser);

      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 if user is not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: 'invalidId' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });
  });
});
