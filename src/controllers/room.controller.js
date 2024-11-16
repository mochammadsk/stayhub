const Room = require('../models/room.model');
const Review = require('../models/review.model');
const path = require('path');
const fs = require('fs').promises;

// Get all rooms
exports.findAll = async (req, res) => {
  try {
    const room = await Room.find().populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'fullName',
      },
    });

    if (room.length === 0) {
      return res.status(404).json({ message: 'Rooms not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get room by id
exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await Room.findById(id).populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'fullName',
      },
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create room
exports.addRoom = async (req, res) => {
  try {
    const { type, name, cost } = req.body;
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(404).json({ message: 'Room already exists' });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    const room = new Room({
      type,
      name,
      cost,
      images,
    });

    await room.save();
    res.status(201).json({ message: 'Room created successfully', data: room });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update room by id
exports.updateRoom = async (req, res) => {
  try {
    const { type, name, cost } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      // Delete images if room not found
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res.status(404).json({ message: 'Room not found' });
    }

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      // Delete images if room with the same name already exists
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res
        .status(409)
        .json({ message: 'Room with the same name already exists' });
    }

    // Update room
    room.type = type || room.type;
    room.name = name || room.name;
    room.cost = cost || room.cost;

    if (req.files && req.files.length > 0) {
      // Delete old images
      if (room.images && room.images.length > 0) {
        for (const image of room.images) {
          const filePath = path.resolve(image.url);

          await fs.access(filePath);
          await fs.unlink(filePath);
        }
      }
      // Update images
      room.images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
    }

    // Save room
    await room.save();
    res.status(200).json({ message: 'Room updated!', room });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete room by id
exports.deleteById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const deleteImages = room.images.map((image) => {
      const filePath = path.resolve(
        __dirname,
        '../../public/images/rooms',
        image.filename
      );
      return fs.unlink(filePath);
    });
    await Promise.all(deleteImages);

    const review = room.reviews.map((review) => review._id);
    await Review.deleteMany({ _id: { $in: review } });

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all rooms
exports.deleteAll = async (req, res) => {
  try {
    const room = await Room.find();

    if (room.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const deleteImages = room.flatMap((room) =>
      room.images.map((image) => {
        const filePath = path.resolve(
          __dirname,
          '../../public/images/rooms',
          image.filename
        );
        return fs.unlink(filePath);
      })
    );
    await Promise.all(deleteImages);

    const review = room.flatMap((room) =>
      room.reviews.map((review) => review._id)
    );
    await Review.deleteMany({ _id: { $in: review } });

    await Room.deleteMany();
    res.status(200).json({ message: 'All rooms deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
