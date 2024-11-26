const FacilityRoom = require('../models/facilityRoom.model');
const TypeRoom = require('../models/typeRoom.model');

// Get all facility
exports.getAll = async (req, res) => {
  try {
    // Check data facility room exist
    const facility = await FacilityRoom.find();
    if (facility.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ messages: 'Data found', data: facility });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get facility by id
exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    // Check data type exist
    const facility = await FacilityRoom.findById(id);
    if (!facility) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Data found', data: facility });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create facility
exports.create = async (req, res) => {
  const { name } = req.body;
  try {
    // Check data base on nane already exists
    const existingFacility = await FacilityRoom.findOne({ name });
    if (existingFacility) {
      return res.status(409).json({ message: `Data ${name} already exists` });
    }

    // Create data
    const facility = new FacilityRoom({ name });
    await facility.save();

    res.status(201).json({ message: 'Data created', data: facility });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update facilityRoom
exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    // Check if type exist
    const facility = await FacilityRoom.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if room with the same name already exists
    const existingFacility = await FacilityRoom.findOne({ name });
    if (existingFacility) {
      return res.status(409).json({ message: `Data ${name} already exists` });
    }

    // Update data
    facility.name = name || facility.name;

    // Save Facility Room
    await facility.save();

    res.status(200).json({ message: 'Data updated', data: facility });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete one facilityRoom
exports.deleteById = async (req, res) => {
  try {
    // Check if type exist
    const facility = await FacilityRoom.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Remove the facility reference from all TypeRoom documents
    await TypeRoom.updateMany(
      { facility: req.params.id },
      { $pull: { facility: req.params.id } }
    );

    // Delete facilityRoom
    await FacilityRoom.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete all facilityRoom
exports.deleteAll = async (req, res) => {
  try {
    // Check if type exist
    const facility = await FacilityRoom.find();
    if (facility.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Get facility room id
    const facilityRoom = await FacilityRoom.find();
    const facilityId = facilityRoom.map((facility) => facility._id);

    // Remove references from TypeRoom documents
    await TypeRoom.updateMany(
      { facility: { $in: facilityId } },
      { $pull: { facility: { $in: facilityId } } }
    );

    // Delete facilityRoom
    await FacilityRoom.deleteMany();

    res.status(200).json({ message: 'Data deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
