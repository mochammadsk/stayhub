const Review = require('../models/roomReview.model');
const Room = require('../models/room.model');
const User = require('../models/user.model');

// Create Review
exports.create = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    // Check data room exists
    const room = await Room.findById(req.params.id).populate({
      path: 'transaction',
      select: 'status',
    });
    if (!room) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if user is authenticated
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    // Check if user is allowed to review this room
    if (user.room != room.id) {
      return res
        .status(400)
        .json({ message: 'You are not allowed to review this room' });
    }

    // Check if room is paid off
    if (room.transaction[0].status === 'pending') {
      return res.status(400).json({ message: 'bayar dulu' });
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
      room: room._id,
      rating,
      comment,
    });
    await review.save();

    // Add review to room
    room.reviews.push(review._id);
    await room.save();

    res.status(201).json({ message: 'Data created', data: review });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update review
exports.update = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    // Check data exist
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Update data
    review.rating = rating;
    review.comment = comment;

    // Save data
    await review.save();

    res.status(200).json({ message: 'Data updated', data: review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server eror', error });
  }
};

// Delete review
exports.deleteById = async (req, res) => {
  try {
    // Check if user has already reviewed the room
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Remove references from Room table
    await Room.updateOne(
      { reviews: req.params.id },
      { $pull: { reviews: req.params.id } }
    );

    // Delete data
    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get room reviews by user ID
exports.getById = async (req, res) => {
  try {
    // Cari reviews berdasarkan userId
    const reviews = await Review.find({ user: req.user.id })
      .populate('user', 'fullName')
      .populate({
        path: 'room',
        populate: {
          path: 'type',
          select: 'name',
        },
      });

    // Periksa apakah ada data yang ditemukan
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: 'No reviews found for this user.' });
    }

    res.status(200).json({ message: 'Data found', data: reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};
