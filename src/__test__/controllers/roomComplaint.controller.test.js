const Complaint = require('../../models/roomComplaint.model');
const Room = require('../../models/room.model');
const { getAll, getById, create, update, updateStatus, deleteById } = require('../../controllers/roomComplaint.controller');

jest.mock('../../models/roomComplaint.model');
jest.mock('../../models/room.model');

describe('Room Complaint Controller Test', () => {
  const mockReq = {
    params: { id: '1' },
    body: {
      title: 'AC Not Working',
      description: 'The air conditioner is broken.',
      status: 'Menunggu',
    },
    files: {
      complaintImages: [{ filename: 'image1.jpg' }],
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

  it('should get a complaint by ID successfully', async () => {
    Complaint.find.mockResolvedValue([
      { id: '1', title: 'AC Not Working', description: 'Broken AC' },
    ]);

    await getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Complaint found' }));
  });

  it('should update a complaint successfully', async () => {
    Complaint.findById.mockResolvedValue({
      id: '1',
      title: 'Old Title',
      description: 'Old Description',
      save: jest.fn(),
    });

    await update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Data updated' }));
  });

  it('should update the status of a complaint successfully', async () => {
    Complaint.findById.mockResolvedValue({
      id: '1',
      status: 'Menunggu',
      save: jest.fn(),
    });

    await updateStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Status updated successfully' }));
  });
});
