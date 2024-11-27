const Room = require('../models/room.model');
const TypeRoom = require('../models/roomType.model');
const Review = require('../models/roomReview.model');
const path = require('path');
const fs = require('fs').promises;

// Get all rooms
exports.getAll = async (req, res) => {
  try {
    const room = await Room.find()
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

    // Check if rooms exist
    if (room.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Rooms fetched successfully', data: rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
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
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room retrieved successfully', data: room });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create room
exports.create = async (req, res) => {
  try {
    // Check if room name already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      // Delete images if data not found
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res.status(404).json({ message: `Data ${name} already exists` });
    }

    // Check if type room exists
    const typeRoom = await TypeRoom.findOne({ name: type });
    if (!typeRoom) {
      // Delete images if data not found
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res.status(404).json({ message: `Data ${type} not found` });
    }

    const images = req.files.map((file) => ({
      url: `${process.env.BASE_URL}/images/rooms/${file.filename}`,
      filename: file.filename,
    }));

    const room = new Room({ name, type, images });
    await room.save();

    res.status(201).json({ message: 'Room created successfully', data: room });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};





// Update room
exports.update = async (req, res) => {
  try {
    const { name, type } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (req.files && req.files.length > 0) {
      // Delete old images
      await Promise.all(
        room.images.map(async (image) => {
          const filePath = path.resolve('./public/images/rooms', image.filename);
          if (fs.existsSync(filePath)) await fs.unlink(filePath);
        })
      );

      // Add new images
      room.images = req.files.map((file) => ({
        url: `${process.env.BASE_URL}/images/rooms/${file.filename}`,
        filename: file.filename,
      }));
    }

    room.name = name || room.name;
    room.type = type || room.type;

    await room.save();
    res.status(200).json({ message: 'Room updated successfully', data: room });
  } catch (error) {
    console.error("Error updating room:", error);
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

    // Delete images
    await Promise.all(
      room.images.map(async (image) => {
        const filePath = path.resolve('./public/images/rooms', image.filename);
        if (fs.existsSync(filePath)) await fs.unlink(filePath);
      })
    );

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all rooms
exports.deleteAll = async (req, res) => {
  try {
    const rooms = await Room.find();

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms to delete' });
    }

    // Delete images
    await Promise.all(
      rooms.flatMap((room) =>
        room.images.map((image) => {
          const filePath = path.resolve('./public/images/rooms', image.filename);
          return fs.unlink(filePath);
        })
      )
    );

    await Room.deleteMany();
    res.status(200).json({ message: 'All rooms deleted successfully' });
  } catch (error) {
    console.error("Error deleting rooms:", error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
