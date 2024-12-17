const mongoose = require('mongoose');
const Room = require('../../models/room.model');

describe('Room Model Test', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost:27017/stayhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Membersihkan koleksi sebelum setiap pengujian
  beforeEach(async () => {
    await Room.deleteMany({});
  });

  it('should throw validation error if required fields are missing', async () => {
    const room = new Room({});
    try {
      await room.validate();
    } catch (error) {
      expect(error.errors.name).toBeDefined();
    }
  });

  describe('toJSON Method', () => {
    it('should modify the output of toJSON method', async () => {
      const room = new Room({
        name: 'Room A',
        status: 'available',
        type: [new mongoose.Types.ObjectId()],
        images: [{ url: 'images/rooms/image1.jpg', filename: 'image1.jpg' }],
      });

      await room.save();
      const savedRoom = await room.toJSON();

      expect(savedRoom.id).toBeDefined();
      expect(savedRoom.__v).toBeUndefined();
      expect(savedRoom.name).toBe('Room A');
      expect(savedRoom.status).toBe('available');
    });
  })
});
