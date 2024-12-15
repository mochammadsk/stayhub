const TypeRoom = require('../../models/roomType.model');
const FacilityRoom = require('../../models/roomFacility.model');
const { getAll, getById, create, update, deleteById } = require('../../controllers/roomType.controller');

jest.mock('../../models/roomType.model');
jest.mock('../../models/roomFacility.model');

describe('Room Type Controller Test', () => {
  const mockReq = {
    params: { id: '1' },
    body: {
      name: 'Deluxe',
      facility: ['WiFi', 'AC'],
      description: 'Spacious room with amenities',
      cost: 100,
    },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a room type successfully', async () => {
    FacilityRoom.find.mockResolvedValue([
      { id: '1', name: 'WiFi' },
      { id: '2', name: 'AC' },
    ]);
    TypeRoom.findOne.mockResolvedValue(null);
    TypeRoom.prototype.save = jest.fn().mockResolvedValue({
      id: '1',
      name: 'Deluxe',
      facility: ['1', '2'],
      description: 'Spacious room with amenities',
      cost: 100,
    });

    await create(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ messages: 'Data created' }));
  });

  it('should update a room type successfully', async () => {
    TypeRoom.findById.mockResolvedValue({
      id: '1',
      name: 'Deluxe',
      description: 'Spacious',
      cost: 100,
      facility: [],
      save: jest.fn(),
    });
    FacilityRoom.find.mockResolvedValue([
      { id: '1', name: 'WiFi' },
      { id: '2', name: 'AC' },
    ]);

    await update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data updated' }));
  });
});
