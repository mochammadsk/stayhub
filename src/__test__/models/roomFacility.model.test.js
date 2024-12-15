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
});
