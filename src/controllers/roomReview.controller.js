const Review = require("../models/roomReview.model");
const Room = require("../models/room.model");

// Create Review
exports.create = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    // Check data room exists
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Check if user has already reviewed the room
    const existingReview = await Review.findOne({
      room: room._id,
      user: req.user.id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this room" });
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

    res.status(201).json({ message: "Data created", data: review });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Update review
exports.update = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    // Check data exist
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Update data
    review.rating = rating;
    review.comment = comment;

    // Save data
    await review.save();

    res.status(200).json({ message: "Data updated", data: review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server eror", error });
  }
};

// Delete review
exports.deleteById = async (req, res) => {
  try {
    // Check if user has already reviewed the room
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Remove references from Room table
    await Room.updateOne(
      { reviews: req.params.id },
      { $pull: { reviews: req.params.id } }
    );

    // Delete data
    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Data deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getRoomReviewsByIdReview = async (req, res) => {
  try {
    // Mencari ulasan berdasarkan id review
    const reviews = await Review.findById(req.params.id)
      .populate({
        path: "room",
        populate: {
          path: "type",
          select: "name",
        },
      })
      .populate("user", "fullName"); // Ambil nama user

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this user." });
    }

    res.status(200).json({ message: "Data found", data: reviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

// Get room reviews by user ID
exports.getRoomReviewsByIdUser = async (req, res) => {
  try {
    // Ambil userId dari request parameter atau token jika menggunakan middleware autentikasi
    const userId = req.user._id; // Jika menggunakan token JWT yang sudah di-decode di middleware

    // Cari reviews berdasarkan userId
    const reviews = await Review.find({ user: userId })
      .populate({
        path: "room", 
        populate: {
          path: "type", // Populate room type information
          select: "name", // Ambil hanya nama type
        },
      })
      .populate("user", "fullName"); // Ambil nama lengkap user

    // Periksa apakah ada data yang ditemukan
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user." });
    }

    // Kembalikan data review yang ditemukan
    res.status(200).json({ message: "Data found", data: reviews });
  } catch (error) {
    // Tangani error
    res.status(500).json({ message: "Error fetching data", error });
  }
};
