const { getAll, getById, updateRole, deleteById } = require('../../controllers/admin.controller');
const User = require('../../models/user.model');

jest.mock('../../models/user.model'); // Mock User model

describe('Admin Controller Tests', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getAll', () => {
    it('should return 200 with all users', async () => {
      User.find.mockResolvedValue([{ _id: '1', userName: 'Test User' }]);

      await getAll({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User found',
        data: [{ _id: '1', userName: 'Test User' }],
      });
    });

    it('should return 404 when no users are found', async () => {
      User.find.mockResolvedValue([]);

      await getAll({}, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });

    it('should handle internal server errors', async () => {
      User.find.mockRejectedValue(new Error('Database Error'));

      await getAll({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: expect.any(Error),
      });
    });
  });

  describe('getById', () => {
    it('should return 200 with user data', async () => {
      User.findById.mockResolvedValue({ _id: '1', userName: 'Test User' });

      const req = { params: { id: '1' } };
      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User found',
        data: { _id: '1', userName: 'Test User' },
      });
    });

    it('should return 404 when user is not found', async () => {
      User.findById.mockResolvedValue(null);

      const req = { params: { id: '1' } };
      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });

    it('should handle internal server errors', async () => {
      User.findById.mockRejectedValue(new Error('Database Error'));

      const req = { params: { id: '1' } };
      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: expect.any(Error),
      });
    });
  });

  describe('updateRole', () => {
    it('should update user role successfully', async () => {
      User.findByIdAndUpdate.mockResolvedValue({ _id: '1', role: 'admin' });

      const req = { params: { id: '1' }, body: { role: 'admin' } };
      await updateRole(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Data updated',
        data: { _id: '1', role: 'admin' },
      });
    });

    it('should return 404 when user is not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      const req = { params: { id: '1' }, body: { role: 'admin' } };
      await updateRole(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });

    it('should handle internal server errors', async () => {
      User.findByIdAndUpdate.mockRejectedValue(new Error('Database Error'));

      const req = { params: { id: '1' }, body: { role: 'admin' } };
      await updateRole(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: expect.any(Error),
      });
    });
  });

  describe('deleteById', () => {
    it('should delete user successfully', async () => {
      User.findByIdAndDelete.mockResolvedValue({ _id: '1', userName: 'Test User' });

      const req = { params: { id: '1' } };
      await deleteById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User deleted successfully',
      });
    });

    it('should return 404 when user is not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: '1' } };
      await deleteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });

    it('should handle internal server errors', async () => {
      User.findByIdAndDelete.mockRejectedValue(new Error('Database Error'));

      const req = { params: { id: '1' } };
      await deleteById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: expect.any(Error),
      });
    });
  });
});
