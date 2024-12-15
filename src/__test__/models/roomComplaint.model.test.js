const mongoose = require('mongoose');
const Complaint = require('../../models/roomComplaint.model');

describe('Room Complaint Model Test', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost:27017/stayhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Complaint.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Complaint.deleteMany({});
  });

  it('should throw validation error if required fields are missing', async () => {
    const complaint = new Complaint({});
    try {
      await complaint.validate();
    } catch (error) {
      expect(error.errors.title).toBeDefined();
    }
  });

  it('should save successfully if all fields are valid', async () => {
    const complaint = new Complaint({
      user: new mongoose.Types.ObjectId(),
      room: new mongoose.Types.ObjectId(),
      title: 'AC Not Working',
      description: 'The air conditioner is broken.',
      status: 'Menunggu',
    });

    const savedComplaint = await complaint.save();
    expect(savedComplaint._id).toBeDefined();
    expect(savedComplaint.title).toBe('AC Not Working');
  });
});
