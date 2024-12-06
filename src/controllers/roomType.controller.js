const TypeRoom = require('../models/roomType.model');
const FacilityRoom = require('../models/roomFacility.model');
const Room = require('../models/room.model');

// Get all type room
exports.getAll = async (req, res) => {
  try {
    // Check data type room exist
    const typeRoom = await TypeRoom.find().populate({
      path: 'facility',
      select: 'name',
    });
    if (typeRoom.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ messages: 'Data found', data: typeRoom });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get one type room
exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const typeRoom = await TypeRoom.findById(id).populate({
      path: 'facility',
      select: 'name',
    });

    // Check data type room exist
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
  const { name, facility, description, cost } = req.body;
  try {
    // Check data exists
    const existingType = await TypeRoom.findOne({ name });
    if (existingType) {
      return res.status(404).json({ message: `Data ${name} already exists` });
    }

    // Find facility IDs based on names
    let facilityIds = [];
    if (facility && facility.length > 0) {
      const foundFacility = await FacilityRoom.find({
        name: { $in: facility },
      });

      // Check if all facility are found
      if (foundFacility.length !== facility.length) {
        const missingFacilities = facility.filter(
          (f) => !foundFacility.some((found) => found.name === f)
        );
        return res.status(400).json({
          message: `Some facility not found: ${missingFacilities.join(', ')}`,
        });
      }

      facilityIds = foundFacility.map((facility) => facility._id);
    }

    // Create data
    const type = new TypeRoom({
      name,
      facility: facilityIds,
      description,
      cost,
    });

    // Save data
    await type.save();

    res.status(201).json({ messages: 'Data created', data: type });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update typeRoom
exports.update = async (req, res) => {
  const { name, facility, description, cost } = req.body;
  try {
    // Check if data exists
    const type = await TypeRoom.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if type room name already exists, excluding current data
    if (name && name !== type.name) {
      const existingType = await TypeRoom.findOne({ name, _id: { $ne: req.params.id } });
      if (existingType) {
        return res.status(409).json({ message: `Data ${name} already exists` });
      }
    }

    // Find facility IDs based on names
    let facilityIds = [];
    if (facility && facility.length > 0) {
      const foundFacility = await FacilityRoom.find({
        name: { $in: facility },
      });

      // Check if all facilities are found
      if (foundFacility.length !== facility.length) {
        const missingFacilities = facility.filter(
          (f) => !foundFacility.some((found) => found.name === f)
        );
        return res.status(400).json({
          message: `Some facilities not found: ${missingFacilities.join(', ')}`,
        });
      }

      facilityIds = foundFacility.map((facility) => facility._id);
    }

    // Update data
    type.name = name || type.name;
    type.facility = facilityIds || type.facility;
    type.description = description || type.description;
    type.cost = cost || type.cost;

    // Save data
    await type.save();

    res.status(200).json({ message: 'Data updated', data: type });
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

    // Remove references from Room table
    await Room.updateMany(
      { type: req.params.id },
      { $pull: { type: req.params.id } }
    );

    // Delete data
    await TypeRoom.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Data deleted' });
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

    // Remove references from Room table
    await Room.updateMany(
      { type: { $in: typeRoomId } },
      { $pull: { type: { $in: typeRoomId } } }
    );

    // Delete data
    await TypeRoom.deleteMany();

    res.status(200).json({ message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
