const Room = require('../../models/room.model');
const TypeRoom = require('../../models/roomType.model');
const { create, deleteById } = require('../../controllers/room.controller');
const fs = require('fs').promises;

// Mock fs.promises.unlink
jest.mock('fs', () => ({
  promises: {
    unlink: jest.fn().mockResolvedValue(),
  },
}));

jest.mock('../../models/room.model');
jest.mock('../../models/roomType.model');

describe('Room Controller Test', () => {
  const mockReq = {
    params: { id: '1' },
    body: { name: 'Room A', type: 'Type A' },
    files: {
      roomImages: [{ filename: 'image1.jpg' }],
    },
    user: { id: '123' },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a room successfully', async () => {
    Room.findOne.mockResolvedValue(null);
    TypeRoom.findOne.mockResolvedValue({ id: '1', name: 'Type A' });
    Room.prototype.save = jest.fn().mockResolvedValue({
      id: '1',
      name: 'Room A',
      type: '1',
    });

    await create(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Room created successfully' }));
  });

  it('should delete a room by ID successfully', async () => {
    Room.findById.mockResolvedValue({
      id: '1',
      name: 'Room A',
      images: [{ url: 'images/rooms/image1.jpg', filename: 'image1.jpg' }],
    });
    Room.findByIdAndDelete.mockResolvedValue(true);

    await deleteById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data berhasil dihapus' }));
  });
});
