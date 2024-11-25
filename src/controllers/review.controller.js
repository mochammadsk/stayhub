const Review = require('../models/review.model');
const Room = require('../models/room.model');

// Create Review
exports.create = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    // Check if user has already reviewed the room
    const existingReview = await Review.findOne({
      room: room._id,
      user: req.user.id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this room' });
    }
    // Create review
    const review = new Review({
      user: req.user.id,
      rating,
      comment,
    });
    await review.save();
    // Add review to room
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
exports.update = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id).populate('reviews');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    // Check if user has already reviewed the room
    const review = await Review.findById(room.reviews[0]._id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    // Update review
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
exports.delete = async (req, res) => {
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id).populate('reviews');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    // Check if user has already reviewed the room
    const review = await Review.findById(room.reviews[0]._id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    // Delete review
    await Review.findByIdAndDelete(review._id);
    // Delete review from room
    room.reviews = room.reviews.filter(
      (r) => r._id.toString() !== review._id.toString()
    );
    await room.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
