const mongoose = require('mongoose');
const Review = require('../../models/roomReview.model');

describe('Review Model Test', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost:27017/stayhub', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should throw validation error if required fields are missing', async () => {
    const review = new Review({});
    try {
      await review.validate();
    } catch (error) {
      expect(error.errors.rating).toBeDefined();
      expect(error.errors.comment).toBeDefined();
      expect(error.errors.user).toBeDefined();
      expect(error.errors.room).toBeDefined();
    }
  });

  it('should save successfully if all fields are valid', async () => {
    const review = new Review({
      user: new mongoose.Types.ObjectId(),
      room: new mongoose.Types.ObjectId(),
      rating: 5,
      comment: 'Excellent room!',
    });
    const savedReview = await review.save();
    expect(savedReview._id).toBeDefined();
    expect(savedReview.rating).toBe(5);
    expect(savedReview.comment).toBe('Excellent room!');
  });
});
