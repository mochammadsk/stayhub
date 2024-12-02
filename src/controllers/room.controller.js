// src/controllers/room.controller.js

const Room = require('../models/room.model');
const TypeRoom = require('../models/roomType.model');
const Review = require('../models/roomReview.model');
const Complaint = require('../models/roomComplaint.model');
const path = require('path');
const fs = require('fs').promises;

// Get all rooms
exports.getAll = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate({
        path: 'type',
        select: 'name facility cost description',
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
    const id = req.params.id;
    const room = await Room.findById(id)
      .populate({
        path: 'type',
        select: 'name facility cost description',
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
  try {
    const { name, type, status } = req.body;
    const files = req.files; // Array of files

    // Input validation
    if (!name || !type || !status || !files || files.length === 0) {
      return res.status(400).json({ message: 'Semua data harus terisi' });
    }

    // Check if TypeRoom exists by ID
    const typeRoom = await TypeRoom.findById(type);
    if (!typeRoom) {
      // Delete uploaded files if TypeRoom doesn't exist
      await Promise.all(files.map(file => fs.unlink(file.path)));
      return res.status(404).json({ message: `Data Type Room dengan ID ${type} tidak ditemukan` });
    }

    // Check if room name already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      await Promise.all(files.map(file => fs.unlink(file.path)));
      return res.status(409).json({ message: `Kamar dengan nama ${name} sudah ada` });
    }

    // Create room with images as objects
    const room = await Room.create({
      name,
      type: typeRoom._id,
      status,
      images: files.map(file => ({
        url: path.join('images/rooms', file.filename), // Align with static serving path
        filename: file.filename,
      })),
    });

    res.status(201).json({
      message: 'Kamar berhasil ditambahkan',
      data: room,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Gagal menambahkan kamar', error });
  }
};

// Update room
exports.update = async (req, res) => {
  const { name, type, status } = req.body;
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id);
    if (!room) {
      // Delete uploaded files if room doesn't exist
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map(file => fs.unlink(file.path)));
      }
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    // Check if room name already exists and is not the same room
    if (name && name !== room.name) {
      const existingRoom = await Room.findOne({ name });
      if (existingRoom && existingRoom._id.toString() !== req.params.id) {
        if (req.files && req.files.length > 0) {
          await Promise.all(req.files.map(file => fs.unlink(file.path)));
        }
        return res.status(409).json({ message: `Kamar dengan nama ${name} sudah ada` });
      }
    }

    // If type is being updated, check if the new TypeRoom exists by ID
    if (type && type !== room.type.toString()) {
      const typeRoom = await TypeRoom.findById(type);
      if (!typeRoom) {
        if (req.files && req.files.length > 0) {
          await Promise.all(req.files.map(file => fs.unlink(file.path)));
        }
        return res.status(404).json({ message: `Data Type Room dengan ID ${type} tidak ditemukan` });
      }
      room.type = typeRoom._id;
    }

    // Update name and status if provided
    if (name) room.name = name;
    if (status) room.status = status;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      // Delete existing images
      if (room.images && room.images.length > 0) {
        await Promise.all(room.images.map(image => {
          const filePath = path.resolve(__dirname, '../../public', image.url);
          return fs.unlink(filePath).catch(err => console.error(`Failed to delete image ${filePath}:`, err));
        }));
      }

      // Update with new images as objects
      room.images = req.files.map(file => ({
        url: path.join('images/rooms', file.filename),
        filename: file.filename,
      }));
    }

    // Save updated room
    await room.save();

    res.status(200).json({ message: 'Data berhasil diperbarui', data: room });
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
      await Promise.all(room.images.map(image => {
        const filePath = path.resolve(__dirname, '../../public', image.url);
        return fs.unlink(filePath).catch(err => console.error(`Failed to delete image ${filePath}:`, err));
      }));
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
    const deleteImagesPromises = rooms.flatMap(room =>
      room.images.map(image => {
        const filePath = path.resolve(__dirname, '../../public', image.url);
        return fs.unlink(filePath).catch(err => console.error(`Failed to delete image ${filePath}:`, err));
      })
    );
    await Promise.all(deleteImagesPromises);

    // Collect all review and complaint IDs
    const allReviewIds = rooms.flatMap(room => room.reviews);
    const allComplaintIds = rooms.flatMap(room => room.complaints);

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
