const Review = require('../models/review.model');
const Room = require('../models/room.model');

// Create Review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const existingReview = await Review.findOne({
      room: room._id,
      user: req.user.id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this room' });
    }

    const review = new Review({
      user: req.user.id,
      rating,
      comment,
    });

    await review.save();

    room.reviews.push(review._id);
    await room.save();

    res
      .status(201)
      .json({ message: 'Review added successfully', data: review });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const room = await Room.findById(req.params.id).populate('reviews');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const review = await Review.findById(room.reviews[0]._id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({ message: 'Update success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server eror', error });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const room = await Room.findById(req.params.id).populate('reviews');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const review = await Review.findById(room.reviews[0]._id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(review._id);

    room.reviews = room.reviews.filter(
      (r) => r._id.toString() !== review._id.toString()
    );
    await room.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
