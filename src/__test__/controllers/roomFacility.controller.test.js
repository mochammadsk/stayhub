const FacilityRoom = require('../../models/roomFacility.model');
const TypeRoom = require('../../models/roomType.model');
const { getAll, getById, create, update, deleteById, deleteAll } = require('../../controllers/roomFacility.controller');

jest.mock('../../models/roomFacility.model');
jest.mock('../../models/roomType.model');

describe('Room Facility Controller Test', () => {
  const mockReq = {
    params: { id: '1' },
    body: { name: 'Facility A' },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all facilities successfully', async () => {
    FacilityRoom.find.mockResolvedValue([
      { id: '1', name: 'Facility A' },
    ]);

    await getAll(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ messages: 'Data found' }));
  });

  it('should return 404 when no facilities are found', async () => {
    FacilityRoom.find.mockResolvedValue([]);

    await getAll(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data not found' }));
  });

  it('should get a facility by ID successfully', async () => {
    FacilityRoom.findById.mockResolvedValue({ id: '1', name: 'Facility A' });

    await getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data found' }));
  });

  it('should return 404 when facility by ID is not found', async () => {
    FacilityRoom.findById.mockResolvedValue(null);

    await getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data not found' }));
  });

  it('should create a facility successfully', async () => {
    FacilityRoom.findOne.mockResolvedValue(null);
    FacilityRoom.prototype.save = jest.fn().mockResolvedValue({
      id: '1',
      name: 'Facility A',
    });

    await create(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data created' }));
  });

  it('should not create a facility with duplicate name', async () => {
    FacilityRoom.findOne.mockResolvedValue({ id: '1', name: 'Facility A' });

    await create(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data Facility A already exists' }));
  });

  it('should update a facility successfully', async () => {
    FacilityRoom.findById.mockResolvedValue({ id: '1', name: 'Facility A', save: jest.fn() });
    FacilityRoom.findOne.mockResolvedValue(null);

    await update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data updated' }));
  });

  it('should delete a facility by ID successfully', async () => {
    FacilityRoom.findById.mockResolvedValue({ id: '1', name: 'Facility A' });
    FacilityRoom.findByIdAndDelete.mockResolvedValue(true);

    await deleteById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data deleted' }));
  });

  it('should delete all facilities successfully', async () => {
    FacilityRoom.find.mockResolvedValue([{ id: '1', name: 'Facility A' }]);
    FacilityRoom.deleteMany.mockResolvedValue(true);

    await deleteAll(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data deleted' }));
  });
});
