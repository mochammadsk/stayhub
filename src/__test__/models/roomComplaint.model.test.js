const mongoose = require('mongoose');
const Complaint = require('../../models/roomComplaint.model');

describe('Room Complaint Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/stayhub', {
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

  // Tambahan pengujian toJSON method
  describe('toJSON Method', () => {
    it('should modify the output of toJSON method', async () => {
      // Membuat instance dari Complaint
      const complaint = new Complaint({
        _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
        user: new mongoose.Types.ObjectId(),
        room: new mongoose.Types.ObjectId(),
        title: 'AC Not Working',
        description: 'The air conditioner is broken.',
        status: 'Menunggu',
      });

      // Simpan ke database
      await complaint.save();

      // Panggil metode toJSON
      const jsonComplaint = complaint.toJSON();

      // Assertions
      expect(jsonComplaint.id).toBeDefined(); // _id menjadi id
      expect(jsonComplaint._id).toBeUndefined(); // _id harus dihapus
      expect(jsonComplaint.__v).toBeUndefined(); // __v harus dihapus
      expect(jsonComplaint.title).toBe('AC Not Working');
      expect(jsonComplaint.description).toBe('The air conditioner is broken.');
      expect(jsonComplaint.status).toBe('Menunggu');
    });
  });
});
