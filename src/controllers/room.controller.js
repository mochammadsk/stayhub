const Room = require('../models/room.model');
const TypeRoom = require('../models/roomType.model');
const Review = require('../models/roomReview.model');
const Complaint = require('../models/roomComplaint.model');
const User = require('../models/user.model');
const path = require('path');
const fs = require('fs').promises;

// Get all rooms
exports.getAll = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate({
        path: 'type',
        populate: {
          path: 'facility',
          select: 'name',
        },
        select: 'name cost description',
      })
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'fullName',
        },
        select: 'rating comment',
      })
      .populate({
        path: 'complaints',
        populate: {
          path: 'user',
          select: 'fullName',
        },
        select: 'description status images',
      });

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Data found', data: rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get room by id
exports.getById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: 'type',
        populate: {
          path: 'facility',
          select: 'name',
        },
        select: 'name cost description',
      })
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'fullName',
        },
        select: 'rating comment',
      })
      .populate({
        path: 'complaints',
        populate: {
          path: 'user',
          select: 'fullName',
        },
        select: 'description status images',
      });

    // Check if room exists
    if (!room) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Data found', data: room });
  } catch (error) {
    console.error('Error fetching room by ID:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create room
exports.create = async (req, res) => {
  const { name, type } = req.body;
  try {
    // Check if name room already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      // Delete images if data already exists
      if (req.files) {
        await Promise.all(
          Object.values(req.files)
            .flat()
            .map((file) => fs.unlink(file.path))
        );
      }
      return res.status(400).json({ message: `Data ${name} already exists` });
    }

    // Check if type room exists
    const typeRoom = await TypeRoom.findOne({ name: type });
    if (!typeRoom) {
      // Delete images if data already exists
      if (req.files) {
        await Promise.all(
          Object.values(req.files)
            .flat()
            .map((file) => fs.unlink(file.path))
        );
      }
      return res
        .status(404)
        .json({ message: `Type Room ID ${type} not found` });
    }

    // Upload images
    const images = req.files.roomImages
      ? req.files.roomImages.map((file) => ({
          url: path.join('images/rooms', file.filename),
          filename: file.filename,
        }))
      : [];

    // Create data
    const room = new Room({
      name,
      type: typeRoom._id,
      images,
    });

    // Save data
    await room.save();

    res.status(201).json({ message: 'Room created successfully', data: room });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update room
exports.update = async (req, res) => {
  const { name, type } = req.body;
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      if (req.files) {
        await Promise.all(
          Object.values(req.files)
            .flat()
            .map((file) => fs.unlink(file.path))
        );
      }
      return res.status(404).json({ message: 'Room not found' });
    }

    if (type) {
      const typeRoom = await TypeRoom.findById(type);
      if (!typeRoom) {
        if (req.files) {
          await Promise.all(
            Object.values(req.files)
              .flat()
              .map((file) => fs.unlink(file.path))
          );
        }
        return res
          .status(404)
          .json({ message: `Type Room ID ${type} not found` });
      }
      room.type = typeRoom._id;
    }

    // Update images jika ada unggahan baru
    if (req.files.roomImages) {
      if (room.images) {
        await Promise.all(
          room.images.map((image) =>
            fs.unlink(path.resolve(__dirname, '../../public', image.url))
          )
        );
      }
      room.images = req.files.roomImages.map((file) => ({
        url: path.join('images/rooms', file.filename),
        filename: file.filename,
      }));
    }

    await room.save();
    res.status(200).json({ message: 'Room updated successfully', data: room });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete room by id
exports.deleteById = async (req, res) => {
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Delete images
    if (room.images && room.images.length > 0) {
      await Promise.all(
        room.images.map((image) => {
          const filePath = path.resolve(__dirname, '../../public', image.url);
          return fs
            .unlink(filePath)
            .catch((err) =>
              console.error(`Failed to delete image ${filePath}:`, err)
            );
        })
      );
    }

    // Delete reviews
    if (room.reviews && room.reviews.length > 0) {
      await Review.deleteMany({ _id: { $in: room.reviews } });
    }

    // Delete complaints
    if (room.complaints && room.complaints.length > 0) {
      await Complaint.deleteMany({ _id: { $in: room.complaints } });
    }

    // Delete room
    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all rooms
exports.deleteAll = async (req, res) => {
  try {
    // Check if rooms exist
    const rooms = await Room.find();
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Delete all images
    const deleteImagesPromises = rooms.flatMap((room) =>
      room.images.map((image) => {
        const filePath = path.resolve(__dirname, '../../public', image.url);
        return fs
          .unlink(filePath)
          .catch((err) =>
            console.error(`Failed to delete image ${filePath}:`, err)
          );
      })
    );
    await Promise.all(deleteImagesPromises);

    // Collect all review and complaint IDs
    const allReviewIds = rooms.flatMap((room) => room.reviews);
    const allComplaintIds = rooms.flatMap((room) => room.complaints);

    // Delete all reviews and complaints
    if (allReviewIds.length > 0) {
      await Review.deleteMany({ _id: { $in: allReviewIds } });
    }

    if (allComplaintIds.length > 0) {
      await Complaint.deleteMany({ _id: { $in: allComplaintIds } });
    }

    // Delete all rooms
    await Room.deleteMany();

    res.status(200).json({ message: 'Semua data kamar berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting all rooms:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get room by user ID
exports.getByUser = async (req, res) => {
  try {
    // Find rooms by user ID
    const room = await Room.find({ user: req.user.id }).populate('type');
    if (room.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ message: 'Data found', data: room });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
