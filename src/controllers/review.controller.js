const Review = require('../models/review.model');
const Room = require('../models/room.model');

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
