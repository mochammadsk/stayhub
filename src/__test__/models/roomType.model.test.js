const mongoose = require('mongoose');
const TypeRoom = require('../../models/roomType.model');

describe('TypeRoom Model Test', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost:27017/stayhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await TypeRoom.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await TypeRoom.deleteMany({});
  });

  it('should throw validation error if required fields are missing', async () => {
    const typeRoom = new TypeRoom({});
    try {
      await typeRoom.validate();
    } catch (error) {
      expect(error.errors.name).toBeDefined();
    }
  });

  it('should save successfully if all fields are valid', async () => {
    const typeRoom = new TypeRoom({
      name: 'Deluxe',
      facility: [new mongoose.Types.ObjectId()],
      description: 'Spacious room with amenities',
      cost: 100,
    });

    const savedTypeRoom = await typeRoom.save();
    expect(savedTypeRoom._id).toBeDefined();
    expect(savedTypeRoom.name).toBe('Deluxe');
  });
});
