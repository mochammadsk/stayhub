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

  // Tambahan pengujian toJSON method
  describe('toJSON Method', () => {
    it('should modify the output of toJSON method', async () => {
      // Mock instance of Review
      const review = new Review({
        _id: '507f191e810c19729de860ea',
        rating: 5,
        comment: 'Good!',
        user: '123',
      });

      // Mock the toObject method from Mongoose
      review.toObject = jest.fn().mockReturnValue({
        _id: '507f191e810c19729de860ea',
        rating: 5,
        comment: 'Good!',
        user: '123',
        __v: 0,
      });

      // Panggil metode toJSON
      const jsonReview = review.toJSON();

      // Assertions
      expect(jsonReview.id).toBeDefined();
      expect(jsonReview.__v).toBeUndefined();
      expect(jsonReview._id).toBeUndefined();
      expect(jsonReview.rating).toBe(5);
      expect(jsonReview.comment).toBe('Good!');
      expect(jsonReview.user).toBe('123');

      // Pastikan toObject dipanggil
      expect(review.toObject).toHaveBeenCalled();
    });
  });
});
