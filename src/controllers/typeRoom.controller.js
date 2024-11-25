const TypeRoom = require('../models/typeRoom.model');
const Room = require('../models/room.model');

// Get all type room
exports.getAll = async (req, res) => {
  try {
    const typeRoom = await TypeRoom.find().populate({
      path: 'facility',
      select: 'name',
    });

    // Check if type room exist
    if (typeRoom.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ data: typeRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get one type room
exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    // Check data exist
    const typeRoom = await TypeRoom.findById(id);
    if (!typeRoom) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Data found', data: typeRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create type room
exports.create = async (req, res) => {
  const { name, description, cost } = req.body;
  try {
    // Check data exists
    const existingReview = await TypeRoom.findOne({ name });
    if (existingReview) {
      return res.status(404).json({ message: 'Type already exists' });
    }

    // Create data
    const type = new TypeRoom({ name, description, cost });
    await type.save();

    res.status(201).json({ messages: 'Created successfully', data: type });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update typeRoom
exports.update = async (req, res) => {
  const { name, description, cost } = req.body;
  try {
    // Check if data exists
    const type = await TypeRoom.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if type room name already exists
    const existingType = await TypeRoom.findOne({ name });
    if (existingType) {
      return res
        .status(409)
        .json({ message: 'Type room with the same name already exists' });
    }

    // Update data
    type.name = name || type.name;
    type.description = description || type.description;
    type.cost = cost || type.cost;

    // Save data
    await type.save();

    res.status(200).json({ message: 'Data updated successfully', data: type });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete one typeRoom
exports.deleteById = async (req, res) => {
  try {
    // Check if data exists
    const type = await TypeRoom.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Remove references from Room documents
    await Room.updateMany(
      { type: req.params.id },
      { $pull: { type: req.params.id } }
    );

    // Delete data
    await TypeRoom.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all typeRoom
exports.deleteAll = async (req, res) => {
  const typeRoom = await TypeRoom.find();
  try {
    // Check if type exist
    if (typeRoom.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Get type room id
    const typeRooms = await TypeRoom.find();
    const typeRoomId = typeRooms.map((typeRoom) => typeRoom._id);

    // Remove references from Room documents
    await Room.updateMany(
      { type: { $in: typeRoomId } },
      { $pull: { type: { $in: typeRoomId } } }
    );

    // Delete data
    await TypeRoom.deleteMany();

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
