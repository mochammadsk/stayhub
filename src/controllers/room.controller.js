const Room = require('../models/room.model');
const TypeRoom = require('../models/roomType.model');
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
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Data found', data: room });
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
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Data found', data: room });
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
      return res.status(404).json({ message: 'Type Data not found' });
    }

    // Upload images
    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    // Create data
    const room = new Room({
      name,
      type: typeRoom._id,
      images,
    });

    // Save
    await room.save();

    res.status(201).json({ message: 'Data created successfully', data: room });
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
      // Delete images if Data not found
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if room name already exists
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

    // Update data
    room.name = name || room.name;

    // Upload images
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

    res.status(200).json({ message: 'Data updated', data: room });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete room by id
exports.deleteById = async (req, res) => {
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Delete data images
    const deleteImages = room.images.map((image) => {
      const filePath = path.resolve(
        __dirname,
        '../../public/images/rooms',
        image.filename
      );
      return fs.unlink(filePath);
    });
    await Promise.all(deleteImages);

    // Delete data reviews
    const review = room.reviews.map((review) => review._id);
    await Review.deleteMany({ _id: { $in: review } });

    // Delete data room
    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all rooms
exports.deleteAll = async (req, res) => {
  try {
    // Check if rooms exist
    const room = await Room.find();
    if (room.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Delete data images
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

    // Delete data reviews
    const review = room.flatMap((room) =>
      room.reviews.map((review) => review._id)
    );
    await Review.deleteMany({ _id: { $in: review } });

    // Delete data rooms
    await Room.deleteMany();

    res.status(200).json({ message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
