const Room = require('../models/room.model');
const TypeRoom = require('../models/typeRoom.model');
const Review = require('../models/review.model');
const path = require('path');
const fs = require('fs').promises;

// Get all rooms
exports.getAll = async (req, res) => {
  try {
    const room = await Room.find()
      .populate({
        path: 'type',
        select: 'type facility cost images',
      })
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'fullName',
        },
      })
      .populate({
        path: 'complaints',
        populate: {
          path: 'user',
          select: 'fullName',
        },
      });
    // Check if rooms exist
    if (room.length === 0) {
      return res.status(404).json({ message: 'Rooms not found' });
    }

    res.status(200).json({ message: 'Rooms found', data: room });
  } catch (error) {
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
        select: 'type facility cost images',
      })
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'fullName',
        },
      })
      .populate({
        path: 'complaints',
        populate: {
          path: 'user',
          select: 'fullName',
        },
      });
    // Check if room exists
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Rooms found', data: room });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create room
exports.create = async (req, res) => {
  const { name, type } = req.body;
  try {
    // Check if room name already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(404).json({ message: 'Room already exists' });
    }
    // Check if type room exists
    const typeRoom = await TypeRoom.findOne({ type });
    if (!typeRoom) {
      return res.status(404).json({ message: 'TypeRoom not found' });
    }
    // Create data
    const room = new Room({
      name,
      type: typeRoom._id,
    });
    // Save room
    await room.save();

    res.status(201).json({ message: 'Room created successfully', data: room });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update room
exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    // Check if room name already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res
        .status(409)
        .json({ message: 'Room with the same name already exists' });
    }
    // Update room
    room.name = name || room.name;
    // Save room
    await room.save();

    res.status(200).json({ message: 'Room updated', data: room });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete room by id
exports.deleteById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    // Check if room exists
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    // Delete reviews
    const review = room.reviews.map((review) => review._id);
    await Review.deleteMany({ _id: { $in: review } });
    // Delete room
    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all rooms
exports.deleteAll = async (req, res) => {
  try {
    const room = await Room.find();
    // Check if rooms exist
    if (room.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    // Delete reviews
    const review = room.flatMap((room) =>
      room.reviews.map((review) => review._id)
    );
    await Review.deleteMany({ _id: { $in: review } });
    // Delete rooms
    await Room.deleteMany();

    res.status(200).json({ message: 'All rooms deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
