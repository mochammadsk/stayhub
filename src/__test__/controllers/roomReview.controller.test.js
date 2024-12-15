const Review = require('../../models/roomReview.model');
const Room = require('../../models/room.model');
const User = require('../../models/user.model');
const { create, update, deleteById, getById } = require('../../controllers/roomReview.controller');

jest.mock('../../models/roomReview.model');
jest.mock('../../models/room.model');
jest.mock('../../models/user.model');

describe('RoomReview Controller Test', () => {
  const mockReq = {
    params: { id: '1' },
    body: { rating: 5, comment: 'Good!' },
    user: { id: '123' },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a review successfully', async () => {
    Review.findById.mockResolvedValue({
      save: jest.fn().mockResolvedValue(true),
    });

    await update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data updated' }));
  });

  it('should delete a review successfully', async () => {
    Review.findById.mockResolvedValue({ _id: '1' });
    Review.findByIdAndDelete.mockResolvedValue(true);

    await deleteById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data deleted' }));
  });
});
