const mongoose = require('mongoose');
const FacilityRoom = require('../../models/roomFacility.model');

describe('FacilityRoom Model Test', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost:27017/stayhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await FacilityRoom.syncIndexes(); // Sinkronkan indeks unik
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await FacilityRoom.deleteMany({});
  });

  it('should throw validation error if required fields are missing', async () => {
    const facility = new FacilityRoom({});
    try {
      await facility.validate();
    } catch (error) {
      expect(error.errors.name).toBeDefined();
    }
  });

  it('should save successfully if all fields are valid', async () => {
    const facility = new FacilityRoom({ name: 'Facility A' });

    const savedFacility = await facility.save();
    expect(savedFacility._id).toBeDefined();
    expect(savedFacility.name).toBe('Facility A');
  });

   // Add toJSON testing
   describe('toJSON Method', () => {
    it('should modify the output of toJSON method', async () => {
      // Mock instance of FacilityRoom
      const facilityRoom = new FacilityRoom({
        _id: '507f191e810c19729de860ea',
        name: 'Facility A',
      });

      // Mock the toObject method from Mongoose
      facilityRoom.toObject = jest.fn().mockReturnValue({
        _id: '507f191e810c19729de860ea',
        name: 'Facility A',
        __v: 0,
      });

      // Call the toJSON method
      const jsonFacilityRoom = facilityRoom.toJSON();

      // Assertions
      expect(jsonFacilityRoom.id).toBeDefined();
      expect(jsonFacilityRoom.__v).toBeUndefined();
      expect(jsonFacilityRoom._id).toBeUndefined();
      expect(jsonFacilityRoom.name).toBe('Facility A');

      // Ensure toObject is called
      expect(facilityRoom.toObject).toHaveBeenCalled();
    });
  });
});
