const TypeRoom = require('../models/roomType.model');
const FacilityRoom = require('../models/roomFacility.model');
const Room = require('../models/room.model');

// Get all type room
// Get all type room
exports.getAll = async (req, res) => {
  try {
    const typeRoom = await TypeRoom.find().populate({
      path: 'facility',
      select: 'name',
    });

    const safeData = typeRoom.map((room) => ({
      id: room._id,
      name: room.name, // Pastikan `name` diambil dari model TypeRoom
      facility: room.facility || [],
      description: room.description,
      cost: room.cost,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    }));

    console.log("Fetched Data (transformed):", safeData);

    if (safeData.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ messages: 'Data found', data: safeData });
  } catch (error) {
    console.error("Error in getAll:", error);
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
  console.log("Data diterima dari frontend:", { name, facility, description, cost });

  try {
    // Cek apakah tipe kamar dengan nama yang sama sudah ada
    const existingType = await TypeRoom.findOne({ name });
    if (existingType) {
      console.log(`Tipe kamar dengan nama "${name}" sudah ada.`);
      return res.status(400).json({ message: `Data ${name} already exists` });
    }

    // Validasi fasilitas berdasarkan nama
    const foundFacility = await FacilityRoom.find({
      name: { $in: facility },
    });
    console.log("Fasilitas ditemukan:", foundFacility);

    // Jika jumlah fasilitas yang ditemukan tidak sesuai dengan yang dikirim
    if (foundFacility.length !== facility.length) {
      const missingFacilities = facility.filter(
        (f) => !foundFacility.some((found) => found.name === f)
      );
      console.log("Fasilitas yang tidak ditemukan:", missingFacilities);
      return res.status(400).json({
        message: `Some facility not found: ${missingFacilities.join(', ')}`,
      });
    }

    // Ambil ID fasilitas yang ditemukan
    const facilityIds = foundFacility.map((facility) => facility._id);
    console.log("ID fasilitas yang akan disimpan:", facilityIds);

    // Buat data tipe kamar baru
    const type = new TypeRoom({
      name,
      facility: facilityIds, // Simpan ID fasilitas
      description,
      cost,
    });

    await type.save(); // Simpan ke database
    console.log("Tipe kamar berhasil dibuat:", type);

    res.status(201).json({ messages: 'Data created', data: type });
  } catch (error) {
    console.error("Error creating type room:", error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update typeRoom
exports.update = async (req, res) => {
  const { name, facility, description, cost } = req.body;

  try {
    const type = await TypeRoom.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if type room name already exists (excluding current one)
    const existingType = await TypeRoom.findOne({ name, _id: { $ne: req.params.id } });
    if (existingType) {
      return res.status(409).json({ message: `Data ${name} already exists` });
    }

    // Find facility IDs based on names
    let facilityIds = [];
    if (facility && facility.length > 0) {
      const foundFacility = await FacilityRoom.find({
        name: { $in: facility },
      });

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

    // Update data
    type.name = name || type.name;
    type.facility = facilityIds.length > 0 ? facilityIds : type.facility;
    type.description = description || type.description;
    type.cost = cost || type.cost;

    await type.save();

    res.status(200).json({ message: 'Data updated successfully', data: type });
  } catch (error) {
    console.error('Error updating type room:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


// Delete one typeRoom
exports.deleteById = async (req, res) => {
  try {
    const type = await TypeRoom.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Check if any room is using this type
    const relatedRooms = await Room.find({ type: req.params.id });
    if (relatedRooms.length > 0) {
      return res.status(400).json({
        message: `Cannot delete typeRoom. ${relatedRooms.length} room(s) are using this type.`,
      });
    }

    await TypeRoom.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting typeRoom:', error);
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
