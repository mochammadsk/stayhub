const TypeRoom = require('../models/typeRoom.model');
const path = require('path');
const fs = require('fs').promises;

// Get all typeRoom
exports.getAll = async (req, res) => {
  const typeRoom = await TypeRoom.find();
  try {
    if (typeRoom.length === 0) {
      return res.status(404).json({ message: 'TypeRoom not found' });
    }

    res.status(200).json({ data: typeRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

exports.getOne = async (req, res) => {
  const id = req.params.id;
  try {
    const typeRoom = await TypeRoom.findById(id);
    if (!typeRoom) {
      return res.status(404).json({ message: 'TypeRoom not found' });
    }

    res.status(200).json({ message: 'Type room found', data: typeRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create typeRoom
exports.create = async (req, res) => {
  const { type, facility, cost } = req.body;
  try {
    // Check if typeRoom already exists
    const existingReview = await TypeRoom.findOne({ type });
    if (existingReview) {
      return res.status(404).json({ message: 'Type already exists' });
    }

    // Upload images
    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    // Create typeRoom
    const typeRoom = new TypeRoom({ type, facility, cost, images });
    await typeRoom.save();

    res.status(201).json({ data: typeRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update typeRoom
exports.update = async (req, res) => {
  const { type, facility, cost } = req.body;
  try {
    const typeRoom = await TypeRoom.findById(req.params.id);
    if (!typeRoom) {
      // Delete images if room not found
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res.status(404).json({ message: 'TypeRoom not found' });
    }

    const existingType = await TypeRoom.findOne({ type });
    if (existingType) {
      // Delete images if room with the same name already exists
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res
        .status(409)
        .json({ message: 'Room with the same name already exists' });
    }

    // Update data
    typeRoom.type = type || typeRoom.type;
    typeRoom.facility = facility || typeRoom.facility;
    typeRoom.cost = cost || typeRoom.cost;

    if (req.files && req.files.length > 0) {
      // Delete old images
      if (typeRoom.images && typeRoom.images.length > 0) {
        for (const image of typeRoom.images) {
          const filePath = path.resolve(image.url);

          await fs.access(filePath);
          await fs.unlink(filePath);
        }
      }
      // Update images
      typeRoom.images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
    }

    // Save Type Room
    await typeRoom.save();

    res.status(200).json({ data: typeRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete one typeRoom
exports.deleteOne = async (req, res) => {
  try {
    const typeRoom = await TypeRoom.findById(req.params.id);
    if (!typeRoom) {
      return res.status(404).json({ message: 'TypeRoom not found' });
    }

    // Delete images
    const deleteImages = typeRoom.images.map((typeRoom) => {
      const filePath = path.resolve(
        __dirname,
        '../../public/images/rooms',
        image.filename
      );
      return fs.unlink(filePath);
    });
    await Promise.all(deleteImages);

    // Delete typeRoom
    await TypeRoom.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Type Room deleted!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all typeRoom
exports.deleteAll = async (req, res) => {
  const typeRoom = await TypeRoom.find();
  try {
    // Check if type exist
    if (typeRoom.length === 0) {
      return res.status(404).json({ message: 'TypeRoom not found' });
    }

    // Delete images
    const deleteImages = typeRoom.flatMap((typeRoom) =>
      typeRoom.images.map((image) => {
        const filePath = path.resolve(
          __dirname,
          '../../public/images/rooms',
          image.filename
        );
        return fs.unlink(filePath);
      })
    );
    await Promise.all(deleteImages);

    // Delete typeRoom
    await TypeRoom.deleteMany();

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
