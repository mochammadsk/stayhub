const Room = require('../models/room.model');

exports.findAll = (req, res) => {
  Room.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Room.findById(id)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Create and Save a new Room
exports.createRoom = async (req, res) => {
  try {
    const { type, name, cost } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const room = new Room({
      type,
      name,
      cost,
      imagePath,
    });

    await room.save();
    res.status(200).json({ message: 'Room created successfully', data: room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update book by id
exports.updateRoom = async (req, res) => {
  try {
    const { type, name, cost } = req.body;
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id },
      { type, name, cost },
      { new: true }
    );
    res.status(200).json({ message: 'Room updated!', room });
  } catch (error) {
    res.status(400).json(error);
  }
};
