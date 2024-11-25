const FacilityRoom = require('../models/facilityRoom.model');

// Get all facility
exports.getAll = async (req, res) => {
  try {
    // Check if type exist
    const facilityRoom = await FacilityRoom.find();
    if (facilityRoom.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ messages: 'Data found', data: facilityRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get facility by id
exports.getOne = async (req, res) => {
  const id = req.params.id;
  try {
    // Check if type exist
    const facilityRoom = await FacilityRoom.findById(id);
    if (!facilityRoom) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Data found', data: facilityRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create facility
exports.create = async (req, res) => {
  const { name } = req.body;
  try {
    // Check if facilityRoom already exists
    const existingFacility = await FacilityRoom.findOne({ name });
    if (existingFacility) {
      return res.status(404).json({ message: 'Facility already exists' });
    }
    // Create data
    const facilityRoom = new FacilityRoom({ name });
    await facilityRoom.save();

    res.status(201).json({ message: 'Data created', data: facilityRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update facilityRoom
exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    // Check if type exist
    const facilityRoom = await FacilityRoom.findById(req.params.id);
    if (!facilityRoom) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    // Check if room with the same name already exists
    const existingFacility = await FacilityRoom.findOne({ name });
    if (existingFacility) {
      return res
        .status(409)
        .json({ message: 'Facility with the same name already exists' });
    }
    // Update data
    facilityRoom.name = name || facilityRoom.name;
    // Save Facility Room
    await facilityRoom.save();

    res.status(200).json({ message: 'Data updated', data: facilityRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete one facilityRoom
exports.deleteOne = async (req, res) => {
  try {
    // Check if type exist
    const facilityRoom = await FacilityRoom.findById(req.params.id);
    if (!facilityRoom) {
      return res.status(404).json({ message: 'FacilityRoom not found' });
    }
    // Delete facilityRoom
    await FacilityRoom.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all facilityRoom
exports.deleteAll = async (req, res) => {
  try {
    // Check if type exist
    const facilityRoom = await FacilityRoom.find();
    if (facilityRoom.length === 0) {
      return res.status(404).json({ message: 'FacilityRoom not found' });
    }
    // Delete facilityRoom
    await FacilityRoom.deleteMany();

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
