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

  // Tambahan pengujian toJSON method
  describe('toJSON Method', () => {
    it('should modify the output of toJSON method', async () => {
      // Mock instance of TypeRoom
      const typeRoom = new TypeRoom({
        _id: '507f191e810c19729de860ea',
        name: 'Deluxe',
        description: 'Spacious room with amenities',
        cost: 100,
        facility: ['1', '2'],
      });

      // Mock the toObject method from Mongoose
      typeRoom.toObject = jest.fn().mockReturnValue({
        _id: '507f191e810c19729de860ea',
        name: 'Deluxe',
        description: 'Spacious room with amenities',
        cost: 100,
        facility: ['1', '2'],
        __v: 0,
      });

      // Panggil metode toJSON
      const jsonTypeRoom = typeRoom.toJSON();

      // Assertions
      expect(jsonTypeRoom.id).toBeDefined();
      expect(jsonTypeRoom.__v).toBeUndefined();
      expect(jsonTypeRoom._id).toBeUndefined();
      expect(jsonTypeRoom.name).toBe('Deluxe');
      expect(jsonTypeRoom.description).toBe('Spacious room with amenities');
      expect(jsonTypeRoom.cost).toBe(100);
      expect(jsonTypeRoom.facility).toEqual(['1', '2']);

      // Pastikan toObject dipanggil
      expect(typeRoom.toObject).toHaveBeenCalled();
    });
  });
});
